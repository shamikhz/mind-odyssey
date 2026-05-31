'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Props { onComplete: () => void; difficulty?: number; }

export default function FractionPizza({ onComplete }: Props) {
  const targetNumerator = 5;
  const targetDenominator = 8;
  
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

  useEffect(() => {
    if (selectedIndices.length === targetNumerator) {
      setTimeout(onComplete, 500);
    }
  }, [selectedIndices, targetNumerator, onComplete]);

  const toggleSlice = (idx: number) => {
    if (selectedIndices.includes(idx)) {
      setSelectedIndices(prev => prev.filter(i => i !== idx));
    } else {
      setSelectedIndices(prev => [...prev, idx]);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Select exactly <b>{targetNumerator}/{targetDenominator}</b> of the pizza!
        </p>
      </div>

      <div className="card flex-center mb-lg" style={{ background: 'var(--bg-card)', padding: '32px', width: '100%' }}>
        <div style={{ position: 'relative', width: '250px', height: '250px', borderRadius: '50%', background: 'var(--bg-body)', border: '4px solid var(--border)' }}>
          {Array.from({ length: targetDenominator }).map((_, i) => {
            const isSelected = selectedIndices.includes(i);
            const angle = (i * 360) / targetDenominator;
            
            // Math for positioning emojis in a circle
            const radius = 70;
            const rad = (angle - 90) * (Math.PI / 180); // -90 to start at top
            const x = radius * Math.cos(rad);
            const y = radius * Math.sin(rad);

            return (
              <motion.button
                key={i}
                onClick={() => toggleSlice(i)}
                animate={{ scale: isSelected ? 1.2 : 1 }}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  marginTop: '-30px', marginLeft: '-30px',
                  width: '60px', height: '60px',
                  transform: `translate(${x}px, ${y}px)`,
                  fontSize: '3rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  filter: isSelected ? 'drop-shadow(0 0 10px rgba(255,200,0,0.8))' : 'grayscale(100%) opacity(0.3)'
                } as any}
              >
                🍕
              </motion.button>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: '2rem', fontWeight: 'bold', color: selectedIndices.length > targetNumerator ? 'var(--danger)' : 'var(--text-primary)' }}>
        {selectedIndices.length} / {targetDenominator}
      </div>

    </div>
  );
}
