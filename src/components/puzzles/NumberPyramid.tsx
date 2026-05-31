'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function NumberPyramid({ onComplete }: Props) {
  // Pyramid:
  //    [ top ]
  //  [ m1 ] [ m2 ]
  // [b1] [b2] [b3]
  // Rule: Cell = sum of 2 cells directly below it
  const base = [3, 8, 4];
  const targetM1 = base[0] + base[1]; // 11
  const targetM2 = base[1] + base[2]; // 12
  const targetTop = targetM1 + targetM2; // 23

  const [m1, setM1] = useState<string>('');
  const [m2, setM2] = useState<string>('');
  const [top, setTop] = useState<string>('');
  const [activeCell, setActiveCell] = useState<'m1'|'m2'|'top'|null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (m1 && m2 && top) {
      if (parseInt(m1) === targetM1 && parseInt(m2) === targetM2 && parseInt(top) === targetTop) {
        setTimeout(onComplete, 500);
      } else {
        setError(true);
        setTimeout(() => setError(false), 800);
      }
    }
  }, [m1, m2, top, targetM1, targetM2, targetTop, onComplete]);

  const handleNumpad = (num: string) => {
    if (!activeCell) return;
    if (num === 'DEL') {
      if (activeCell === 'm1') setM1(prev => prev.slice(0, -1));
      if (activeCell === 'm2') setM2(prev => prev.slice(0, -1));
      if (activeCell === 'top') setTop(prev => prev.slice(0, -1));
    } else {
      if (activeCell === 'm1') setM1(prev => (prev + num).slice(0, 3));
      if (activeCell === 'm2') setM2(prev => (prev + num).slice(0, 3));
      if (activeCell === 'top') setTop(prev => (prev + num).slice(0, 3));
    }
  };

  const Cell = ({ val, id, isBase = false }: { val: string | number, id?: any, isBase?: boolean }) => (
    <div 
      onClick={() => !isBase && setActiveCell(id)}
      style={{
        width: '60px', height: '60px',
        background: isBase ? 'rgba(255,255,255,0.05)' : activeCell === id ? 'var(--accent-primary)' : 'var(--bg-body)',
        border: '2px solid var(--border)',
        borderRadius: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.5rem', fontWeight: 'bold',
        cursor: isBase ? 'default' : 'pointer',
        boxShadow: activeCell === id ? '0 0 10px var(--accent-primary)' : 'none'
      }}
    >
      {val}
    </div>
  );

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Each number is the sum of the two numbers directly below it! <br/>
          Select a cell and type the correct number.
        </p>
      </div>

      <div className={`card flex-col flex-center ${error ? 'error-shake' : ''}`} style={{ background: 'var(--bg-card)', padding: '24px', gap: '8px', borderColor: error ? 'var(--danger)' : 'var(--border)' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Cell val={top} id="top" />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Cell val={m1} id="m1" />
          <Cell val={m2} id="m2" />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Cell val={base[0]} isBase />
          <Cell val={base[1]} isBase />
          <Cell val={base[2]} isBase />
        </div>
      </div>

      {activeCell && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '24px', width: '200px' }}>
          {[1,2,3,4,5,6,7,8,9,'DEL',0].map(btn => (
            <button 
              key={btn}
              onClick={() => handleNumpad(btn.toString())}
              className={`btn ${btn === 'DEL' ? 'btn-danger' : 'btn-secondary'}`}
              style={{ gridColumn: btn === 0 ? '2 / span 1' : 'auto', padding: '12px', fontSize: '1.2rem' }}
            >
              {btn}
            </button>
          ))}
        </div>
      )}

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
