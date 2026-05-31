'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { GameState, GameAction } from '@/types/game';

import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'mind-odyssey-state';

const initialState: GameState = {
  currentLevel: 1,
  hintsRemaining: 10,
  progress: {},
  totalTimePlayed: 0,
  playerName: 'Player',
  user: {
    id: '',
    name: '',
    email: '',
    avatar: '',
    isLoggedIn: false,
  },
  adsRemoved: false,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'COMPLETE_LEVEL': {
      const existing = state.progress[action.levelId];
      const newStars = existing ? Math.max(existing.stars, action.stars) : action.stars;
      const newBest = existing ? Math.min(existing.bestTime, action.time) : action.time;
      return {
        ...state,
        currentLevel: Math.max(state.currentLevel, action.levelId + 1),
        totalTimePlayed: state.totalTimePlayed + action.time,
        progress: {
          ...state.progress,
          [action.levelId]: {
            levelId: action.levelId,
            completed: true,
            stars: newStars,
            bestTime: newBest,
            hintsUsed: action.hintsUsed,
          },
        },
      };
    }
    case 'USE_HINT':
      return {
        ...state,
        hintsRemaining: Math.max(0, state.hintsRemaining - 1),
      };
    case 'ADD_HINT':
      return {
        ...state,
        hintsRemaining: state.hintsRemaining + 1,
      };
    case 'BUY_HINTS':
      return {
        ...state,
        hintsRemaining: state.hintsRemaining + action.count,
      };
    case 'REMOVE_ADS':
      return {
        ...state,
        adsRemoved: true,
      };
    case 'ADD_TIME':
      return {
        ...state,
        totalTimePlayed: state.totalTimePlayed + action.seconds,
      };
    case 'SET_PLAYER_NAME':
      return {
        ...state,
        playerName: action.name,
        user: { ...state.user, name: action.name },
      };
    case 'LOGIN':
      return {
        ...state,
        user: {
          id: action.user.id || 'usr_' + Math.random().toString(36).substr(2, 9),
          name: action.user.name || 'Explorer',
          email: action.user.email || '',
          avatar: action.user.avatar || '',
          isLoggedIn: true,
        },
      };
    case 'LOGOUT':
      return {
        ...state,
        user: { ...initialState.user },
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.updates },
      };
    case 'RESET_PROGRESS':
      return { 
        ...initialState, 
        user: state.user,
        playerName: state.playerName,
        adsRemoved: state.adsRemoved // preserve ad removal
      };
    case 'LOAD_SAVED':
      return { ...initialState, ...action.state, user: { ...initialState.user, ...action.state.user } };
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  getStarsForLevel: (levelId: number) => number;
  isLevelUnlocked: (levelId: number) => boolean;
  isLevelCompleted: (levelId: number) => boolean;
  getTotalStars: () => number;
  getLevelsCleared: () => number;
  getCategoryScore: (category: string) => number;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [loaded, setLoaded] = React.useState(false);
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  // Initialize state from localStorage (lazy initializer)
  const initState = (initial: typeof initialState) => {
    if (typeof window !== 'undefined') {
      try {
        const saved = window.localStorage?.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          return { ...initial, ...parsed, user: { ...initial.user, ...parsed.user } };
        }
      } catch {}
    }
    return initial;
  };

  const [state, dispatch] = useReducer(gameReducer, initialState, initState);

  const [session, setSession] = React.useState<any>(null);

  // Sync with Supabase Auth
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync Profile from Supabase DB
  useEffect(() => {
    const syncProfile = async () => {
      if (session?.user) {
        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (!error && profile) {
            dispatch({
              type: 'LOGIN',
              user: {
                id: session.user.id,
                name: profile.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Player',
                email: session.user.email || '',
                avatar: profile.avatar || session.user.user_metadata?.avatar_url || ''
              }
            });
            if (profile.adsRemoved) {
              dispatch({ type: 'REMOVE_ADS' });
            }
            // If they have remote progress, you can sync it here
          } else {
             // Fallback to session metadata if profile doesn't exist yet
             dispatch({ type: 'RESET_PROGRESS' });
             dispatch({
              type: 'LOGIN',
              user: {
                id: session.user.id,
                name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Player',
                email: session.user.email || '',
                avatar: session.user.user_metadata?.avatar_url || ''
              }
            });
          }
        } catch (error) {
          console.error('Failed to sync profile', error);
        }
      } else {
        dispatch({ type: 'LOGOUT' });
      }
      setLoaded(true);
    };
    
    syncProfile();
  }, [session]);

  // Persist state on every change
  const syncTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (loaded) {
      try {
        const storage = (globalThis as any).localStorage;
        storage?.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Ignore storage errors
      }

      // Sync progress to Supabase DB if logged in, debounced to prevent spam
      if (session?.user && state.user.id) {
        if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
        syncTimeoutRef.current = setTimeout(() => {
          supabase.from('profiles').update({
            progress: state.progress,
            currentLevel: state.currentLevel,
            totalTimePlayed: state.totalTimePlayed,
            hintsRemaining: state.hintsRemaining,
            adsRemoved: state.adsRemoved
          }).eq('id', state.user.id).then(({ error }) => {
            if (error) console.error('Error syncing progress:', error);
          });
        }, 2000); // 2 second debounce
      }
    }
  }, [state, loaded, session]);

  // Global body class for ad removal (hides injected auto-ads like AdSense)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (state.adsRemoved) {
        document.body.classList.add('no-ads');
      } else {
        document.body.classList.remove('no-ads');
      }
    }
  }, [state.adsRemoved]);

  const getStarsForLevel = useCallback(
    (levelId: number) => state.progress[levelId]?.stars ?? 0,
    [state.progress]
  );

  const isLevelUnlocked = useCallback(
    (levelId: number) => levelId <= state.currentLevel,
    [state.currentLevel]
  );

  const isLevelCompleted = useCallback(
    (levelId: number) => state.progress[levelId]?.completed ?? false,
    [state.progress]
  );

  const getTotalStars = useCallback(
    () => Object.values(state.progress).reduce((sum, p) => sum + p.stars, 0),
    [state.progress]
  );

  const getLevelsCleared = useCallback(
    () => Object.values(state.progress).filter(p => p.completed).length,
    [state.progress]
  );

  const getCategoryScore = useCallback(
    (category: string) => {
      const { levels } = require('@/data/levels');
      const catLevels = levels.filter((l: { category: string }) => l.category === category);
      const completed = catLevels.filter((l: { id: number }) => state.progress[l.id]?.completed);
      return catLevels.length > 0 ? Math.round((completed.length / catLevels.length) * 100) : 0;
    },
    [state.progress]
  );

  if (!loaded) {
    return (
      <GameContext.Provider value={{
        state,
        dispatch,
        getStarsForLevel,
        isLevelUnlocked,
        isLevelCompleted,
        getTotalStars,
        getLevelsCleared,
        getCategoryScore,
        showAuthModal,
        setShowAuthModal,
      }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0a1a',
          color: '#f1f5f9'
        }}>
          <div className="loading-spinner" />
        </div>
      </GameContext.Provider>
    );
  }

  return (
    <GameContext.Provider value={{
      state,
      dispatch,
      getStarsForLevel,
      isLevelUnlocked,
      isLevelCompleted,
      getTotalStars,
      getLevelsCleared,
      getCategoryScore,
      showAuthModal,
      setShowAuthModal,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    if (typeof window === 'undefined') {
      // Bulletproof fallback for Next.js SSR prerendering edge cases (like _not-found)
      return {
        state: {
          currentLevel: 1,
          hintsRemaining: 10,
          progress: {},
          totalTimePlayed: 0,
          playerName: 'Player',
          user: { id: '', name: '', email: '', avatar: '', isLoggedIn: false },
          adsRemoved: false,
        },
        dispatch: () => {},
        getStarsForLevel: () => 0,
        isLevelUnlocked: () => true,
        isLevelCompleted: () => false,
        getTotalStars: () => 0,
        getLevelsCleared: () => 0,
        getCategoryScore: () => 0,
        showAuthModal: false,
        setShowAuthModal: () => {},
      } as unknown as GameContextType;
    }
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
