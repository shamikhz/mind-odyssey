'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props { onComplete: () => void; difficulty?: number; }

export default function BinaryConversion({ onComplete }: Props) {
  const target = 155; // 128 + 16 + 8 + 2 + 1
  const bits = [128, 64, 32, 16, 8, 4, 2, 1];
  
  const [activeBits, setActiveBits] = useState<number[]>([]);

  useEffect(() => {
    const currentSum = activeBits.reduce((a, b) => a + b, 0);
    if (currentSum === target) {
      setTimeout(onComplete, 500);
    }
  }, [activeBits, target, onComplete]);

  const toggleBit = (val: number) => {
    if (activeBits.includes(val)) {
      setActiveBits(prev => prev.filter(b => b !== val));
    } else {
      setActiveBits(prev => [...prev, val]);
    }
  };

  const currentSum = activeBits.reduce((a, b) => a + b, 0);

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Toggle the binary switches to reach exactly the target number!
        </p>
      </div>

      <div className="card flex-col flex-center" style={{ background: 'var(--bg-card)', padding: '32px', width: '100%' }}>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Target</div>
        <div style={{ fontSize: '4rem', fontWeight: 'bold', color: 'var(--accent-primary)', textShadow: '0 0 20px rgba(124,58,237,0.5)', lineHeight: 1 }}>
          {target}
        </div>
        
        <div style={{ display: 'flex', gap: '8px', marginTop: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {bits.map((val) => {
            const isActive = activeBits.includes(val);
            return (
              <div key={val} className="flex-col flex-center" style={{ gap: '8px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>{val}</span>
                <button
                  onClick={() => toggleBit(val)}
                  style={{
                    width: '50px', height: '60px',
                    background: isActive ? 'var(--success)' : 'var(--bg-body)',
                    border: `2px solid ${isActive ? 'var(--success)' : 'var(--border)'}`,
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem', fontWeight: 'bold', color: 'white',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 0 15px var(--success)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {isActive ? '1' : '0'}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: '32px', fontSize: '1.2rem', color: currentSum > target ? 'var(--danger)' : 'var(--text-secondary)' }}>
          Current: <span style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>{currentSum}</span>
        </div>
      </div>
    </div>
  );
}
