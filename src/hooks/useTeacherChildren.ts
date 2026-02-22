import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface TeacherChild {
  id: string;
  nombre: string;
  apellidos: string | null;
  nivel_educativo: string | null;
}

export function useTeacherChildren(childIds: string[]) {
  const [children, setChildren] = useState<TeacherChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChildren = useCallback(async () => {
    if (!childIds.length) {
      setChildren([]);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('children')
        .select('id, nombre, apellidos, nivel_educativo')
        .in('id', childIds);

      if (fetchError) throw fetchError;
      setChildren((data ?? []) as TeacherChild[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los niños');
      setChildren([]);
    } finally {
      setLoading(false);
    }
  }, [childIds.join(',')]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return { children, loading, error, refetch: fetchChildren };
}
