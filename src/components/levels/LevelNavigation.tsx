import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lock, Trophy, Home } from 'lucide-react';
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
    <div className="mb-6 p-4 bg-gradient-to-r from-braini-blue/10 to-braini-turquoise/10 rounded-xl border border-braini-blue/20 shadow-sm">
      {/* Fila superior: Botones de navegación */}
      <div className="flex justify-between items-center mb-3">
        {/* Botón Anterior */}
        <Button
          variant="outline"
          onClick={() => previousSession && onNavigate(previousSession.levels.id)}
          disabled={isFirstSession}
          className={`flex items-center gap-2 transition-all duration-200 ${
            isFirstSession 
              ? 'opacity-50 cursor-not-allowed border-gray-300' 
              : 'hover:bg-braini-blue hover:text-white border-braini-blue text-braini-blue hover:shadow-md'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        {/* Indicador de Progreso */}
        <div className="text-center flex-1 mx-4">
          <div className="text-base font-bold text-braini-blue mb-1">
            Sesión {currentLevelId} de {totalSessions}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 max-w-xs mx-auto">
            <div 
              className="bg-gradient-to-r from-braini-blue to-braini-turquoise h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / totalSessions) * 100}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-600 mt-1 font-medium">
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
              : 'hover:bg-braini-blue hover:text-white border-braini-blue text-braini-blue hover:shadow-md'
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

      {/* Fila inferior: Botón Volver a Home */}
      <div className="flex justify-center pt-2 border-t border-braini-blue/20">
        <Button
          variant="ghost"
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-braini-blue hover:bg-braini-blue/10 transition-all duration-200"
        >
          <Home className="w-4 h-4" />
          Volver a mis sesiones
        </Button>
      </div>
    </div>
  );
};

export default SessionNavigation; 