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
    <div className="relative group">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      
      <div className="relative bg-slate-800/60 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6">
        {/* Header */}
        <div className="flex items-center justify-center space-x-3 mb-6">
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-pulse"></div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            {title}
          </h3>
        </div>

        {/* Scores list */}
        <div className="space-y-3">
          {scores.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🏆</div>
              <p className="text-gray-400">No scores yet</p>
              <p className="text-sm text-gray-500">Be the first to play!</p>
            </div>
          ) : (
            scores.map(({ rank, displayName, score }, index) => (
              <div 
                key={rank} 
                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  rank === 1 ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30' :
                  rank === 2 ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30' :
                  rank === 3 ? 'bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30' :
                  'bg-slate-700/30 border border-slate-600/30'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900' :
                    rank === 2 ? 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800' :
                    rank === 3 ? 'bg-gradient-to-r from-orange-400 to-red-400 text-orange-900' :
                    'bg-slate-600 text-slate-200'
                  }`}>
                    {rank === 1 ? '👑' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
                  </div>
                  <span className="font-medium text-white truncate max-w-32">
                    {displayName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                    {score}
                  </span>
                  <span className="text-xs text-gray-400">countries</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {scores.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-700/50">
            <p className="text-xs text-center text-gray-400">
              🏆 Top {scores.length} players
            </p>
          </div>
        )}
      </div>
    </div>
  );
  
  export default Leaderboard;