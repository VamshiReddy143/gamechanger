import { useEffect, useRef } from 'react';
import { 
  FaFootballBall, 
  FaBasketballBall,
  FaTableTennis,
  FaBaseballBall,
  FaGolfBall,
  FaHockeyPuck,
  FaRunning,
  FaSwimmer,
  FaVolleyballBall,
  FaTablets,
  FaFistRaised,
  FaFlagCheckered
} from 'react-icons/fa';
import { GiBoxingGlove, GiCricketBat } from 'react-icons/gi';

const InfiniteSportsScroller = () => {
  const sports = [
    { name: 'Football', icon: <FaFootballBall className="text-blue-400" />, bg: 'bg-blue-900/30' },
    { name: 'Basketball', icon: <FaBasketballBall className="text-orange-400" />, bg: 'bg-orange-900/30' },
    { name: 'Tennis', icon: <FaTableTennis className="text-green-400" />, bg: 'bg-green-900/30' },
    { name: 'Cricket', icon: <GiCricketBat className="text-red-400" />, bg: 'bg-red-900/30' },
    { name: 'Baseball', icon: <FaBaseballBall className="text-yellow-400" />, bg: 'bg-yellow-900/30' },
    { name: 'Golf', icon: <FaGolfBall className="text-emerald-400" />, bg: 'bg-emerald-900/30' },
    { name: 'Hockey', icon: <FaHockeyPuck className="text-sky-400" />, bg: 'bg-sky-900/30' },
    { name: 'Rugby', icon: <FaRunning className="text-amber-400" />, bg: 'bg-amber-900/30' },
    { name: 'Volleyball', icon: <FaVolleyballBall className="text-purple-400" />, bg: 'bg-purple-900/30' },
    { name: 'Badminton', icon: <FaTablets className="text-pink-400" />, bg: 'bg-pink-900/30' },
    { name: 'Boxing', icon: <GiBoxingGlove className="text-rose-400" />, bg: 'bg-rose-900/30' },
    { name: 'Swimming', icon: <FaSwimmer className="text-cyan-400" />, bg: 'bg-cyan-900/30' },
    { name: 'Racing', icon: <FaFlagCheckered className="text-fuchsia-400" />, bg: 'bg-fuchsia-900/30' },
    { name: 'MMA', icon: <FaFistRaised className="text-violet-400" />, bg: 'bg-violet-900/30' }
  ];

  const containerRef = useRef(null);
  const requestRef = useRef();
  const animationRef = useRef(0);
  const itemWidths = useRef([]);
  const totalWidth = useRef(0);

  // Double the items for seamless looping
  const displayItems = [...sports, ...sports];

  useEffect(() => {
    const scrollSpeed = 1.5; // pixels per frame

    const calculateWidths = () => {
      const container = containerRef.current;
      itemWidths.current = Array.from(container.children).map(child => 
        child.getBoundingClientRect().width + 32 // 32 = mx-4*2
      );
      totalWidth.current = itemWidths.current.reduce((sum, width) => sum + width, 0);
    };

    const scroll = () => {
      animationRef.current += scrollSpeed;
      
      // When we've scrolled one full loop, reset position but keep scrolling
      if (animationRef.current >= totalWidth.current / 2) {
        animationRef.current = 0;
        // Immediately reposition the container without animation
        containerRef.current.style.transition = 'none';
        containerRef.current.style.transform = `translateX(-${animationRef.current}px)`;
        // Force reflow
        containerRef.current.offsetHeight;
        // Re-enable transitions
        containerRef.current.style.transition = '';
      }
      
      containerRef.current.style.transform = `translateX(-${animationRef.current}px)`;
      requestRef.current = requestAnimationFrame(scroll);
    };

    // Initialize
    calculateWidths();
    window.addEventListener('resize', calculateWidths);
    requestRef.current = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(requestRef.current);
      window.removeEventListener('resize', calculateWidths);
    };
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-[#07081B] mt-20">
      <div className=" px-4">
        <div className="flex items-center mb-8">
          <div className="bg-[#1E213F] px-6 py-3 rounded-r-full">
            <h2 className="text-2xl font-bold text-white">OUR GAMES</h2>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-blue-500/30 to-transparent ml-4" />
        </div>
        
        <div className="relative h-24 overflow-hidden">
          <div 
            ref={containerRef}
            className="absolute left-0 top-0 flex whitespace-nowrap will-change-transform"
          >
            {displayItems.map((sport, index) => (
              <div 
                key={`${sport.name}-${index}`}
                className={`inline-flex items-center mx-4 px-6 py-3 rounded-xl ${sport.bg} backdrop-blur-sm border border-white/10 shadow-lg transition-all hover:scale-105`}
              >
                <span className="text-2xl mr-3">{sport.icon}</span>
                <span className="text-lg font-semibold text-white/90">{sport.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfiniteSportsScroller;