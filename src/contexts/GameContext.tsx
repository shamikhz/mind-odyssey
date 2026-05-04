'use client';

import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { GameState, GameAction } from '@/types/game';

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
      return { ...initialState };
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
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [loaded, setLoaded] = React.useState(false);

  // Load saved state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_SAVED', state: parsed });
      }
    } catch {
      // Ignore parse errors
    }
    setLoaded(true);
  }, []);

  // Persist state on every change
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // Ignore storage errors
      }
    }
  }, [state, loaded]);

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
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
