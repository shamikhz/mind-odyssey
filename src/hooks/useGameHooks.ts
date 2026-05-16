'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  const start = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => { setSeconds(0); setIsRunning(false); }, []);
  const format = useCallback((s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  }, []);

  return { seconds, isRunning, start, stop, reset, formatted: format(seconds), format };
}

export function useHints(levelHints: string[], hintsRemaining: number, dispatch: React.Dispatch<{ type: string }>) {
  const [hintIndex, setHintIndex] = useState(0);
  const [shownHints, setShownHints] = useState<string[]>([]);
  const [hintsUsedThisLevel, setHintsUsedThisLevel] = useState(0);

  const useHint = useCallback(() => {
    if (hintsRemaining <= 0 || hintIndex >= levelHints.length) return null;
    const hint = levelHints[hintIndex];
    dispatch({ type: 'USE_HINT' });
    setShownHints(prev => [...prev, hint]);
    setHintIndex(prev => prev + 1);
    setHintsUsedThisLevel(prev => prev + 1);
    return hint;
  }, [hintsRemaining, hintIndex, levelHints, dispatch]);

  const resetHints = useCallback(() => {
    setHintIndex(0);
    setShownHints([]);
    setHintsUsedThisLevel(0);
  }, []);

  return { useHint, shownHints, hintsUsedThisLevel, resetHints, canUseHint: hintsRemaining > 0 && hintIndex < levelHints.length };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const storage = (globalThis as any).localStorage;
      const item = storage?.getItem(key);
      if (item) setValue(JSON.parse(item));
    } catch { /* ignore */ }
  }, [key]);

  const setStoredValue = useCallback((val: T | ((prev: T) => T)) => {
    setValue(prev => {
      const newVal = val instanceof Function ? val(prev) : val;
      try { 
        const storage = (globalThis as any).localStorage;
        storage?.setItem(key, JSON.stringify(newVal)); 
      } catch { /* ignore */ }
      return newVal;
    });
  }, [key]);

  return [value, setStoredValue] as const;
}
