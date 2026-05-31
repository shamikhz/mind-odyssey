'use client';
import React, { useState, useEffect } from 'react';
import { useCountdown } from '@/hooks/useCountdown';
import { motion } from 'framer-motion';

interface Props { onComplete: () => void; difficulty?: number; }

export default function FastClicker({ onComplete }: Props) {
  const targetClicks = 30;
  const timeLimit = 10;
  
  const [clicks, setClicks] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const { seconds, start: startTimer, reset: resetTimer, isRunning } = useCountdown(timeLimit, () => {
    setIsPlaying(false);
  });

  useEffect(() => {
    if (clicks >= targetClicks) {
      setIsPlaying(false);
      setTimeout(onComplete, 500);
    }
  }, [clicks, targetClicks, onComplete]);

  const startGame = () => {
    setClicks(0);
    resetTimer(timeLimit);
    setIsPlaying(true);
    startTimer();
  };

  const handleClick = () => {
    if (isPlaying) setClicks(c => c + 1);
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Speed Test! Tap the button <b>{targetClicks}</b> times in <b>{timeLimit}</b> seconds!
        </p>
      </div>

      <div className="card flex-col flex-center mb-lg" style={{ background: 'var(--bg-card)', padding: '40px', width: '100%', minHeight: '300px' }}>
        
        {!isPlaying && clicks === 0 && (
          <button className="btn btn-primary btn-lg" onClick={startGame}>
            START
          </button>
        )}

        {!isPlaying && clicks > 0 && clicks < targetClicks && (
          <div className="flex-col flex-center">
            <h2 style={{ color: 'var(--danger)' }}>Time's Up!</h2>
            <p>You got {clicks} clicks.</p>
            <button className="btn btn-secondary mt-md" onClick={startGame}>Try Again</button>
          </div>
        )}

        {isPlaying && (
          <div className="flex-col flex-center" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '24px', fontSize: '1.5rem', fontWeight: 'bold' }}>
              <span style={{ color: 'var(--accent-primary)' }}>{clicks} / {targetClicks}</span>
              <span style={{ color: seconds <= 3 ? 'var(--danger)' : 'var(--text-primary)' }}>{seconds}s</span>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleClick}
              style={{
                width: '150px', height: '150px', borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                border: 'none', cursor: 'pointer',
                boxShadow: '0 10px 25px rgba(124, 58, 237, 0.5)',
                fontSize: '2rem', color: 'white', fontWeight: 'bold',
                userSelect: 'none'
              } as any}
            >
              TAP!
            </motion.button>
          </div>
        )}

      </div>
    </div>
  );
}
