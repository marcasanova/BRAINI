import React, { useMemo } from 'react';
import Navbar from './navigation/Navbar';

interface BackgroundsProps {
  className?: string;
  children?: React.ReactNode;
  wrapWithCard?: boolean;
  customColor?: string;
  showCircles?: boolean;
}

type CircleSpec = {
  size: number;
  left: number;
  top: number;
};

function shuffle<T>(items: T[]): T[] {
  const next = [...items];
  for (let i = next.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

function createCircles(count: number): CircleSpec[] {
  const cols = 3;
  const rows = 3;
  const vw = typeof window === 'undefined' ? 1200 : window.innerWidth;
  const vh = typeof window === 'undefined' ? 800 : window.innerHeight;
  const cellW = vw / cols;
  const cellH = vh / rows;
  const minSide = Math.min(cellW, cellH);

  const cells = shuffle(
    Array.from({ length: cols * rows }, (_, index) => ({
      col: index % cols,
      row: Math.floor(index / cols),
    })),
  );

  return cells.slice(0, count).map(({ col, row }) => {
    const size = minSide * (0.4 + Math.random() * 0.3);
    const maxJitterX = Math.max(0, (cellW - size) / 2);
    const maxJitterY = Math.max(0, (cellH - size) / 2);
    const cx = col * cellW + cellW / 2 + (Math.random() * 2 - 1) * maxJitterX;
    const cy = row * cellH + cellH / 2 + (Math.random() * 2 - 1) * maxJitterY;
    return {
      size,
      left: cx - size / 2,
      top: cy - size / 2,
    };
  });
}

const Backgrounds: React.FC<BackgroundsProps> = ({
  className = '',
  children,
  wrapWithCard = false,
  customColor = '#7ea4df',
  showCircles = false,
}) => {
  const circles = useMemo(() => (showCircles ? createCircles(7) : []), [showCircles]);

  const renderBackground = () => {
    return (
      <>
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #7ea4df 0%, #35bdb1 100%)',
          }}
        />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
          <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
        </div>
      </>
    );
  };

  if (wrapWithCard) {
    return (
      <div
        className={`min-h-screen font-montserrat relative ${className}`}
        style={{ background: customColor }}
      >
        <Navbar />

        {showCircles && (
          <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
            {circles.map((circle, index) => (
              <div
                key={index}
                className="absolute rounded-full bg-white/15"
                style={{
                  width: circle.size,
                  height: circle.size,
                  left: circle.left,
                  top: circle.top,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 min-h-screen md:pl-72">
          <div className="w-full px-6 md:px-8 lg:px-10 pt-6 md:pt-8 pb-20 md:pb-8">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {renderBackground()}
    </div>
  );
};

export default Backgrounds;
