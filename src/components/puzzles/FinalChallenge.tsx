'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

// Grand finale: 4 mini-challenges in sequence
export default function FinalChallenge({ onComplete }: Props) {
  const [phase, setPhase] = useState(0);
  const [feedback, setFeedback] = useState<string|null>(null);

  // Phase 0: Pattern (logic)
  const [seqAnswer, setSeqAnswer] = useState('');
  // Phase 1: Memory grid
  const [memPhase, setMemPhase] = useState<'show'|'input'>('show');
  const [memPattern] = useState([0,1,0,1,1,0,1,0,1]);
  const [memInput, setMemInput] = useState(Array(9).fill(0));
  // Phase 2: Word puzzle (creativity)
  const [wordInput, setWordInput] = useState('');
  // Phase 3: Final code
  const [finalInput, setFinalInput] = useState('');

  React.useEffect(() => {
    if (phase === 1) {
      const timer = setTimeout(() => setMemPhase('input'), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const phases = [
    {
      title: '🧠 Logic',
      desc: 'What is 2, 6, 18, 54, ?',
      render: () => (
        <div>
          <input type="text" value={seqAnswer} onChange={e => setSeqAnswer(e.target.value)}
            onKeyDown={e => e.key==='Enter' && checkPhase()}
            style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', borderRadius: '8px', padding: '10px', fontSize: '1.2rem', textAlign: 'center', width: '80px', color: 'var(--text-primary)', outline: 'none' }}
            autoFocus />
        </div>
      ),
      check: () => seqAnswer === '162',
    },
    {
      title: '🎯 Memory',
      desc: memPhase === 'show' ? 'Memorize this pattern...' : 'Recreate the pattern!',
      render: () => (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', maxWidth: '180px', margin: '0 auto' }}>
          {(memPhase === 'show' ? memPattern : memInput).map((v, i) => (
            <button key={i} onClick={() => memPhase === 'input' && setMemInput(prev => { const n=[...prev]; n[i]=n[i]?0:1; return n; })}
              style={{ width: '52px', height: '52px', borderRadius: '8px', background: v ? 'var(--accent-primary)' : 'var(--bg-tertiary)', border: '1px solid var(--border)', cursor: memPhase === 'input' ? 'pointer' : 'default' }} />
          ))}
        </div>
      ),
      check: () => memInput.every((v, i) => v === memPattern[i]),
    },
    {
      title: '🎨 Creativity',
      desc: 'Unscramble: YDSOSE',
      render: () => (
        <input type="text" value={wordInput} onChange={e => setWordInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && checkPhase()}
          placeholder="Answer" autoFocus
          style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', borderRadius: '8px', padding: '10px', fontSize: '1.1rem', textAlign: 'center', width: '160px', color: 'var(--text-primary)', outline: 'none', textTransform: 'uppercase' }} />
      ),
      check: () => wordInput.toUpperCase() === 'ODYSSEY',
    },
    {
      title: '🏆 Final Code',
      desc: 'Enter the name of this game (two words)',
      render: () => (
        <input type="text" value={finalInput} onChange={e => setFinalInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && checkPhase()}
          placeholder="_ _ _ _   _ _ _ _ _ _ _" autoFocus
          style={{ background: 'var(--bg-tertiary)', border: '2px solid var(--border)', borderRadius: '8px', padding: '10px', fontSize: '1.1rem', textAlign: 'center', width: '220px', color: 'var(--text-primary)', outline: 'none', textTransform: 'uppercase' }} />
      ),
      check: () => finalInput.toUpperCase().trim() === 'MIND ODYSSEY',
    },
  ];

  const checkPhase = () => {
    if (phases[phase].check()) {
      setFeedback('correct');
      setTimeout(() => {
        if (phase >= phases.length - 1) onComplete();
        else { setPhase(p => p + 1); setFeedback(null); }
      }, 600);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  const current = phases[phase];

  return (
    <div style={{ width: '100%', maxWidth: '380px', textAlign: 'center' }}>
      <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginBottom: '16px' }}>
        {phases.map((_, i) => (
          <div key={i} style={{
            width: '32px', height: '4px', borderRadius: '2px',
            background: i < phase ? 'var(--success)' : i === phase ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
          }} />
        ))}
      </div>
      <div className="card" style={{ padding: '24px' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Challenge {phase + 1}/{phases.length}</p>
        <h3 style={{ marginBottom: '8px' }}>{current.title}</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>{current.desc}</p>
        {current.render()}
        <button className="btn btn-primary w-full mt-md" onClick={checkPhase}
          style={{ animation: feedback==='wrong'?'shake 0.3s':undefined }}>
          {feedback==='correct'?'✅ Next!':feedback==='wrong'?'❌ Try Again':'Submit'}
        </button>
      </div>
    </div>
  );
}
