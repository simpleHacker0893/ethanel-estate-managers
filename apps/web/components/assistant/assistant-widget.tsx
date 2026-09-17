'use client';

import {
  Loader2Icon,
  MessageCircleIcon,
  MicIcon,
  SendIcon,
  SquareIcon,
  Volume2Icon,
  VolumeXIcon,
  XIcon,
} from 'lucide-react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

import {
  assistantStatusSchema,
  assistantTranscribeResponseSchema,
  type AssistantEvent,
  type AssistantStatus,
} from '@ethanel/contracts/assistant';
import { cn } from '@ethanel/ui/lib/cn';

import { assistant as copy } from '@/content/assistant';

import { useRecorder } from './use-recorder';

interface Turn {
  id: number;
  role: 'user' | 'assistant';
  content: string;
  suggestion?: { label: string; href: string };
  error?: boolean;
}

/** Parses one SSE frame (`event: x\ndata: {...}`) into an assistant event. */
function parseFrame(frame: string): AssistantEvent | null {
  const data = frame
    .split('\n')
    .find((l) => l.startsWith('data:'))
    ?.slice(5)
    .trim();
  if (!data) return null;
  try {
    return JSON.parse(data) as AssistantEvent;
  } catch {
    return null;
  }
}

function speakInBrowser(text: string): void {
  if (typeof speechSynthesis === 'undefined') return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-KE';
  speechSynthesis.speak(utterance);
}

/**
 * Client leaf. Floating launcher → dialog with a message log, text input, microphone capture
 * (transcript lands in the input for confirmation) and optional spoken replies. State lives in
 * memory only; nothing is persisted.
 */
