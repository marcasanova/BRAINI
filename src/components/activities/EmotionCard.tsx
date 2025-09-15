import React from 'react';

interface Emotion {
  id: number;
  name: string;
  phrase: string;
  image: string;
}

interface EmotionCardProps {
  emotion: Emotion;
  isSelected: boolean;
  isMatched: boolean;
  onSelect: () => void;
}

const EmotionCard: React.FC<EmotionCardProps> = ({
  emotion,
  isSelected,
  isMatched,
  onSelect
}) => {
  return (
    <button
      onClick={onSelect}
      disabled={isMatched}
      className={`
        relative group flex flex-col items-center p-4 rounded-xl transition-all duration-300 transform
        ${isMatched 
          ? 'opacity-60 cursor-not-allowed scale-95' 
          : 'hover:scale-105 hover:shadow-lg cursor-pointer'
        }
        ${isSelected 
          ? 'ring-4 ring-braini-blue scale-105 shadow-lg bg-blue-50' 
          : 'bg-white shadow-md border border-gray-200 hover:shadow-lg'
        }
        ${isMatched 
          ? 'bg-green-50 border-green-300' 
          : ''
        }
      `}
    >
      {/* Imagen de la emoción */}
      <div className={`
        w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 transition-all duration-300
        ${isSelected ? 'ring-2 ring-white' : ''}
        ${isMatched ? 'opacity-80' : ''}
      `}>
        <img
          src={emotion.image}
          alt={emotion.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      
      {/* Nombre de la emoción */}
      <span className={`
        text-sm font-medium text-center transition-colors duration-300
        ${isSelected ? 'text-braini-blue font-bold' : 'text-gray-700'}
        ${isMatched ? 'text-green-700' : ''}
      `}>
        {emotion.name}
      </span>

      {/* Indicador de completado */}
      {isMatched && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* Efecto de selección */}
      {isSelected && !isMatched && (
        <div className="absolute inset-0 rounded-xl bg-blue-100 opacity-20 animate-pulse" />
      )}
    </button>
  );
};

export default EmotionCard;
