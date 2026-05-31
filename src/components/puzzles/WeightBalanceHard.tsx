'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

type Weight = { id: string; symbol: string; weight: number };

const ITEMS: Weight[] = [
  { id: 'A', symbol: '🔺', weight: 2 },
  { id: 'B', symbol: '🔵', weight: 3 },
  { id: 'C', symbol: '🟦', weight: 5 },
  { id: 'D', symbol: '⭐', weight: 10 },
];

export default function WeightBalanceHard({ onComplete }: Props) {
  const [inventory, setInventory] = useState<Weight[]>(ITEMS);
  const [leftPan, setLeftPan] = useState<Weight[]>([]);
  const [rightPan, setRightPan] = useState<Weight[]>([]);

  useEffect(() => {
    const leftSum = leftPan.reduce((acc, curr) => acc + curr.weight, 0);
    const rightSum = rightPan.reduce((acc, curr) => acc + curr.weight, 0);
    
    // Win if balanced and all items are used
    if (leftSum > 0 && leftSum === rightSum && inventory.length === 0) {
      setTimeout(onComplete, 500);
    }
  }, [leftPan, rightPan, inventory, onComplete]);

  const moveItem = (item: Weight, from: 'inv' | 'left' | 'right') => {
    if (from === 'inv') {
      setInventory(prev => prev.filter(i => i.id !== item.id));
      setLeftPan(prev => [...prev, item]); // Move to left by default
    } else if (from === 'left') {
      setLeftPan(prev => prev.filter(i => i.id !== item.id));
      setRightPan(prev => [...prev, item]);
    } else if (from === 'right') {
      setRightPan(prev => prev.filter(i => i.id !== item.id));
      setInventory(prev => [...prev, item]);
    }
  };

  const leftSum = leftPan.reduce((acc, curr) => acc + curr.weight, 0);
  const rightSum = rightPan.reduce((acc, curr) => acc + curr.weight, 0);
  const tilt = leftSum > rightSum ? -10 : leftSum < rightSum ? 10 : 0;

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Click shapes to cycle them between the Inventory, Left Pan, and Right Pan. <br/>
          Use <b>all shapes</b> to perfectly balance the scale!
        </p>
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '40px', minHeight: '60px' }}>
        {inventory.map(item => (
          <button
            key={item.id}
            onClick={() => moveItem(item, 'inv')}
            style={{ fontSize: '2.5rem', background: 'none', border: 'none', cursor: 'pointer', transition: 'transform 0.1s' }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {item.symbol}
          </button>
        ))}
        {inventory.length === 0 && <span style={{ color: 'var(--text-tertiary)', alignSelf: 'center' }}>Inventory Empty</span>}
      </div>

      {/* The Scale */}
      <div style={{ position: 'relative', width: '300px', height: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Scale Arm */}
        <div style={{ 
          width: '100%', height: '8px', background: 'var(--border)', 
          marginTop: '60px', transform: `rotate(${tilt}deg)`,
          transition: 'transform 0.5s ease',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'relative'
        }}>
          {/* Left Pan */}
          <div style={{ position: 'absolute', left: '-20px', top: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '2px', height: '40px', background: 'var(--border)' }} />
            <div style={{ width: '80px', height: '10px', background: 'var(--accent-primary)', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '4px', position: 'absolute', bottom: '10px' }}>
                {leftPan.map(item => (
                  <button key={item.id} onClick={() => moveItem(item, 'left')} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    {item.symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Pan */}
          <div style={{ position: 'absolute', right: '-20px', top: '0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '2px', height: '40px', background: 'var(--border)' }} />
            <div style={{ width: '80px', height: '10px', background: 'var(--accent-primary)', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'flex-end', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', gap: '4px', position: 'absolute', bottom: '10px' }}>
                {rightPan.map(item => (
                  <button key={item.id} onClick={() => moveItem(item, 'right')} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    {item.symbol}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Base */}
        <div style={{ width: '20px', height: '120px', background: 'var(--border)', marginTop: '-4px' }} />
        <div style={{ width: '100px', height: '20px', background: 'var(--border)', borderRadius: '10px 10px 0 0' }} />
      </div>

    </div>
  );
}
