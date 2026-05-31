'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

const POOL = ['🍎', '🚀', '🦊', '🎸', '🍔', '⚡', '🏆', '🎈'];

export default function ShadowMatching({ onComplete, difficulty = 1 }: Props) {
  const [items, setItems] = useState<string[]>([]);
  const [shadows, setShadows] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  
  const [selectedShadow, setSelectedShadow] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const pairCount = 3 + difficulty; // 4 pairs for diff 1

  useEffect(() => {
    const shuffledPool = [...POOL].sort(() => Math.random() - 0.5).slice(0, pairCount);
    setItems(shuffledPool.sort(() => Math.random() - 0.5));
    // Another shuffle for the shadows list
    setShadows([...shuffledPool].sort(() => Math.random() - 0.5));
  }, [pairCount]);

  const handleShadowClick = (shadow: string) => {
    if (matched.includes(shadow)) return;
    setSelectedShadow(shadow);
  };

  const handleItemClick = (item: string) => {
    if (matched.includes(item)) return;
    if (!selectedShadow) return; // Must select shadow first

    if (item === selectedShadow) {
      // Match!
      const newMatched = [...matched, item];
      setMatched(newMatched);
      setSelectedShadow(null);
      if (newMatched.length === pairCount) {
        setTimeout(onComplete, 400);
      }
    } else {
      // Mismatch
      setError(true);
      setTimeout(() => {
        setError(false);
        setSelectedShadow(null);
      }, 500);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Select a shadow, then select the matching object!
        </p>
      </div>

      <div 
        className={`card ${error ? 'error-shake' : ''}`}
        style={{ 
          display: 'flex',
          gap: '40px',
          background: 'var(--bg-card)',
          borderColor: error ? 'var(--danger)' : 'var(--border)'
        }}
      >
        {/* Shadows Column */}
        <div className="flex-col" style={{ gap: '16px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '8px', color: 'var(--text-secondary)' }}>Shadows</h4>
          {shadows.map((s, idx) => {
            const isMatched = matched.includes(s);
            const isSelected = selectedShadow === s;
            return (
              <button
                key={`shadow-${idx}`}
                onClick={() => handleShadowClick(s)}
                disabled={isMatched}
                style={{
                  width: '60px', height: '60px',
                  fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isSelected ? 'var(--accent-primary)' : 'var(--bg-body)',
                  border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'transparent'}`,
                  borderRadius: '12px',
                  opacity: isMatched ? 0.2 : 1,
                  cursor: isMatched ? 'default' : 'pointer',
                  // CSS trick to make it look like a black silhouette shadow
                  filter: 'brightness(0) drop-shadow(0px 0px 2px rgba(0,0,0,0.5))',
                  transition: 'all 0.2s ease'
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Objects Column */}
        <div className="flex-col" style={{ gap: '16px' }}>
          <h4 style={{ textAlign: 'center', marginBottom: '8px', color: 'var(--text-secondary)' }}>Objects</h4>
          {items.map((item, idx) => {
            const isMatched = matched.includes(item);
            return (
              <button
                key={`item-${idx}`}
                onClick={() => handleItemClick(item)}
                disabled={isMatched || !selectedShadow}
                style={{
                  width: '60px', height: '60px',
                  fontSize: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg-body)',
                  border: '2px solid transparent',
                  borderRadius: '12px',
                  opacity: isMatched ? 0.2 : 1,
                  cursor: (isMatched || !selectedShadow) ? 'default' : 'pointer',
                  transition: 'all 0.2s ease',
                  transform: isMatched ? 'scale(0.9)' : 'scale(1)'
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
