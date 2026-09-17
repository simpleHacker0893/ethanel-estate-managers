import { z } from 'zod';

import { marketplaceSearchSchema, type MarketplaceSearchInput } from './marketplace-search';

/** Chat protocol between the assistant widget and /api/assistant/*. */
export const assistantMessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string().trim().min(1).max(2000),
});
export type AssistantMessage = z.output<typeof assistantMessageSchema>;

export const assistantChatRequestSchema = z.object({
  messages: z.array(assistantMessageSchema).min(1).max(20),
  /** Same-origin path the visitor is on, for context. */
  page: z
    .string()
    .regex(/^\/(?!\/)/)
    .max(200)
    .optional(),
});
export type AssistantChatRequest = z.output<typeof assistantChatRequestSchema>;

export const assistantSpeakRequestSchema = z.object({
  text: z.string().trim().min(1).max(600),
});
export type AssistantSpeakRequest = z.output<typeof assistantSpeakRequestSchema>;

export const assistantModes = ['live', 'demo'] as const;
export type AssistantMode = (typeof assistantModes)[number];

export const assistantStatusSchema = z.object({
  mode: z.enum(assistantModes),
  voice: z.boolean(),
  model: z.string(),
});
export type AssistantStatus = z.output<typeof assistantStatusSchema>;

/** Server-sent events on /api/assistant/chat. Wire format: `event: <type>\ndata: <json>\n\n`. */
export type AssistantEvent =
  | { type: 'token'; text: string }
  | { type: 'suggestion'; label: string; href: string; search: MarketplaceSearchInput }
  | { type: 'done'; mode: AssistantMode }
  | { type: 'error'; message: string };

export const assistantSuggestionSchema = marketplaceSearchSchema.partial();

export const assistantTranscribeResponseSchema = z.discriminatedUnion('ok', [
  z.object({ ok: z.literal(true), text: z.string(), mode: z.enum(assistantModes) }),
  z.object({
    ok: z.literal(false),
    error: z.enum(['invalid', 'rate_limited', 'unavailable']),
    message: z.string(),
  }),
]);
export type AssistantTranscribeResponse = z.output<typeof assistantTranscribeResponseSchema>;
