import React, { useEffect, useRef, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getMedalImageForNivelEducativo } from '@/shared/lib/constants/emotionsStorage';
import {
  MEDAL_SHELF_ANIMATION_DELAY_MS,
  MEDAL_SHELF_ANIMATION_DURATION_MS,
  prefersReducedMotion,
} from './celebration';
import { playSound } from '@/shared/lib/sound';

interface MedalShelfProps {
  userMedals: Array<{ id: number; medal_id: number; fecha_obtencion: string }>;
  totalMedals: number;
  isLoading: boolean;
  childNivelEducativo?: string | null;
  /**
   * Si se indica, el progreso se anima desde este número de medallas hasta el real
   * (celebración al volver de «Guardar medalla»).
   */
  animateFrom?: number;
}

/** Interpola de `from` a `to` con easing; devuelve `to` directamente si no hay animación. */
function useCountUp(to: number, from: number | undefined): number {
  const animate = from != null && from !== to && !prefersReducedMotion();
  const [value, setValue] = useState(animate ? from! : to);

  useEffect(() => {
    if (!animate) {
      setValue(to);
      return;
    }
    setValue(from!);
    let frame = 0;
    let start: number | null = null;
    const delay = window.setTimeout(() => {
      const step = (now: number) => {
        if (start == null) start = now;
        const t = Math.min(1, (now - start) / MEDAL_SHELF_ANIMATION_DURATION_MS);
        const eased = 1 - Math.pow(1 - t, 3);
        setValue(from! + (to - from!) * eased);
        if (t < 1) frame = window.requestAnimationFrame(step);
      };
      frame = window.requestAnimationFrame(step);
    }, MEDAL_SHELF_ANIMATION_DELAY_MS);
    return () => {
      window.clearTimeout(delay);
      window.cancelAnimationFrame(frame);
    };
  }, [animate, from, to]);

  return value;
}

const MedalShelf: React.FC<MedalShelfProps> = ({
  userMedals,
  totalMedals,
  isLoading,
  childNivelEducativo,
  animateFrom,
}) => {
  const earnedMedals = userMedals.length;
  const animatedEarned = useCountUp(earnedMedals, animateFrom);
  const isCelebrating = animateFrom != null && animateFrom < earnedMedals;
  const reachedTarget = Math.round(animatedEarned) === earnedMedals;

  // Un tick por cada medalla que suma la barra durante la celebración
  const lastTickRef = useRef<number | null>(null);
  useEffect(() => {
    if (!isCelebrating) {
      lastTickRef.current = null;
      return;
    }
    const current = Math.round(animatedEarned);
    if (lastTickRef.current !== null && current > lastTickRef.current) playSound('tick');
    lastTickRef.current = current;
  }, [animatedEarned, isCelebrating]);

  const progressPercentage = totalMedals > 0 ? (animatedEarned / totalMedals) * 100 : 0;
  const medalImage = getMedalImageForNivelEducativo(childNivelEducativo);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-xs text-gray-500">Cargando misiones...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        {/* Sección izquierda - Icono y número */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <div
              className={`w-12 h-12 md:w-14 md:h-14 flex items-center justify-center ${
                isCelebrating && reachedTarget ? 'medal-celebrate' : ''
              }`}
            >
              <img
                src={medalImage}
                alt="Medalla Braini"
                className="w-full h-full object-contain"
              />
            </div>
            {isCelebrating && reachedTarget && (
              <>
                <Sparkles
                  aria-hidden="true"
                  className="absolute -top-2 -right-2 w-5 h-5 text-braini-yellow animate-sparkle-twinkle pointer-events-none"
                />
                <Sparkles
                  aria-hidden="true"
                  className="absolute -bottom-1 -left-2 w-4 h-4 text-braini-yellow animate-sparkle-twinkle pointer-events-none"
                  style={{ animationDelay: '0.4s' }}
                />
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black text-braini-turquoise-dark animate-fade-in-up pointer-events-none">
                  +1
                </span>
              </>
            )}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-700" aria-live="polite">
              {Math.round(animatedEarned)} / {totalMedals} misiones
            </div>
          </div>
        </div>

        {/* Sección derecha - Porcentaje */}
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-xs text-gray-500 font-medium uppercase">
              Misiones superadas
            </div>
            <div
              className={`text-lg font-black text-braini-blue ${isCelebrating && reachedTarget ? 'animate-medal-pop' : ''}`}
              style={{ fontWeight: 900 }}
            >
              {Math.round(progressPercentage)}%
            </div>
          </div>
        </div>
      </div>

      {/* Barra de progreso compacta */}
      <div className="mt-2">
        <div
          className={`flex-1 bg-gray-200 rounded-full overflow-hidden transition-all duration-500 ${
            isCelebrating ? 'h-2.5' : 'h-1.5'
          }`}
        >
          <div
            className={`h-full rounded-full ${isCelebrating ? 'bg-linear-to-r from-braini-blue to-braini-turquoise' : 'bg-braini-blue transition-all duration-500 ease-out'}`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MedalShelf;
