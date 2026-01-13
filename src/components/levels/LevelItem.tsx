import React from "react";
import { Link } from "react-router-dom";
import { SESSION_STATUS } from "@/constants/levelStatus";
import Medal from "@/components/medals/Medal";

export interface SessionItemProps {
  levelId: number;
  titulo: string;
  descripcion: string;
  status: string;
  hasMedal?: boolean;
  medalDate?: string;
}

const SessionItem: React.FC<SessionItemProps> = ({ levelId, titulo, descripcion, status, hasMedal = false, medalDate }) => {
  const isLocked = status === SESSION_STATUS.LOCKED;
  const isAccessible = status === SESSION_STATUS.CURRENT || status === SESSION_STATUS.COMPLETED;

  return (
    <li
      className={`flex flex-col md:flex-row items-start md:items-center justify-between p-3 sm:p-4 md:p-5 rounded-xl md:rounded-2xl border transition-all ${isLocked ? 'bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed border-gray-200' : 'bg-white border-gray-200 shadow-md hover:shadow-lg hover:border-braini-blue/30'} animate-fade-in`}
    >
      <div className="flex-1">
        {/* Etiquetas de estado encima del título */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          {status === SESSION_STATUS.LOCKED && <span className="text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded">Bloqueada</span>}
          {status === SESSION_STATUS.CURRENT && <span className="text-xs bg-braini-blue/20 text-braini-blue-dark px-2 py-0.5 rounded">Actual</span>}
          {status === SESSION_STATUS.COMPLETED && <span className="text-xs bg-braini-turquoise/20 text-braini-turquoise-dark px-2 py-0.5 rounded">Completada</span>}
        </div>
        {/* Título de la sesión */}
        <div className="text-braini-blue font-bold text-xl sm:text-2xl md:text-3xl" style={{ fontWeight: 700 }}>
          Sesión{levelId}: <span className="text-lg sm:text-xl md:text-2xl" style={{ fontWeight: 700 }}>{titulo}</span>
        </div>
        <div className="text-gray-700 mt-1 text-xs sm:text-sm md:text-base font-medium">{descripcion}</div>
      </div>
      <div className="mt-3 md:mt-0 md:ml-6 flex items-center gap-3 sm:gap-4 w-full md:w-auto">
        {/* Medalla */}
        <Medal
          levelNumber={levelId}
          isEarned={hasMedal}
          earnedAt={medalDate}
        />
        {/* Spacer para empujar el botón a la derecha */}
        <div className="flex-1 md:hidden"></div>
        {/* Botón Acceder - Completamente a la derecha */}
        {isAccessible ? (
          <Link
            to={`/brainifamily/sesion/${levelId}`}
            className="ml-auto md:ml-0 inline-block px-4 py-2.5 sm:px-6 sm:py-3 bg-braini-blue text-white text-sm sm:text-base font-semibold rounded-lg shadow hover:bg-braini-blue-dark transition disabled:opacity-50"
          >
            Acceder
          </Link>
        ) : (
          <button
            disabled
            className="ml-auto md:ml-0 inline-block px-4 py-2.5 sm:px-6 sm:py-3 bg-gray-300 text-gray-500 text-sm sm:text-base font-semibold rounded-lg cursor-not-allowed"
          >
            Acceso bloqueado
          </button>
        )}
      </div>
    </li>
  );
};

export default SessionItem; 