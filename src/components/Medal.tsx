import React from 'react';
import { Trophy, Circle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MedalProps {
  levelNumber: number;
  isEarned: boolean;
  earnedAt?: string;
  onClick?: () => void;
}

const Medal: React.FC<MedalProps> = ({ levelNumber, isEarned, earnedAt, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const tooltipContent = isEarned 
    ? `Nivel ${levelNumber} - Completado el ${formatDate(earnedAt!)}`
    : `Nivel ${levelNumber} - Pendiente de completar`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={`
              w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110
              ${isEarned 
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-lg hover:shadow-xl cursor-pointer' 
                : 'border-2 border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 cursor-pointer'
              }
            `}
          >
            {isEarned ? (
              <Trophy className="w-8 h-8 text-white" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="bg-gray-800 text-white text-sm px-3 py-2">
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Medal;
