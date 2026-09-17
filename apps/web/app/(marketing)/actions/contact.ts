'use server';

import { headers } from 'next/headers';

import {
  contactRequestSchema,
  type ContactRequestResult,
} from '@ethanel/contracts/contact-request';

import { leads } from '@/lib/leads';
import { clientIpFrom, contactRateLimiter } from '@/lib/rate-limit';

/** Company page contact form. Public endpoint: validate, rate-limit, persist, discriminated result. */
export async function submitContact(
  _previous: ContactRequestResult | null,
  formData: FormData,
): Promise<ContactRequestResult> {
  const parsed = contactRequestSchema.safeParse({
    name: formData.get('name'),
    organization: formData.get('organization') ?? undefined,
    whatsapp: formData.get('whatsapp'),
    units: formData.get('units'),
    interest: formData.get('interest'),
    message: formData.get('message'),
    website: formData.get('website') ?? undefined,
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form');
      fieldErrors[key] ??= issue.message;
    }
    return { ok: false, error: 'invalid', message: 'Check the highlighted fields.', fieldErrors };
  }

  const ip = clientIpFrom(await headers());
  const limit = await contactRateLimiter.consume(`contact:${ip}`);
  if (!limit.allowed) {
    return {
      ok: false,
      error: 'rate_limited',
      message: `Too many messages from this connection. Try again in ${Math.ceil(limit.resetInSeconds / 60)} minutes or WhatsApp us.`,
    };
  }

  try {
    const { website: _honeypot, ...payload } = parsed.data;
    await leads.save({
      type: 'contact_request',
      payload,
      receivedAt: new Date().toISOString(),
      ip,
    });
  } catch (error) {
    console.error(
      JSON.stringify({ level: 'error', event: 'contact_request_failed', error: String(error) }),
    );
    return {
      ok: false,
      error: 'unavailable',
      message: "We couldn't save that just now. Try again in a moment or WhatsApp us.",
    };
  }
  return { ok: true };
}
