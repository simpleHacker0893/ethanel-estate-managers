'use server';

import { headers } from 'next/headers';

import { demoRequestSchema, type DemoRequestResult } from '@ethanel/contracts/demo-request';

import { track } from '@/lib/analytics';
import { demoRequests } from '@/lib/demo-requests';
import { clientIpFrom, demoRateLimiter } from '@/lib/rate-limit';

/**
 * Server Action for the landing demo form. Treat as a public endpoint: validate with the
 * contract, rate-limit by IP, persist behind the sink interface. Returns a discriminated result;
 * never redirects. Imported by a Client Component, which does not make `/` dynamic.
 */
export async function requestDemo(
  _previous: DemoRequestResult | null,
  formData: FormData,
): Promise<DemoRequestResult> {
  const parsed = demoRequestSchema.safeParse({
    email: formData.get('email'),
    source: 'landing',
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: 'invalid_email',
      message: parsed.error.issues[0]?.message ?? 'Enter a valid email address',
    };
  }

  const ip = clientIpFrom(await headers());
  const limit = await demoRateLimiter.consume(`demo:${ip}`);
  if (!limit.allowed) {
    return {
      ok: false,
      error: 'rate_limited',
      message: `Too many requests from this connection. Try again in ${Math.ceil(limit.resetInSeconds / 60)} minutes or WhatsApp us.`,
    };
  }

  try {
    await demoRequests.save({ ...parsed.data, receivedAt: new Date().toISOString(), ip });
  } catch (error) {
    console.error(
      JSON.stringify({ level: 'error', event: 'demo_request_failed', error: String(error) }),
    );
    return {
      ok: false,
      error: 'unavailable',
      message: "We couldn't save that just now. Try again in a moment or WhatsApp us.",
    };
  }

  track({ name: 'demo_requested', source: 'landing' });
  return { ok: true };
}
