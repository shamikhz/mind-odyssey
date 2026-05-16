'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const puzzles = [
  { images: '👁️ ❤️ 🗽', answer: 'I LOVE NEW YORK', hint: 'A famous city slogan' },
  { images: '🌍 + 🐛 = ?', answer: 'EARTHWORM', hint: 'A creature in soil' },
  { images: '⭐ + 🐟 = ?', answer: 'STARFISH', hint: 'A sea creature' },
];

export default function Rebus({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSubmit = () => {
    if (input.toUpperCase().trim() === puzzles[current].answer) {
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
    <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>{current + 1}/{puzzles.length}</p>
      <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{puzzles[current].images}</div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{puzzles[current].hint}</p>
      </div>
      <input type="text" value={input} onChange={e => setInput((e.target as any).value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="What does this represent?"
        style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '1rem', color: 'var(--text-primary)', textAlign: 'center', width: '100%', outline: 'none' }}
        autoFocus />
      <button className="btn btn-primary w-full mt-md" onClick={handleSubmit}
        style={{ animation: feedback === 'wrong' ? 'shake 0.3s' : undefined }}>
        {feedback === 'correct' ? '✅ Correct!' : feedback === 'wrong' ? '❌ Try Again' : 'Submit'}
      </button>
    </div>
  );
}
