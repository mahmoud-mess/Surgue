import { useState, FormEvent } from 'react';

interface GuessInputProps {
  onSubmit: (guess: string) => void;
  disabled: boolean;
}

const GuessInput = ({ onSubmit, disabled }: GuessInputProps) => {
  const [guess, setGuess] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !disabled) {
      onSubmit(guess);
      setGuess('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <div className="relative group">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-lg group-focus-within:blur-xl transition-all duration-300"></div>
        
        <div className="relative flex gap-3 p-2 bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-2xl">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter country name..."
            disabled={disabled}
            className="flex-grow px-4 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none disabled:opacity-50 text-lg font-medium"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={disabled || !guess.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 text-white font-bold rounded-xl hover:from-cyan-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-cyan-500/25 disabled:transform-none"
          >
            <span className="flex items-center space-x-2">
              <span>🚀</span>
              <span>Guess</span>
            </span>
          </button>
        </div>
      </div>
    </form>
  );
};

export default GuessInput;