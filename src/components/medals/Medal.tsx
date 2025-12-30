import React from 'react';
import { Circle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MedalProps {
  levelNumber: number;
  isEarned: boolean;
  earnedAt?: string;
  onClick?: () => void;
}

// URL de la emoción de orgullo
const PRIDE_EMOTION_IMAGE = "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/23.%20Orgullo.jpg";

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
              w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 overflow-hidden
              ${isEarned 
                ? 'bg-white shadow-sm hover:shadow-md cursor-pointer border border-gray-200' 
                : 'border border-dashed border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100 cursor-pointer'
              }
            `}
          >
            {isEarned ? (
              <img 
                src={PRIDE_EMOTION_IMAGE} 
                alt="Orgullo" 
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
