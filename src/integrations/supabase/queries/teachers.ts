import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export const teacherKeys = {
  all: ['teacher'] as const,
  current: ['teacher', 'current'] as const,
  byUserId: (userId: string) => ['teacher', userId] as const,
};

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
  classList: TeacherClassRecord[];
  classStudentCounts: Record<string, number>;
}

export async function fetchTeacherByUserId(userId: string): Promise<Teacher | null> {
  const { data: row, error: teacherErr } = await supabase
    .from('teachers')
    .select('id, email, nombre, school_id, active, created_at, updated_at')
    .eq('id', userId)
    .maybeSingle();

  if (teacherErr) throw teacherErr;
  if (!row) return null;

  const { data: classRows, error: classErr } = await supabase
    .from('classes')
    .select('id, name, course_id, nivel_educativo, courses ( nombre )')
    .eq('teacher_id', userId)
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
        classStudentCounts[r.class_id] = (classStudentCounts[r.class_id] ?? 0) + 1;
      }
    }
  }

  return {
    ...row,
    classList,
    classStudentCounts,
  };
}

export async function fetchCurrentTeacher(): Promise<{
  user: User | null;
  teacher: Teacher | null;
}> {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, teacher: null };
  }

  const teacher = await fetchTeacherByUserId(user.id);
  return { user, teacher };
}
