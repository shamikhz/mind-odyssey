'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

type Item = { val: number; setA: boolean; setB: boolean };
type Placement = 'A' | 'B' | 'Both' | 'None';

export default function VennDiagramLogic({ onComplete }: Props) {
  // Set A: Even. Set B: Multiple of 3.
  const items: Item[] = [
    { val: 2, setA: true, setB: false },
    { val: 9, setA: false, setB: true },
    { val: 6, setA: true, setB: true },
    { val: 5, setA: false, setB: false },
  ];

  const [placements, setPlacements] = useState<Record<number, Placement | null>>({
    2: null, 9: null, 6: null, 5: null
  });

  useEffect(() => {
    const allPlaced = items.every(i => placements[i.val] !== null);
    if (!allPlaced) return;

    let isCorrect = true;
    for (const item of items) {
      const p = placements[item.val];
      if (item.setA && !item.setB && p !== 'A') isCorrect = false;
      if (!item.setA && item.setB && p !== 'B') isCorrect = false;
      if (item.setA && item.setB && p !== 'Both') isCorrect = false;
      if (!item.setA && !item.setB && p !== 'None') isCorrect = false;
    }

    if (isCorrect) {
      setTimeout(onComplete, 500);
    }
  }, [placements, onComplete]);

  const handlePlace = (val: number, p: Placement) => {
    setPlacements(prev => ({ ...prev, [val]: p }));
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Place each number into the correct region of the Venn Diagram.
        </p>
      </div>

      <div className="card" style={{ background: 'var(--bg-card)', padding: '24px', width: '100%' }}>
        
        {/* Venn Diagram Visual Reference */}
        <div style={{ position: 'relative', width: '300px', height: '180px', margin: '0 auto 40px auto' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, width: '180px', height: '180px', borderRadius: '50%', border: '4px solid rgba(124, 58, 237, 0.5)', background: 'rgba(124, 58, 237, 0.1)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-start', padding: '20px' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--accent-primary)' }}>Set A:<br/>Even</span>
          </div>
          <div style={{ position: 'absolute', right: 0, top: 0, width: '180px', height: '180px', borderRadius: '50%', border: '4px solid rgba(16, 185, 129, 0.5)', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end', padding: '20px', textAlign: 'right' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>Set B:<br/>Mult of 3</span>
          </div>
          <div style={{ position: 'absolute', left: '125px', top: '70px', fontWeight: 'bold', fontSize: '0.9rem' }}>BOTH</div>
          <div style={{ position: 'absolute', right: '-40px', bottom: '0px', fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>NEITHER</div>
        </div>

        {/* Interactive Assignment */}
        <div className="flex-col" style={{ gap: '16px' }}>
          {items.map(item => (
            <div key={item.val} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--bg-body)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', width: '40px', textAlign: 'center' }}>{item.val}</span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => handlePlace(item.val, 'A')}
                  className={`btn ${placements[item.val] === 'A' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8rem', padding: '8px' }}
                >
                  Set A Only
                </button>
                <button 
                  onClick={() => handlePlace(item.val, 'Both')}
                  className={`btn ${placements[item.val] === 'Both' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8rem', padding: '8px' }}
                >
                  Both
                </button>
                <button 
                  onClick={() => handlePlace(item.val, 'B')}
                  className={`btn ${placements[item.val] === 'B' ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8rem', padding: '8px', background: placements[item.val] === 'B' ? 'var(--success)' : '' }}
                >
                  Set B Only
                </button>
                <button 
                  onClick={() => handlePlace(item.val, 'None')}
                  className={`btn ${placements[item.val] === 'None' ? 'btn-ghost' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8rem', padding: '8px' }}
                >
                  Neither
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
