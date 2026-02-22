import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export interface TeacherClass {
  name: string;
  child_ids: string[];
}

export interface Teacher {
  id: string;
  email: string | null;
  nombre: string;
  created_at: string;
  updated_at: string;
  classes: { classes: TeacherClass[] };
}

export function useTeacher() {
  const [user, setUser] = useState<User | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeacher = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !authUser) {
        setUser(null);
        setTeacher(null);
        setLoading(false);
        return;
      }
      setUser(authUser);
      const { data, error: fetchError } = await supabase
        .from('teachers')
        .select('id, email, nombre, created_at, updated_at, classes')
        .eq('id', authUser.id)
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (data) {
        const classes = (data.classes as { classes?: TeacherClass[] })?.classes ?? [];
        setTeacher({
          ...data,
          classes: { classes },
        } as Teacher);
      } else {
        setTeacher(null);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar el perfil de maestro');
      setTeacher(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTeacher();
  }, [fetchTeacher]);

  const isTeacher = teacher !== null;

  return { user, teacher, isTeacher, loading, error, refetch: fetchTeacher };
}
