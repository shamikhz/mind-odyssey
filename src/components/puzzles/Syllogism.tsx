'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const puzzles = [
  { premises: ["All dogs are mammals.", "All mammals are animals."], question: "Are all dogs animals?", answer: "Yes" },
  { premises: ["Some birds can fly.", "Penguins are birds."], question: "Can penguins fly?", answer: "Not necessarily" },
];

export default function Syllogism({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const p = puzzles[current];
  const options = current === 0 ? ["Yes", "No", "Not necessarily"] : ["Yes", "No", "Not necessarily"];

  const handleAnswer = (ans: string) => {
    if (ans === p.answer) {
      setFeedback('correct');
      setTimeout(() => {
        if (current >= puzzles.length - 1) onComplete();
        else { setCurrent(c => c + 1); setFeedback(null); }
      }, 600);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  return (
    <div style={{ width: '100%', textAlign: 'center', maxWidth: '420px' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{current + 1}/{puzzles.length}</div>
      <div className="card" style={{ padding: '20px', marginBottom: '16px', textAlign: 'left' }}>
        {p.premises.map((pr, i) => (
          <p key={i} style={{ marginBottom: '6px', color: 'var(--text-secondary)' }}>📌 {pr}</p>
        ))}
        <p style={{ fontWeight: 700, marginTop: '12px', fontSize: '1.05rem' }}>❓ {p.question}</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map(opt => (
          <button key={opt} className="btn btn-secondary w-full" onClick={() => handleAnswer(opt)}
            style={{
              background: feedback && opt === p.answer ? 'rgba(16,185,129,0.2)' : undefined,
              animation: feedback === 'wrong' ? 'shake 0.3s' : undefined,
            }}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
