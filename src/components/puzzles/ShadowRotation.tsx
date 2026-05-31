'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function ShadowRotation({ onComplete }: Props) {
  const targetRotation = 180;
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (rotation === targetRotation) {
      setTimeout(onComplete, 500);
    }
  }, [rotation, targetRotation, onComplete]);

  const rotate = (deg: number) => {
    setRotation(prev => {
      let next = prev + deg;
      if (next >= 360) next -= 360;
      if (next < 0) next += 360;
      return next;
    });
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Rotate the object to perfectly match the silhouette's shadow!
        </p>
      </div>

      <div className="card flex-col flex-center" style={{ background: 'var(--bg-card)', padding: '40px', width: '100%', gap: '40px' }}>
        
        <div style={{ position: 'relative', width: '150px', height: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Target Silhouette */}
          <div style={{
            position: 'absolute',
            fontSize: '6rem',
            filter: 'brightness(0) drop-shadow(0px 0px 5px rgba(0,0,0,0.5))',
            opacity: 0.3,
            transform: `rotate(${targetRotation}deg)`
          }}>
            ✈️
          </div>

          {/* Player Object */}
          <div style={{
            position: 'absolute',
            fontSize: '6rem',
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease',
            zIndex: 10
          }}>
            ✈️
          </div>

        </div>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button className="btn btn-secondary" style={{ fontSize: '1.2rem', padding: '12px 24px' }} onClick={() => rotate(-90)}>
            ↺ -90°
          </button>
          <button className="btn btn-secondary" style={{ fontSize: '1.2rem', padding: '12px 24px' }} onClick={() => rotate(90)}>
            +90° ↻
          </button>
        </div>

      </div>
    </div>
  );
}
