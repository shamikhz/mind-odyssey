'use client';
import React from 'react';
import Link from 'next/link';
import { User, Settings, Download, LogOut, Trophy } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useGame } from '@/contexts/GameContext';

export default function Header() {
  const { isInstallable, install } = usePWA();
  const { state, dispatch } = useGame();
  const [showAuthModal, setShowAuthModal] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogin = (method: string) => {
    // Mock login
    dispatch({ type: 'LOGIN', user: { name: 'Player One', email: 'player@example.com' } });
    setShowAuthModal(false);
  };

  return (
    <header className="top-bar" style={{ position: 'fixed', width: '100%', top: 0, zIndex: 100 }}>
      <div className="top-bar-item">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>🧠</span>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.5px' }} className="gradient-text">
            Mind Odyssey
          </span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isInstallable && (
          <button className="btn btn-secondary btn-sm" onClick={install} style={{ padding: '8px 12px', gap: '6px' }}>
            <Download size={18} />
            <span style={{ fontSize: '0.8rem', fontWeight: 700 }}>Install</span>
          </button>
        )}
        
        {state.user.isLoggedIn ? (
          <div style={{ position: 'relative' }}>
            <button className="btn btn-ghost btn-icon" onClick={() => setShowDropdown(!showDropdown)} style={{ padding: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700 }}>
                {state.user.name[0]}
              </div>
            </button>
            
            {showDropdown && (
              <div className="card" style={{ position: 'absolute', top: '100%', right: 0, width: '200px', marginTop: '10px', padding: '8px', zIndex: 101, animation: 'slideDown 0.2s ease' }}>
                <Link href="/profile" className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px' }} onClick={() => setShowDropdown(false)}>
                  <User size={18} /> Profile
                </Link>
                <Link href="/leaderboard" className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px' }} onClick={() => setShowDropdown(false)}>
                  <Trophy size={18} /> Leaderboard
                </Link>
                <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                <button className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px', color: 'var(--danger)' }} onClick={() => { dispatch({ type: 'LOGOUT' }); setShowDropdown(false); }}>
                  <LogOut size={18} /> Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => setShowAuthModal(true)}>
            Login / Register
          </button>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)} style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', margin: 'auto' }}>
            <h2 className="mb-md">Welcome Back!</h2>
            <p className="mb-lg" style={{ color: 'var(--text-secondary)' }}>Choose a login method to save your progress.</p>
            
            <div className="flex-col gap-md">
              <button className="btn btn-secondary w-full" onClick={() => handleLogin('google')} style={{ justifyContent: 'center', gap: '12px', padding: '14px' }}>
                <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: '18px' }} />
                Continue with Google
              </button>
              <button className="btn btn-secondary w-full" onClick={() => handleLogin('email')} style={{ justifyContent: 'center', gap: '12px', padding: '14px' }}>
                📧 Continue with Email
              </button>
              <button className="btn btn-ghost w-full mt-sm" onClick={() => setShowAuthModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
