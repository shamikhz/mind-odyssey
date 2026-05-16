/* ──────────────────────────────────────────────
   Mind Odyssey – Core TypeScript Interfaces
   ────────────────────────────────────────────── */

export type PuzzleCategory = 'logic' | 'memory' | 'creativity' | 'strategy';

export interface Level {
  id: number;
  name: string;
  description: string;
  instruction: string;
  category: PuzzleCategory;
  difficulty: number; // 1-5
  parTime: number; // seconds
  puzzleKey: string; // key into puzzle registry
  hints: string[];
  insight: string;
}

export interface LevelProgress {
  levelId: number;
  completed: boolean;
  stars: number; // 0-3
  bestTime: number; // seconds
  hintsUsed: number;
}

export interface PlayerStats {
  levelsCleared: number;
  totalStars: number;
  hintsRemaining: number;
  totalTimePlayed: number; // seconds
  categoryScores: Record<PuzzleCategory, number>;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isLoggedIn: boolean;
}

export interface GameState {
  currentLevel: number;
  hintsRemaining: number;
  progress: Record<number, LevelProgress>;
  totalTimePlayed: number;
  playerName: string;
  user: UserProfile;
}

export interface PuzzleProps {
  level: Level;
  onComplete: (stars: number, timeTaken: number) => void;
  hintsRemaining: number;
  onUseHint: () => string | null;
  difficulty: number;
}

export type GameAction =
  | { type: 'COMPLETE_LEVEL'; levelId: number; stars: number; time: number; hintsUsed: number }
  | { type: 'USE_HINT' }
  | { type: 'ADD_HINT' }
  | { type: 'RESET_PROGRESS' }
  | { type: 'LOAD_SAVED'; state: GameState }
  | { type: 'SET_PLAYER_NAME'; name: string }
  | { type: 'LOGIN'; user: Partial<UserProfile> }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; updates: Partial<UserProfile> }
  | { type: 'ADD_TIME'; seconds: number }
  | { type: 'BUY_HINTS'; count: number };
