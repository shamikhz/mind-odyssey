'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Settings, Download, LogOut, Trophy } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useGame } from '@/contexts/GameContext';
import { supabase } from '@/lib/supabase';

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export default function Header() {
  const { isInstallable, install } = usePWA();
  const { state, dispatch, showAuthModal, setShowAuthModal } = useGame();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showShop, setShowShop] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const searchParams = new URLSearchParams(window.location.search);
      const errDesc = searchParams.get('error_description') || hashParams.get('error_description');
      if (errDesc) {
        setError(errDesc.replace(/\+/g, ' '));
        setShowAuthModal(true);
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [setShowAuthModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (!signInError && data?.user) {
        setShowAuthModal(false);
        router.push('/');
        setFormData({ name: '', email: '', password: '' });
        return;
      }

      // If sign in failed, try to sign up
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { name: formData.name },
        }
      });

      if (signUpError) {
        // If it's still an error, show it (e.g., wrong password, invalid email)
        // If user already registered, Supabase might throw user already exists.
        throw new Error(signUpError.message || signInError?.message || 'Failed to authenticate');
      }

      if (signUpData?.user) {
        setShowAuthModal(false);
        router.push('/');
        setFormData({ name: '', email: '', password: '' });
      }

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { 
          redirectTo: `${window.location.origin}/`,
          queryParams: {
            prompt: 'consent',
          }
        }
      });
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'Failed to initialize Google Login');
    }
  };

  const handleLogout = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    try {
      await supabase.auth.signOut();
      dispatch({ type: 'LOGOUT' });
      setShowDropdown(false);
    } catch (err) {
      console.error('Logout error:', err);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const handlePayment = async (amount: number, count: number) => {
    try {
      setLoading(true);
      // 1. Create order on backend
      const res = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, count }),
      });
      const order = await res.json();

      if (order.error) throw new Error(order.error);

      // 2. Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Mind Odyssey',
        description: `Purchase ${count} Hints`,
        order_id: order.id,
        handler: async function (response: RazorpayResponse) {
          try {
            if (state.user.id) {
              const { error: dbError } = await supabase.from('payments').insert({
                user_id: state.user.id,
                order_id: order.id,
                payment_id: response.razorpay_payment_id,
                amount: amount,
                hint_count: count,
                status: 'captured'
              });
              if (dbError) throw dbError;

              // Fetch current hints and add
              const { data: profile } = await supabase.from('profiles').select('hintsRemaining').eq('id', state.user.id).single();
              if (profile) {
                await supabase.from('profiles').update({ hintsRemaining: (profile.hintsRemaining || 0) + count }).eq('id', state.user.id);
              }
            }
            
            // Success!
            if (count === -1) {
              dispatch({ type: 'REMOVE_ADS' });
              window.alert(`Success! Ads have been permanently removed.`);
            } else {
              dispatch({ type: 'BUY_HINTS', count });
              window.alert(`Success! ${count} hints added to your account.`);
            }
            setShowDropdown(false);
            setShowShop(false);
          } catch (dbError) {
            console.error('Error saving payment record:', dbError);
            // Still grant reward even if DB logging fails, to ensure good UX
            if (count === -1) {
              dispatch({ type: 'REMOVE_ADS' });
            } else {
              dispatch({ type: 'BUY_HINTS', count });
            }
          }
        },
        prefill: {
          name: state.user.name,
          email: state.user.email,
        },
        theme: { color: '#7c3aed' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: unknown) {
      console.error('Payment Error:', err);
      if (err instanceof Error) window.alert('Payment initialization failed. Please try again.'); else window.alert('Payment initialization failed.');
    } finally {
      setLoading(false);
    }
  };

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

        {state.user.isLoggedIn ? (
          <div style={{ position: 'relative' }}>
            <button className="btn btn-ghost btn-icon" onClick={() => setShowDropdown(!showDropdown)} style={{ padding: '6px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, overflow: 'hidden' }}>
                {state.user.avatar ? (
                  <img src={state.user.avatar} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{state.user.name ? state.user.name[0].toUpperCase() : 'P'}</span>
                )}
              </div>
            </button>

            {showDropdown && (
              <div className="card" style={{ position: 'absolute', top: '100%', right: 0, width: '220px', marginTop: '10px', padding: '8px', zIndex: 101, animation: 'slideDown 0.2s ease' }}>
                <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', marginBottom: '8px' }}>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {state.user.name}
                  </p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {state.user.email}
                  </p>
                </div>
                {showShop ? (
                  <div style={{ padding: '4px' }}>
                    <button className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px', marginBottom: '8px', color: 'var(--accent-primary)' }} onClick={() => setShowShop(false)}>
                      ← Back to Menu
                    </button>
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', padding: '0 8px 8px' }}>Store Options:</p>
                    <button className="btn btn-secondary btn-sm w-full mb-xs" style={{ justifyContent: 'space-between', padding: '12px' }} onClick={() => handlePayment(10, 5)} disabled={loading}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>💡 5 Hints</span>
                      <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>{loading ? '...' : '₹10'}</span>
                    </button>
                    <button className="btn btn-secondary btn-sm w-full mb-xs" style={{ justifyContent: 'space-between', padding: '12px' }} onClick={() => handlePayment(35, 20)} disabled={loading}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>💡 20 Hints</span>
                      <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>{loading ? '...' : '₹35'}</span>
                    </button>
                    <button className="btn btn-primary btn-sm w-full mb-xs" style={{ justifyContent: 'space-between', padding: '12px' }} onClick={() => handlePayment(150, 100)} disabled={loading}>
                      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>💡 100 Hints</span>
                      <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>{loading ? '...' : '₹150'}</span>
                    </button>
                    {!state.adsRemoved && (
                      <>
                        <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                        <button className="btn btn-secondary btn-sm w-full" style={{ justifyContent: 'space-between', padding: '12px', background: 'var(--surface-hover)' }} onClick={() => handlePayment(50, -1)} disabled={loading}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--danger)' }}>🚫 Remove Ads</span>
                          <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>{loading ? '...' : '₹50'}</span>
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="/profile" className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px' }} onClick={() => setShowDropdown(false)}>
                      <User size={18} /> Profile
                    </Link>
                    <button className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px', color: 'var(--warning)' }} onClick={() => setShowShop(true)}>
                      <span style={{ fontSize: '18px' }}>🛒</span> Store
                    </button>
                    <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                    <button className="btn btn-ghost btn-sm w-full" style={{ justifyContent: 'flex-start', gap: '10px', color: 'var(--danger)', cursor: 'pointer', pointerEvents: 'auto' }} onClick={handleLogout}>
                      <LogOut size={18} /> Log Out
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ) : (
          <button className="btn btn-primary btn-sm" onClick={() => setShowAuthModal(true)}>
            Sign In
          </button>
        )}
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)} style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '400px', width: '90%', margin: 'auto' }}>
            <h3 className="mb-sm" style={{ fontSize: '1.4rem' }}>Welcome to the Odyssey</h3>
            <p className="mb-md" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Enter your details to continue your brain training journey.
            </p>

            <form onSubmit={handleAuthSubmit} className="flex-col gap-sm">
              {error && (
                <div style={{ color: 'var(--danger)', fontSize: '0.85rem', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', textAlign: 'left', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  ⚠️ {error}
                </div>
              )}

              <div className="input-group">
                <label className="input-label">Full Name (Optional)</label>
                <input
                  type="text"
                  name="name"
                  className="input-field"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="input-field"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="input-field"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full mt-sm" style={{ padding: '12px' }} disabled={loading}>
                {loading ? <div className="loading-spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }} /> : 'Continue'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '4px 0' }}>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>OR</span>
                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border)' }} />
              </div>

              <button type="button" className="btn btn-secondary w-full" onClick={handleGoogleLogin} style={{ justifyContent: 'center', gap: '10px', padding: '10px', fontSize: '0.9rem' }}>
                <img src="https://www.google.com/favicon.ico" alt="G" style={{ width: '16px' }} />
                Continue with Google
              </button>

            </form>
          </div>
        </div>
      )}
      {/* End Auth Modal */}
    </header>
  );
}
