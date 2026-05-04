'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; }

const ITEMS = ['🍎', '🍊', '🍋', '🍇', '🍒'];

export default function RememberOrder({ onComplete }: Props) {
  const [phase, setPhase] = useState<'memorize' | 'recall'>('memorize');
  const [order, setOrder] = useState<string[]>(() => {
    const shuffled = [...ITEMS];
    for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    return shuffled;
  });
  const [playerOrder, setPlayerOrder] = useState<string[]>([]);
  const [available, setAvailable] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase('recall');
      const shuffled = [...order];
      for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
      setAvailable(shuffled);
    }, 5000);
    return () => clearTimeout(timer);
  }, [order]);

  const handlePick = (item: string) => {
    const newOrder = [...playerOrder, item];
    setPlayerOrder(newOrder);
    setAvailable(a => a.filter(i => i !== item));
    if (newOrder.length === order.length) {
      if (newOrder.every((it, i) => it === order[i])) setTimeout(onComplete, 500);
      else {
        setTimeout(() => {
          setPlayerOrder([]);
          setPhase('memorize');
          const shuffled = [...ITEMS];
          for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
          setOrder(shuffled);
        }, 1000);
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
      {phase === 'memorize' ? (
        <>
          <p style={{ color: 'var(--warning)', fontWeight: 600, marginBottom: '16px' }}>⏳ Memorize this order!</p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            {order.map((item, i) => (
              <div key={i} style={{ fontSize: '2.5rem', animation: `slideUp 0.3s ease ${i * 0.1}s both` }}>{item}</div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '12px' }}>Place them in the correct order:</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '20px', minHeight: '50px' }}>
            {playerOrder.map((item, i) => (
              <div key={i} style={{ fontSize: '2rem', background: 'var(--bg-tertiary)', borderRadius: '8px', padding: '4px 8px' }}>{item}</div>
            ))}
            {Array.from({ length: order.length - playerOrder.length }).map((_, i) => (
              <div key={`empty-${i}`} style={{ width: '40px', height: '40px', border: '2px dashed var(--border)', borderRadius: '8px' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {available.map(item => (
              <button key={item} onClick={() => handlePick(item)} className="btn btn-secondary" style={{ fontSize: '1.5rem', padding: '8px 12px' }}>{item}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
