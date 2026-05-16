'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const riddles = [
  { q: "A man walks into a restaurant and orders a water. The waiter pulls out a gun and points it at him. The man says 'Thank you' and leaves. Why?", a: "HICCUPS", hint: "Why would a gun help?" },
  { q: "What can you hold in your right hand but never in your left hand?", a: "YOUR LEFT HAND", hint: "Think literally" },
];

export default function LateralThinking({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<string|null>(null);
  const [showHint, setShowHint] = useState(false);

  const check = () => {
    const answer = input.toUpperCase().trim();
    const correct = answer.includes(riddles[current].a) || riddles[current].a.includes(answer);
    if (correct && answer.length >= 3) {
      setFeedback('correct');
      setTimeout(() => {
        if (current >= riddles.length - 1) onComplete();
        else { setCurrent(c => c + 1); setInput(''); setFeedback(null); setShowHint(false); }
      }, 600);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '420px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>{current + 1}/{riddles.length}</p>
      <div className="card" style={{ padding: '20px', marginBottom: '16px', textAlign: 'left', lineHeight: 1.6 }}>
        <p>{riddles[current].q}</p>
      </div>
      {showHint && <p style={{ color: 'var(--warning)', fontSize: '0.85rem', marginBottom: '12px' }}>💡 {riddles[current].hint}</p>}
      {!showHint && <button className="btn btn-ghost btn-sm mb-sm" onClick={() => setShowHint(true)}>Show extra hint</button>}
      <input type="text" value={input} onChange={e => setInput((e.target as any).value)}
        onKeyDown={e => e.key === 'Enter' && check()}
        placeholder="Your answer..."
        style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px', fontSize: '1rem', color: 'var(--text-primary)', textAlign: 'center', width: '100%', outline: 'none' }}
        autoFocus />
      <button className="btn btn-primary w-full mt-md" onClick={check}
        style={{ animation: feedback === 'wrong' ? 'shake 0.3s' : undefined }}>
        {feedback === 'correct' ? '✅ Brilliant!' : feedback === 'wrong' ? '❌ Think Differently' : 'Submit'}
      </button>
    </div>
  );
}
