import { connection } from 'next/server';

import type { AssistantTranscribeResponse } from '@ethanel/contracts/assistant';

import { getAssistant } from '@/lib/assistant';
import { assistantMediaLimiter, clientIpFrom } from '@/lib/rate-limit';

const maxBytes = 5 * 1024 * 1024;
const allowedTypes = [
  'audio/webm',
  'audio/ogg',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/mpeg',
];

function reply(body: AssistantTranscribeResponse, status = 200): Response {
  return Response.json(body, { status, headers: { 'cache-control': 'no-store' } });
}

/** Multipart `audio` field (≤ 5 MB) → transcript. Demo mode returns a canned line. */
export async function POST(request: Request): Promise<Response> {
  await connection();
  const ip = clientIpFrom(request.headers);
  const limit = await assistantMediaLimiter.consume(`assistant:media:${ip}`);
  if (!limit.allowed) {
    return reply(
      {
        ok: false,
        error: 'rate_limited',
        message: 'Too many recordings. Try again in a few minutes.',
      },
      429,
    );
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return reply({ ok: false, error: 'invalid', message: 'Expected multipart form data.' }, 400);
  }
  const audio = form.get('audio');
  if (!(audio instanceof Blob) || audio.size === 0) {
    return reply(
      { ok: false, error: 'invalid', message: 'Attach a short audio clip as "audio".' },
      400,
    );
  }
  if (audio.size > maxBytes) {
    return reply({ ok: false, error: 'invalid', message: 'Clips are limited to 5 MB.' }, 413);
  }
  const baseType = audio.type.split(';')[0] ?? '';
  if (!allowedTypes.includes(baseType)) {
    return reply(
      { ok: false, error: 'invalid', message: `Unsupported audio type ${baseType || '(none)'}.` },
      415,
    );
  }
  const backend = getAssistant();
  try {
    const text = await backend.asr.transcribe(audio);
    return reply({ ok: true, text, mode: backend.mode });
  } catch (error) {
    console.error(
      JSON.stringify({
        level: 'error',
        event: 'assistant_transcribe_failed',
        error: String(error),
      }),
    );
    return reply(
      { ok: false, error: 'unavailable', message: 'Transcription is unavailable right now.' },
      503,
    );
  }
}
