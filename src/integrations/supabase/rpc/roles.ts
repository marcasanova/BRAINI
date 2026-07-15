import { supabase } from '@/integrations/supabase/client';

/** Respuesta JSON de la RPC `get_my_role` (SECURITY DEFINER). */
export type MyRolePayload = {
  role: string | null;
  user_id?: string;
  error?: string;
  school_id?: string;
  director_id?: string;
  teacher_id?: string;
  parent_id?: string;
};

/** PostgREST a veces devuelve una fila como objeto o como array de una fila. */
function unwrapRpcRow(data: unknown): Record<string, unknown> | null {
  if (data == null) return null;
  if (typeof data === 'string') {
    try {
      const parsed: unknown = JSON.parse(data);
      return unwrapRpcRow(parsed);
    } catch {
      return null;
    }
  }
  if (Array.isArray(data)) {
    if (data.length === 0) return null;
    const first = data[0];
    return first && typeof first === 'object' ? (first as Record<string, unknown>) : null;
  }
  if (typeof data === 'object') return data as Record<string, unknown>;
  return null;
}

/**
 * Unifica variantes que pueda devolver la BD (`Super Admin`, `platform_admin`, etc.).
 */
export function normalizeAppRole(raw: unknown): string | null {
  if (raw == null) return null;
  if (typeof raw !== 'string') return null;
  const r = raw.trim().toLowerCase().replace(/\s+/g, '_');
  if (r === 'platform_admin' || r === 'superadmin') return 'super_admin';
  return r;
}

/**
 * Comprueba si el correo está en `admin_emails` (lista de super admin en BD).
 */
export async function isEmailListedAsPlatformAdmin(
  normalizedEmail: string,
): Promise<boolean> {
  const email = normalizedEmail.trim().toLowerCase();
  if (!email) return false;
  const { data, error } = await supabase
    .from('admin_emails')
    .select('email')
    .ilike('email', email)
    .maybeSingle();
  if (error) {
    if (import.meta.env.DEV) {
      console.warn('[isEmailListedAsPlatformAdmin]', error.message);
    }
    return false;
  }
  return !!data;
}

export async function fetchMyRole(): Promise<MyRolePayload | null> {
  const { data, error } = await supabase.rpc('get_my_role');
  if (error) {
    console.error('[fetchMyRole]', error.message);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const email = user?.email?.trim().toLowerCase();
    if (email && (await isEmailListedAsPlatformAdmin(email))) {
      return { role: 'super_admin', user_id: user?.id };
    }
    return null;
  }
  const row = unwrapRpcRow(data);
  if (!row) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const email = user?.email?.trim().toLowerCase();
    if (email && (await isEmailListedAsPlatformAdmin(email))) {
      return { role: 'super_admin', user_id: user?.id };
    }
    return null;
  }

  let role = normalizeAppRole(row.role);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email?.trim().toLowerCase();
  if (email && role !== 'super_admin') {
    const listed = await isEmailListedAsPlatformAdmin(email);
    if (listed) {
      role = 'super_admin';
    }
  }

  return {
    ...(row as unknown as MyRolePayload),
    role,
  };
}

export function isSuperAdminRole(p: MyRolePayload | null): boolean {
  return p?.role === 'super_admin';
}

export function isDirectorRole(p: MyRolePayload | null): boolean {
  return p?.role === 'director';
}

export function isTeacherRole(p: MyRolePayload | null): boolean {
  return p?.role === 'teacher';
}

export function isParentRole(p: MyRolePayload | null): boolean {
  return p?.role === 'parent';
}
