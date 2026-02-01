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
  const [totalMedals, setTotalMedals] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserMedals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      // ✅ Si no hay usuario, limpiar datos pero NO lanzar error
      if (authError || !user) {
        console.log('Usuario no autenticado en useUserMedals');
        setUserMedals([]);
        setTotalMedals(0);
        setError(null); // No es un error real
        return;
      }

      // Obtener las medallas del usuario
      const { data: userMedalsData, error: userMedalsError } = await supabase
        .from('parents_medals')
        .select('id, user_id, medal_id, fecha_obtencion')
        .eq('user_id', user.id);

      if (userMedalsError) throw userMedalsError;

      // Obtener el total de medallas disponibles en la tabla medals
      const { count, error: medalsCountError } = await supabase
        .from('medals')
        .select('*', { count: 'exact', head: true });

      if (medalsCountError) throw medalsCountError;

      setUserMedals(userMedalsData || []);
      setTotalMedals(count || 0);
      setError(null);
    } catch (err: any) {
      console.error('Error en useUserMedals:', err);
      setError(err.message);
      // ✅ En caso de error, limpiar datos para evitar estados inconsistentes
      setUserMedals([]);
      setTotalMedals(0);
    } finally {
      // ✅ SIEMPRE ejecutar setLoading(false)
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserMedals();
  }, [fetchUserMedals]);

  return { userMedals, totalMedals, loading, error, refetch: fetchUserMedals };
};
