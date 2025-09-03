import { useEffect, useState } from 'react';
import Head from 'next/head';
import AreaCounter from '../components/AreaCounter';
import AuthButtons from '../components/AuthButtons';
import GuessInput from '../components/GuessInput';
import Leaderboard from '../components/Leaderboard';
import WorldMap from '../components/WorldMap';
import { useAuthStore } from '../stores/useAuthStore';
import { useGameStore } from '../stores/useGameStore';
import * as api from '../lib/api';

type LeaderboardScore = { rank: number; displayName: string; score: number; };

export default function Home() {
  const { isAuthenticated, checkAuthStatus } = useAuthStore();
  const { 
    gameState, score, currentArea, totalLandArea, removedCountryCode, lastCorrectAnswer,
    setGameState, setScore, setCurrentArea, setTotalLandArea, setRemovedCountryCode, resetGame, setLastCorrectAnswer
  } = useGameStore();

  const [dailyScores, setDailyScores] = useState<LeaderboardScore[]>([]);
  const [worldwideScores, setWorldwideScores] = useState<LeaderboardScore[]>([]);

  useEffect(() => {
    checkAuthStatus();
    api.getDailyLeaderboard().then(res => setDailyScores(res.data));
    api.getWorldwideLeaderboard().then(res => setWorldwideScores(res.data));
  }, [checkAuthStatus]);
  
// surgue-frontend/pages/index.tsx
const handleStartGame = async () => {
  try {
    // Get totalLandArea from the API response
    const { data } = await api.startGame();
    // Set both the total and the current area
    setTotalLandArea(data.totalLandArea);
    setCurrentArea(data.startingTotalLandArea);
    setScore(0);
    setGameState('playing');
    setRemovedCountryCode(null);
    setLastCorrectAnswer(null);
  } catch (error) {
    console.error("Failed to start game", error);
  }
};

  const handleGuessSubmit = async (guess: string) => {
    try {
      const { data } = await api.submitGuess(guess);
      if (data.correct) {
        setScore(data.newScore);
        setCurrentArea(data.newTotalArea);
        setRemovedCountryCode(data.removedCountryCode);
      } else {
        setGameState('over');
        setLastCorrectAnswer(data.answer);
      }
    } catch (error) {
       console.error("Failed to submit guess", error);
       setGameState('idle');
    }
  };

  return (
    <>
      <Head>
        <title>Surgue - The World Guessing Game</title>
        <meta name="description" content="Guess the country that was removed from the world!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-900 text-white">
        <AuthButtons />
        
        <div className="w-full max-w-4xl mx-auto text-center space-y-8">
          <header>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter">Surgue 🗺️</h1>
            <p className="text-gray-400 mt-2">A country was removed. Based on the new land area, can you guess which one?</p>
          </header>

          {gameState !== 'idle' && <AreaCounter area={currentArea} />}
          
          <WorldMap removedCountryCode={removedCountryCode} />

          {gameState === 'playing' && (
            <div className="space-y-4">
              <p className="text-2xl font-bold">Current Streak: {score}</p>
              <GuessInput onSubmit={handleGuessSubmit} disabled={gameState !== 'playing'} />
            </div>
          )}

          {gameState === 'over' && (
            <div className="p-6 bg-red-900/50 rounded-lg text-center space-y-4">
              <h2 className="text-3xl font-bold">Game Over!</h2>
              <p className="text-xl">The correct answer was: <strong className="text-yellow-300">{lastCorrectAnswer}</strong></p>
              <p className="text-2xl">Final Score: <strong className="text-green-400">{score}</strong></p>
              <button onClick={handleStartGame} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700">
                Play Again
              </button>
            </div>
          )}

          {gameState === 'idle' && (
             <button
              onClick={handleStartGame}
              disabled={!isAuthenticated}
              className="px-8 py-4 bg-green-600 text-white font-bold text-xl rounded-md hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isAuthenticated ? "Start Game" : "Sign in to Play"}
            </button>
          )}

          <div className="flex flex-col md:flex-row gap-8 justify-center pt-8">
            <Leaderboard title="Daily Top 100" scores={dailyScores} />
            <Leaderboard title="Worldwide High Scores" scores={worldwideScores} />
          </div>
        </div>
      </main>
    </>
  );
}