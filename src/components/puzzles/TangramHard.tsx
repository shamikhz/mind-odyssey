'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const shapes = ['🔺','🔻','◆','▪️','🔷','▫️','🔶'];
const targetOrder = ['🔺','🔶','◆','🔻','🔷','▪️','▫️'];

export default function TangramHard({ onComplete }: Props) {
  const [placed, setPlaced] = useState<(string|null)[]>(Array(7).fill(null));
  const [available, setAvailable] = useState(() => {
    const s = [...shapes]; for (let i = s.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s[i],s[j]]=[s[j],s[i]];} return s;
  });
  const [feedback, setFeedback] = useState<string|null>(null);

  const handlePlace = (slotIdx: number) => {
    if (available.length === 0 || placed[slotIdx]) return;
    const shape = available[0];
    const np = [...placed]; np[slotIdx] = shape;
    setPlaced(np);
    setAvailable(a => a.slice(1));
    if (np.every(p => p !== null)) {
      if (np.every((p, i) => p === targetOrder[i])) {
        setFeedback('correct'); setTimeout(onComplete, 500);
      } else {
        setFeedback('wrong');
        setTimeout(() => {
          setPlaced(Array(7).fill(null));
          const s = [...shapes]; for (let i = s.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[s[i],s[j]]=[s[j],s[i]];} setAvailable(s);
          setFeedback(null);
        }, 800);
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>Arrange 7 pieces in the correct order:</p>
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '8px' }}>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target: </span>
        {targetOrder.map((s, i) => <span key={i} style={{ fontSize: '1.2rem' }}>{s}</span>)}
      </div>
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '16px', flexWrap: 'wrap' }}>
        {placed.map((shape, i) => (
          <button key={i} onClick={() => handlePlace(i)} style={{
            width: '44px', height: '44px', borderRadius: '6px', fontSize: '1.5rem',
            background: shape ? 'rgba(124,58,237,0.2)' : 'var(--bg-tertiary)',
            border: '2px dashed var(--border)', cursor: shape ? 'default' : 'pointer',
          }}>{shape || '?'}</button>
        ))}
      </div>
      {available.length > 0 && (
        <div><p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Next: <span style={{ fontSize: '1.5rem' }}>{available[0]}</span></p></div>
      )}
    </div>
  );
}
