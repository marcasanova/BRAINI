import React from "react";
import SessionItem from "./LevelItem";
import { UserSession } from "@/hooks/useUserLevels";

interface SessionListProps {
  sessions: UserSession[];
}

const SessionList: React.FC<SessionListProps> = ({ sessions }) => {
  return (
    <ul className="space-y-4">
      {sessions.map((session) => (
        <SessionItem
          key={session.level_id}
          levelId={session.levels.id}
          titulo={session.levels.titulo}
          descripcion={session.levels.descripcion}
          status={session.status}
        />
      ))}
    </ul>
  );
};

export default SessionList; 