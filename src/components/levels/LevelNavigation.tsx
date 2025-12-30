import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lock, Trophy, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const isFirstSession = currentIndex === 0;
  const isLastSession = currentIndex === totalSessions - 1;
  const isNextSessionLocked = nextSession?.status === 'locked';

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-2 sm:p-2.5 md:p-4 shadow-lg">
      {/* Fila principal: Navegación y progreso - Siempre en fila */}
      <div className="flex flex-row items-center justify-between gap-1.5 sm:gap-2 md:gap-4">
        {/* Lado izquierdo: Botón Home + Botón Anterior */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            onClick={() => navigate('/home')}
            size="sm"
            className="flex items-center justify-center text-white hover:text-white hover:bg-white/20 transition-all duration-200 p-2 sm:p-2.5 md:px-3 md:py-2"
          >
            <Home className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
            <span className="hidden md:inline ml-1 text-sm font-medium">Volver</span>
          </Button>
          
          <div className="h-5 sm:h-5 w-px bg-white/30"></div>
          
          <Button
            variant="ghost"
            onClick={() => previousSession && onNavigate(previousSession.levels.id)}
            disabled={isFirstSession}
            size="sm"
            className={`flex items-center justify-center transition-all duration-200 p-2 sm:p-2.5 md:px-3 md:py-2 ${
              isFirstSession 
                ? 'opacity-40 cursor-not-allowed text-white/50' 
                : 'text-white hover:text-white hover:bg-white/20'
            }`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
            <span className="hidden md:inline ml-1 text-sm font-medium">Sesión anterior</span>
          </Button>
        </div>

        {/* Centro: Indicador de progreso compacto */}
        <div className="flex-1 flex items-center gap-2 sm:gap-2 md:gap-3 min-w-0 mx-1.5 sm:mx-2">
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-[10px] md:text-sm font-bold text-white mb-1 sm:mb-1 md:mb-2 truncate">
              Sesión {currentLevelId} de {totalSessions}
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2 md:h-2.5 overflow-hidden">
              <div 
                className="bg-white h-1.5 sm:h-2 md:h-2.5 rounded-full transition-all duration-500 ease-out shadow-sm"
                style={{ width: `${((currentIndex + 1) / totalSessions) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-xs sm:text-[10px] md:text-sm text-white font-semibold whitespace-nowrap flex-shrink-0">
            {Math.round(((currentIndex + 1) / totalSessions) * 100)}%
          </div>
        </div>

        {/* Lado derecho: Botón Siguiente */}
        <div className="flex items-center flex-shrink-0">
          <Button
            variant="ghost"
            onClick={() => nextSession && onNavigate(nextSession.levels.id)}
            disabled={isNextSessionLocked || isLastSession}
            size="sm"
            className={`flex items-center justify-center transition-all duration-200 p-2 sm:p-2.5 md:px-3 md:py-2 ${
              isNextSessionLocked || isLastSession
                ? 'opacity-40 cursor-not-allowed text-white/50'
                : 'text-white hover:text-white hover:bg-white/20'
            }`}
          >
            {isLastSession ? (
              <>
                <span className="hidden md:inline mr-1 text-sm font-medium">Completado</span>
                <Trophy className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
              </>
            ) : isNextSessionLocked ? (
              <>
                <span className="hidden md:inline mr-1 text-sm font-medium">Sesión bloqueada</span>
                <Lock className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
              </>
            ) : (
              <>
                <span className="hidden md:inline mr-1 text-sm font-medium">Sesión siguiente</span>
                <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionNavigation; 