'use client';
import React, { useState, useRef, useEffect } from 'react';

interface Props { onComplete: () => void; }

// Star shape dots
const dots = [
  { x: 150, y: 20 }, { x: 180, y: 100 }, { x: 270, y: 110 },
  { x: 200, y: 160 }, { x: 220, y: 250 }, { x: 150, y: 200 },
  { x: 80, y: 250 }, { x: 100, y: 160 }, { x: 30, y: 110 },
  { x: 120, y: 100 },
];

export default function ConnectDots({ onComplete }: Props) {
  const [connected, setConnected] = useState<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleDotClick = (idx: number) => {
    if (connected.length === 0 && idx !== 0) return;
    if (idx === connected.length) {
      setConnected(c => [...c, idx]);
      if (idx === dots.length - 1) setTimeout(onComplete, 800);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = (canvas as any).getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, 300, 280);
    ctx.strokeStyle = '#7c3aed';
    ctx.lineWidth = 2;
    for (let i = 1; i < connected.length; i++) {
      ctx.beginPath();
      ctx.moveTo(dots[connected[i - 1]].x, dots[connected[i - 1]].y);
      ctx.lineTo(dots[connected[i]].x, dots[connected[i]].y);
      ctx.stroke();
    }
    if (connected.length === dots.length) {
      ctx.beginPath();
      ctx.moveTo(dots[connected[connected.length - 1]].x, dots[connected[connected.length - 1]].y);
      ctx.lineTo(dots[connected[0]].x, dots[connected[0]].y);
      ctx.stroke();
    }
  }, [connected]);

  return (
    <div style={{ width: '100%', maxWidth: '320px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>Connect dots 1→{dots.length} in order</p>
      <div style={{ position: 'relative', width: '300px', height: '280px', margin: '0 auto' }}>
        <canvas ref={canvasRef} width={300} height={280} style={{ position: 'absolute', inset: 0 }} />
        {dots.map((dot, i) => (
          <button key={i} onClick={() => handleDotClick(i)}
            style={{
              position: 'absolute', left: dot.x - 14, top: dot.y - 14,
              width: '28px', height: '28px', borderRadius: '50%',
              background: connected.includes(i) ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              border: i === connected.length ? '2px solid var(--warning)' : '2px solid var(--border)',
              color: 'var(--text-primary)', fontSize: '0.65rem', fontWeight: 700,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
            }}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
