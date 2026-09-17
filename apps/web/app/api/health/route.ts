import { connection } from 'next/server';

import { serverEnv } from '@/lib/env';

/**
 * Liveness for Kubernetes probes. `connection()` defers to request time so the response is
 * produced by the running process on every probe rather than served from the static shell.
 */
export async function GET(): Promise<Response> {
  await connection();
  return Response.json(
    { ok: true, sha: serverEnv().GIT_SHA ?? 'unknown' },
    { headers: { 'cache-control': 'no-store' } },
  );
}
