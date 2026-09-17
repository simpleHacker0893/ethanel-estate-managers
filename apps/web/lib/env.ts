import { z } from 'zod';

/**
 * Hand-rolled zod env loader. Server-only values are validated lazily on first read so the
 * static prerender of marketing routes never touches them. NEXT_PUBLIC_* values are inlined by
 * Next at build time, so they are read as literals below rather than through `process.env[key]`.
 */
const publicSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default('http://localhost:3000'),
  NEXT_PUBLIC_WHATSAPP_NUMBER: z
    .string()
    .regex(/^\+[1-9]\d{6,14}$/, 'E.164, e.g. +2547XXXXXXXX')
    .optional(),
});

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DEMO_WEBHOOK_URL: z.url().optional(),
  GIT_SHA: z.string().min(1).optional(),
});

function emptyToUndefined(value: string | undefined): string | undefined {
  return value === undefined || value.trim() === '' ? undefined : value;
}

export const publicEnv = publicSchema.parse({
  NEXT_PUBLIC_SITE_URL: emptyToUndefined(process.env.NEXT_PUBLIC_SITE_URL),
  NEXT_PUBLIC_WHATSAPP_NUMBER: emptyToUndefined(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER),
});

let cachedServerEnv: z.infer<typeof serverSchema> | undefined;

/** Server-only. Throws with a readable message on first use if the environment is invalid. */
export function serverEnv(): z.infer<typeof serverSchema> {
  cachedServerEnv ??= serverSchema.parse({
    NODE_ENV: process.env.NODE_ENV,
    DEMO_WEBHOOK_URL: emptyToUndefined(process.env.DEMO_WEBHOOK_URL),
    GIT_SHA: emptyToUndefined(process.env.GIT_SHA),
  });
  return cachedServerEnv;
}
