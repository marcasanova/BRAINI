import { supabase } from '@/integrations/supabase/client';
import { unwrapRelation } from './lib';

export const childrenKeys = {
  all: ['children'] as const,
  byParent: (parentId: string) => ['children', 'parent', parentId] as const,
  byClass: (classId: string) => ['children', 'class', classId] as const,
  parentExists: (parentId: string) => ['parents', parentId] as const,
};

export interface ChildRecord {
  id: string;
  parent_id: string;
  nombre: string;
  apellidos: string | null;
  nivel_educativo: string | null;
  course_id: number | null;
  profile_completed: boolean;
  school_id: string | null;
  school_name: string | null;
}

type ChildRow = {
  id: string;
  parent_id: string;
  nombre: string;
  apellidos: string | null;
  nivel_educativo: string | null;
  course_id: number | null;
  profile_completed: boolean;
  school_id: string | null;
  schools: { name: string | null } | { name: string | null }[] | null;
};

function mapChildRow(row: ChildRow): ChildRecord {
  const school = unwrapRelation(row.schools);
  return {
    id: row.id,
    parent_id: row.parent_id,
    nombre: row.nombre,
    apellidos: row.apellidos,
    nivel_educativo: row.nivel_educativo,
    course_id: row.course_id,
    profile_completed: row.profile_completed,
    school_id: row.school_id,
    school_name: school?.name ?? null,
  };
}

const CHILD_SELECT =
  'id, parent_id, nombre, apellidos, nivel_educativo, course_id, profile_completed, school_id, schools ( name )';

export async function fetchParentExists(parentId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('parents')
    .select('id')
    .eq('id', parentId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

export async function fetchChildrenByParentId(parentId: string): Promise<ChildRecord[]> {
  const { data, error } = await supabase
    .from('children')
    .select(CHILD_SELECT)
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return ((data ?? []) as ChildRow[]).map(mapChildRow);
}

export async function fetchFirstChildByParentId(parentId: string): Promise<ChildRecord | null> {
  const { data, error } = await supabase
    .from('children')
    .select(CHILD_SELECT)
    .eq('parent_id', parentId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return mapChildRow(data as ChildRow);
}

export interface ClassChildRecord {
  id: string;
  nombre: string;
  apellidos: string | null;
  nivel_educativo: string | null;
  parent_id: string | null;
}

export interface PendingInviteRecord {
  child_id: string;
  token: string;
  email: string | null;
}

export async function fetchClassChildren(classId: string): Promise<ClassChildRecord[]> {
  const { data, error } = await supabase
    .from('children')
    .select('id, nombre, apellidos, nivel_educativo, parent_id')
    .eq('class_id', classId)
    .eq('active', true)
    .order('nombre');

  if (error) throw error;
  return (data ?? []) as ClassChildRecord[];
}

export async function fetchPendingInvitesByChildIds(
  childIds: string[],
): Promise<PendingInviteRecord[]> {
  if (childIds.length === 0) return [];

  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('parent_invited')
    .select('child_id, token, email, created_at, expires_at')
    .in('child_id', childIds)
    .eq('status', 'pending')
    .gt('expires_at', nowIso)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as PendingInviteRecord[];
}
