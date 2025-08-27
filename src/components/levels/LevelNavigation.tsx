import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lock, Trophy } from 'lucide-react';
import { UserLevel } from '@/hooks/useUserLevels';

interface LevelNavigationProps {
  currentLevelId: number;
  previousLevel: UserLevel | null;
  nextLevel: UserLevel | null;
  currentIndex: number;
  totalLevels: number;
  onNavigate: (levelId: number) => void;
}

const LevelNavigation: React.FC<LevelNavigationProps> = ({
  currentLevelId,
  previousLevel,
  nextLevel,
  currentIndex,
  totalLevels,
  onNavigate
}) => {
  const isFirstLevel = currentIndex === 0;
  const isLastLevel = currentIndex === totalLevels - 1;
  const isNextLevelLocked = nextLevel?.status === 'locked';

  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-white/50 backdrop-blur-sm rounded-xl border border-braini-blue/20">
      {/* Botón Anterior */}
      <Button
        variant="outline"
        onClick={() => previousLevel && onNavigate(previousLevel.levels.id)}
        disabled={isFirstLevel}
        className={`flex items-center gap-2 transition-all duration-200 ${
          isFirstLevel 
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
          Nivel {currentLevelId} de {totalLevels}
        </div>
        <div className="text-xs text-gray-500">
          {Math.round(((currentIndex + 1) / totalLevels) * 100)}% completado
        </div>
      </div>

      {/* Botón Siguiente */}
      <Button
        variant="outline"
        onClick={() => nextLevel && onNavigate(nextLevel.levels.id)}
        disabled={isNextLevelLocked || isLastLevel}
        className={`flex items-center gap-2 transition-all duration-200 ${
          isNextLevelLocked || isLastLevel
            ? 'opacity-50 cursor-not-allowed border-gray-300 text-gray-500'
            : 'hover:bg-braini-blue hover:text-white border-braini-blue text-braini-blue'
        }`}
      >
        {isLastLevel ? (
          <>
            ¡Completado!
            <Trophy className="w-4 h-4" />
          </>
        ) : isNextLevelLocked ? (
          <>
            Siguiente bloqueado
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

export default LevelNavigation; 