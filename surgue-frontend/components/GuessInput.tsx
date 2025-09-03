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
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm mx-auto">
      <input
        type="text"
        value={guess}
        onChange={(e) => setGuess(e.target.value)}
        placeholder="Guess the removed country..."
        disabled={disabled}
        className="flex-grow p-3 rounded-md bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={disabled}
        className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-500 disabled:cursor-not-allowed"
      >
        Guess
      </button>
    </form>
  );
};

export default GuessInput;