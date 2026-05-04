'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const WORDS = ['Sun', 'Moon', 'Star', 'Cloud', 'Rain', 'Wind', 'Snow', 'Fire'];

export default function WordChain({ onComplete }: Props) {
  const [chain, setChain] = useState<string[]>([WORDS[0]]);
  const [phase, setPhase] = useState<'show' | 'recall'>('show');
  const [playerChain, setPlayerChain] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const targetLength = 5;

  const startRecall = () => {
    setPhase('recall');
    setPlayerChain([]);
    const shuffled = [...chain, ...WORDS.filter(w => !chain.includes(w)).slice(0, 3)];
    for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
    setOptions(shuffled);
  };

  const handlePick = (word: string) => {
    const newChain = [...playerChain, word];
    setPlayerChain(newChain);
    const idx = newChain.length - 1;
    if (newChain[idx] !== chain[idx]) {
      setFeedback('wrong');
      setTimeout(() => { setFeedback(null); setPlayerChain([]); }, 800);
      return;
    }
    if (newChain.length === chain.length) {
      if (chain.length >= targetLength) {
        setFeedback('correct');
        setTimeout(onComplete, 500);
      } else {
        setFeedback('correct');
        setTimeout(() => {
          const nextWord = WORDS[chain.length];
          setChain(c => [...c, nextWord]);
          setPhase('show');
          setFeedback(null);
        }, 600);
      }
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>Chain: {chain.length}/{targetLength}</p>
      {phase === 'show' ? (
        <>
          <p style={{ color: 'var(--warning)', marginBottom: '16px' }}>Memorize the chain:</p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
            {chain.map((w, i) => (
              <span key={i} className="badge" style={{ background: 'rgba(124,58,237,0.2)', color: 'var(--accent-primary)', padding: '6px 14px', fontSize: '0.9rem' }}>
                {i + 1}. {w}
              </span>
            ))}
          </div>
          <button className="btn btn-primary" onClick={startRecall}>I Remember!</button>
        </>
      ) : (
        <>
          <p style={{ marginBottom: '12px', color: 'var(--text-secondary)' }}>Tap the words in order:</p>
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '16px', minHeight: '36px', flexWrap: 'wrap' }}>
            {playerChain.map((w, i) => (
              <span key={i} style={{ background: 'var(--bg-tertiary)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.85rem' }}>{w}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {options.map(w => (
              <button key={w} className="btn btn-secondary btn-sm" onClick={() => handlePick(w)}
                disabled={playerChain.includes(w)}
                style={{ opacity: playerChain.includes(w) ? 0.3 : 1, animation: feedback === 'wrong' ? 'shake 0.3s' : undefined }}>
                {w}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
