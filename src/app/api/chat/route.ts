import {
  streamText,
  convertToModelMessages,
  createGateway,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { getVercelOidcToken } from '@vercel/oidc';
import { getSystemPrompt } from '@/lib/ai/system-prompt';
import { checkRateLimit } from '@/lib/ai/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_MESSAGES = 12;
const MAX_CHARS = 500;
const GATEWAY_BASE_URL = 'https://ai-gateway.vercel.sh/v1';

const DEFAULT_GATEWAY_MODEL = 'openai/gpt-4o-mini';
const DEFAULT_ANTHROPIC_MODEL = 'claude-3-5-haiku-20241022';
const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';

function isGatewayModel(id?: string): id is string {
  return !!id && id.includes('/');
}

async function resolveGatewayToken(): Promise<string | null> {
  if (process.env.AI_GATEWAY_API_KEY) {
    return process.env.AI_GATEWAY_API_KEY;
  }
  try {
    return await getVercelOidcToken();
  } catch {
    return null;
  }
}

async function pickModel() {
  const envModel = process.env.ASK_AHMAD_MODEL;

  // Prefer Vercel AI Gateway: use an explicit API key, otherwise try the
  // Vercel OIDC token (available via `vc env pull` locally and injected into
  // Functions when OIDC Federation is enabled).
  const gatewayToken = await resolveGatewayToken();
  if (gatewayToken) {
    return createGateway({ apiKey: gatewayToken }).languageModel(envModel ?? DEFAULT_GATEWAY_MODEL);
  }

  // Direct-provider fallback so the chat still works without a gateway key.
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic(isGatewayModel(envModel) ? DEFAULT_ANTHROPIC_MODEL : (envModel ?? DEFAULT_ANTHROPIC_MODEL));
  }
  if (process.env.OPENAI_API_KEY) {
    return openai(isGatewayModel(envModel) ? DEFAULT_OPENAI_MODEL : (envModel ?? DEFAULT_OPENAI_MODEL));
  }

  return null;
}

export async function POST(req: Request) {
  // Provider not configured yet — the panel shows its warm-up fallback.
  const model = await pickModel();
  if (!model) {
    return Response.json({ error: 'not-configured' }, { status: 503 });
  }
  // The gateway provider string already encodes the provider/model; no need
  // to keep separate ANTHROPIC_API_KEY / OPENAI_API_KEY handling here.

  // Same-origin only (browser fetches send sec-fetch-site: same-origin).
  const fetchSite = req.headers.get('sec-fetch-site');
  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  let body: { messages?: UIMessage[]; website?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'bad-request' }, { status: 400 });
  }

  // Honeypot field — real UI never sets it.
  if (body.website) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  const rate = checkRateLimit(req);
  if (!rate.ok) {
    return Response.json(
      { error: 'rate-limited', retryAfterSeconds: rate.retryAfterSeconds },
      { status: 429, headers: { 'Retry-After': String(rate.retryAfterSeconds ?? 600) } }
    );
  }

  // Sanitize: last N messages, text parts only, hard length caps.
  const incoming = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];
  const messages: UIMessage[] = incoming
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m) => ({
      id: m.id,
      role: m.role,
      parts: (m.parts ?? [])
        .filter((p): p is Extract<UIMessage['parts'][number], { type: 'text' }> => p.type === 'text')
        .map((p) => ({ type: 'text' as const, text: String(p.text).slice(0, MAX_CHARS) })),
    }))
    .filter((m) => m.parts.length > 0);

  if (messages.length === 0) {
    return Response.json({ error: 'bad-request' }, { status: 400 });
  }

  const result = streamText({
    model,
    system: getSystemPrompt(),
    messages: await convertToModelMessages(messages),
    maxOutputTokens: 600,
    temperature: 0.6,
  });

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({ stream: result.stream }),
    headers: rate.setCookie ? { 'Set-Cookie': rate.setCookie } : undefined,
  });
}
