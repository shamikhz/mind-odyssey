'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const puzzles = [
  { scrambled: 'APCLE', answer: 'PLACE' },
  { scrambled: 'INBRA', answer: 'BRAIN' },
  { scrambled: 'ZLPUEZ', answer: 'PUZZLE' },
];

export default function Anagram({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = () => {
    if (input.toUpperCase() === puzzles[current].answer) {
      setFeedback('correct');
      setTimeout(() => {
        if (current >= puzzles.length - 1) onComplete();
        else { setCurrent(c => c + 1); setInput(''); setFeedback(null); }
      }, 600);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>{current + 1}/{puzzles.length}</p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
        {puzzles[current].scrambled.split('').map((l, i) => (
          <div key={i} style={{
            width: '42px', height: '42px', background: 'var(--accent-gradient)', borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1.2rem', animation: `slideUp 0.3s ease ${i * 0.05}s both`,
          }}>{l}</div>
        ))}
      </div>
      <input type="text" value={input} onChange={e => setInput((e.target as any).value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="Type the word..."
        style={{
          background: 'var(--bg-tertiary)', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)',
          padding: '12px', fontSize: '1.1rem', color: 'var(--text-primary)', textAlign: 'center',
          width: '100%', outline: 'none', textTransform: 'uppercase', letterSpacing: '4px',
        }}
        autoFocus />
      <button className="btn btn-primary w-full mt-md" onClick={handleSubmit}
        style={{ animation: feedback === 'wrong' ? 'shake 0.3s' : undefined }}>
        {feedback === 'correct' ? '✅ Correct!' : feedback === 'wrong' ? '❌ Try Again' : 'Submit'}
      </button>
    </div>
  );
}
