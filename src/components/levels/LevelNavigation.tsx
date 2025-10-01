import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lock, Trophy } from 'lucide-react';
import { UserSession } from '@/hooks/useUserLevels';

interface SessionNavigationProps {
  currentLevelId: number;
  previousSession: UserSession | null;
  nextSession: UserSession | null;
  currentIndex: number;
  totalSessions: number;
  onNavigate: (levelId: number) => void;
}

const SessionNavigation: React.FC<SessionNavigationProps> = ({
  currentLevelId,
  previousSession,
  nextSession,
  currentIndex,
  totalSessions,
  onNavigate
}) => {
  const isFirstSession = currentIndex === 0;
  const isLastSession = currentIndex === totalSessions - 1;
  const isNextSessionLocked = nextSession?.status === 'locked';

  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-braini-blue/20">
      {/* Botón Anterior */}
      <Button
        variant="outline"
        onClick={() => previousSession && onNavigate(previousSession.levels.id)}
        disabled={isFirstSession}
        className={`flex items-center gap-2 transition-all duration-200 ${
          isFirstSession 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:bg-braini-blue hover:text-white border-braini-blue text-braini-blue'
        }`}
      >
        <ChevronLeft className="w-4 h-4" />
        Anterior
      </Button>

      {/* Indicador de Progreso */}
      <div className="text-center">
        <div className="text-sm font-medium text-gray-700">
          Sesión {currentLevelId} de {totalSessions}
        </div>
        <div className="text-xs text-gray-500">
          {Math.round(((currentIndex + 1) / totalSessions) * 100)}% completado
        </div>
      </div>

      {/* Botón Siguiente */}
      <Button
        variant="outline"
        onClick={() => nextSession && onNavigate(nextSession.levels.id)}
        disabled={isNextSessionLocked || isLastSession}
        className={`flex items-center gap-2 transition-all duration-200 ${
          isNextSessionLocked || isLastSession
            ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-500'
            : 'hover:bg-braini-blue hover:text-white border-braini-blue text-braini-blue'
        }`}
      >
        {isLastSession ? (
          <>
            ¡Completado!
            <Trophy className="w-4 h-4" />
          </>
        ) : isNextSessionLocked ? (
          <>
            Siguiente bloqueada
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

export default SessionNavigation; 