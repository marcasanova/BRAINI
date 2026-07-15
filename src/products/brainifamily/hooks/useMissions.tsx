import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface MissionWithProgress {
  mission_id: number;
  status: "locked" | "current" | "completed";
  missions: {
    id: number;
    titulo: string;
    descripcion: string | null;
  };
}

export function useMissions(childId: string | undefined) {
  const [missions, setMissions] = useState<MissionWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshMissions = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const loadMissions = async () => {
      if (!childId) {
        setMissions([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("child_missions")
          .select(
            `
            mission_id,
            status,
            missions (
              id,
              titulo,
              descripcion
            )
            `
          )
          .eq("child_id", childId)
          .order("mission_id", { ascending: true });

        if (error) throw error;

        type Row = { mission_id: number; status: string; missions: MissionWithProgress['missions'] | MissionWithProgress['missions'][] };
        const mapped = (data as Row[]).map((item) => ({
          ...item,
          missions: Array.isArray(item.missions) ? item.missions[0] : item.missions,
        })) as MissionWithProgress[];

        setMissions(mapped);
        setError(null);
      } catch (err: unknown) {
        console.error("Error cargando misiones:", err);
        setError(err instanceof Error ? err.message : "Error al cargar las misiones");
        setMissions([]);
      } finally {
        setLoading(false);
      }
    };

    loadMissions();
  }, [childId, refreshTrigger]);

  const getAdjacentMissions = (currentMissionId: number) => {
    const currentIndex = missions.findIndex((m) => m.missions.id === currentMissionId);
    const previousMission = currentIndex > 0 ? missions[currentIndex - 1] : null;
    const nextMission = currentIndex < missions.length - 1 ? missions[currentIndex + 1] : null;
    return { previousMission, nextMission, currentIndex, totalMissions: missions.length };
  };

  return { missions, loading, error, getAdjacentMissions, refreshMissions };
}
