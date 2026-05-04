'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; }

const FACES = [
  { emoji: '👨', name: 'James' },
  { emoji: '👩', name: 'Sarah' },
  { emoji: '👴', name: 'Robert' },
  { emoji: '👧', name: 'Emily' },
  { emoji: '👦', name: 'David' },
];

export default function FaceName({ onComplete }: Props) {
  const [phase, setPhase] = useState<'study' | 'match'>('study');
  const [shuffledFaces, setShuffledFaces] = useState(FACES);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<string | null>(null);
  const names = FACES.map(f => f.name);

  useEffect(() => {
    const timer = setTimeout(() => {
      const shuffled = [...FACES];
      for (let i = shuffled.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; }
      setShuffledFaces(shuffled);
      setPhase('match');
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (emoji: string, name: string) => {
    setAnswers(a => ({ ...a, [emoji]: name }));
  };

  const check = () => {
    const correct = FACES.every(f => answers[f.emoji] === f.name);
    if (correct) { setFeedback('correct'); setTimeout(onComplete, 500); }
    else { setFeedback('wrong'); setTimeout(() => setFeedback(null), 1000); }
  };

  return (
    <div style={{ width: '100%', maxWidth: '350px', textAlign: 'center' }}>
      {phase === 'study' ? (
        <>
          <p style={{ color: 'var(--warning)', marginBottom: '16px' }}>⏳ Study the faces and names...</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FACES.map(f => (
              <div key={f.emoji} className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px' }}>
                <span style={{ fontSize: '2rem' }}>{f.emoji}</span>
                <span style={{ fontWeight: 600 }}>{f.name}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Match each face to the correct name:</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {shuffledFaces.map(f => (
              <div key={f.emoji} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '2rem' }}>{f.emoji}</span>
                <select value={answers[f.emoji] || ''} onChange={e => handleChange(f.emoji, e.target.value)}
                  style={{ flex: 1, background: 'var(--bg-tertiary)', color: 'var(--text-primary)', border: '1px solid var(--border)', borderRadius: '6px', padding: '8px' }}>
                  <option value="">Select name...</option>
                  {names.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            ))}
          </div>
          <button className="btn btn-primary w-full mt-md" onClick={check}
            style={{ animation: feedback === 'wrong' ? 'shake 0.3s' : undefined }}>
            {feedback === 'correct' ? '✅ Perfect!' : feedback === 'wrong' ? '❌ Try Again' : 'Check Matches'}
          </button>
        </>
      )}
    </div>
  );
}
