import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface UserMedal {
  id: number;
  child_id: string;
  medal_id: number;
  fecha_obtencion: string;
}

export const useUserMedals = (childId: string | undefined) => {
  const [userMedals, setUserMedals] = useState<UserMedal[]>([]);
  const [totalMedals, setTotalMedals] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserMedals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (!childId) {
        setUserMedals([]);
        setTotalMedals(0);
        setLoading(false);
        return;
      }

      const { data: userMedalsData, error: userMedalsError } = await supabase
        .from('child_medals')
        .select('id, child_id, medal_id, fecha_obtencion')
        .eq('child_id', childId);

      if (userMedalsError) throw userMedalsError;

      const { count, error: medalsCountError } = await supabase
        .from('medals')
        .select('*', { count: 'exact', head: true });

      if (medalsCountError) throw medalsCountError;

      setUserMedals(userMedalsData || []);
      setTotalMedals(count || 0);
      setError(null);
    } catch (err: unknown) {
      console.error('Error en useUserMedals:', err);
      setError(err instanceof Error ? err.message : 'Error al cargar medallas');
      setUserMedals([]);
      setTotalMedals(0);
    } finally {
      setLoading(false);
    }
  }, [childId]);

  useEffect(() => {
    fetchUserMedals();
  }, [fetchUserMedals]);

  return { userMedals, totalMedals, loading, error, refetch: fetchUserMedals };
};
