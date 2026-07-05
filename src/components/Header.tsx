'use client';
import React from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

export default function Header() {
  const { state } = useGame();
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <header className="top-bar" style={{ position: 'fixed', width: '100%', top: 0, zIndex: 100 }}>
      <div className="top-bar-item" style={{ gap: '12px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.8rem' }}>🧠</span>
          <span style={{ fontWeight: 800, letterSpacing: '0.5px' }} className="gradient-text logo-text">
            Mind Odyssey
          </span>
        </Link>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ position: 'relative' }}>
          <button className="btn btn-ghost btn-icon" onClick={() => setShowDropdown(!showDropdown)} style={{ padding: '6px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, overflow: 'hidden' }}>
              {state.user?.avatar ? (
                <img src={state.user.avatar} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>{state.playerName ? state.playerName[0].toUpperCase() : 'P'}</span>
              )}
            </div>
          </button>

          {showDropdown && (
            <div className="card" style={{ position: 'absolute', top: '100%', right: 0, width: '220px', marginTop: '10px', padding: '8px', zIndex: 101, animation: 'slideDown 0.2s ease' }}>
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {state.playerName}
                </p>
              </div>
              <Link href="/profile" className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px' }} onClick={() => setShowDropdown(false)}>
                <User size={18} /> Profile
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
