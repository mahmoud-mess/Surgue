import { useSpring, animated } from '@react-spring/web';

interface AreaCounterProps {
  area: number;
}

const AreaCounter = ({ area }: AreaCounterProps) => {
  const { number } = useSpring({
    from: { number: 0 },
    to: { number: area },
    config: { duration: 1000 },
  });

  return (
    <div className="text-center">
      <h2 className="text-lg font-semibold text-gray-400">Total Land Area (km²)</h2>
      <animated.p className="text-5xl md:text-7xl font-bold tracking-tighter">
        {number.to((n) => n.toLocaleString(undefined, { maximumFractionDigits: 0 }))}
      </animated.p>
    </div>
  );
};

export default AreaCounter;