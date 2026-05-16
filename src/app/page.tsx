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
  const [showComingSoon, setShowComingSoon] = React.useState(false);
  const [showResetModal, setShowResetModal] = React.useState(false);

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
          <button onClick={(e) => {
            if (!state.user.isLoggedIn) {
              setShowAuthModal(true);
            } else {
              setShowComingSoon(true);
            }
          }} className="btn btn-ghost w-full">
            🏆 Global Leaderboard
          </button>
          {hasProgress && (
            <button onClick={() => setShowResetModal(true)} className="btn btn-ghost btn-sm w-full" style={{ color: 'var(--danger)', opacity: 0.8, marginTop: '10px' }}>
              🗑️ Reset All Progress
            </button>
          )}
        </div>

        {/* Footer */}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '20px' }}>
          Train your brain. Discover your mind. 🚀
        </p>
      </div>

      {/* Coming Soon Alert */}
      {showComingSoon && (
        <div className="modal-overlay" onClick={() => setShowComingSoon(false)} style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '320px', width: '90%', margin: 'auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🏆</div>
            <h3 className="mb-sm">Coming Soon!</h3>
            <p className="mb-md" style={{ color: 'var(--text-secondary)' }}>
              The Global Leaderboard is currently under development. Stay tuned!
            </p>
            <button className="btn btn-primary w-full" onClick={() => setShowComingSoon(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
      {/* Reset Confirmation Modal */}
      {showResetModal && (
        <div className="modal-overlay" onClick={() => setShowResetModal(false)} style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '360px', width: '90%', margin: 'auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
            <h3 className="mb-sm">Reset Progress?</h3>
            <p className="mb-md" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              This will permanently delete all your cleared levels, stars, and time records. This action cannot be undone.
            </p>
            <div className="flex-col gap-sm">
              <button className="btn btn-danger w-full" onClick={() => { dispatch({ type: 'RESET_PROGRESS' }); setShowResetModal(false); }}>
                Yes, Reset Everything
              </button>
              <button className="btn btn-secondary w-full" onClick={() => setShowResetModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
