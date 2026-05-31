'use client';
import React, { useState, useEffect } from 'react';
import { useCountdown } from '@/hooks/useCountdown';

interface Props { onComplete: () => void; difficulty?: number; }

const COLORS = [
  { id: 'R', hex: '#EF4444' },
  { id: 'B', hex: '#3B82F6' },
  { id: 'G', hex: '#10B981' },
  { id: 'Y', hex: '#FACC15' }
];

export default function UltimateChallenge({ onComplete }: Props) {
  const [phase, setPhase] = useState<'intro' | 'mem' | 'math' | 'stroop' | 'recall' | 'win' | 'fail'>('intro');
  const [memSequence, setMemSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);

  // Timer for memory phase
  const { seconds, start, reset } = useCountdown(4, () => {
    setPhase('math');
  });

  const startGame = () => {
    const seq = Array.from({ length: 4 }, () => COLORS[Math.floor(Math.random() * COLORS.length)].id);
    setMemSequence(seq);
    setPlayerSequence([]);
    setPhase('mem');
    reset(4);
    start();
  };

  const handleMath = (ans: number) => {
    if (ans === 56) { // 7 * 8
      setPhase('stroop');
    } else {
      setPhase('fail');
    }
  };

  const handleStroop = (colorName: string) => {
    if (colorName === 'GREEN') { // Text: YELLOW, Color: GREEN
      setPhase('recall');
    } else {
      setPhase('fail');
    }
  };

  const handleRecall = (id: string) => {
    const next = [...playerSequence, id];
    setPlayerSequence(next);

    if (next.length === memSequence.length) {
      if (next.every((v, i) => v === memSequence[i])) {
        setPhase('win');
        setTimeout(onComplete, 1500);
      } else {
        setPhase('fail');
      }
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <h2 style={{ color: 'var(--accent-primary)', textShadow: '0 0 10px rgba(124,58,237,0.5)' }}>Level 100: The Gauntlet</h2>
      </div>

      <div className={`card flex-col flex-center mb-lg ${phase === 'fail' ? 'error-shake' : ''}`} style={{ background: 'var(--bg-card)', padding: '32px', width: '100%', minHeight: '400px', borderColor: phase === 'fail' ? 'var(--danger)' : phase === 'win' ? 'var(--success)' : 'var(--border)' }}>
        
        {phase === 'intro' && (
          <div className="flex-col flex-center">
            <p className="text-center mb-lg">This is the final test. A continuous sequence of challenges.<br/>Do not lose focus.</p>
            <button className="btn btn-primary btn-lg" onClick={startGame}>Begin</button>
          </div>
        )}

        {phase === 'fail' && (
          <div className="flex-col flex-center">
            <h2 style={{ color: 'var(--danger)' }}>Focus Broken.</h2>
            <button className="btn btn-secondary mt-md" onClick={() => setPhase('intro')}>Restart Gauntlet</button>
          </div>
        )}

        {phase === 'win' && (
          <div className="flex-col flex-center">
            <div style={{ fontSize: '4rem' }}>🏆</div>
            <h2 style={{ color: 'var(--success)', marginTop: '16px' }}>MIND ODYSSEY COMPLETED!</h2>
          </div>
        )}

        {phase === 'mem' && (
          <div className="flex-col flex-center" style={{ width: '100%' }}>
            <h3 style={{ marginBottom: '24px' }}>Stage 1: Memorize ({seconds}s)</h3>
            <div style={{ display: 'flex', gap: '16px' }}>
              {memSequence.map((id, i) => {
                const color = COLORS.find(c => c.id === id)?.hex;
                return (
                  <div key={i} style={{ width: '50px', height: '50px', borderRadius: '50%', background: color, boxShadow: `0 0 20px ${color}` }} />
                );
              })}
            </div>
          </div>
        )}

        {phase === 'math' && (
          <div className="flex-col flex-center" style={{ width: '100%' }}>
            <h3 style={{ marginBottom: '32px' }}>Stage 2: Calculate</h3>
            <div style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '32px' }}>7 × 8</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
              {[42, 56, 64, 48].map(n => (
                <button key={n} className="btn btn-secondary" style={{ padding: '16px', fontSize: '1.5rem' }} onClick={() => handleMath(n)}>{n}</button>
              ))}
            </div>
          </div>
        )}

        {phase === 'stroop' && (
          <div className="flex-col flex-center" style={{ width: '100%' }}>
            <h3 style={{ marginBottom: '32px' }}>Stage 3: Ink Color</h3>
            <div style={{ fontSize: '4rem', fontWeight: '900', color: '#10B981', textShadow: '2px 2px 0 #000', marginBottom: '32px' }}>YELLOW</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
              {['RED', 'BLUE', 'GREEN', 'YELLOW'].map(n => (
                <button key={n} className="btn btn-secondary" style={{ padding: '16px', fontSize: '1.2rem', fontWeight: 'bold' }} onClick={() => handleStroop(n)}>{n}</button>
              ))}
            </div>
          </div>
        )}

        {phase === 'recall' && (
          <div className="flex-col flex-center" style={{ width: '100%' }}>
            <h3 style={{ marginBottom: '32px' }}>Stage 4: Recall</h3>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              {Array.from({ length: 4 }).map((_, i) => {
                const id = playerSequence[i];
                const color = COLORS.find(c => c.id === id)?.hex || 'var(--bg-body)';
                return (
                  <div key={i} style={{ width: '40px', height: '40px', borderRadius: '50%', background: color, border: '2px solid var(--border)' }} />
                );
              })}
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              {COLORS.map(c => (
                <button
                  key={c.id}
                  onClick={() => handleRecall(c.id)}
                  style={{ width: '60px', height: '60px', borderRadius: '50%', background: c.hex, border: 'none', cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
        )}

      </div>
      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
