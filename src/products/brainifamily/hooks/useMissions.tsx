import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  fetchChildMissions,
  missionKeys,
  type MissionWithProgress,
} from '@/integrations/supabase/queries/missions';

export type { MissionWithProgress };

export function useMissions(childId: string | undefined) {
  const queryClient = useQueryClient();
  const {
    data: missions = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: missionKeys.byChild(childId ?? ''),
    queryFn: () => fetchChildMissions(childId!),
    enabled: !!childId,
  });

  const refreshMissions = () => {
    if (!childId) return;
    void queryClient.invalidateQueries({ queryKey: missionKeys.byChild(childId) });
    void refetch();
  };

  const getAdjacentMissions = (currentMissionId: number) => {
    const currentIndex = missions.findIndex((m) => m.missions.id === currentMissionId);
    const previousMission = currentIndex > 0 ? missions[currentIndex - 1] : null;
    const nextMission = currentIndex < missions.length - 1 ? missions[currentIndex + 1] : null;
    return { previousMission, nextMission, currentIndex, totalMissions: missions.length };
  };

  return {
    missions,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    getAdjacentMissions,
    refreshMissions,
  };
}
