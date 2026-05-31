'use client';
import React, { useState, useEffect } from 'react';
import { useCountdown } from '@/hooks/useCountdown';

interface Props { onComplete: () => void; difficulty?: number; }

export default function MathMarathon({ onComplete }: Props) {
  const targetScore = 5;
  const initialTime = 20;

  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQ, setCurrentQ] = useState({ q: '', a: 0, opts: [] as number[] });
  
  const { seconds, start, reset, isRunning } = useCountdown(initialTime, () => setIsPlaying(false));

  const generateQuestion = () => {
    const ops = ['+', '-', '*'];
    const op = ops[Math.floor(Math.random() * ops.length)];
    let n1 = Math.floor(Math.random() * 20) + 1;
    let n2 = Math.floor(Math.random() * 20) + 1;
    
    // Keep multiplication simpler
    if (op === '*') {
      n1 = Math.floor(Math.random() * 9) + 2;
      n2 = Math.floor(Math.random() * 9) + 2;
    }

    const a = op === '+' ? n1 + n2 : op === '-' ? n1 - n2 : n1 * n2;
    
    // Generate 4 options
    let opts = [a];
    while(opts.length < 4) {
      const offset = Math.floor(Math.random() * 10) - 5;
      const fake = a + (offset === 0 ? 1 : offset);
      if (!opts.includes(fake)) opts.push(fake);
    }
    opts = opts.sort(() => Math.random() - 0.5);

    setCurrentQ({ q: `${n1} ${op} ${n2}`, a, opts });
  };

  const startGame = () => {
    setScore(0);
    reset(initialTime);
    generateQuestion();
    setIsPlaying(true);
    start();
  };

  useEffect(() => {
    if (score >= targetScore && isPlaying) {
      setIsPlaying(false);
      setTimeout(onComplete, 500);
    }
  }, [score, targetScore, onComplete, isPlaying]);

  const handleGuess = (val: number) => {
    if (!isPlaying) return;
    if (val === currentQ.a) {
      setScore(s => s + 1);
      if (score + 1 < targetScore) {
        generateQuestion();
      }
    } else {
      // Penalty! We can't subtract from useCountdown directly easily without a custom hook mod, 
      // so we'll just require them to answer correctly to proceed, or reset game
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Math Marathon! Solve <b>{targetScore}</b> equations before time runs out! A wrong answer ends the run!
        </p>
      </div>

      <div className="card flex-col flex-center mb-lg" style={{ background: 'var(--bg-card)', padding: '32px', width: '100%', minHeight: '350px' }}>
        
        {!isPlaying && score === 0 && (
          <button className="btn btn-primary btn-lg" onClick={startGame}>Start Marathon</button>
        )}

        {!isPlaying && score > 0 && score < targetScore && (
          <div className="flex-col flex-center">
            <h2 style={{ color: 'var(--danger)' }}>Run Ended!</h2>
            <p>Score: {score} / {targetScore}</p>
            <button className="btn btn-secondary mt-md" onClick={startGame}>Try Again</button>
          </div>
        )}

        {isPlaying && (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '24px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent-primary)' }}>Score: {score}/{targetScore}</span>
              <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: seconds <= 5 ? 'var(--danger)' : 'white' }}>{seconds}s</span>
            </div>

            <div style={{ fontSize: '3.5rem', fontWeight: '900', margin: '24px 0' }}>
              {currentQ.q}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
              {currentQ.opts.map(opt => (
                <button
                  key={opt}
                  onClick={() => handleGuess(opt)}
                  className="btn btn-secondary"
                  style={{ padding: '16px', fontSize: '1.5rem', fontWeight: 'bold' }}
                >
                  {opt}
                </button>
              ))}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
