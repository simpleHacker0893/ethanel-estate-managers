import type { AssistantMessage, AssistantMode } from '@ethanel/contracts/assistant';

/** Provider seams. NVIDIA NIM behind them today; a self-hosted NIM or another vendor later. */
export interface ChatProvider {
  /** Streams plain-text tokens for the conversation. Throws on transport failure. */
  stream(input: {
    system: string;
    messages: readonly AssistantMessage[];
    signal?: AbortSignal;
  }): AsyncIterable<string>;
}

export interface AsrProvider {
  /** Returns the transcript for a short audio clip. Throws on transport failure. */
  transcribe(audio: Blob): Promise<string>;
}

export interface SpeechAudio {
  audio: ArrayBuffer;
  contentType: string;
}

export interface TtsProvider {
  /** Returns audio for the text, or null when the hosted service cannot synthesize. */
  synthesize(text: string): Promise<SpeechAudio | null>;
}

export interface AssistantBackend {
  mode: AssistantMode;
  model: string;
  /** Whether server-side transcription and speech are available. */
  voice: boolean;
  chat: ChatProvider;
  asr: AsrProvider;
  tts: TtsProvider;
}
