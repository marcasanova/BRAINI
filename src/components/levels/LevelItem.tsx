import React from "react";
import { Link } from "react-router-dom";
import { SESSION_STATUS } from "@/constants/levelStatus";

export interface SessionItemProps {
  levelId: number;
  titulo: string;
  descripcion: string;
  status: string;
}

const SessionItem: React.FC<SessionItemProps> = ({ levelId, titulo, descripcion, status }) => {
  const isLocked = status === SESSION_STATUS.LOCKED;
  const isAccessible = status === SESSION_STATUS.CURRENT || status === SESSION_STATUS.COMPLETED;

  return (
    <li
      className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 rounded-lg border transition-all ${isLocked ? 'bg-gray-100 text-gray-400 border-gray-200 opacity-60 cursor-not-allowed' : 'bg-white border-braini-blue/30 hover:shadow-lg'} animate-fade-in`}
    >
      <div>
        <div className="font-semibold text-lg flex items-center gap-2">
          Sesión {levelId}
          {status === SESSION_STATUS.LOCKED && <span className="ml-2 text-xs bg-gray-300 text-gray-600 px-2 py-0.5 rounded">Bloqueada</span>}
          {status === SESSION_STATUS.CURRENT && <span className="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">Actual</span>}
          {status === SESSION_STATUS.COMPLETED && <span className="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded">Completada</span>}
        </div>
        <div className="text-braini-blue font-bold text-xl">{titulo}</div>
        <div className="text-gray-600 mt-1">{descripcion}</div>
      </div>
      {isAccessible ? (
        <Link
          to={`/sesion/${levelId}`}
          className="mt-4 md:mt-0 md:ml-8 inline-block px-4 py-2 bg-braini-blue text-white rounded-lg shadow hover:bg-braini-blue-dark transition disabled:opacity-50"
        >
          Acceder
        </Link>
      ) : (
        <button
          disabled
          className="mt-4 md:mt-0 md:ml-8 inline-block px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
        >
          Acceso bloqueado
        </button>
      )}
    </li>
  );
};

export default SessionItem; 