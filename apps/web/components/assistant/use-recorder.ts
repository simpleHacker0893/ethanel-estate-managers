'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type RecorderState = 'idle' | 'recording' | 'unsupported' | 'denied';

/**
 * Microphone capture with MediaRecorder and a coarse level reading for the meter.
 * Stops and releases the track on unmount.
 */
export function useRecorder({
  onClip,
  onError,
}: {
  onClip: (clip: Blob) => void;
  onError: (reason: 'unsupported' | 'denied') => void;
}) {
  const [state, setState] = useState<RecorderState>('idle');
  const [level, setLevel] = useState(0);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const frameRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((t) => {
      t.stop();
    });
    streamRef.current = null;
    void audioRef.current?.close();
    audioRef.current = null;
    recorderRef.current = null;
    setLevel(0);
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const start = useCallback(async () => {
    if (typeof MediaRecorder === 'undefined' || !navigator.mediaDevices.getUserMedia) {
      setState('unsupported');
      onError('unsupported');
      return;
    }
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setState('denied');
      onError('denied');
      return;
    }
    streamRef.current = stream;
    const mimeType = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
    ].find((t) => MediaRecorder.isTypeSupported(t));
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
    const chunks: BlobPart[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    recorder.onstop = () => {
      const clip = new Blob(chunks, { type: recorder.mimeType || 'audio/webm' });
      cleanup();
      setState('idle');
      if (clip.size > 0) onClip(clip);
    };
    recorderRef.current = recorder;

    try {
      const ctx = new AudioContext();
      audioRef.current = ctx;
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      ctx.createMediaStreamSource(stream).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let sum = 0;
        for (const v of data) sum += (v - 128) ** 2;
        setLevel(Math.min(1, Math.sqrt(sum / data.length) / 40));
        frameRef.current = requestAnimationFrame(tick);
      };
      tick();
    } catch {
      // No meter; recording still works.
    }
    recorder.start();
    setState('recording');
  }, [cleanup, onClip, onError]);

  const stop = useCallback(() => {
    const recorder = recorderRef.current;
    if (recorder && recorder.state !== 'inactive') recorder.stop();
  }, []);

  return { state, level, start, stop };
}
