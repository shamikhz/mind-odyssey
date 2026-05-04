'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; }

const rooms = [
  { name: 'Kitchen', emoji: '🍳', items: ['🔑', '📖', '🕯️'] },
  { name: 'Bedroom', emoji: '🛏️', items: ['💍', '🎸', '📱'] },
  { name: 'Garden', emoji: '🌳', items: ['⚽', '🦋', '🌹'] },
];

const questions = [
  { q: 'What was in the Kitchen?', room: 0, correctIdx: 0 },
  { q: 'What was in the Bedroom?', room: 1, correctIdx: 1 },
  { q: 'What was in the Garden?', room: 2, correctIdx: 2 },
];

export default function MemoryPalace({ onComplete }: Props) {
  const [phase, setPhase] = useState<'explore' | 'quiz'>('explore');
  const [currentRoom, setCurrentRoom] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const allItems = rooms.flatMap(r => r.items);

  const handleAnswer = (items: string[]) => {
    const correct = items.every(item => rooms[questions[qIdx].room].items.includes(item));
    if (correct) {
      setFeedback('correct');
      setTimeout(() => {
        if (qIdx >= questions.length - 1) onComplete();
        else { setQIdx(q => q + 1); setFeedback(null); }
      }, 600);
    } else {
      setFeedback('wrong');
      setTimeout(() => setFeedback(null), 800);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center' }}>
      {phase === 'explore' ? (
        <>
          <p style={{ color: 'var(--warning)', marginBottom: '12px' }}>🏰 Explore each room and memorize the items!</p>
          <div className="card" style={{ padding: '20px', marginBottom: '16px' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>{rooms[currentRoom].emoji}</div>
            <h3>{rooms[currentRoom].name}</h3>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', margin: '16px 0', fontSize: '2rem' }}>
              {rooms[currentRoom].items.map((item, i) => (
                <span key={i} style={{ animation: `slideUp 0.3s ease ${i * 0.1}s both` }}>{item}</span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {rooms.map((r, i) => (
              <button key={i} className={`btn btn-sm ${i === currentRoom ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCurrentRoom(i)}>
                {r.emoji} {r.name}
              </button>
            ))}
          </div>
          <button className="btn btn-primary w-full mt-md" onClick={() => setPhase('quiz')}>I&apos;ve Memorized!</button>
        </>
      ) : (
        <>
          <p style={{ marginBottom: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Question {qIdx + 1}/{questions.length}</p>
          <p style={{ fontWeight: 600, marginBottom: '16px' }}>{questions[qIdx].q}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {rooms.map((r, i) => (
              <button key={i} className="btn btn-secondary w-full" onClick={() => handleAnswer(r.items)}
                style={{ animation: feedback === 'wrong' ? 'shake 0.3s' : undefined }}>
                {r.items.join(' ')}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
