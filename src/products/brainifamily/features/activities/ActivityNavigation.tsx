import React from 'react';
import { Button } from '@/shared/ui/button';
import { ChevronLeft, ChevronRight, Lock, Trophy, Home } from 'lucide-react';
import { ActivityNavigationProps } from '@/products/brainifamily/hooks/useUserActivities';

const ActivityNavigation: React.FC<ActivityNavigationProps> = ({
  currentActivityId,
  previousActivity,
  nextActivity,
  currentIndex,
  totalActivities,
  onNavigate,
  onBackToMission
}) => {
  const isFirstActivity = currentIndex === 0;
  const isLastActivity = currentIndex === totalActivities - 1;

  return (
    <div className="bg-white/60 rounded-2xl p-2 sm:p-2.5 md:p-3">
      {/* Fila principal: Navegación y progreso - Siempre en fila */}
      <div className="flex flex-row items-center justify-between gap-1.5 sm:gap-2 md:gap-4">
        {/* Lado izquierdo: Botón Home + Botón Anterior */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2 shrink-0">
          <Button
            variant="ghost"
            onClick={onBackToMission}
            size="sm"
            className="flex items-center justify-center text-ink hover:bg-white/80 transition-all duration-200 p-2 sm:p-2.5 md:px-3 md:py-2"
          >
            <Home className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
            <span className="hidden xl:inline ml-1 text-sm font-medium">Volver</span>
          </Button>
          
          <div className="h-5 sm:h-5 w-px bg-ink/15"></div>
          
          <Button
            variant="ghost"
            onClick={() => previousActivity && onNavigate(previousActivity.id)}
            disabled={isFirstActivity}
            size="sm"
            className={`flex items-center justify-center transition-all duration-200 p-2 sm:p-2.5 md:px-3 md:py-2 ${
              isFirstActivity 
                ? 'opacity-40 cursor-not-allowed text-ink' 
                : 'text-ink hover:bg-white/80'
            }`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
            <span className="hidden xl:inline ml-1 text-sm font-medium">Actividad anterior</span>
          </Button>
        </div>

        {/* Centro: Indicador de progreso compacto */}
        <div className="flex-1 flex items-center gap-2 sm:gap-2 md:gap-3 min-w-0 mx-1.5 sm:mx-2">
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-ink mb-1 sm:mb-1 md:mb-2 truncate">
              Actividad {currentIndex + 1} de {totalActivities}
            </div>
            <div className="w-full bg-ink/10 rounded-full h-1.5 sm:h-2 md:h-2.5 overflow-hidden">
              <div 
                className="bg-ink h-1.5 sm:h-2 md:h-2.5 rounded-full transition-all duration-500 ease-out shadow-xs"
                style={{ width: `${((currentIndex + 1) / totalActivities) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-sm text-ink font-semibold whitespace-nowrap shrink-0">
            {Math.round(((currentIndex + 1) / totalActivities) * 100)}%
          </div>
        </div>

        {/* Lado derecho: Botón Siguiente */}
        <div className="flex items-center shrink-0">
          <Button
            variant="ghost"
            onClick={() => nextActivity && onNavigate(nextActivity.id)}
            disabled={isLastActivity}
            size="sm"
            className={`flex items-center justify-center transition-all duration-200 p-2 sm:p-2.5 md:px-3 md:py-2 ${
              isLastActivity
                ? 'opacity-40 cursor-not-allowed text-ink'
                : 'text-ink hover:bg-white/80'
            }`}
          >
            {isLastActivity ? (
              <>
                <span className="hidden xl:inline mr-1 text-sm font-medium">Completado</span>
                <Trophy className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
              </>
            ) : (
              <>
                <span className="hidden xl:inline mr-1 text-sm font-medium">Siguiente actividad</span>
                <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivityNavigation;
