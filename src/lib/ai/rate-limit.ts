// Serverless-honest rate limiting for the chat route - no database.
// Layer 1: HMAC-signed cookie sliding window (survives cold starts, per-browser).
// Layer 2: per-instance in-memory IP window (best-effort backstop).
// Hard request caps in the route bound worst-case spend regardless.
import { createHmac, timingSafeEqual } from 'node:crypto';

const WINDOW_MS = 10 * 60 * 1000;
const WINDOW_MAX = 10;
const DAY_MS = 24 * 60 * 60 * 1000;
const DAY_MAX = 30;
const IP_WINDOW_MAX = 20;

const COOKIE_NAME = 'aa_rl';

function secret(): string {
  // Falls back to a static build secret; clearing cookies then bypasses layer 1,
  // which layer 2 + hard caps absorb. Set RATE_LIMIT_SECRET in prod.
  return process.env.RATE_LIMIT_SECRET || 'aa-rl-static-fallback-2026';
}

interface RlState {
  count: number;
  windowStart: number;
  dayCount: number;
  dayStart: number;
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url');
}

function encode(state: RlState): string {
  const payload = Buffer.from(JSON.stringify(state)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function decode(raw: string | undefined): RlState | null {
  if (!raw) return null;
  const dot = raw.lastIndexOf('.');
  if (dot < 0) return null;
  const payload = raw.slice(0, dot);
  const mac = raw.slice(dot + 1);
  const expected = sign(payload);
  try {
    if (mac.length !== expected.length || !timingSafeEqual(Buffer.from(mac), Buffer.from(expected))) return null;
    const state = JSON.parse(Buffer.from(payload, 'base64url').toString()) as RlState;
    if (typeof state.count !== 'number' || typeof state.windowStart !== 'number') return null;
    return state;
  } catch {
    return null;
  }
}

function readCookie(req: Request): string | undefined {
  const header = req.headers.get('cookie') ?? '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === COOKIE_NAME) return v.join('=');
  }
  return undefined;
}

// Layer 2: per-instance IP memory (evicts oldest beyond 2000 entries)
const ipHits = new Map<string, number[]>();
function ipAllowed(ip: string, now: number): boolean {
  const hits = (ipHits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= IP_WINDOW_MAX) {
    ipHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  if (ipHits.size > 2000) {
    const first = ipHits.keys().next().value;
    if (first !== undefined) ipHits.delete(first);
  }
  return true;
}

export interface RateResult {
  ok: boolean;
  retryAfterSeconds?: number;
  /** Set-Cookie value to attach to the response (present when ok). */
  setCookie?: string;
}

export function checkRateLimit(req: Request): RateResult {
  const now = Date.now();

  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  if (!ipAllowed(ip, now)) {
    return { ok: false, retryAfterSeconds: Math.ceil(WINDOW_MS / 1000) };
  }

  let state = decode(readCookie(req));
  if (!state) state = { count: 0, windowStart: now, dayCount: 0, dayStart: now };

  if (now - state.windowStart > WINDOW_MS) {
    state.count = 0;
    state.windowStart = now;
  }
  if (now - state.dayStart > DAY_MS) {
    state.dayCount = 0;
    state.dayStart = now;
  }

  if (state.count >= WINDOW_MAX) {
    return { ok: false, retryAfterSeconds: Math.ceil((state.windowStart + WINDOW_MS - now) / 1000) };
  }
  if (state.dayCount >= DAY_MAX) {
    return { ok: false, retryAfterSeconds: Math.ceil((state.dayStart + DAY_MS - now) / 1000) };
  }

  state.count += 1;
  state.dayCount += 1;

  const setCookie = `${COOKIE_NAME}=${encode(state)}; Path=/api/chat; Max-Age=${Math.ceil(DAY_MS / 1000)}; HttpOnly; SameSite=Strict; Secure`;
  return { ok: true, setCookie };
}
