'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import FloatingIcons from '@/components/FloatingIcons';
import Header from '@/components/Header';

export default function LandingPage() {
  const { state, getLevelsCleared, getTotalStars } = useGame();
  const router = useRouter();
  const hasProgress = getLevelsCleared() > 0;

  return (
    <div className="page">
      <Header />
      <FloatingIcons />
      <div className="page-content flex-col flex-center" style={{ minHeight: '100vh', gap: '32px', textAlign: 'center', paddingTop: '80px' }}>
        {/* Logo */}
        <div style={{ animation: 'slideDown 0.6s ease' }}>
          <div style={{ fontSize: '4rem', marginBottom: '8px' }}>🧠</div>
          <h1>
            <span className="gradient-text">Mind Odyssey</span>
          </h1>
        </div>

        {/* Progress Preview */}
        {hasProgress && (
          <div className="card" style={{ animation: 'slideUp 0.6s ease 0.2s both', maxWidth: '360px', width: '100%' }}>
            <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="stat-card" style={{ padding: '12px' }}>
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>{getLevelsCleared()}</div>
                <div className="stat-label">Cleared</div>
              </div>
              <div className="stat-card" style={{ padding: '12px' }}>
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>{getTotalStars()}⭐</div>
                <div className="stat-label">Stars</div>
              </div>
              <div className="stat-card" style={{ padding: '12px' }}>
                <div className="stat-value" style={{ fontSize: '1.5rem' }}>💡{state.hintsRemaining}</div>
                <div className="stat-label">Hints</div>
              </div>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex-col gap-md" style={{ animation: 'slideUp 0.6s ease 0.3s both', width: '100%', maxWidth: '320px' }}>
          {hasProgress ? (
            <button onClick={() => router.push(`/play/${state.currentLevel}`)} className="btn btn-primary btn-lg w-full">
              ▶ Continue Game
            </button>
          ) : (
            <button onClick={() => router.push('/play/1')} className="btn btn-primary btn-lg w-full">
              🚀 Start Game
            </button>
          )}
          <button onClick={() => router.push('/levels')} className="btn btn-secondary w-full">
            📊 All Levels
          </button>
        </div>

        {/* Footer */}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '20px' }}>
          Train your brain. Discover your mind. 🚀
        </p>
      </div>
    </div>
  );
}
