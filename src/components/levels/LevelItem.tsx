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
      className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-5 rounded-xl md:rounded-2xl border transition-all ${isLocked ? 'bg-gray-100 text-gray-400 opacity-60 cursor-not-allowed border-gray-200' : 'bg-white border-gray-200 shadow-md hover:shadow-lg hover:border-braini-blue/30'} animate-fade-in`}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="text-braini-blue font-bold text-2xl md:text-3xl" style={{ fontWeight: 700 }}>
            Sesión{levelId}: <span className="text-xl md:text-2xl" style={{ fontWeight: 700 }}>{titulo}</span>
          </div>
          {status === SESSION_STATUS.LOCKED && <span className="text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded">Bloqueada</span>}
          {status === SESSION_STATUS.CURRENT && <span className="text-xs bg-braini-blue/20 text-braini-blue-dark px-2 py-0.5 rounded">Actual</span>}
          {status === SESSION_STATUS.COMPLETED && <span className="text-xs bg-braini-turquoise/20 text-braini-turquoise-dark px-2 py-0.5 rounded">Completada</span>}
        </div>
        <div className="text-gray-700 mt-1 text-sm md:text-base font-medium">{descripcion}</div>
      </div>
      <div className="mt-3 md:mt-0 md:ml-6 flex items-center gap-3">
        {/* Medalla */}
        <Medal
          levelNumber={levelId}
          isEarned={hasMedal}
          earnedAt={medalDate}
        />
        {/* Botón Acceder */}
        {isAccessible ? (
          <Link
            to={`/sesion/${levelId}`}
            className="inline-block px-4 py-2 bg-braini-blue text-white rounded-lg shadow hover:bg-braini-blue-dark transition disabled:opacity-50"
          >
            Acceder
          </Link>
        ) : (
          <button
            disabled
            className="inline-block px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
          >
            Acceso bloqueado
          </button>
        )}
      </div>
    </li>
  );
};

export default SessionItem; 