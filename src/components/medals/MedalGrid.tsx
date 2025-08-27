import React from 'react';
import Medal from './Medal';

interface MedalGridProps {
  medals: Array<{
    levelNumber: number;
    isEarned: boolean;
    earnedAt?: string;
  } | null>;
  onMedalClick: (levelNumber: number) => void;
}

const MedalGrid: React.FC<MedalGridProps> = ({ medals, onMedalClick }) => {
  return (
    <div className="w-full">
      {/* Grid de medallas */}
      <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-10 gap-4 justify-items-center mb-6">
        {medals.map((medal, index) => (
          <div key={index} className="flex flex-col items-center">
            {medal ? (
              <Medal
                levelNumber={medal.levelNumber}
                isEarned={medal.isEarned}
                earnedAt={medal.earnedAt}
                onClick={() => onMedalClick(medal.levelNumber)}
              />
            ) : (
              <div className="w-16 h-16 border-2 border-dashed border-gray-300 bg-gray-50 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 text-gray-300">?</div>
              </div>
            )}
            {/* Número del nivel */}
            <span className="text-xs text-gray-500 mt-2 font-medium">
              N{index + 1}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedalGrid;
