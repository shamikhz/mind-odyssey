'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

type Color = { id: string; name: string; hex: string };

const PRIMARY_COLORS: Color[] = [
  { id: 'R', name: 'Red', hex: '#EF4444' },
  { id: 'B', name: 'Blue', hex: '#3B82F6' },
  { id: 'Y', name: 'Yellow', hex: '#FACC15' },
  { id: 'W', name: 'White', hex: '#FFFFFF' },
  { id: 'K', name: 'Black', hex: '#111827' },
];

export default function ColorMixing({ onComplete }: Props) {
  // Target: Orange (Red + Yellow)
  const targetColor = { name: 'Orange', hex: '#F97316', required: ['R', 'Y'] };
  
  const [selected, setSelected] = useState<string[]>([]);
  const [mixedColor, setMixedColor] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const handleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(prev => prev.filter(c => c !== id));
    } else {
      if (selected.length < 2) {
        setSelected(prev => [...prev, id]);
      }
    }
  };

  const handleMix = () => {
    if (selected.length !== 2) return;
    
    const isCorrect = targetColor.required.every(id => selected.includes(id));
    
    if (isCorrect) {
      setMixedColor(targetColor.hex);
      setTimeout(onComplete, 1000);
    } else {
      // Just make a muddy brown/gray for wrong answers
      setMixedColor('#78716C');
      setError(true);
      setTimeout(() => {
        setError(false);
        setMixedColor(null);
        setSelected([]);
      }, 1000);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Select exactly 2 colors and mix them to create:
        </p>
        <h3 style={{ color: targetColor.hex, marginTop: '8px' }}>{targetColor.name}</h3>
      </div>

      <div className={`card flex-col flex-center ${error ? 'error-shake' : ''}`} style={{ background: 'var(--bg-card)', padding: '24px', width: '100%', borderColor: error ? 'var(--danger)' : 'var(--border)' }}>
        
        {/* The Vat */}
        <div style={{
          width: '120px', height: '120px', borderRadius: '50%',
          background: mixedColor || 'var(--bg-body)',
          border: '4px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.5s ease',
          boxShadow: mixedColor ? `0 0 20px ${mixedColor}80` : 'none',
          marginBottom: '32px'
        }}>
          {!mixedColor && <span style={{ color: 'var(--text-tertiary)' }}>VAT</span>}
        </div>

        {/* Color Palette */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {PRIMARY_COLORS.map(c => (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              style={{
                width: '60px', height: '60px', borderRadius: '50%',
                background: c.hex,
                border: selected.includes(c.id) ? '4px solid var(--accent-primary)' : '2px solid rgba(255,255,255,0.2)',
                cursor: 'pointer',
                transform: selected.includes(c.id) ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.2s ease',
                boxShadow: selected.includes(c.id) ? '0 0 10px rgba(255,255,255,0.5)' : 'none'
              }}
              title={c.name}
            />
          ))}
        </div>

        <button 
          className="btn btn-primary mt-lg"
          onClick={handleMix}
          disabled={selected.length !== 2 || mixedColor !== null}
          style={{ width: '150px' }}
        >
          MIX
        </button>
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
