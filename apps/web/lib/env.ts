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
    .default('+254722000000'),
});

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  /** Leads (demo requests, contact form, questionnaire) are POSTed here as JSON when set. */
  DEMO_WEBHOOK_URL: z.url().optional(),
  GIT_SHA: z.string().min(1).optional(),
  /** Unsplash API access key (free). Without it, scene photos fall back to brand illustrations. */
  UNSPLASH_ACCESS_KEY: z.string().min(1).optional(),
  /** NVIDIA NIM key from build.nvidia.com. Without it the assistant runs in demo mode. */
  NVIDIA_API_KEY: z.string().min(1).optional(),
  NVIDIA_CHAT_BASE_URL: z.url().default('https://integrate.api.nvidia.com/v1'),
  NVIDIA_CHAT_MODEL: z.string().min(1).default('nvidia/nemotron-3-super-120b-a12b'),
  // ASSUMPTION (QUESTIONS.md Q-24): hosted Parakeet function id; verify on build.nvidia.com.
  NVIDIA_ASR_FUNCTION_ID: z.string().min(1).default('1598d209-5e27-4d3c-8079-4751568b1081'),
  // ASSUMPTION (QUESTIONS.md Q-24): hosted Magpie TTS function id; HTTP synth may be unavailable.
  NVIDIA_TTS_FUNCTION_ID: z.string().min(1).default('877104f7-e885-42b9-8de8-f6e4c6303969'),
  NVIDIA_TTS_VOICE: z.string().min(1).default('Magpie-Multilingual.EN-US.Aria'),
  /** Force the assistant's scripted demo mode even when a key is present. */
  ASSISTANT_DEMO_MODE: z
    .enum(['true', 'false'])
    .default('false')
    .transform((v) => v === 'true'),
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
    UNSPLASH_ACCESS_KEY: emptyToUndefined(process.env.UNSPLASH_ACCESS_KEY),
    NVIDIA_API_KEY: emptyToUndefined(process.env.NVIDIA_API_KEY),
    NVIDIA_CHAT_BASE_URL: emptyToUndefined(process.env.NVIDIA_CHAT_BASE_URL),
    NVIDIA_CHAT_MODEL: emptyToUndefined(process.env.NVIDIA_CHAT_MODEL),
    NVIDIA_ASR_FUNCTION_ID: emptyToUndefined(process.env.NVIDIA_ASR_FUNCTION_ID),
    NVIDIA_TTS_FUNCTION_ID: emptyToUndefined(process.env.NVIDIA_TTS_FUNCTION_ID),
    NVIDIA_TTS_VOICE: emptyToUndefined(process.env.NVIDIA_TTS_VOICE),
    ASSISTANT_DEMO_MODE: emptyToUndefined(process.env.ASSISTANT_DEMO_MODE),
  });
  return cachedServerEnv;
}
