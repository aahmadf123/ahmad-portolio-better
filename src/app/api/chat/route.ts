import { streamText, convertToModelMessages, type UIMessage } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { openai } from '@ai-sdk/openai';
import { getSystemPrompt } from '@/lib/ai/system-prompt';
import { checkRateLimit } from '@/lib/ai/rate-limit';

export const runtime = 'nodejs';
export const maxDuration = 30;

const MAX_MESSAGES = 12;
const MAX_CHARS = 500;

function pickModel() {
  if (process.env.ANTHROPIC_API_KEY) {
    return anthropic(process.env.ASK_AHMAD_MODEL ?? 'claude-haiku-4-5');
  }
  if (process.env.OPENAI_API_KEY) {
    return openai(process.env.ASK_AHMAD_MODEL ?? 'gpt-4o-mini');
  }
  return null;
}

export async function POST(req: Request) {
  // Provider not configured yet — the panel shows its warm-up fallback.
  const model = pickModel();
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

  return result.toUIMessageStreamResponse({
    headers: rate.setCookie ? { 'Set-Cookie': rate.setCookie } : undefined,
  });
}