export function AssistantWidget() {
  const pathname = usePathname();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<AssistantStatus | null>(null);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState<'idle' | 'streaming' | 'transcribing'>('idle');
  const [speak, setSpeak] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [transcriptPending, setTranscriptPending] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const nextId = useRef(1);

  const speakReply = useCallback(async (text: string) => {
    const spoken = text.slice(0, 600);
    try {
      const res = await fetch('/api/assistant/speak', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: spoken }),
      });
      if (res.ok && (res.headers.get('content-type') ?? '').startsWith('audio/')) {
        const url = URL.createObjectURL(await res.blob());
        const audio = new Audio(url);
        audio.onended = () => {
          URL.revokeObjectURL(url);
        };
        await audio.play();
        return;
      }
    } catch {
      // fall through to the browser voice
    }
    speakInBrowser(spoken);
  }, []);

  const onClip = useCallback((clip: Blob) => {
    setBusy('transcribing');
    setNotice(null);
    const form = new FormData();
    form.set('audio', clip, 'clip.webm');
    void fetch('/api/assistant/transcribe', { method: 'POST', body: form })
      .then(async (res) => assistantTranscribeResponseSchema.safeParse(await res.json()))
      .then((parsed) => {
        if (parsed.success && parsed.data.ok) {
          setInput(parsed.data.text);
          setTranscriptPending(true);
          inputRef.current?.focus();
        } else {
          setNotice(
            parsed.success && !parsed.data.ok ? parsed.data.message : copy.errors.transcribe,
          );
        }
      })
      .catch(() => {
        setNotice(copy.errors.transcribe);
      })
      .finally(() => {
        setBusy('idle');
      });
  }, []);
  const onRecorderError = useCallback((reason: 'unsupported' | 'denied') => {
    setNotice(reason === 'denied' ? copy.errors.micDenied : copy.errors.micUnsupported);
  }, []);
  const recorder = useRecorder({ onClip, onError: onRecorderError });

  useEffect(() => {
    if (!open || status) return;
    void fetch('/api/assistant/status')
      .then(async (res) => assistantStatusSchema.safeParse(await res.json()))
      .then((parsed) => {
        if (parsed.success) setStatus(parsed.data);
      })
      .catch(() => {
        setStatus({ mode: 'demo', voice: false, model: 'unknown' });
      });
  }, [open, status]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRef.current();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [turns]);

  const closeRef = useRef<() => void>(() => undefined);
  function close() {
    setOpen(false);
    abortRef.current?.abort();
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    launcherRef.current?.focus();
  }
  closeRef.current = close;

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy !== 'idle') return;
    setInput('');
    setTranscriptPending(false);
    setNotice(null);
    const userTurn: Turn = { id: nextId.current++, role: 'user', content };
    const replyId = nextId.current++;
    const history = [...turns.filter((t) => !t.error), userTurn].slice(-20);
    setTurns((prev) => [...prev, userTurn, { id: replyId, role: 'assistant', content: '' }]);
    setBusy('streaming');
    const controller = new AbortController();
    abortRef.current = controller;
    let reply = '';
    const patch = (update: Partial<Turn>) => {
      setTurns((prev) => prev.map((t) => (t.id === replyId ? { ...t, ...update } : t)));
    };
    try {
      const res = await fetch('/api/assistant/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json', accept: 'text/event-stream' },
        body: JSON.stringify({
          messages: history.map((t) => ({ role: t.role, content: t.content })),
          page: pathname,
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let boundary = buffer.indexOf('\n\n');
        while (boundary !== -1) {
          const event = parseFrame(buffer.slice(0, boundary));
          buffer = buffer.slice(boundary + 2);
          boundary = buffer.indexOf('\n\n');
          if (!event) continue;
          if (event.type === 'token') {
            reply += event.text;
            patch({ content: reply });
          } else if (event.type === 'suggestion') {
            patch({ suggestion: { label: event.label, href: event.href } });
          } else if (event.type === 'error') {
            reply = event.message;
            patch({ content: reply, error: true });
          }
        }
      }
      if (!reply) patch({ content: copy.errors.generic, error: true });
      else if (speak) void speakReply(reply);
    } catch (error) {
      if (!(error instanceof DOMException && error.name === 'AbortError')) {
        patch({ content: copy.errors.generic, error: true });
      }
    } finally {
      setBusy('idle');
      abortRef.current = null;
    }
  }

  const streaming = busy === 'streaming';
  const dialogId = `${id}-dialog`;

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        aria-label={copy.launcherAria}
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => {
          if (open) close();
          else setOpen(true);
        }}
        className={cn(
          'fixed right-4 bottom-4 z-40 inline-flex h-14 items-center gap-2 rounded-full bg-pink-500 pr-5 pl-4 font-sans text-label-m font-semibold text-navy-950 shadow-[0_10px_30px_rgba(11,16,38,0.25)] transition-colors hover:bg-pink-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 motion-safe:transition-transform motion-safe:hover:-translate-y-px md:right-6 md:bottom-6',
          open && 'hidden md:inline-flex',
        )}
      >
        <MessageCircleIcon className="size-5" aria-hidden="true" />
        {copy.launcher}
      </button>

      {open ? (
        <section
          id={dialogId}
          role="dialog"
          aria-modal="false"
          aria-labelledby={`${id}-title`}
          className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-card bg-white shadow-[0_-10px_40px_rgba(11,16,38,0.25)] md:inset-x-auto md:right-6 md:bottom-24 md:h-[600px] md:w-[400px] md:rounded-card"
        >
          <header className="flex items-start justify-between gap-3 bg-navy-950 px-4 py-3 text-frost">
            <div>
              <p id={`${id}-title`} className="font-display text-[20px] leading-6 font-semibold">
                {copy.title}
              </p>
              <p className="mt-0.5 text-label-s text-lavender-muted">
                {copy.poweredBy}
                {status ? ` · ${status.mode === 'live' ? status.model : 'demo mode'}` : ''}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label={copy.close}
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-button text-frost hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
            >
              <XIcon className="size-5" aria-hidden="true" />
            </button>
          </header>

          {status?.mode === 'demo' ? (
            <p
              role="status"
              className="border-b border-amber-100 bg-amber-100 px-4 py-2 text-body-s text-amber-700"
            >
              {copy.demoBanner}
            </p>
          ) : null}

          <div
            ref={logRef}
            role="log"
            aria-live="polite"
            aria-relevant="additions text"
            className="flex-1 space-y-3 overflow-y-auto px-4 py-4"
          >
            <p className="max-w-[90%] rounded-[14px] rounded-tl-[4px] bg-mist-100 px-3.5 py-2.5 text-body-s text-ink">
              {copy.intro}
            </p>
            {turns.length === 0 ? (
              <ul className="flex flex-wrap gap-2" aria-label="Suggested questions">
                {copy.starters.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => void send(s)}
                      className="rounded-full border border-iris-200 bg-iris-50 px-3 py-1.5 text-label-s font-semibold text-iris-700 hover:bg-iris-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            {turns.map((t) => (
              <div
                key={t.id}
                className={cn(
                  'flex flex-col gap-2',
                  t.role === 'user' ? 'items-end' : 'items-start',
                )}
                data-role={t.role}
              >
                <p
                  className={cn(
                    'max-w-[90%] rounded-[14px] px-3.5 py-2.5 text-body-s whitespace-pre-wrap',
                    t.role === 'user'
                      ? 'rounded-tr-[4px] bg-iris-700 text-white'
                      : 'rounded-tl-[4px] bg-mist-100 text-ink',
                    t.error && 'border border-coral bg-white text-coral',
                  )}
                >
                  {t.content || (streaming ? copy.thinking : '')}
                </p>
                {t.suggestion ? (
                  <Link
                    href={t.suggestion.href as Route}
                    onClick={close}
                    className="inline-flex min-h-11 items-center rounded-full bg-pink-500 px-4 text-label-s font-semibold text-navy-950 hover:bg-pink-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
                    data-testid="assistant-suggestion"
                  >
                    {t.suggestion.label} →
                  </Link>
                ) : null}
              </div>
            ))}
          </div>

          {notice ? (
            <p role="alert" className="border-t border-mist-200 px-4 py-2 text-body-s text-coral">
              {notice}
            </p>
          ) : null}
          {transcriptPending && !notice ? (
            <p
              role="status"
              className="border-t border-mist-200 px-4 py-2 text-body-s text-mist-700"
            >
              {copy.transcriptHint}
            </p>
          ) : null}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="border-t border-mist-200 p-3"
          >
            <label htmlFor={`${id}-input`} className="sr-only">
              {copy.placeholder}
            </label>
            <div className="flex items-end gap-2">
              <textarea
                id={`${id}-input`}
                ref={inputRef}
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                rows={1}
                maxLength={2000}
                placeholder={
                  recorder.state === 'recording'
                    ? copy.mic.listening
                    : busy === 'transcribing'
                      ? copy.mic.transcribing
                      : copy.placeholder
                }
                disabled={busy === 'transcribing'}
                className="min-h-11 flex-1 resize-none rounded-button border border-mist-200 bg-white px-3.5 py-2.5 font-sans text-body-s text-ink placeholder:text-mist-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
              />
              <button
                type="button"
                aria-label={recorder.state === 'recording' ? copy.mic.stop : copy.mic.start}
                aria-pressed={recorder.state === 'recording'}
                disabled={busy !== 'idle'}
                onClick={() => {
                  if (recorder.state === 'recording') recorder.stop();
                  else void recorder.start();
                }}
                className={cn(
                  'relative inline-flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-button border border-mist-200 text-ink hover:bg-mist-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-60',
                  recorder.state === 'recording' && 'border-coral text-coral',
                )}
              >
                {recorder.state === 'recording' ? (
                  <>
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 bg-pink-200"
                      style={{ height: `${String(Math.round(recorder.level * 100))}%` }}
                    />
                    <SquareIcon className="relative size-4" aria-hidden="true" />
                  </>
                ) : (
                  <MicIcon className="size-5" aria-hidden="true" />
                )}
              </button>
              <button
                type="button"
                aria-label={speak ? copy.speak.on : copy.speak.off}
                aria-pressed={speak}
                onClick={() => {
                  setSpeak((v) => !v);
                  if (speak && typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
                }}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-button border border-mist-200 text-ink hover:bg-mist-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
              >
                {speak ? (
                  <Volume2Icon className="size-5" aria-hidden="true" />
                ) : (
                  <VolumeXIcon className="size-5" aria-hidden="true" />
                )}
              </button>
              <button
                type="submit"
                aria-label={copy.send}
                disabled={busy !== 'idle' || input.trim() === ''}
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-button bg-iris-700 text-white hover:bg-iris-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500 disabled:opacity-60"
              >
                {streaming ? (
                  <Loader2Icon className="size-5 motion-safe:animate-spin" aria-hidden="true" />
                ) : (
                  <SendIcon className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>
            <p className="mt-2 text-[11px] leading-4 text-mist-500">{copy.disclaimer}</p>
          </form>
        </section>
      ) : null}
    </>
  );
}
