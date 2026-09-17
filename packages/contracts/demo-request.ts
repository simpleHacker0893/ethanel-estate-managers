import { z } from 'zod';

/** Landing demo form. Email only in Sprint 001; billing-svc adds organization and phone later. */
export const demoRequestSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Enter your work email')
    .max(254, 'That email is too long')
    .pipe(z.email('Enter a valid email address'))
    .transform((value) => value.toLowerCase()),
  /** Where the request came from; lets billing-svc attribute leads. */
  source: z.enum(['landing', 'pricing', 'marketplace', 'demo', 'company']).default('landing'),
});

export type DemoRequestInput = z.input<typeof demoRequestSchema>;
export type DemoRequest = z.output<typeof demoRequestSchema>;

export type DemoRequestResult =
  | { ok: true }
  | {
      ok: false;
      error: 'invalid_email' | 'rate_limited' | 'unavailable';
      message: string;
    };
