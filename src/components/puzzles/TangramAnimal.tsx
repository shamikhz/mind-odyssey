'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function TangramAnimal({ onComplete }: Props) {
  // Target: House (Square + Triangle)
  const targetShapes = ['Square', 'Triangle'];
  
  const [selected, setSelected] = useState<string[]>([]);
  const [error, setError] = useState(false);

  const shapes = [
    { id: 'Square', icon: '🟦' },
    { id: 'Triangle', icon: '🔺' },
    { id: 'Circle', icon: '🔴' },
    { id: 'Hexagon', icon: '🛑' }, // Pretend it's a hexagon
  ];

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(prev => prev.filter(s => s !== id));
    } else {
      if (selected.length < 2) {
        setSelected(prev => [...prev, id]);
      }
    }
  };

  const handleBuild = () => {
    if (selected.length !== 2) return;
    
    const isCorrect = targetShapes.every(s => selected.includes(s));
    if (isCorrect) {
      setTimeout(onComplete, 500);
    } else {
      setError(true);
      setTimeout(() => { setError(false); setSelected([]); }, 800);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Select the exactly 2 shapes needed to build the silhouette!
        </p>
      </div>

      <div className={`card flex-col flex-center ${error ? 'error-shake' : ''}`} style={{ background: 'var(--bg-card)', padding: '40px', width: '100%', gap: '32px', borderColor: error ? 'var(--danger)' : 'var(--border)' }}>
        
        {/* Silhouette */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.3, filter: 'brightness(0)' }}>
          <div style={{ fontSize: '4rem', marginBottom: '-20px', zIndex: 2 }}>🔺</div>
          <div style={{ fontSize: '4rem' }}>🟦</div>
        </div>

        {/* Inventory */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {shapes.map(s => (
            <button
              key={s.id}
              onClick={() => handleSelect(s.id)}
              style={{
                width: '60px', height: '60px',
                fontSize: '2rem',
                background: 'var(--bg-body)',
                border: selected.includes(s.id) ? '3px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                transform: selected.includes(s.id) ? 'scale(1.1)' : 'scale(1)',
                boxShadow: selected.includes(s.id) ? '0 0 15px rgba(124,58,237,0.5)' : 'none'
              }}
            >
              {s.icon}
            </button>
          ))}
        </div>

        <button 
          className="btn btn-primary"
          onClick={handleBuild}
          disabled={selected.length !== 2}
        >
          Build
        </button>
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
