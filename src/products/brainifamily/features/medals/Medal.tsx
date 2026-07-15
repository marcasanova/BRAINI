import React from 'react';
import { Circle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { getMedalImageForNivelEducativo } from '@/shared/lib/constants/emotionsStorage';

interface MedalProps {
  missionNumber: number;
  isEarned: boolean;
  earnedAt?: string;
  onClick?: () => void;
  /** Nivel educativo del niño (infantil_3, infantil_4, infantil_5, etc.) para mostrar la medalla correcta */
  childNivelEducativo?: string | null;
}

const Medal: React.FC<MedalProps> = ({ missionNumber, isEarned, earnedAt, onClick, childNivelEducativo }) => {
  const medalImage = getMedalImageForNivelEducativo(childNivelEducativo);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const tooltipContent = isEarned 
    ? `Misión ${missionNumber} - Completado el ${formatDate(earnedAt!)}`
    : `Misión ${missionNumber} - Pendiente de completar`;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={`
              w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 overflow-hidden
              ${isEarned 
                ? 'bg-white shadow-xs hover:shadow-md cursor-pointer border border-gray-200' 
                : 'border border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 cursor-pointer'
              }
            `}
          >
            {isEarned ? (
              <img 
                src={medalImage} 
                alt="Medalla Braini" 
                className="w-full h-full object-cover"
              />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
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
