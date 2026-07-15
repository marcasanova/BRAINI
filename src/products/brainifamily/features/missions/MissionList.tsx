import React from "react";
import MissionItem from "./MissionItem";
import { MissionWithProgress } from "@/products/brainifamily/hooks/useMissions";

export interface MissionListProps {
  missions: MissionWithProgress[];
  userMedals: Map<number, string>; // Map<missionId, fecha_obtencion>
  /** Nivel educativo del niño para la imagen de medalla en cada misión */
  childNivelEducativo?: string | null;
  /** Id de misión recién completada (para animación al volver de "Guardar medalla") */
  highlightMissionCompleted?: number;
  /** Id de misión recién desbloqueada (para animación al volver de "Guardar medalla") */
  highlightMissionUnlocked?: number;
}

const MissionList: React.FC<MissionListProps> = ({
  missions,
  userMedals,
  childNivelEducativo,
  highlightMissionCompleted,
  highlightMissionUnlocked,
}) => {
  return (
    <>
      {missions.map((mission) => {
        const missionId = mission.missions.id;
        const hasMedal = userMedals.has(missionId);
        const medalDate = userMedals.get(missionId);
        const isJustCompleted = missionId === highlightMissionCompleted;
        const isJustUnlocked = missionId === highlightMissionUnlocked;

        return (
          <MissionItem
            key={mission.mission_id}
            missionId={missionId}
            titulo={mission.missions.titulo}
            descripcion={mission.missions.descripcion ?? ''}
            status={mission.status}
            hasMedal={hasMedal}
            medalDate={medalDate}
            childNivelEducativo={childNivelEducativo}
            isJustCompleted={isJustCompleted}
            isJustUnlocked={isJustUnlocked}
          />
        );
      })}
    </>
  );
};

export default MissionList;
