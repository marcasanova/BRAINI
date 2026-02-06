import React from "react";
import SessionItem from "./LevelItem";
import { UserSession } from "@/hooks/useUserLevels";

interface SessionListProps {
  sessions: UserSession[];
  userMedals: Map<number, string>; // Map<levelId, fecha_obtencion>
  /** Nivel educativo del niño para la imagen de medalla en cada misión */
  childNivelEducativo?: string | null;
}

const SessionList: React.FC<SessionListProps> = ({ sessions, userMedals, childNivelEducativo }) => {
  return (
    <>
      {sessions.map((session) => {
        const levelId = session.levels.id;
        const hasMedal = userMedals.has(levelId);
        const medalDate = userMedals.get(levelId);

        return (
          <SessionItem
            key={session.level_id}
            levelId={levelId}
            titulo={session.levels.titulo}
            descripcion={session.levels.descripcion}
            status={session.status}
            hasMedal={hasMedal}
            medalDate={medalDate}
            childNivelEducativo={childNivelEducativo}
          />
        );
      })}
    </>
  );
};

export default SessionList; 