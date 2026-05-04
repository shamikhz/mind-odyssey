'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const objects = ['🍎', '🍊', '🍋'];
// Apple is heaviest
export default function BalancingScale({ onComplete }: Props) {
  const [weighings, setWeighings] = useState<string[]>([]);
  const [left, setLeft] = useState<number | null>(null);
  const [right, setRight] = useState<number | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [answer, setAnswer] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const weights = [5, 3, 2]; // apple, orange, lemon

  const weigh = () => {
    if (left === null || right === null || left === right) return;
    const r = weights[left] > weights[right] ? `${objects[left]} is heavier` : weights[left] < weights[right] ? `${objects[right]} is heavier` : 'Equal';
    setResult(r);
    setWeighings(w => [...w, `${objects[left]} vs ${objects[right]}: ${r}`]);
  };

  const handleAnswer = (idx: number) => {
    setAnswer(idx);
    if (idx === 0) { setFeedback('correct'); setTimeout(onComplete, 600); }
    else { setFeedback('wrong'); setTimeout(() => { setFeedback(null); setAnswer(null); }, 800); }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>Find the heaviest object</p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Left</label>
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            {objects.map((o, i) => (
              <button key={i} className="btn btn-sm" onClick={() => setLeft(i)}
                style={{ fontSize: '1.5rem', padding: '8px', background: left === i ? 'var(--accent-primary)' : 'var(--bg-tertiary)' }}>{o}</button>
            ))}
          </div>
        </div>
        <span style={{ fontSize: '1.5rem', margin: '0 8px' }}>⚖️</span>
        <div>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Right</label>
          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
            {objects.map((o, i) => (
              <button key={i} className="btn btn-sm" onClick={() => setRight(i)}
                style={{ fontSize: '1.5rem', padding: '8px', background: right === i ? 'var(--accent-secondary)' : 'var(--bg-tertiary)' }}>{o}</button>
            ))}
          </div>
        </div>
      </div>
      <button className="btn btn-primary btn-sm mb-md" onClick={weigh} disabled={left === null || right === null}>⚖️ Weigh</button>
      {result && <p style={{ color: 'var(--accent-secondary)', marginBottom: '12px' }}>{result}</p>}
      {weighings.length > 0 && (
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
          {weighings.map((w, i) => <p key={i}>{w}</p>)}
        </div>
      )}
      <p style={{ fontWeight: 600, marginBottom: '8px' }}>Which is heaviest?</p>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        {objects.map((o, i) => (
          <button key={i} className="btn btn-secondary" onClick={() => handleAnswer(i)}
            style={{ fontSize: '1.5rem', animation: answer === i && feedback === 'wrong' ? 'shake 0.3s' : undefined,
              background: answer === i && feedback === 'correct' ? 'rgba(16,185,129,0.3)' : undefined }}>{o}</button>
        ))}
      </div>
    </div>
  );
}
