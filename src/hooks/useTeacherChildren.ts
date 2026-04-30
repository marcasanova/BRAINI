import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface TeacherChild {
  id: string;
  nombre: string;
  apellidos: string | null;
  nivel_educativo: string | null;
}

/**
 * Alumnos de una clase (`children.class_id`).
 */
export function useTeacherChildren(classId: string | null) {
  const [children, setChildren] = useState<TeacherChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChildren = useCallback(async () => {
    if (!classId) {
      setChildren([]);
      setLoading(false);
      setError(null);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('children')
        .select('id, nombre, apellidos, nivel_educativo')
        .eq('class_id', classId)
        .eq('active', true)
        .order('nombre');

      if (fetchError) throw fetchError;
      setChildren((data ?? []) as TeacherChild[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los niños');
      setChildren([]);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  return { children, loading, error, refetch: fetchChildren };
}
