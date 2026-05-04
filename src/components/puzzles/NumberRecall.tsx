'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; }

export default function NumberRecall({ onComplete }: Props) {
  const [numbers, setNumbers] = useState<number[]>([]);
  const [phase, setPhase] = useState<'showing' | 'input'>('showing');
  const [input, setInput] = useState('');
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const targetRounds = 4;

  useEffect(() => {
    const len = round + 3; // 4,5,6,7 digits
    const nums = Array.from({ length: len }, () => Math.floor(Math.random() * 10));
    setNumbers(nums);
    setPhase('showing');
    const timer = setTimeout(() => setPhase('input'), 3000);
    return () => clearTimeout(timer);
  }, [round]);

  const handleSubmit = () => {
    const expected = numbers.join('');
    if (input === expected) {
      setFeedback('correct');
      setTimeout(() => {
        if (round >= targetRounds) onComplete();
        else { setRound(r => r + 1); setInput(''); setFeedback(null); }
      }, 600);
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setInput(''); setPhase('showing'); }, 1000);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Round {round}/{targetRounds}</p>
      {phase === 'showing' ? (
        <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '8px', color: 'var(--accent-primary)', animation: 'fadeIn 0.3s ease' }}>
          {numbers.join(' ')}
        </div>
      ) : (
        <div>
          <p style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>Type the numbers:</p>
          <input type="text" value={input} onChange={e => setInput(e.target.value.replace(/\D/g, ''))}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            style={{
              background: 'var(--bg-tertiary)', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)',
              padding: '12px 16px', fontSize: '1.5rem', color: 'var(--text-primary)', textAlign: 'center',
              letterSpacing: '6px', width: '100%', outline: 'none',
            }}
            autoFocus
          />
          <button className="btn btn-primary w-full mt-md" onClick={handleSubmit}
            style={{ animation: feedback === 'wrong' ? 'shake 0.3s' : undefined }}>
            {feedback === 'correct' ? '✅ Correct!' : feedback === 'wrong' ? '❌ Wrong' : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
}
