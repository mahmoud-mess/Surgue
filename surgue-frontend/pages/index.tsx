import { useEffect, useState } from 'react';
import Head from 'next/head';
import AreaCounter from '../components/AreaCounter';
import AuthButtons from '../components/AuthButtons';
import CountryHint from '../components/CountryHint';
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
    gameState, score, currentArea, totalLandArea, revealedCountryCode, lastCorrectAnswer, currentHint,
    setGameState, setScore, setCurrentArea, setTotalLandArea, setRevealedCountryCode, resetGame, setLastCorrectAnswer, setCurrentHint
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
    setRevealedCountryCode(null);
    setLastCorrectAnswer(null);
    setCurrentHint(data.nextCountryHint);
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
        setRevealedCountryCode(data.revealedCountryCode);
        setCurrentHint(data.nextCountryHint);
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
        <meta name="description" content="Guess countries to reveal them on the world map!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
          <AuthButtons />
          
          <div className="w-full max-w-6xl mx-auto text-center space-y-12">
            <header className="space-y-6">
              <div className="relative">
                <h1 className="text-7xl md:text-8xl font-black tracking-tighter bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  SURGUE
                </h1>
                
              </div>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Uncover the world one country at a time. Use your geography knowledge to reveal nations through their surface area.
              </p>
            </header>

            {gameState !== 'idle' && (
              <div className="relative">
                <AreaCounter currentArea={currentArea} totalArea={totalLandArea} />
              </div>
            )}
            
            <div className="relative">
              <WorldMap revealedCountryCode={revealedCountryCode} />
            </div>

            {gameState === 'playing' && (
              <div className="space-y-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl"></div>
                  <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                      <p className="text-2xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                        Streak: {score}
                      </p>
                    </div>
                    <CountryHint surfaceArea={currentHint} />
                    <div className="mt-6">
                      <p className="text-sm text-gray-400 mb-4">
                        ✨ Type the country name that matches the surface area above
                      </p>
                      <GuessInput onSubmit={handleGuessSubmit} disabled={gameState !== 'playing'} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {gameState === 'over' && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-red-500/30 rounded-3xl p-8 text-center space-y-6">
                  <h2 className="text-4xl font-black bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                    Game Over!
                  </h2>
                  <div className="space-y-3">
                    <p className="text-xl">The correct answer was: <span className="font-bold text-yellow-300">{lastCorrectAnswer}</span></p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                      {score} countries revealed
                    </p>
                    <p className="text-lg text-gray-300">
                      You uncovered {((currentArea / totalLandArea) * 100).toFixed(1)}% of the world!
                    </p>
                  </div>
                  <button 
                    onClick={handleStartGame} 
                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-bold text-xl rounded-2xl hover:from-purple-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}

            {gameState === 'idle' && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-slate-800/50 backdrop-blur-sm border border-green-500/30 rounded-3xl p-8">
                  <button
                    onClick={handleStartGame}
                    disabled={!isAuthenticated}
                    className="px-12 py-6 bg-gradient-to-r from-green-600 to-cyan-600 text-white font-black text-2xl rounded-2xl hover:from-green-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-green-500/25 disabled:transform-none"
                  >
                    {isAuthenticated ? "Start Your Journey" : "🔐 Sign in to Play"}
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-8">
              <Leaderboard title="Daily Champions" scores={dailyScores} />
              <Leaderboard title="All-Time Legends" scores={worldwideScores} />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}