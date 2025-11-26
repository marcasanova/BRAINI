import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lock, ArrowLeft, List } from 'lucide-react';
import { ActivityNavigationProps } from '@/hooks/useUserActivities';

const ActivityNavigation: React.FC<ActivityNavigationProps> = ({
  currentActivityId,
  previousActivity,
  nextActivity,
  currentIndex,
  totalActivities,
  onNavigate,
  onBackToLevel
}) => {
  const isFirstActivity = currentIndex === 0;
  const isLastActivity = currentIndex === totalActivities - 1;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-3 md:p-4 shadow-lg">
      {/* Fila principal: Navegación y progreso */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 md:gap-4">
        {/* Lado izquierdo: Botón Volver + Botón Anterior */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <Button
            variant="ghost"
            onClick={onBackToLevel}
            size="sm"
            className="flex items-center gap-1.5 text-xs md:text-sm text-white hover:text-white hover:bg-white/20 transition-all duration-200 px-2 md:px-3 font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Volver</span>
          </Button>
          
          <div className="h-5 w-px bg-white/30"></div>
          
          <Button
            variant="ghost"
            onClick={() => previousActivity && onNavigate(previousActivity.id)}
            disabled={isFirstActivity}
            size="sm"
            className={`flex items-center gap-1.5 text-xs md:text-sm transition-all duration-200 px-2 md:px-3 font-medium ${
              isFirstActivity 
                ? 'opacity-40 cursor-not-allowed text-white/50' 
                : 'text-white hover:text-white hover:bg-white/20'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>
        </div>

        {/* Centro: Indicador de progreso compacto */}
        <div className="flex-1 flex flex-col sm:flex-row items-center gap-2 md:gap-3 min-w-0 w-full sm:w-auto">
          <div className="text-center sm:text-left min-w-0 flex-1 sm:flex-initial">
            <div className="text-xs md:text-sm font-bold text-white mb-1.5">
              Actividad {currentIndex + 1} de {totalActivities}
            </div>
            <div className="w-full sm:w-48 bg-white/30 rounded-full h-2 overflow-hidden backdrop-blur-sm">
              <div 
                className="bg-white h-2 rounded-full transition-all duration-500 shadow-md"
                style={{ width: `${((currentIndex + 1) / totalActivities) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-xs md:text-sm text-white/90 font-semibold whitespace-nowrap">
            {Math.round(((currentIndex + 1) / totalActivities) * 100)}%
          </div>
        </div>

        {/* Lado derecho: Botón Siguiente */}
        <div className="w-full sm:w-auto flex justify-center sm:justify-end">
          <Button
            variant="ghost"
            onClick={() => nextActivity && onNavigate(nextActivity.id)}
            disabled={isLastActivity}
            size="sm"
            className={`flex items-center gap-1.5 text-xs md:text-sm transition-all duration-200 px-2 md:px-3 font-medium ${
              isLastActivity
                ? 'opacity-40 cursor-not-allowed text-white/50'
                : 'text-white hover:text-white hover:bg-white/20'
            }`}
          >
            {isLastActivity ? (
              <>
                <span className="hidden sm:inline">Completado</span>
                <Lock className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </>
            ) : (
              <>
                <span className="hidden sm:inline">Siguiente</span>
                <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivityNavigation;
