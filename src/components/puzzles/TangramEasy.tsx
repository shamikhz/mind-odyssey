'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

// Simplified tangram: match shapes to target slots
const shapes = ['🔺', '🔻', '◆', '▪️'];
const targetOrder = ['🔺', '◆', '🔻', '▪️'];

export default function TangramEasy({ onComplete }: Props) {
  const [placed, setPlaced] = useState<(string | null)[]>([null, null, null, null]);
  const [available, setAvailable] = useState([...shapes]);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handlePlace = (slotIdx: number) => {
    if (available.length === 0 || placed[slotIdx]) return;
    const shape = available[0];
    const newPlaced = [...placed];
    newPlaced[slotIdx] = shape;
    setPlaced(newPlaced);
    setAvailable(a => a.slice(1));

    if (newPlaced.every(p => p !== null)) {
      if (newPlaced.every((p, i) => p === targetOrder[i])) {
        setFeedback('correct');
        setTimeout(onComplete, 500);
      } else {
        setFeedback('wrong');
        setTimeout(() => {
          setPlaced([null, null, null, null]);
          const s = [...shapes];
          for (let i = s.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [s[i], s[j]] = [s[j], s[i]]; }
          setAvailable(s);
          setFeedback(null);
        }, 800);
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>Place shapes in the correct pattern:</p>
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Target: </span>
        {targetOrder.map((s, i) => <span key={i} style={{ fontSize: '1.5rem' }}>{s}</span>)}
      </div>
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
        {placed.map((shape, i) => (
          <button key={i} onClick={() => handlePlace(i)}
            style={{
              width: '60px', height: '60px', borderRadius: '8px', fontSize: '1.8rem',
              background: shape ? 'rgba(124,58,237,0.2)' : 'var(--bg-tertiary)',
              border: '2px dashed var(--border)', cursor: shape ? 'default' : 'pointer',
            }}>
            {shape || '?'}
          </button>
        ))}
      </div>
      {available.length > 0 && (
        <div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px' }}>Next piece:</p>
          <span style={{ fontSize: '2.5rem' }}>{available[0]}</span>
        </div>
      )}
    </div>
  );
}
