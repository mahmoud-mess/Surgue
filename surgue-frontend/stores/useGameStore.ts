import { create } from 'zustand';

type GameState = 'idle' | 'playing' | 'over';

interface SurgueState {
  gameState: GameState;
  score: number;
  currentArea: number;
  totalLandArea: number; 
  revealedCountryCode: string | null; // Changed from removedCountryCode
  lastCorrectAnswer: string | null;
  currentHint: number | null; // Surface area hint for the country to guess
  setGameState: (state: GameState) => void;
  setScore: (score: number) => void;
  setCurrentArea: (area: number) => void;
  setTotalLandArea: (area: number) => void;
  setRevealedCountryCode: (code: string | null) => void; // Changed from setRemovedCountryCode
  setLastCorrectAnswer: (answer: string | null) => void;
  setCurrentHint: (hint: number | null) => void;
  resetGame: () => void;
}

export const useGameStore = create<SurgueState>((set) => ({
  gameState: 'idle',
  score: 0,
  currentArea: 0,
  totalLandArea: 0,
  revealedCountryCode: null, // Changed from removedCountryCode
  lastCorrectAnswer: null,
  currentHint: null,
  setGameState: (state) => set({ gameState: state }),
  setScore: (score) => set({ score }),
  setCurrentArea: (area) => set({ currentArea: area }),
  setTotalLandArea: (area) => set({ totalLandArea: area }),
  setRevealedCountryCode: (code) => set({ revealedCountryCode: code }), // Changed from setRemovedCountryCode
  setLastCorrectAnswer: (answer) => set({ lastCorrectAnswer: answer }),
  setCurrentHint: (hint) => set({ currentHint: hint }),
  resetGame: () => set({ 
    gameState: 'idle', 
    score: 0, 
    currentArea: 0,
    totalLandArea: 0,
    revealedCountryCode: null, // Changed from removedCountryCode
    lastCorrectAnswer: null,
    currentHint: null,
  }),
}));