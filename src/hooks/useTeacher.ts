import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import type { User } from '@supabase/supabase-js';

export interface TeacherClassRecord {
  id: string;
  name: string;
  course_id: number;
  nivel_educativo: string | null;
  courses?: { nombre: string } | { nombre: string }[] | null;
}

export interface Teacher {
  id: string;
  email: string | null;
  nombre: string;
  school_id: string;
  active: boolean;
  created_at: string;
  updated_at: string;
  /** Clases normalizadas (`public.classes`). */
  classList: TeacherClassRecord[];
  /** Alumnos activos por `class_id`. */
  classStudentCounts: Record<string, number>;
}

function normalizeCourseName(
  courses: TeacherClassRecord['courses'],
): string | null {
  if (!courses) return null;
  const c = Array.isArray(courses) ? courses[0] : courses;
  return c?.nombre ?? null;
}

export { normalizeCourseName };

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

      const { data: row, error: teacherErr } = await supabase
        .from('teachers')
        .select('id, email, nombre, school_id, active, created_at, updated_at')
        .eq('id', authUser.id)
        .maybeSingle();

      if (teacherErr) throw teacherErr;
      if (!row) {
        setTeacher(null);
        setLoading(false);
        return;
      }

      const { data: classRows, error: classErr } = await supabase
        .from('classes')
        .select('id, name, course_id, nivel_educativo, courses ( nombre )')
        .eq('teacher_id', authUser.id)
        .eq('active', true)
        .order('name');

      if (classErr) throw classErr;

      const classList = (classRows ?? []) as TeacherClassRecord[];
      const classStudentCounts: Record<string, number> = {};

      if (classList.length > 0) {
        const ids = classList.map((c) => c.id);
        const { data: childRows, error: chErr } = await supabase
          .from('children')
          .select('class_id')
          .in('class_id', ids)
          .eq('active', true);

        if (chErr) throw chErr;
        for (const r of childRows ?? []) {
          if (r.class_id) {
            classStudentCounts[r.class_id] =
              (classStudentCounts[r.class_id] ?? 0) + 1;
          }
        }
      }

      setTeacher({
        ...row,
        classList,
        classStudentCounts,
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : 'Error al cargar el perfil de maestro',
      );
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
