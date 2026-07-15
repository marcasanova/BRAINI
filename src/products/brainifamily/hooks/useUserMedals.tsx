import { useQuery } from '@tanstack/react-query';
import {
  fetchChildMedals,
  medalKeys,
  type UserMedal,
} from '@/integrations/supabase/queries/medals';

export type { UserMedal };

export const useUserMedals = (childId: string | undefined) => {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: medalKeys.byChild(childId ?? ''),
    queryFn: () => fetchChildMedals(childId!),
    enabled: !!childId,
  });

  return {
    userMedals: data?.userMedals ?? [],
    totalMedals: data?.totalMedals ?? 0,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refetch,
  };
};
