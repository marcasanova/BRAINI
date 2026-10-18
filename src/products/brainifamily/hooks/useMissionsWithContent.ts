import { useQuery } from '@tanstack/react-query';
import {
  activityKeys,
  fetchMissionIdsWithActivities,
} from '@/integrations/supabase/queries/activities';

/** Misiones con actividades en el catálogo. Cambia poco: se cachea 10 minutos. */
export function useMissionsWithContent() {
  const { data, isLoading, error } = useQuery({
    queryKey: activityKeys.missionsWithContent,
    queryFn: fetchMissionIdsWithActivities,
    staleTime: 10 * 60_000,
  });

  return {
    missionIdsWithContent: data ?? null,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  };
}
