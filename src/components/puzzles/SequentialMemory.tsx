'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; }

const ACTIONS = ['Click the RED button', 'Click the BLUE button', 'Click the GREEN button', 'Click the YELLOW button'];
const COLORS: Record<string, string> = { RED: '#ef4444', BLUE: '#3b82f6', GREEN: '#10b981', YELLOW: '#f59e0b' };

export default function SequentialMemory({ onComplete }: Props) {
  const [instructions, setInstructions] = useState<string[]>([]);
  const [phase, setPhase] = useState<'read' | 'execute'>('read');
  const [step, setStep] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState<string | null>(null);
  const targetRounds = 3;

  useEffect(() => {
    const count = round + 2;
    const inst: string[] = [];
    for (let i = 0; i < count; i++) inst.push(ACTIONS[Math.floor(Math.random() * ACTIONS.length)]);
    setInstructions(inst);
    setPhase('read');
    setStep(0);
  }, [round]);

  const handleClick = (color: string) => {
    if (phase !== 'execute') return;
    const expected = instructions[step].match(/RED|BLUE|GREEN|YELLOW/)?.[0];
    if (color === expected) {
      if (step + 1 >= instructions.length) {
        setFeedback('correct');
        setTimeout(() => {
          if (round >= targetRounds) onComplete();
          else { setRound(r => r + 1); setFeedback(null); }
        }, 600);
      } else { setStep(s => s + 1); }
    } else {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setStep(0); setPhase('read'); }, 800);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>Round {round}/{targetRounds}</p>
      {phase === 'read' ? (
        <>
          <p style={{ color: 'var(--warning)', marginBottom: '12px' }}>Memorize these instructions:</p>
          <div className="card" style={{ padding: '16px', marginBottom: '16px', textAlign: 'left' }}>
            {instructions.map((inst, i) => (
              <p key={i} style={{ marginBottom: '4px', fontSize: '0.9rem' }}>
                {i + 1}. {inst}
              </p>
            ))}
          </div>
          <button className="btn btn-primary" onClick={() => setPhase('execute')}>Ready!</button>
        </>
      ) : (
        <>
          <p style={{ marginBottom: '4px', color: 'var(--text-secondary)' }}>Step {step + 1} of {instructions.length}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginTop: '16px' }}>
            {Object.entries(COLORS).map(([name, bg]) => (
              <button key={name} onClick={() => handleClick(name)}
                style={{
                  height: '60px', borderRadius: 'var(--radius-md)', background: bg,
                  border: 'none', fontWeight: 700, color: 'white', fontSize: '0.9rem',
                  cursor: 'pointer', transition: 'all 0.15s',
                  animation: feedback === 'wrong' ? 'shake 0.3s' : undefined,
                }}>
                {name}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
