import { useQuery } from '@tanstack/react-query';
import {
  activityKeys,
  fetchChildActivities,
  fetchChildActivitiesByMission,
  type Activity,
  type UserActivity,
} from '@/integrations/supabase/queries/activities';

export type { Activity, UserActivity };

export interface ActivityWithProgress extends Activity {
  userProgress?: {
    puntuacion: number | null;
    opinion: string | null;
    started_at: string | null;
  };
}

export interface ActivityRating {
  puntuacion: number;
  opinion: string;
}

export interface ActivityNavigationProps {
  currentActivityId: number;
  previousActivity: Activity | null;
  nextActivity: Activity | null;
  currentIndex: number;
  totalActivities: number;
  onNavigate: (activityId: number) => void;
  onBackToMission: () => void;
}

export interface ActivityRatingProps {
  activityId: number;
  childId: string;
  missionId?: number;
  activityType?: string;
  onRatingSubmitted?: () => void;
  onMedalEarned?: (medal: {
    id: number;
    mission_id: number;
    nombre: string;
    descripcion: string | null;
    icono: string;
    color: string;
  }) => void;
}

export interface ActivityListProps {
  activities: UserActivity[];
  onActivityClick: (activityId: number) => void;
  loading?: boolean;
}

export function useUserActivities(childId: string | undefined) {
  const {
    data: activities = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: activityKeys.byChild(childId ?? ''),
    queryFn: () => fetchChildActivities(childId!),
    enabled: !!childId,
  });

  const refreshActivities = () => {
    void refetch();
  };

  return {
    activities,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refreshActivities,
  };
}

export function useUserActivitiesByMission(childId: string | undefined, missionId: number) {
  const {
    data: activities = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: activityKeys.byChildAndMission(childId ?? '', missionId),
    queryFn: () => fetchChildActivitiesByMission(childId!, missionId),
    enabled: !!childId && !!missionId,
  });

  return {
    activities,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
  };
}
