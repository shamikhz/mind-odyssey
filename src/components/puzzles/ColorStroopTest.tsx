'use client';
import React, { useState, useEffect } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

const COLORS = [
  { name: 'RED', hex: '#EF4444' },
  { name: 'BLUE', hex: '#3B82F6' },
  { name: 'GREEN', hex: '#10B981' },
  { name: 'YELLOW', hex: '#FACC15' }
];

export default function ColorStroopTest({ onComplete }: Props) {
  const targetRounds = 5;
  const [round, setRound] = useState(0);
  const [word, setWord] = useState(COLORS[0]);
  const [color, setColor] = useState(COLORS[1]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);

  const startGame = () => {
    setRound(0);
    setError(false);
    setIsPlaying(true);
    nextRound();
  };

  const nextRound = () => {
    const rWord = COLORS[Math.floor(Math.random() * COLORS.length)];
    // Ensure the color is DIFFERENT from the word to trigger Stroop effect
    let rColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    while (rColor.name === rWord.name) {
      rColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    setWord(rWord);
    setColor(rColor);
  };

  const handleGuess = (guessName: string) => {
    if (guessName === color.name) { // Must select the INK color, not the word
      const nextR = round + 1;
      setRound(nextR);
      if (nextR >= targetRounds) {
        setIsPlaying(false);
        setTimeout(onComplete, 500);
      } else {
        nextRound();
      }
    } else {
      setIsPlaying(false);
      setError(true);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Stroop Test! Select the <b>Color of the Ink</b>, ignore the word itself!
        </p>
      </div>

      <div className={`card flex-col flex-center mb-lg ${error ? 'error-shake' : ''}`} style={{ background: 'var(--bg-card)', padding: '24px', width: '100%', minHeight: '300px', borderColor: error ? 'var(--danger)' : 'var(--border)' }}>
        
        {!isPlaying && !error && (
          <button className="btn btn-primary btn-lg" onClick={startGame}>START</button>
        )}

        {!isPlaying && error && (
          <div className="flex-col flex-center">
            <h2 style={{ color: 'var(--danger)' }}>Wrong!</h2>
            <p>You must select the color of the ink.</p>
            <button className="btn btn-secondary mt-md" onClick={startGame}>Try Again</button>
          </div>
        )}

        {isPlaying && (
          <>
            <div style={{ width: '100%', textAlign: 'right', color: 'var(--text-tertiary)', fontWeight: 'bold' }}>
              {round + 1} / {targetRounds}
            </div>

            <div style={{ fontSize: '4rem', fontWeight: '900', color: color.hex, margin: '40px 0', textShadow: '2px 2px 0 #000' }}>
              {word.name}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', width: '100%' }}>
              {COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => handleGuess(c.name)}
                  className="btn btn-secondary"
                  style={{ padding: '16px', fontSize: '1.2rem', fontWeight: 'bold' }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </>
        )}

      </div>
      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
