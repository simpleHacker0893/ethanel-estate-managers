/** Assistant widget copy. The model's facts live in lib/assistant/system-prompt.ts. */
export const assistant = {
  launcher: 'Ask Ethanel',
  launcherAria: 'Open the Ethanel assistant',
  title: 'Ethanel assistant',
  poweredBy: 'Powered by NVIDIA Nemotron',
  close: 'Close assistant',
  demoBanner:
    'Demo mode: scripted answers while the NVIDIA key is not configured. Live answers and voice arrive with the key.',
  intro:
    "Hi, I'm the Ethanel assistant. Ask me about rent collection, land sales, pricing, or tell me what you're looking for and I'll set up the search.",
  starters: [
    'How does M-Pesa rent collection work?',
    'Find a 2-bedroom to rent in Kisumu',
    'What does the Growth plan include?',
  ],
  placeholder: 'Ask about rent, land, pricing, or a place to live…',
  send: 'Send',
  thinking: 'Thinking…',
  mic: {
    start: 'Speak your question',
    stop: 'Stop recording',
    listening: 'Listening…',
    transcribing: 'Transcribing…',
  },
  speak: { on: 'Read replies aloud: on', off: 'Read replies aloud: off' },
  transcriptHint: 'Check the transcript, then press Send.',
  errors: {
    generic: 'Something went wrong on my side. Try again, or WhatsApp us.',
    rateLimited: 'You have sent a lot of messages in a short time. Give it a few minutes.',
    micDenied: 'Microphone access was declined. You can still type your question.',
    micUnsupported: 'This browser cannot record audio. You can still type your question.',
    transcribe: "I couldn't transcribe that. Try again or type your question.",
  },
  disclaimer: 'Answers can be wrong. Prices and terms are confirmed in your agreement.',
} as const;
