interface Score {
    rank: number;
    displayName: string;
    score: number;
  }
  
  interface LeaderboardProps {
    title: string;
    scores: Score[];
  }
  
  const Leaderboard = ({ title, scores }: LeaderboardProps) => (
    <div className="w-full max-w-sm p-4 bg-gray-800 rounded-lg">
      <h3 className="text-xl font-bold mb-4 text-center">{title}</h3>
      <ul className="space-y-2">
        {scores.map(({ rank, displayName, score }) => (
          <li key={rank} className="flex justify-between items-center text-sm">
            <span className="flex items-center">
              <span className="font-bold w-6 text-gray-400">{rank}.</span>
              <span>{displayName}</span>
            </span>
            <span className="font-semibold">{score}</span>
          </li>
        ))}
         {scores.length === 0 && <p className="text-center text-gray-400">No scores yet.</p>}
      </ul>
    </div>
  );
  
  export default Leaderboard;