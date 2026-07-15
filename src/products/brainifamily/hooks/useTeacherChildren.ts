import { useState, useEffect, useCallback } from 'react';
import {
  fetchClassChildren,
  fetchPendingInvitesByChildIds,
} from '@/integrations/supabase/queries/children';

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

      const base = await fetchClassChildren(classId);
      const childIds = base.map((c) => c.id);
      const invites = await fetchPendingInvitesByChildIds(childIds);

      const inviteByChildId: Record<string, { token: string; email: string | null }> = {};
      for (const inv of invites) {
        if (!inviteByChildId[inv.child_id]) {
          inviteByChildId[inv.child_id] = {
            token: inv.token,
            email: inv.email,
          };
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
