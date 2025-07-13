import React from "react";
import LevelItem from "./LevelItem";
import { UserLevel } from "@/hooks/useUserLevels";

interface LevelListProps {
  levels: UserLevel[];
}

const LevelList: React.FC<LevelListProps> = ({ levels }) => {
  return (
    <ul className="space-y-4">
      {levels.map((level) => (
        <LevelItem
          key={level.level_id}
          levelId={level.levels.id}
          titulo={level.levels.titulo}
          descripcion={level.levels.descripcion}
          status={level.status}
        />
      ))}
    </ul>
  );
};

export default LevelList; 