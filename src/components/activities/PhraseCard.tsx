import React from 'react';

interface PhraseCardProps {
  phrase: string;
  isSelected: boolean;
  isMatched: boolean;
  onSelect: () => void;
}

const PhraseCard: React.FC<PhraseCardProps> = ({
  phrase,
  isSelected,
  isMatched,
  onSelect
}) => {
  return (
    <button
      onClick={onSelect}
      disabled={isMatched}
      className={`
        w-full p-4 rounded-lg transition-all duration-300 transform text-left
        ${isMatched 
          ? 'opacity-60 cursor-not-allowed scale-95' 
          : 'hover:scale-105 hover:shadow-lg cursor-pointer'
        }
        ${isSelected 
          ? 'ring-4 ring-braini-blue scale-105 shadow-lg bg-blue-50 border-2 border-braini-blue' 
          : 'bg-white shadow-md border border-gray-200 hover:shadow-lg hover:border-braini-blue/50'
        }
        ${isMatched 
          ? 'bg-green-50 border-green-300' 
          : ''
        }
      `}
    >
      <div className="flex items-center justify-between">
        <span className={`
          text-sm font-medium transition-colors duration-300
          ${isSelected ? 'text-braini-blue font-bold' : 'text-gray-700'}
          ${isMatched ? 'text-green-700' : ''}
        `}>
          {phrase}
        </span>

        {/* Indicador de completado */}
        {isMatched && (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}

        {/* Efecto de selección */}
        {isSelected && !isMatched && (
          <div className="w-6 h-6 bg-braini-blue rounded-full flex items-center justify-center ml-3 flex-shrink-0">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
        )}
      </div>

      {/* Efecto de selección de fondo */}
      {isSelected && !isMatched && (
        <div className="absolute inset-0 rounded-lg bg-blue-100 opacity-20 animate-pulse" />
      )}
    </button>
  );
};

export default PhraseCard;
