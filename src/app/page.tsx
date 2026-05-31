'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useGame } from '@/contexts/GameContext';
import FloatingIcons from '@/components/FloatingIcons';
import Header from '@/components/Header';
import { levels } from '@/data/levels';

export default function LandingPage() {
  const { state, dispatch, getLevelsCleared, getTotalStars, setShowAuthModal } = useGame();
  const router = useRouter();
  const hasProgress = getLevelsCleared() > 0;

  const handleProtectedAction = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    if (!state.user.isLoggedIn) {
      setShowAuthModal(true);
    } else {
      router.push(target);
    }
  };

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
        {state.user.isLoggedIn && hasProgress && (
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
            <button onClick={(e) => handleProtectedAction(e, `/play/${state.currentLevel}`)} className="btn btn-primary btn-lg w-full">
              ▶ Continue Game
            </button>
          ) : (
            <button onClick={(e) => handleProtectedAction(e, '/play/1')} className="btn btn-primary btn-lg w-full">
              🚀 Start Game
            </button>
          )}
          <button onClick={(e) => handleProtectedAction(e, '/levels')} className="btn btn-secondary w-full">
            📊 All Levels
          </button>
        </div>

        {/* Footer */}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '20px' }}>
          Train your brain. Discover your mind. 🚀
        </p>

        {/* Adsterra Homepage Banner (728x90) */}
        {!state.adsRemoved && (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px', paddingBottom: '20px', overflow: 'hidden' }}>
            <iframe 
              src="/ad-728.html" 
              width="728" 
              height="90" 
              frameBorder="0" 
              scrolling="no" 
              style={{ maxWidth: '100%' }}
            />
          </div>
        )}
      </div>

    </div>
  );
}
