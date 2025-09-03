import { create } from 'zustand';

type GameState = 'idle' | 'playing' | 'over';

interface SurgueState {
  gameState: GameState;
  score: number;
  currentArea: number;
  // --- ADDED ---
  totalLandArea: number; 
  // --- ADDED ---
  removedCountryCode: string | null;
  lastCorrectAnswer: string | null;
  setGameState: (state: GameState) => void;
  setScore: (score: number) => void;
  setCurrentArea: (area: number) => void;
  // --- ADDED ---
  setTotalLandArea: (area: number) => void;
  // --- ADDED ---
  setRemovedCountryCode: (code: string | null) => void;
  setLastCorrectAnswer: (answer: string | null) => void;
  resetGame: () => void;
}

export const useGameStore = create<SurgueState>((set) => ({
  gameState: 'idle',
  score: 0,
  currentArea: 0,
  // --- ADDED ---
  totalLandArea: 0,
  // --- ADDED ---
  removedCountryCode: null,
  lastCorrectAnswer: null,
  setGameState: (state) => set({ gameState: state }),
  setScore: (score) => set({ score }),
  setCurrentArea: (area) => set({ currentArea: area }),
  // --- ADDED ---
  setTotalLandArea: (area) => set({ totalLandArea: area }),
  // --- ADDED ---
  setRemovedCountryCode: (code) => set({ removedCountryCode: code }),
  setLastCorrectAnswer: (answer) => set({ lastCorrectAnswer: answer }),
  resetGame: () => set({ 
    gameState: 'idle', 
    score: 0, 
    currentArea: 0,
    // --- ADDED ---
    totalLandArea: 0,
    // --- ADDED ---
    removedCountryCode: null,
    lastCorrectAnswer: null,
  }),
}));