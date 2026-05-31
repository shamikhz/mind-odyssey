'use client';
import React, { useState, useEffect } from 'react';
import { useAudio, Tone } from '@/hooks/useAudio';

interface Props { onComplete: () => void; difficulty?: number; }

const PADS: { id: number; color: string; tone: Tone; label: string }[] = [
  { id: 0, color: '#ef4444', tone: 'C4', label: '1' }, // Red
  { id: 1, color: '#3b82f6', tone: 'E4', label: '2' }, // Blue
  { id: 2, color: '#10b981', tone: 'G4', label: '3' }, // Green
  { id: 3, color: '#f59e0b', tone: 'C5', label: '4' }, // Yellow
];

export default function SoundSequenceRecall({ onComplete, difficulty = 1 }: Props) {
  const [phase, setPhase] = useState<'start' | 'playing' | 'input'>('start');
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [activePad, setActivePad] = useState<number | null>(null);
  const [error, setError] = useState(false);
  
  const { playTone, initAudio } = useAudio();
  const seqLength = 3 + difficulty; // 4 notes for diff 1

  const startGame = () => {
    initAudio(); // required on first click
    const newSeq = Array.from({ length: seqLength }, () => Math.floor(Math.random() * PADS.length));
    setSequence(newSeq);
    setUserInput([]);
    setPhase('playing');
    playSequence(newSeq);
  };

  const playSequence = (seq: number[]) => {
    let delay = 500;
    seq.forEach((padId, index) => {
      setTimeout(() => {
        setActivePad(padId);
        playTone(PADS[padId].tone, 400);
        setTimeout(() => setActivePad(null), 300); // turn off highlight
        
        if (index === seq.length - 1) {
          setTimeout(() => setPhase('input'), 500);
        }
      }, delay);
      delay += 800; // time between notes
    });
  };

  const handleInput = (padId: number) => {
    if (phase !== 'input') return;
    
    // Play the sound they clicked
    playTone(PADS[padId].tone, 300);
    setActivePad(padId);
    setTimeout(() => setActivePad(null), 200);

    const nextIndex = userInput.length;
    if (sequence[nextIndex] === padId) {
      const newInput = [...userInput, padId];
      setUserInput(newInput);
      if (newInput.length === sequence.length) {
        setTimeout(onComplete, 500);
      }
    } else {
      // Wrong input
      setError(true);
      setTimeout(() => {
        setError(false);
        setUserInput([]); // Reset sequence on mistake
      }, 500);
    }
  };

  if (phase === 'start') {
    return (
      <div className="flex-col flex-center" style={{ padding: '40px' }}>
        <p className="mb-md" style={{ color: 'var(--text-secondary)' }}>
          Listen carefully to the melody and watch the pads. Repeat the sequence exactly!
        </p>
        <button className="btn btn-primary btn-lg" onClick={startGame}>Start Listening</button>
      </div>
    );
  }

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center" style={{ height: '30px' }}>
        {phase === 'playing' ? (
          <p style={{ color: 'var(--warning)', fontWeight: 'bold' }}>Listen and watch...</p>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>
            Your turn! ({userInput.length} / {sequence.length})
          </p>
        )}
      </div>

      <div 
        className={`${error ? 'error-shake' : ''}`}
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '16px',
          width: '280px',
          height: '280px',
        }}
      >
        {PADS.map((pad) => (
          <button
            key={pad.id}
            onClick={() => handleInput(pad.id)}
            disabled={phase !== 'input'}
            style={{ 
              borderRadius: 'var(--radius-md)',
              background: pad.color,
              border: 'none',
              cursor: phase === 'input' ? 'pointer' : 'default',
              opacity: activePad === pad.id ? 1 : 0.4,
              transform: activePad === pad.id ? 'scale(0.95)' : 'scale(1)',
              transition: 'all 0.1s ease',
              boxShadow: activePad === pad.id ? `0 0 20px ${pad.color}` : 'none',
              fontSize: '2rem',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 'bold'
            }}
          >
            {pad.label}
          </button>
        ))}
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
