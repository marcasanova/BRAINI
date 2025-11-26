import React from "react";
import SessionItem from "./LevelItem";
import { UserSession } from "@/hooks/useUserLevels";

interface SessionListProps {
  sessions: UserSession[];
  userMedals: Map<number, string>; // Map<levelId, fecha_obtencion>
}

const SessionList: React.FC<SessionListProps> = ({ sessions, userMedals }) => {
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
          />
        );
      })}
    </>
  );
};

export default SessionList; 