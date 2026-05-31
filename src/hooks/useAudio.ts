'use client';
import { useRef, useCallback, useEffect } from 'react';

// Frequencies for a simple C Major scale (C4 to C5)
export const TONE_FREQUENCIES = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  F4: 349.23,
  G4: 392.00,
  A4: 440.00,
  B4: 493.88,
  C5: 523.25,
};

export type Tone = keyof typeof TONE_FREQUENCIES;

export function useAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize AudioContext lazily on first user interaction to comply with browser policies
  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current?.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playTone = useCallback((tone: Tone, durationMs: number = 300) => {
    initAudio();
    if (!audioCtxRef.current) return;

    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = 'sine'; // sine wave for a clean, bell-like tone
    osc.frequency.setValueAtTime(TONE_FREQUENCIES[tone], ctx.currentTime);

    // Simple ADSR envelope for a soft pluck/bell sound
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 0.05); // Attack
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000); // Decay/Release

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + durationMs / 1000);
  }, [initAudio]);

  const playSequence = useCallback((tones: Tone[], delayMs: number = 500) => {
    let delay = 0;
    tones.forEach((tone) => {
      setTimeout(() => playTone(tone), delay);
      delay += delayMs;
    });
  }, [playTone]);

  // Clean up
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => { });
      }
    };
  }, []);

  return { playTone, playSequence, initAudio };
}
