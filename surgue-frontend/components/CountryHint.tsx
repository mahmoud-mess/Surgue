import { useSpring, animated } from '@react-spring/web';

interface CountryHintProps {
  surfaceArea: number | null;
}

const CountryHint = ({ surfaceArea }: CountryHintProps) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: surfaceArea || 0 },
    config: { duration: 1000, tension: 80, friction: 40 },
  });

  if (!surfaceArea) {
    return null;
  }

  // Add some context about the size
  const getSizeContext = (area: number) => {
    if (area > 10000000) return { text: "Continental Giant", emoji: "🌍", color: "from-red-400 to-orange-400" };
    if (area > 5000000) return { text: "Major Power", emoji: "🗺️", color: "from-orange-400 to-yellow-400" };
    if (area > 1000000) return { text: "Significant Nation", emoji: "🏞️", color: "from-yellow-400 to-green-400" };
    if (area > 100000) return { text: "Medium Country", emoji: "🏝️", color: "from-green-400 to-cyan-400" };
    return { text: "Small Nation", emoji: "🏘️", color: "from-cyan-400 to-blue-400" };
  };

  const sizeInfo = getSizeContext(surfaceArea);

  return (
    <div className="relative group">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      
      <div className="relative bg-slate-800/60 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 text-center">
        {/* Header */}
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
          <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎯 Country Clue
          </h3>
        </div>

        {/* Surface area display */}
        <div className="space-y-3">
          <p className="text-sm text-gray-300">This country covers an area of:</p>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur-lg"></div>
            <div className="relative bg-slate-800/80 backdrop-blur-sm border border-yellow-500/30 rounded-xl p-4">
              <animated.div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {number.to((n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 }))}
              </animated.div>
              <div className="text-sm text-gray-400 mt-1">km²</div>
            </div>
          </div>
        </div>

        {/* Size context */}
        <div className="mt-4">
          <div className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${sizeInfo.color}/20 border border-${sizeInfo.color.split('-')[1]}-500/30 rounded-full`}>
            <span className="text-lg">{sizeInfo.emoji}</span>
            <span className={`text-sm font-semibold bg-gradient-to-r ${sizeInfo.color} bg-clip-text text-transparent`}>
              {sizeInfo.text}
            </span>
          </div>
        </div>

        {/* Hint text */}
        <div className="mt-4">
          <p className="text-xs text-gray-400 flex items-center justify-center space-x-1">
            <span>💡</span>
            <span>Use this area to identify the country</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CountryHint;
