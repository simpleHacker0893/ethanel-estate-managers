import { z } from 'zod';

import { kenyanPhoneSchema } from './phone';

export const contactInterests = [
  'demo',
  'pricing',
  'design-partner',
  'list-plots',
  'press',
  'other',
] as const;
export type ContactInterest = (typeof contactInterests)[number];

export const portfolioBands = [
  'none',
  '1-5',
  '6-20',
  '21-50',
  '51-150',
  '151-300',
  '301-plus',
] as const;
export type PortfolioBand = (typeof portfolioBands)[number];

/** Company page contact form. */
export const contactRequestSchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(80),
  organization: z.string().trim().max(120).optional(),
  whatsapp: kenyanPhoneSchema,
  units: z.enum(portfolioBands, { error: 'Pick the closest size' }),
  interest: z.enum(contactInterests, { error: 'Pick one' }),
  message: z
    .string()
    .trim()
    .min(10, 'Tell us a little more (at least 10 characters)')
    .max(1000, 'Keep it under 1,000 characters'),
  /** Honeypot: humans never fill this. */
  website: z.string().max(0).optional(),
  source: z.literal('company').default('company'),
});
export type ContactRequestInput = z.input<typeof contactRequestSchema>;
export type ContactRequest = z.output<typeof contactRequestSchema>;

export type ContactRequestResult =
  | { ok: true }
  | {
      ok: false;
      error: 'invalid' | 'rate_limited' | 'unavailable';
      message: string;
      fieldErrors?: Record<string, string>;
    };
