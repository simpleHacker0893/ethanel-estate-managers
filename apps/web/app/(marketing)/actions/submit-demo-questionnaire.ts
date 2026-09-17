'use server';

import { headers } from 'next/headers';

import {
  demoQuestionnaireSchema,
  type DemoQuestionnaireResult,
} from '@ethanel/contracts/demo-questionnaire';

import { track } from '@/lib/analytics';
import { leads } from '@/lib/leads';
import { clientIpFrom, questionnaireRateLimiter } from '@/lib/rate-limit';

/** Book-a-demo questionnaire. JSON input validated with the contract; never redirects. */
export async function submitDemoQuestionnaire(input: unknown): Promise<DemoQuestionnaireResult> {
  const parsed = demoQuestionnaireSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'invalid',
      message: parsed.error.issues[0]?.message ?? 'Check your answers and try again.',
    };
  }

  const ip = clientIpFrom(await headers());
  const limit = await questionnaireRateLimiter.consume(`questionnaire:${ip}`);
  if (!limit.allowed) {
    return {
      ok: false,
      error: 'rate_limited',
      message: `Too many requests from this connection. Try again in ${Math.ceil(limit.resetInSeconds / 60)} minutes or WhatsApp us.`,
    };
  }

  try {
    await leads.save({
      type: 'demo_questionnaire',
      payload: parsed.data,
      receivedAt: new Date().toISOString(),
      ip,
    });
  } catch (error) {
    console.error(
      JSON.stringify({ level: 'error', event: 'demo_questionnaire_failed', error: String(error) }),
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
