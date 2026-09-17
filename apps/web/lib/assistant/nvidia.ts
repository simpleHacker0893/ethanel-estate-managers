import { z } from 'zod';

import type { AsrProvider, ChatProvider, TtsProvider } from './providers';

/**
 * NVIDIA NIM adapters over plain fetch. Chat is the OpenAI-compatible completions endpoint with
 * streaming; ASR and TTS are NVCF function invocations (Parakeet, Magpie).
 * ASSUMPTION (QUESTIONS.md Q-24): the hosted function ids and the HTTP TTS shape are verified
 * on build.nvidia.com when the key is added; every call degrades to demo mode or the browser.
 */
export interface NvidiaConfig {
  apiKey: string;
  chatBaseUrl: string;
  chatModel: string;
  asrFunctionId: string;
  ttsFunctionId: string;
  ttsVoice: string;
}

const deltaSchema = z.object({
  choices: z.array(z.object({ delta: z.object({ content: z.string().nullish() }).optional() })),
});

function invocationUrl(functionId: string, path: string): string {
  return `https://${functionId}.invocation.api.nvcf.nvidia.com${path}`;
}

/** Yields `data:` payloads of an SSE body, one per event, until `[DONE]`. */
async function* sseData(body: ReadableStream<Uint8Array>): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      let newline = buffer.indexOf('\n');
      while (newline !== -1) {
        const line = buffer.slice(0, newline).replace(/\r$/, '');
        buffer = buffer.slice(newline + 1);
        newline = buffer.indexOf('\n');
        if (!line.startsWith('data:')) continue;
        const payload = line.slice(5).trim();
        if (payload === '[DONE]') return;
        if (payload) yield payload;
      }
    }
  } finally {
    reader.releaseLock();
  }
}

export function nvidiaChat(config: NvidiaConfig): ChatProvider {
  return {
    async *stream({ system, messages, signal }) {
      const response = await fetch(`${config.chatBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${config.apiKey}`,
          'content-type': 'application/json',
          accept: 'text/event-stream',
        },
        body: JSON.stringify({
          model: config.chatModel,
          messages: [{ role: 'system', content: system }, ...messages],
          temperature: 0.4,
          top_p: 0.9,
          max_tokens: 600,
          stream: true,
        }),
        ...(signal ? { signal } : {}),
      });
      if (!response.ok || !response.body) {
        throw new Error(`nvidia chat ${String(response.status)}`);
      }
      for await (const payload of sseData(response.body)) {
        let parsed: unknown;
        try {
          parsed = JSON.parse(payload);
        } catch {
          continue;
        }
        const delta = deltaSchema.safeParse(parsed);
        const text = delta.success ? delta.data.choices[0]?.delta?.content : undefined;
        if (text) yield text;
      }
    },
  };
}

const transcriptSchema = z.object({ text: z.string() });

export function nvidiaAsr(config: NvidiaConfig): AsrProvider {
  return {
    async transcribe(audio) {
      const form = new FormData();
      form.set('file', audio, audio.type.includes('wav') ? 'clip.wav' : 'clip.webm');
      form.set('language', 'en-US');
      const response = await fetch(
        invocationUrl(config.asrFunctionId, '/v1/audio/transcriptions'),
        {
          method: 'POST',
          headers: { authorization: `Bearer ${config.apiKey}` },
          body: form,
        },
      );
      if (!response.ok) throw new Error(`nvidia asr ${String(response.status)}`);
      const parsed = transcriptSchema.safeParse(await response.json());
      if (!parsed.success) throw new Error('nvidia asr: unexpected response');
      return parsed.data.text.trim();
    },
  };
}

export function nvidiaTts(config: NvidiaConfig): TtsProvider {
  return {
    async synthesize(text) {
      try {
        const response = await fetch(invocationUrl(config.ttsFunctionId, '/v1/audio/speech'), {
          method: 'POST',
          headers: { authorization: `Bearer ${config.apiKey}`, 'content-type': 'application/json' },
          body: JSON.stringify({ input: text, voice: config.ttsVoice, response_format: 'wav' }),
        });
        if (!response.ok) return null;
        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.startsWith('audio/')) return null;
        return { audio: await response.arrayBuffer(), contentType };
      } catch {
        return null;
      }
    },
  };
}
