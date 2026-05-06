import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

export interface TeacherChild {
  id: string;
  nombre: string;
  apellidos: string | null;
  nivel_educativo: string | null;
  /** Null hasta que la familia complete la invitación y quede vinculada. */
  parent_id: string | null;
  /** Invitación pendiente vigente para la familia (si existe). */
  pending_invite_token: string | null;
  pending_invite_email: string | null;
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
        .select('id, nombre, apellidos, nivel_educativo, parent_id')
        .eq('class_id', classId)
        .eq('active', true)
        .order('nombre');

      if (fetchError) throw fetchError;
      const base = (data ?? []) as Array<{
        id: string;
        nombre: string;
        apellidos: string | null;
        nivel_educativo: string | null;
        parent_id: string | null;
      }>;

      const childIds = base.map((c) => c.id);
      const inviteByChildId: Record<
        string,
        { token: string; email: string | null }
      > = {};

      if (childIds.length > 0) {
        const nowIso = new Date().toISOString();
        const { data: invites, error: inviteError } = await supabase
          .from('parent_invited')
          .select('child_id, token, email, created_at, expires_at')
          .in('child_id', childIds)
          .eq('status', 'pending')
          .gt('expires_at', nowIso)
          .order('created_at', { ascending: false });

        if (inviteError) throw inviteError;

        for (const inv of invites ?? []) {
          const childId = (inv as { child_id?: string }).child_id;
          if (!childId) continue;
          if (!inviteByChildId[childId]) {
            inviteByChildId[childId] = {
              token: String((inv as { token?: string }).token ?? ''),
              email: ((inv as { email?: string | null }).email ?? null) as
                | string
                | null,
            };
          }
        }
      }

      setChildren(
        base.map((c) => ({
          ...c,
          pending_invite_token: inviteByChildId[c.id]?.token ?? null,
          pending_invite_email: inviteByChildId[c.id]?.email ?? null,
        })),
      );
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
