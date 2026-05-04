'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const statements = [
  { text: "All cats are animals. Therefore, all animals are cats.", answer: false },
  { text: "If it rains, the ground gets wet. It rained. The ground is wet.", answer: true },
  { text: "No fish can fly. Penguins can't fly. Therefore, penguins are fish.", answer: false },
];

export default function TrueFalse({ onComplete }: Props) {
  const [current, setCurrent] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const handleAnswer = (answer: boolean) => {
    if (answer === statements[current].answer) {
      setFeedback('correct');
      setTimeout(() => {
        if (current >= statements.length - 1) { onComplete(); }
        else { setCurrent(c => c + 1); setFeedback(null); }
      }, 600);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  return (
    <div style={{ width: '100%', textAlign: 'center', maxWidth: '400px' }}>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
        Statement {current + 1} of {statements.length}
      </div>
      <div className="progress-bar mb-md">
        <div className="progress-fill" style={{ width: `${((current) / statements.length) * 100}%` }} />
      </div>
      <div className="card" style={{
        padding: '24px', marginBottom: '20px', fontSize: '1rem', lineHeight: 1.6,
        border: feedback === 'correct' ? '2px solid var(--success)' : feedback === 'wrong' ? '2px solid var(--danger)' : undefined,
        animation: feedback === 'wrong' ? 'shake 0.3s' : undefined,
      }}>
        {statements[current].text}
      </div>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => handleAnswer(true)} style={{ minWidth: '100px' }}>✅ TRUE</button>
        <button className="btn btn-danger" onClick={() => handleAnswer(false)} style={{ minWidth: '100px' }}>❌ FALSE</button>
      </div>
    </div>
  );
}
