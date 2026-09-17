import { connection } from 'next/server';

import { assistantChatRequestSchema, type AssistantEvent } from '@ethanel/contracts/assistant';

import { getAssistant, runChat } from '@/lib/assistant';
import { eventStream } from '@/lib/assistant/sse';
import { assistantChatLimiter, clientIpFrom } from '@/lib/rate-limit';

async function* single(event: AssistantEvent): AsyncGenerator<AssistantEvent> {
  yield event;
  await Promise.resolve();
}

/** One assistant turn as server-sent events. Body: { messages, page? }. */
export async function POST(request: Request): Promise<Response> {
  await connection();
  const ip = clientIpFrom(request.headers);
  const limit = await assistantChatLimiter.consume(`assistant:chat:${ip}`);
  if (!limit.allowed) {
    return eventStream(
      single({
        type: 'error',
        message: 'Too many messages from this connection. Try again in a few minutes.',
      }),
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
  const parsed = assistantChatRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      {
        ok: false,
        error: 'invalid',
        message: parsed.error.issues[0]?.message ?? 'Invalid request.',
      },
      { status: 400 },
    );
  }
  return eventStream(runChat(getAssistant(), parsed.data, request.signal));
}
