import type { AssistantChatRequest, AssistantEvent } from '@ethanel/contracts/assistant';

import { serverEnv } from '@/lib/env';

import { demoAsr, demoChat, demoTts } from './demo';
import { nvidiaAsr, nvidiaChat, nvidiaTts } from './nvidia';
import type { AssistantBackend } from './providers';
import { extractSuggestion } from './search-suggestion';
import { buildSystemPrompt } from './system-prompt';

/** Picks NVIDIA when a key is configured and demo mode is not forced; otherwise the script. */
export function getAssistant(): AssistantBackend {
  const env = serverEnv();
  if (env.NVIDIA_API_KEY && !env.ASSISTANT_DEMO_MODE) {
    const config = {
      apiKey: env.NVIDIA_API_KEY,
      chatBaseUrl: env.NVIDIA_CHAT_BASE_URL,
      chatModel: env.NVIDIA_CHAT_MODEL,
      asrFunctionId: env.NVIDIA_ASR_FUNCTION_ID,
      ttsFunctionId: env.NVIDIA_TTS_FUNCTION_ID,
      ttsVoice: env.NVIDIA_TTS_VOICE,
    };
    return {
      mode: 'live',
      model: env.NVIDIA_CHAT_MODEL,
      voice: true,
      chat: nvidiaChat(config),
      asr: nvidiaAsr(config),
      tts: nvidiaTts(config),
    };
  }
  return {
    mode: 'demo',
    model: 'demo-script',
    voice: false,
    chat: demoChat,
    asr: demoAsr,
    tts: demoTts,
  };
}

/**
 * Runs one turn and yields protocol events. Tokens stream until a fence opens; the tail is held
 * back and turned into a suggestion at the end so the visitor never sees raw JSON.
 */
export async function* runChat(
  backend: AssistantBackend,
  request: AssistantChatRequest,
  signal?: AbortSignal,
): AsyncGenerator<AssistantEvent> {
  const system = buildSystemPrompt(request.page);
  let full = '';
  let held = '';
  let holding = false;
  try {
    for await (const token of backend.chat.stream({
      system,
      messages: request.messages,
      ...(signal ? { signal } : {}),
    })) {
      full += token;
      if (holding) {
        held += token;
        continue;
      }
      const fenceAt = (held + token).indexOf('```');
      if (fenceAt === -1) {
        // Keep a short tail so a fence split across tokens is never emitted.
        const merged = held + token;
        const emit = merged.slice(0, Math.max(0, merged.length - 2));
        held = merged.slice(emit.length);
        if (emit) yield { type: 'token', text: emit };
        continue;
      }
      const before = (held + token).slice(0, fenceAt);
      if (before) yield { type: 'token', text: before };
      held = (held + token).slice(fenceAt);
      holding = true;
    }
    if (!holding && held) yield { type: 'token', text: held };
    const { suggestion } = extractSuggestion(full);
    if (suggestion) yield suggestion;
    yield { type: 'done', mode: backend.mode };
  } catch (error) {
    console.error(
      JSON.stringify({ level: 'error', event: 'assistant_chat_failed', error: String(error) }),
    );
    yield {
      type: 'error',
      message: "I couldn't reach the model just now. Try again in a moment or WhatsApp us.",
    };
  }
}
