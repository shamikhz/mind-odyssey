'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props { onComplete: () => void; difficulty?: number; }

export default function WaterJugHard({ onComplete, difficulty = 1 }: Props) {
  // Difficulty 1: 5L and 3L to get 4L
  // Difficulty 2: 7L and 5L to get 6L
  const target = difficulty === 1 ? 4 : 6;
  const capA = difficulty === 1 ? 5 : 7;
  const capB = difficulty === 1 ? 3 : 5;

  const [jugA, setJugA] = useState(0);
  const [jugB, setJugB] = useState(0);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    if (jugA === target || jugB === target) {
      setTimeout(onComplete, 500);
    }
  }, [jugA, jugB, target, onComplete]);

  const incrementMove = () => setMoves(m => m + 1);

  const fillA = () => { if (jugA !== capA) { setJugA(capA); incrementMove(); } };
  const fillB = () => { if (jugB !== capB) { setJugB(capB); incrementMove(); } };
  const emptyA = () => { if (jugA !== 0) { setJugA(0); incrementMove(); } };
  const emptyB = () => { if (jugB !== 0) { setJugB(0); incrementMove(); } };
  
  const pourAToB = () => {
    if (jugA === 0 || jugB === capB) return;
    const space = capB - jugB;
    const amount = Math.min(jugA, space);
    setJugA(jugA - amount);
    setJugB(jugB + amount);
    incrementMove();
  };
  
  const pourBToA = () => {
    if (jugB === 0 || jugA === capA) return;
    const space = capA - jugA;
    const amount = Math.min(jugB, space);
    setJugB(jugB - amount);
    setJugA(jugA + amount);
    incrementMove();
  };

  const getWaterColor = (amount: number, cap: number) => {
    if (amount === target) return 'var(--success)';
    return '#3b82f6';
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Target: exactly <b>{target} Liters</b> in any jug.
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-tertiary)' }}>Moves: {moves}</p>
      </div>

      <div 
        className="card flex-center"
        style={{ 
          display: 'flex', gap: '40px', alignItems: 'flex-end',
          background: 'var(--bg-card)', minHeight: '300px'
        }}
      >
        {/* JUG A */}
        <div className="flex-col flex-center" style={{ gap: '16px' }}>
          <div style={{ position: 'relative', width: '80px', height: `${capA * 30}px`, border: '3px solid var(--border)', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ height: `${(jugA / capA) * 100}%` }}
              transition={{ type: 'spring', damping: 15 }}
              style={({
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: getWaterColor(jugA, capA),
              } as React.CSSProperties)}
            />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', zIndex: 2 }}>
              {jugA}L / {capA}L
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={fillA}>Fill</button>
            <button className="btn btn-secondary btn-sm" onClick={emptyA}>Empty</button>
            <button className="btn btn-primary btn-sm" style={{ gridColumn: 'span 2' }} onClick={pourAToB}>Pour to B ➡</button>
          </div>
        </div>

        {/* JUG B */}
        <div className="flex-col flex-center" style={{ gap: '16px' }}>
          <div style={{ position: 'relative', width: '80px', height: `${capB * 30}px`, border: '3px solid var(--border)', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
            <motion.div 
              animate={{ height: `${(jugB / capB) * 100}%` }}
              transition={{ type: 'spring', damping: 15 }}
              style={({
                position: 'absolute', bottom: 0, left: 0, right: 0,
                background: getWaterColor(jugB, capB),
              } as React.CSSProperties)}
            />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', zIndex: 2 }}>
              {jugB}L / {capB}L
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button className="btn btn-secondary btn-sm" onClick={fillB}>Fill</button>
            <button className="btn btn-secondary btn-sm" onClick={emptyB}>Empty</button>
            <button className="btn btn-primary btn-sm" style={{ gridColumn: 'span 2' }} onClick={pourBToA}>⬅ Pour to A</button>
          </div>
        </div>
      </div>
    </div>
  );
}
