import React from 'react';
import { Card, CardContent } from '@/shared/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';

interface EmotionConfig {
  id: number;
  name: string;
  imageUrl: string;
  color: string;
  description: string;
}

interface EmotionSelectorProps {
  emotions: EmotionConfig[];
  selectedEmotions: EmotionConfig[];
  onEmotionSelect: (emotion: EmotionConfig) => void;
  disabled?: boolean;
  childName?: string;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  emotions,
  selectedEmotions,
  onEmotionSelect,
  disabled = false,
  childName = ''
}) => {
  return (
    <TooltipProvider>
      <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0">
        <CardContent className="p-4 sm:p-5 md:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4 text-center px-2">
            {childName 
              ? (
                <>
                  ¿Cómo se siente <span className="font-black" style={{ fontWeight: 800 }}>{childName}</span> hoy?
                </>
              )
              : '¿Cómo se siente hoy?'
            }
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 text-center mb-3">Puedes elegir todas las que quieras</p>
          
          <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4">
            {emotions.map((emotion) => {
              const isSelected = selectedEmotions.some(e => e.id === emotion.id);
              
              return (
                <Tooltip key={emotion.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => !disabled && onEmotionSelect(emotion)}
                      disabled={disabled}
                      className={`
                        relative group flex flex-col items-center p-2 sm:p-3 rounded-xl transition-all duration-300 transform
                        ${isSelected
                          ? 'scale-105 shadow-lg'
                          : 'hover:scale-105 hover:shadow-lg'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                      style={isSelected ? { 
                        outline: `4px solid ${emotion.color}`,
                        outlineOffset: '0px'
                      } : {}}
                    >
                      {/* Imagen de la emoción (~5px menos que el tamaño estándar) */}
                      <div className={`
                        w-[43px] h-[43px] sm:w-[59px] sm:h-[59px] md:w-[75px] md:h-[75px] rounded-lg overflow-hidden mb-2 transition-all duration-300
                      `}>
                        <img
                          src={emotion.imageUrl}
                          alt={emotion.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      
                      {/* Nombre de la emoción */}
                      <span className={`
                        text-[10px] sm:text-xs md:text-sm font-medium text-center transition-colors duration-200
                        ${isSelected ? '' : 'text-gray-700'}
                      `}
                      style={isSelected ? { color: emotion.color } : {}}
                      >
                        {emotion.name}
                      </span>
                      
                      {/* Efecto de hover mejorado - solo borde sutil */}
                      <div className={`
                        absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none
                        ${isSelected 
                          ? '' 
                          : 'ring-0 group-hover:ring-2 group-hover:ring-gray-300/50'
                        }
                      `}
                      style={isSelected ? { 
                        boxShadow: `inset 0 0 0 2px ${emotion.color}30`
                      } : {}}
                      />
                      
                      {/* Efecto de brillo sutil en hover */}
                      <div className={`
                        absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none
                        ${isSelected 
                          ? '' 
                          : 'bg-transparent group-hover:bg-white/30'
                        }
                      `}
                      style={isSelected ? { 
                        backgroundColor: `${emotion.color}08`
                      } : {}}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="bg-gray-800 text-white text-sm px-3 py-2">
                    <p className="font-medium">{emotion.name}</p>
                    <p className="text-xs text-gray-300">{emotion.description}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
          
          {selectedEmotions.length > 0 && (
            <div 
              className="mt-3 sm:mt-4 p-2.5 sm:p-3 rounded-xl border border-gray-200 bg-gray-50"
            >
              <p className="text-center text-xs sm:text-sm text-gray-700">
                {selectedEmotions.length === 1 ? (
                  <>
                    <span className="font-semibold" style={{ color: selectedEmotions[0].color }}>
                      {selectedEmotions[0].name}
                    </span>{' '}
                    seleccionada
                  </>
                ) : (
                  <>
                    <span className="font-semibold">{selectedEmotions.length} emociones</span>
                    {' '}seleccionadas: {selectedEmotions.map(e => e.name).join(', ')}
                  </>
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EmotionSelector;
