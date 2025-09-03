import { useSpring, animated } from '@react-spring/web';

interface AreaCounterProps {
  currentArea: number;
  totalArea: number;
}

const AreaCounter = ({ currentArea, totalArea }: AreaCounterProps) => {
  const { currentNumber } = useSpring({
    from: { currentNumber: 0 },
    to: { currentNumber: currentArea },
    config: { duration: 1200, tension: 100, friction: 50 },
  });

  const { totalNumber } = useSpring({
    from: { totalNumber: 0 },
    to: { totalNumber: totalArea },
    config: { duration: 1200, tension: 100, friction: 50 },
  });

  const progressPercentage = totalArea > 0 ? (currentArea / totalArea) * 100 : 0;

  return (
    <div className="relative">
      {/* Background glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-2xl"></div>
      
      <div className="relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 space-y-8">
        {/* Progress bar */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-300">World Discovery Progress</span>
            <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {progressPercentage.toFixed(1)}%
            </span>
          </div>
          <div className="relative h-3 bg-slate-700/50 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full"></div>
            <animated.div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full relative"
              style={{ width: currentNumber.to(n => `${(n / totalArea) * 100}%`) }}
            >
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
            </animated.div>
          </div>
        </div>

        {/* Area displays */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Current Area */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-cyan-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <div className="relative bg-slate-800/60 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="text-sm font-semibold text-green-300 uppercase tracking-wider">Your Discovery</h3>
              </div>
              <animated.div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                {currentNumber.to((n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 }))}
              </animated.div>
              <p className="text-xs text-gray-400 mt-2">km² revealed</p>
            </div>
          </div>

          {/* Total Area */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
            <div className="relative bg-slate-800/60 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <h3 className="text-sm font-semibold text-blue-300 uppercase tracking-wider">Total World</h3>
              </div>
              <animated.div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {totalNumber.to((n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 }))}
              </animated.div>
              <p className="text-xs text-gray-400 mt-2">km² total</p>
            </div>
          </div>
        </div>

        {/* Achievement indicator */}
        {progressPercentage > 0 && (
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full">
              <span className="text-yellow-400">🏆</span>
              <span className="text-sm font-medium text-yellow-300">
                {progressPercentage >= 100 ? 'World Master!' : 
                 progressPercentage >= 75 ? 'Geography Expert!' :
                 progressPercentage >= 50 ? 'Explorer!' :
                 progressPercentage >= 25 ? 'Adventurer!' : 'Beginner!'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AreaCounter;