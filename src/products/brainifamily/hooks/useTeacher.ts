import { useQuery } from '@tanstack/react-query';
import {
  fetchCurrentTeacher,
  teacherKeys,
  type Teacher,
  type TeacherClassRecord,
} from '@/integrations/supabase/queries/teachers';

export type { Teacher, TeacherClassRecord };

function normalizeCourseName(
  courses: TeacherClassRecord['courses'],
): string | null {
  if (!courses) return null;
  const c = Array.isArray(courses) ? courses[0] : courses;
  return c?.nombre ?? null;
}

export { normalizeCourseName };

export function useTeacher() {
  const {
    data,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: teacherKeys.current,
    queryFn: fetchCurrentTeacher,
  });

  const teacher = data?.teacher ?? null;
  const user = data?.user ?? null;

  return {
    user,
    teacher,
    isTeacher: teacher !== null,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    refetch,
  };
}
