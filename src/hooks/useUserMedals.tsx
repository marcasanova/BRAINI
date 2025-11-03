import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface UserMedal {
  id: number;
  user_id: string;
  medal_id: number;
  fecha_obtencion: string;
}

export const useUserMedals = () => {
  const [userMedals, setUserMedals] = useState<UserMedal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserMedals = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('Usuario no autenticado');

      // Obtener solo las medallas del usuario (medal_id y fecha)
      const { data: userMedalsData, error: userMedalsError } = await supabase
        .from('parents_medals')
        .select('id, user_id, medal_id, fecha_obtencion')
        .eq('user_id', user.id);

      if (userMedalsError) throw userMedalsError;


      setUserMedals(userMedalsData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserMedals();
  }, [fetchUserMedals]);

  return { userMedals, loading, error, refetch: fetchUserMedals };
};
