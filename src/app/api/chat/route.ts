import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  type UIMessage,
} from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { getSystemPrompt } from '@/lib/ai/system-prompt';
import { checkRateLimit } from '@/lib/ai/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_MESSAGES = 12;
const MAX_CHARS = 500;
const GATEWAY_BASE_URL = 'https://ai-gateway.vercel.sh/v1';

function createModel() {
  // Prefer Vercel AI Gateway; fall back to direct OpenAI if only OPENAI_API_KEY is set.
  const apiKey = process.env.AI_GATEWAY_API_KEY ?? process.env.OPENAI_API_KEY;
  const baseURL = process.env.AI_GATEWAY_BASE_URL ?? GATEWAY_BASE_URL;
  if (!apiKey) return null;

  const openai = createOpenAI({ baseURL, apiKey });
  return openai(process.env.ASK_AHMAD_MODEL ?? 'openai/gpt-4o-mini');
}

export async function POST(req: Request) {
  // Provider not configured yet — the panel shows its warm-up fallback.
  const model = createModel();
  if (!model) {
    return Response.json({ error: 'not-configured' }, { status: 503 });
  }

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
