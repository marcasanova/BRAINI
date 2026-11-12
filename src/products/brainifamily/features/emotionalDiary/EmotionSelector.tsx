import React from 'react';
import { Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip';
import { playSound } from '@/shared/lib/sound';

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

/** Las emociones del día: el elemento principal de «Así me siento hoy». Se puede elegir más de una. */
const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  emotions,
  selectedEmotions,
  onEmotionSelect,
  disabled = false,
  childName = '',
}) => {
  return (
    <TooltipProvider>
      <fieldset>
        <legend className="font-display text-xl sm:text-2xl font-semibold text-ink">
          {childName ? `¿Cómo se ha sentido ${childName}?` : '¿Cómo se ha sentido?'}
        </legend>
        <p className="mt-1 text-sm text-ink/70">Puedes elegir más de una emoción.</p>

        <div className="mt-5 grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4">
          {emotions.map((emotion) => {
            const isSelected = selectedEmotions.some((e) => e.id === emotion.id);
            return (
              <Tooltip key={emotion.id}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      if (disabled) return;
                      playSound('select');
                      onEmotionSelect(emotion);
                    }}
                    disabled={disabled}
                    className={`relative flex flex-col items-center gap-2 rounded-2xl p-1.5 sm:p-2.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-ink/5'
                    }`}
                    style={
                      isSelected
                        ? { boxShadow: `0 0 0 3px ${emotion.color}`, backgroundColor: `${emotion.color}1f` }
                        : undefined
                    }
                  >
                    {isSelected && (
                      <span
                        aria-hidden="true"
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-white shadow-sm"
                        style={{ backgroundColor: emotion.color }}
                      >
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </span>
                    )}
                    <img
                      src={emotion.imageUrl}
                      alt=""
                      className="w-20 h-20 md:w-24 md:h-24 rounded-xl object-cover"
                      loading="lazy"
                    />
                    <span className="text-sm font-medium text-ink text-center">{emotion.name}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-ink text-white text-sm px-3 py-2 max-w-56">
                  {emotion.description}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </fieldset>
    </TooltipProvider>
  );
};

export default EmotionSelector;
