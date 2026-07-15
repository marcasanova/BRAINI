import { useQuery } from '@tanstack/react-query';
import { fetchMyRole, type MyRolePayload } from '@/integrations/supabase/rpc/roles';

export const myRoleKeys = {
  all: ['myRole'] as const,
};

export function useMyRole(options?: { enabled?: boolean }) {
  return useQuery<MyRolePayload | null>({
    queryKey: myRoleKeys.all,
    queryFn: fetchMyRole,
    enabled: options?.enabled ?? true,
    staleTime: 60_000,
  });
}
