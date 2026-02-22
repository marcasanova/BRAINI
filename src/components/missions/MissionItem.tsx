import React from "react";
import { Link } from "react-router-dom";
import { MISSION_STATUS } from "@/constants/missionStatus";
import Medal from "@/components/medals/Medal";

export interface MissionItemProps {
  missionId: number;
  titulo: string;
  descripcion: string;
  status: string;
  hasMedal?: boolean;
  medalDate?: string;
  /** Nivel educativo del niño para mostrar la medalla correcta (3/4/5 años infantil o orgullo) */
  childNivelEducativo?: string | null;
  /** Resaltar como "recién completada" (animación al volver de Guardar medalla) */
  isJustCompleted?: boolean;
  /** Resaltar como "recién desbloqueada" (animación al volver de Guardar medalla) */
  isJustUnlocked?: boolean;
}

const MissionItem: React.FC<MissionItemProps> = ({
  missionId,
  titulo,
  descripcion,
  status,
  hasMedal = false,
  medalDate,
  childNivelEducativo,
  isJustCompleted = false,
  isJustUnlocked = false,
}) => {
  const isLocked = status === MISSION_STATUS.LOCKED;
  const isAccessible = status === MISSION_STATUS.CURRENT || status === MISSION_STATUS.COMPLETED;

  const highlightCompletedClass = isJustCompleted ? 'ring-2 ring-braini-turquoise ring-offset-2 animate-pulse' : '';
  const highlightUnlockedClass = isJustUnlocked ? 'ring-2 ring-braini-blue ring-offset-2 animate-pulse' : '';
  const highlightClass = [highlightCompletedClass, highlightUnlockedClass].filter(Boolean).join(' ');

  return (
    <li
      className={`flex flex-col md:flex-row items-start md:items-center justify-between p-3 sm:p-4 md:p-5 rounded-xl md:rounded-2xl border transition-all ${isLocked ? 'bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed border-gray-200' : 'bg-white border-gray-200 shadow-md hover:shadow-lg hover:border-braini-blue/30'} animate-fade-in ${highlightClass}`}
    >
      <div className="flex-1">
        {/* Etiquetas de estado encima del título */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {isJustUnlocked && <span className="text-xs bg-braini-blue text-white px-2 py-0.5 rounded animate-pulse">¡Nueva disponible!</span>}
          {isJustCompleted && <span className="text-xs bg-braini-turquoise text-white px-2 py-0.5 rounded animate-pulse">¡Completada!</span>}
          {status === MISSION_STATUS.LOCKED && !isJustUnlocked && <span className="text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded">Por desbloquear</span>}
          {status === MISSION_STATUS.CURRENT && !isJustUnlocked && <span className="text-xs bg-braini-blue/20 text-braini-blue-dark px-2 py-0.5 rounded">Disponible</span>}
          {status === MISSION_STATUS.COMPLETED && !isJustCompleted && <span className="text-xs bg-braini-turquoise/20 text-braini-turquoise-dark px-2 py-0.5 rounded">Superada</span>}
        </div>
        {/* Título de la misión */}
        <div className="text-braini-blue font-bold text-xl sm:text-2xl md:text-3xl" style={{ fontWeight: 700 }}>
          Misión {missionId}. <span className="text-lg sm:text-xl md:text-2xl" style={{ fontWeight: 700 }}>{titulo}</span>
        </div>
      </div>
      <div className="mt-3 md:mt-0 md:ml-6 flex items-center gap-3 sm:gap-4 w-full md:w-auto">
        {/* Medalla */}
        <Medal
          missionNumber={missionId}
          isEarned={hasMedal}
          earnedAt={medalDate}
          childNivelEducativo={childNivelEducativo}
        />
        {/* Spacer para empujar el botón a la derecha */}
        <div className="flex-1 md:hidden"></div>
        {/* Botón Acceder - Completamente a la derecha */}
        {isAccessible ? (
          <Link
            to={`/brainifamily/sesion/${missionId}`}
            className="ml-auto md:ml-0 inline-block px-4 py-2.5 sm:px-6 sm:py-3 bg-braini-blue text-white text-sm sm:text-base font-semibold rounded-lg shadow hover:bg-braini-blue-dark transition disabled:opacity-50"
          >
            Acceder
          </Link>
        ) : (
          <button
            disabled
            className="ml-auto md:ml-0 inline-block px-4 py-2.5 sm:px-6 sm:py-3 bg-gray-300 text-gray-500 text-sm sm:text-base font-semibold rounded-lg cursor-not-allowed"
          >
            Aventura bloqueada
          </button>
        )}
      </div>
    </li>
  );
};

export default MissionItem;
