import React from 'react';
import { Button } from '@/shared/ui/button';
import { ChevronLeft, ChevronRight, Lock, Trophy, Home } from 'lucide-react';
import { useNavigate } from 'react-router';
import { MissionWithProgress } from '@/products/brainifamily/hooks/useMissions';

interface MissionNavigationProps {
  currentMissionId: number;
  previousMission: MissionWithProgress | null;
  nextMission: MissionWithProgress | null;
  currentIndex: number;
  totalMissions: number;
  onNavigate: (missionId: number) => void;
}

const MissionNavigation: React.FC<MissionNavigationProps> = ({
  currentMissionId,
  previousMission,
  nextMission,
  currentIndex,
  totalMissions,
  onNavigate
}) => {
  const navigate = useNavigate();
  const isFirstMission = currentIndex === 0;
  const isLastMission = currentIndex === totalMissions - 1;
  const isNextMissionLocked = nextMission?.status === 'locked';

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-lg border border-white/20 p-2 sm:p-2.5 md:p-4 shadow-lg">
      {/* Fila principal: Navegación y progreso - Siempre en fila */}
      <div className="flex flex-row items-center justify-between gap-1.5 sm:gap-2 md:gap-4">
        {/* Lado izquierdo: Botón Home + Botón Anterior */}
        <div className="flex items-center gap-1.5 sm:gap-2 md:gap-2 shrink-0">
          <Button
            variant="ghost"
            onClick={() => navigate('/brainifamily/home')}
            size="sm"
            className="flex items-center justify-center text-white hover:text-white hover:bg-white/20 transition-all duration-200 p-2 sm:p-2.5 md:px-3 md:py-2"
          >
            <Home className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
            <span className="hidden md:inline ml-1 text-sm font-medium">Volver</span>
          </Button>
          
          <div className="h-5 sm:h-5 w-px bg-white/30"></div>
          
          <Button
            variant="ghost"
            onClick={() => previousMission && onNavigate(previousMission.missions.id)}
            disabled={isFirstMission}
            size="sm"
            className={`flex items-center justify-center transition-all duration-200 p-2 sm:p-2.5 md:px-3 md:py-2 ${
              isFirstMission 
                ? 'opacity-40 cursor-not-allowed text-white/50' 
                : 'text-white hover:text-white hover:bg-white/20'
            }`}
          >
            <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
            <span className="hidden md:inline ml-1 text-sm font-medium">Aventura anterior</span>
          </Button>
        </div>

        {/* Centro: Indicador de progreso compacto */}
        <div className="flex-1 flex items-center gap-2 sm:gap-2 md:gap-3 min-w-0 mx-1.5 sm:mx-2">
          <div className="flex-1 min-w-0">
            <div className="text-xs sm:text-[10px] md:text-sm font-bold text-white mb-1 sm:mb-1 md:mb-2 truncate">
              Misión {currentMissionId} de {totalMissions}
            </div>
            <div className="w-full bg-white/20 rounded-full h-1.5 sm:h-2 md:h-2.5 overflow-hidden">
              <div 
                className="bg-white h-1.5 sm:h-2 md:h-2.5 rounded-full transition-all duration-500 ease-out shadow-xs"
                style={{ width: `${((currentIndex + 1) / totalMissions) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="text-xs sm:text-[10px] md:text-sm text-white font-semibold whitespace-nowrap shrink-0">
            {Math.round(((currentIndex + 1) / totalMissions) * 100)}%
          </div>
        </div>

        {/* Lado derecho: Botón Siguiente */}
        <div className="flex items-center shrink-0">
          <Button
            variant="ghost"
            onClick={() => nextMission && onNavigate(nextMission.missions.id)}
            disabled={isNextMissionLocked || isLastMission}
            size="sm"
            className={`flex items-center justify-center transition-all duration-200 p-2 sm:p-2.5 md:px-3 md:py-2 ${
              isNextMissionLocked || isLastMission
                ? 'opacity-40 cursor-not-allowed text-white/50'
                : 'text-white hover:text-white hover:bg-white/20'
            }`}
          >
            {isLastMission ? (
              <>
                <span className="hidden md:inline mr-1 text-sm font-medium">Completado</span>
                <Trophy className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
              </>
            ) : isNextMissionLocked ? (
              <>
                <span className="hidden md:inline mr-1 text-sm font-medium">Aventura bloqueada</span>
                <Lock className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
              </>
            ) : (
              <>
                <span className="hidden md:inline mr-1 text-sm font-medium">Siguiente aventura</span>
                <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4 md:w-4 md:h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MissionNavigation;
