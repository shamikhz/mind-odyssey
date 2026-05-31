'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

const isPrime = (n: number) => {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  let i = 5;
  while (i * i <= n) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
    i += 6;
  }
  return true;
};

export default function PrimeNumberFilter({ onComplete }: Props) {
  const [numbers, setNumbers] = useState<{val: number, isP: boolean}[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [errorIds, setErrorIds] = useState<number[]>([]);

  useEffect(() => {
    // Generate pool of primes and composites
    const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
    const composites = [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 24, 25, 26, 27, 28, 30, 32, 33, 34, 35];
    
    // Pick 6 primes, 10 composites
    const chosenPrimes = [...primes].sort(() => Math.random() - 0.5).slice(0, 6);
    const chosenComps = [...composites].sort(() => Math.random() - 0.5).slice(0, 10);
    
    const combined = [...chosenPrimes, ...chosenComps]
      .sort(() => Math.random() - 0.5)
      .map(n => ({ val: n, isP: isPrime(n) }));
      
    setNumbers(combined);
  }, []);

  const handleClick = (num: {val: number, isP: boolean}) => {
    if (selected.includes(num.val)) return; // Already selected

    if (num.isP) {
      const nextSel = [...selected, num.val];
      setSelected(nextSel);
      
      const allPrimes = numbers.filter(n => n.isP);
      if (nextSel.length === allPrimes.length) {
        setTimeout(onComplete, 400);
      }
    } else {
      // Clicked a composite! Error
      setErrorIds(prev => [...prev, num.val]);
      setTimeout(() => {
        setErrorIds(prev => prev.filter(id => id !== num.val));
      }, 500);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Identify and tap <b>ALL</b> the Prime Numbers! <br/>
          (A number divisible only by 1 and itself)
        </p>
      </div>

      <div 
        className="card"
        style={{ 
          background: 'var(--bg-card)', 
          padding: '16px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
          border: '2px solid var(--border)'
        }}
      >
        {numbers.map((num, i) => {
          const isSel = selected.includes(num.val);
          const isErr = errorIds.includes(num.val);
          
          let bg = 'var(--bg-body)';
          if (isSel) bg = 'var(--success)';
          if (isErr) bg = 'var(--danger)';

          return (
            <button
              key={i}
              onClick={() => handleClick(num)}
              className={isErr ? 'error-shake' : ''}
              style={{
                width: '60px', height: '60px',
                background: bg,
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                fontSize: '1.5rem', fontWeight: 'bold',
                cursor: isSel ? 'default' : 'pointer',
                color: isSel || isErr ? 'white' : 'var(--text-primary)',
                transition: 'background 0.2s ease',
              }}
            >
              {num.val}
            </button>
          );
        })}
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
