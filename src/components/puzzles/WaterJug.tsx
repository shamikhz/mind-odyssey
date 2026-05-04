'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

// 5L and 3L jugs, target = 4L
export default function WaterJug({ onComplete }: Props) {
  const [jug5, setJug5] = useState(0);
  const [jug3, setJug3] = useState(0);
  const [moves, setMoves] = useState(0);
  const target = 4;

  const doAction = (action: string) => {
    setMoves(m => m + 1);
    switch (action) {
      case 'fill5': setJug5(5); break;
      case 'fill3': setJug3(3); break;
      case 'empty5': setJug5(0); break;
      case 'empty3': setJug3(0); break;
      case 'pour5to3': {
        const pour = Math.min(jug5, 3 - jug3);
        setJug5(jug5 - pour); setJug3(jug3 + pour); break;
      }
      case 'pour3to5': {
        const pour = Math.min(jug3, 5 - jug5);
        setJug3(jug3 - pour); setJug5(jug5 + pour); break;
      }
    }
  };

  React.useEffect(() => {
    if (jug5 === target || jug3 === target) setTimeout(onComplete, 500);
  }, [jug5, jug3, onComplete]);

  const jugStyle = (current: number, max: number): React.CSSProperties => ({
    width: `${max * 20 + 30}px`, height: '120px',
    border: '3px solid var(--border)', borderTop: 'none', borderRadius: '0 0 12px 12px',
    position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
    background: 'var(--bg-tertiary)',
  });

  const waterStyle = (current: number, max: number): React.CSSProperties => ({
    width: '100%', height: `${(current / max) * 100}%`,
    background: 'linear-gradient(180deg, #06b6d4, #0e7490)',
    borderRadius: '0 0 10px 10px', transition: 'height 0.3s ease',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontWeight: 700, color: 'white', fontSize: '1.1rem',
  });

  return (
    <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>
        Target: {target}L · Moves: {moves}
      </p>
      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', marginBottom: '20px', marginTop: '12px' }}>
        {[{ label: '5L Jug', current: jug5, max: 5 }, { label: '3L Jug', current: jug3, max: 3 }].map(({ label, current, max }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>{label}</p>
            <div style={jugStyle(current, max)}>
              <div style={waterStyle(current, max)}>{current > 0 ? `${current}L` : ''}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
        <button className="btn btn-secondary btn-sm" onClick={() => doAction('fill5')}>Fill 5L</button>
        <button className="btn btn-secondary btn-sm" onClick={() => doAction('fill3')}>Fill 3L</button>
        <button className="btn btn-secondary btn-sm" onClick={() => doAction('empty5')}>Empty 5L</button>
        <button className="btn btn-secondary btn-sm" onClick={() => doAction('empty3')}>Empty 3L</button>
        <button className="btn btn-primary btn-sm" onClick={() => doAction('pour5to3')}>5L → 3L</button>
        <button className="btn btn-primary btn-sm" onClick={() => doAction('pour3to5')}>3L → 5L</button>
      </div>
    </div>
  );
}
