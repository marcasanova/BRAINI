import React from 'react';
import { Textarea } from '@/shared/ui/textarea';

interface EmotionEntryProps {
  observations: string;
  onObservationsChange: (observations: string) => void;
  disabled?: boolean;
  childName?: string;
}

const MAX_LENGTH = 500;

/** Nota opcional del día, debajo de las emociones. */
const EmotionEntry: React.FC<EmotionEntryProps> = ({
  observations,
  onObservationsChange,
  disabled = false,
  childName = '',
}) => {
  return (
    <div>
      <label htmlFor="diario-observaciones" className="font-display text-lg font-semibold text-ink">
        ¿Quieres apuntar algo? <span className="font-sans text-sm font-normal text-ink/70">(opcional)</span>
      </label>
      <Textarea
        id="diario-observaciones"
        value={observations}
        onChange={(e) => onObservationsChange(e.target.value)}
        placeholder={
          childName
            ? `Qué ha pasado hoy, cómo ha reaccionado ${childName} o cualquier cosa que quieras recordar.`
            : 'Qué ha pasado hoy o cualquier cosa que quieras recordar.'
        }
        className="mt-2 min-h-[96px] resize-none rounded-xl border-ink/15 text-base text-ink placeholder:text-ink/50 focus-visible:ring-braini-turquoise-strong"
        maxLength={MAX_LENGTH}
        disabled={disabled}
      />
      <p className="mt-1 text-right text-sm text-ink/60">
        {observations.length}/{MAX_LENGTH}
      </p>
    </div>
  );
};

export default EmotionEntry;
