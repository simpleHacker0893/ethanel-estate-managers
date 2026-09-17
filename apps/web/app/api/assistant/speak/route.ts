import { connection } from 'next/server';

import { assistantSpeakRequestSchema } from '@ethanel/contracts/assistant';

import { getAssistant } from '@/lib/assistant';
import { assistantMediaLimiter, clientIpFrom } from '@/lib/rate-limit';

/**
 * { text } → audio from the hosted voice, or 501 when no server voice is available so the
 * widget falls back to the browser's speech synthesis.
 */
export async function POST(request: Request): Promise<Response> {
  await connection();
  const ip = clientIpFrom(request.headers);
  const limit = await assistantMediaLimiter.consume(`assistant:media:${ip}`);
  if (!limit.allowed) {
    return Response.json(
      { ok: false, error: 'rate_limited', message: 'Too many requests.' },
      { status: 429 },
    );
  }
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: 'invalid', message: 'Expected JSON.' },
      { status: 400 },
    );
  }
  const parsed = assistantSpeakRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: 'invalid', message: 'Text is required (≤ 600 chars).' },
      { status: 400 },
    );
  }
  const backend = getAssistant();
  const speech = backend.voice ? await backend.tts.synthesize(parsed.data.text) : null;
  if (!speech) {
    return Response.json(
      { ok: false, error: 'unavailable', message: 'No server voice; use the browser voice.' },
      { status: 501, headers: { 'cache-control': 'no-store' } },
    );
  }
  return new Response(speech.audio, {
    headers: { 'content-type': speech.contentType, 'cache-control': 'no-store' },
  });
}
