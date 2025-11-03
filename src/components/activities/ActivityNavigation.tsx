import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lock, Play } from 'lucide-react';
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
    <div className="flex justify-between items-center mb-6 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-braini-blue/20">
      {/* Botón Anterior */}
      <Button
        variant="outline"
        onClick={() => previousActivity && onNavigate(previousActivity.id)}
        disabled={isFirstActivity}
        className={`flex items-center gap-2 transition-all duration-200 ${
          isFirstActivity 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-braini-blue hover:text-white border-braini-blue text-braini-blue'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </Button>

      {/* Información central */}
      <div className="text-center flex-1 mx-4">
        <div className="text-sm font-medium text-gray-700">
          Actividad {currentActivityId} de {totalActivities}
        </div>
        <div className="text-xs text-gray-500">
          {Math.round(((currentIndex + 1) / totalActivities) * 100)}% completado
        </div>
        <Button
          variant="ghost"
          onClick={onBackToLevel}
          className="text-xs text-gray-500 hover:text-braini-blue mt-1"
        >
          ← Volver a la sesión
        </Button>
      </div>

      {/* Botón Siguiente */}
      <Button
        variant="outline"
        onClick={() => nextActivity && onNavigate(nextActivity.id)}
        disabled={isLastActivity}
        className={`flex items-center gap-2 transition-all duration-200 ${
          isLastActivity
            ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-500'
            : 'hover:bg-braini-blue hover:text-white border-braini-blue text-braini-blue'
        }`}
      >
        {isLastActivity ? (
          <>
            ¡Completado!
            <Lock className="w-4 h-4" />
          </>
        ) : (
          <>
            Siguiente
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
};

export default ActivityNavigation;
