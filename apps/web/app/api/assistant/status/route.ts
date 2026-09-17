import { connection } from 'next/server';

import type { AssistantStatus } from '@ethanel/contracts/assistant';

import { getAssistant } from '@/lib/assistant';

/** Tells the widget whether it is talking to NVIDIA or the script, and whether voice is on. */
export async function GET(): Promise<Response> {
  await connection();
  const backend = getAssistant();
  const status: AssistantStatus = {
    mode: backend.mode,
    voice: backend.voice,
    model: backend.model,
  };
  return Response.json(status, { headers: { 'cache-control': 'no-store' } });
}
