'use client';
import { useState, useEffect, useRef, useCallback } from 'react';

export function useCountdown(initialSeconds: number, onComplete?: () => void) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onCompleteRef = useRef(onComplete);

  // Update ref so we don't trigger effect on every render if callback changes
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (onCompleteRef.current) onCompleteRef.current();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, seconds]);

  const start = useCallback(() => setIsRunning(true), []);
  const stop = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newSeconds: number = initialSeconds) => {
    setIsRunning(false);
    setSeconds(newSeconds);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [initialSeconds]);

  return { seconds, isRunning, start, stop, reset };
}
