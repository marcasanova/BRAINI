import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EmotionConfig {
  id: number;
  name: string;
  imageUrl: string;
  color: string;
  description: string;
}

interface EmotionSelectorProps {
  emotions: EmotionConfig[];
  selectedEmotion: EmotionConfig | null;
  onEmotionSelect: (emotion: EmotionConfig) => void;
  disabled?: boolean;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  emotions,
  selectedEmotion,
  onEmotionSelect,
  disabled = false
}) => {
  return (
    <TooltipProvider>
      <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            ¿Cómo se siente tu hijo/a hoy?
          </h3>
          
          <div className="grid grid-cols-5 gap-3 md:gap-4">
            {emotions.map((emotion) => {
              const isSelected = selectedEmotion?.id === emotion.id;
              
              return (
                <Tooltip key={emotion.id}>
                  <TooltipTrigger asChild>
                    <button
                      onClick={() => !disabled && onEmotionSelect(emotion)}
                      disabled={disabled}
                      className={`
                        relative group flex flex-col items-center p-3 rounded-xl transition-all duration-300 transform
                        ${isSelected
                          ? 'ring-4 ring-braini-blue scale-105 shadow-lg'
                          : 'hover:scale-105 hover:shadow-lg'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      {/* Imagen de la emoción */}
                      <div className={`
                        w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden mb-2 transition-all duration-300
                        ${isSelected ? 'ring-2 ring-white' : ''}
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
                        text-xs md:text-sm font-medium text-center transition-colors duration-200
                        ${isSelected ? 'text-braini-blue' : 'text-gray-700'}
                      `}>
                        {emotion.name}
                      </span>
                      
                      {/* Indicador de selección */}
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-braini-blue rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        </div>
                      )}
                      
                      {/* Efecto de hover mejorado - solo borde sutil */}
                      <div className={`
                        absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none
                        ${isSelected 
                          ? 'ring-2 ring-braini-blue/30' 
                          : 'ring-0 group-hover:ring-2 group-hover:ring-gray-300/50'
                        }
                      `} />
                      
                      {/* Efecto de brillo sutil en hover */}
                      <div className={`
                        absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none
                        ${isSelected 
                          ? 'bg-braini-blue/5' 
                          : 'bg-transparent group-hover:bg-white/30'
                        }
                      `} />
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
          
          {selectedEmotion && (
            <div className="mt-4 p-3 bg-gradient-to-r from-braini-blue/10 to-purple-600/10 rounded-xl border border-braini-blue/20">
              <p className="text-center text-sm text-gray-700">
                <span className="font-semibold text-braini-blue">
                  {selectedEmotion.name}
                </span> seleccionada
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default EmotionSelector;
