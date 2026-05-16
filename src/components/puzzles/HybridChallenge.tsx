'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

// Phase 1: Logic → solve equation to get a code
// Phase 2: Memory → remember the code
// Phase 3: Strategy → use code to unlock sequence

export default function HybridChallenge({ onComplete }: Props) {
  const [phase, setPhase] = useState(1);
  const [code, setCode] = useState('');
  const [memInput, setMemInput] = useState('');
  const [seqInput, setSeqInput] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string|null>(null);
  const answer = '7'; // 3 + 4 = 7
  const sequence = [7, 14, 21, 28]; // multiples of the code

  // Phase 1: Logic
  const handleLogic = () => {
    if (code === answer) { setPhase(2); setFeedback(null); }
    else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 800); }
  };

  // Phase 2: Memory (show code × 4 sequence briefly)
  const handleMemory = () => {
    if (memInput === sequence.join(',')) { setPhase(3); setFeedback(null); }
    else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 800); }
  };

  // Phase 3: Strategy
  const handleStrategy = (num: number) => {
    const ns = [...seqInput, num];
    setSeqInput(ns);
    if (ns.length === 4) {
      if (ns.every((n, i) => n === sequence[i])) {
        setFeedback('correct'); setTimeout(onComplete, 500);
      } else {
        setFeedback('wrong'); setTimeout(() => { setFeedback(null); setSeqInput([]); }, 800);
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
        {[1,2,3].map(p => (
          <span key={p} className="badge" style={{
            background: phase === p ? 'var(--accent-gradient)' : phase > p ? 'rgba(16,185,129,0.2)' : 'var(--bg-tertiary)',
            color: phase >= p ? 'white' : 'var(--text-muted)',
            padding: '6px 14px',
          }}>
            {phase > p ? '✅' : ''} Phase {p}
          </span>
        ))}
      </div>

      {phase === 1 && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '12px' }}>🧠 Logic Phase</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Solve: If x + 4 = 11 and y = x - 4, what is x − y + 4?</p>
          <input type="text" value={code} onChange={e => setCode((e.target as any).value)} placeholder="Answer"
            onKeyDown={e => e.key === 'Enter' && handleLogic()}
            style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', borderRadius: '8px', padding: '10px', fontSize: '1.2rem', textAlign: 'center', width: '80px', color: 'var(--text-primary)', outline: 'none' }}
            autoFocus />
          <button className="btn btn-primary w-full mt-md" onClick={handleLogic}
            style={{ animation: feedback==='wrong'?'shake 0.3s':undefined }}>Submit</button>
        </div>
      )}

      {phase === 2 && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '12px' }}>🎯 Memory Phase</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>The first 4 multiples of your answer ({answer}) are:</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '16px' }}>{sequence.join(', ')}</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>Type them separated by commas:</p>
          <input type="text" value={memInput} onChange={e => setMemInput((e.target as any).value)} placeholder="7,14,21,28"
            onKeyDown={e => e.key === 'Enter' && handleMemory()}
            style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', borderRadius: '8px', padding: '10px', fontSize: '1rem', textAlign: 'center', width: '100%', color: 'var(--text-primary)', outline: 'none' }} />
          <button className="btn btn-primary w-full mt-md" onClick={handleMemory}
            style={{ animation: feedback==='wrong'?'shake 0.3s':undefined }}>Submit</button>
        </div>
      )}

      {phase === 3 && (
        <div className="card" style={{ padding: '24px' }}>
          <h3 style={{ marginBottom: '12px' }}>🏆 Strategy Phase</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Select the sequence in order from the options:</p>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '12px', minHeight: '36px' }}>
            {seqInput.map((n, i) => <span key={i} className="badge" style={{ background: 'var(--accent-gradient)', color: 'white', padding: '6px 12px' }}>{n}</span>)}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[28, 7, 21, 35, 14, 42].map(n => (
              <button key={n} className="btn btn-secondary btn-sm" onClick={() => handleStrategy(n)}
                disabled={seqInput.includes(n)}
                style={{ opacity: seqInput.includes(n) ? 0.3 : 1 }}>{n}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
