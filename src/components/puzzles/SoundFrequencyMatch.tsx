'use client';
import React, { useState } from 'react';

interface Props { onComplete: () => void; difficulty?: number; }

export default function SoundFrequencyMatch({ onComplete }: Props) {
  const targetFreq = 440; // A4
  const [userFreq, setUserFreq] = useState(300);
  const [error, setError] = useState(false);

  const playFreq = (freq: number, type: OscillatorType = 'sine', durationSec: number = 1) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      gain.gain.setValueAtTime(1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);
      osc.stop(ctx.currentTime + durationSec);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = () => {
    // Give a small tolerance of +/- 5Hz
    if (Math.abs(userFreq - targetFreq) <= 5) {
      playFreq(targetFreq, 'sine', 0.5); // Success chime
      setTimeout(onComplete, 800);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <div className="flex-col flex-center" style={{ width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <div className="mb-md text-center">
        <p style={{ color: 'var(--text-secondary)' }}>
          Listen to the target tone, then adjust your frequency slider to match it!
        </p>
      </div>

      <div className={`card flex-col flex-center ${error ? 'error-shake' : ''}`} style={{ background: 'var(--bg-card)', padding: '32px', width: '100%', gap: '32px', borderColor: error ? 'var(--danger)' : 'var(--border)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', alignItems: 'center' }}>
          <button 
            className="btn btn-secondary"
            style={{ fontSize: '1.2rem', padding: '16px 32px', borderRadius: '32px' }}
            onClick={() => playFreq(targetFreq, 'sine', 1)}
          >
            🎵 Play Target Tone
          </button>

          <div style={{ width: '100%', height: '1px', background: 'var(--border)', margin: '16px 0' }} />

          <button 
            className="btn btn-primary"
            style={{ fontSize: '1.2rem', padding: '16px 32px', borderRadius: '32px' }}
            onClick={() => playFreq(userFreq, 'sine', 1)}
          >
            🔊 Play Your Tone
          </button>
        </div>

        <div style={{ width: '100%', padding: '0 20px' }}>
          <input 
            type="range" 
            min="200" max="800" step="1"
            value={userFreq}
            onChange={(e) => setUserFreq(parseInt(e.target.value))}
            style={{ width: '100%', height: '8px', borderRadius: '4px', appearance: 'none', background: 'var(--border)', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-tertiary)', fontSize: '0.8rem', marginTop: '8px' }}>
            <span>200Hz</span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>{userFreq}Hz</span>
            <span>800Hz</span>
          </div>
        </div>

        <button className="btn btn-primary" onClick={handleSubmit} style={{ width: '150px' }}>
          Submit Match
        </button>
      </div>

      <style>{`
        .error-shake { animation: shake 0.4s ease-in-out; }
      `}</style>
    </div>
  );
}
