import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCurrentChildContext } from "@/contexts/CurrentChildContext";

export type { Child } from "@/contexts/CurrentChildContext";

/**
 * Obtiene el hijo actual del padre logueado.
 * Si existe CurrentChildProvider (rutas protegidas brainifamily), usa el hijo seleccionado en el contexto.
 * Si no, hace fetch del primer hijo (fallback para rutas sin provider).
 */
export function useCurrentChild() {
  const ctx = useCurrentChildContext();

  const [fallbackChild, setFallbackChild] = useState<import("@/contexts/CurrentChildContext").Child | null>(null);
  const [fallbackLoading, setFallbackLoading] = useState(!ctx);
  const [fallbackError, setFallbackError] = useState<string | null>(null);

  const fetchFallback = useCallback(async () => {
    try {
      setFallbackLoading(true);
      setFallbackError(null);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        setFallbackChild(null);
        setFallbackLoading(false);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from("children")
        .select(
          "id, parent_id, nombre, apellidos, nivel_educativo, course_id, profile_completed, school_id, schools ( name )",
        )
        .eq("parent_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (fetchError) throw fetchError;
      if (data) {
        const row = data as {
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
        const school = Array.isArray(row.schools) ? row.schools[0] : row.schools;
        setFallbackChild({
          id: row.id,
          parent_id: row.parent_id,
          nombre: row.nombre,
          apellidos: row.apellidos,
          nivel_educativo: row.nivel_educativo,
          course_id: row.course_id,
          profile_completed: row.profile_completed,
          school_id: row.school_id,
          school_name: school?.name ?? null,
        });
      } else {
        setFallbackChild(null);
      }
    } catch (err: unknown) {
      setFallbackError(err instanceof Error ? err.message : "Error al cargar el niño");
      setFallbackChild(null);
    } finally {
      setFallbackLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ctx) return;
    fetchFallback();
  }, [ctx, fetchFallback]);

  if (ctx) {
    return {
      child: ctx.currentChild,
      childId: ctx.currentChildId,
      loading: ctx.loading,
      error: ctx.error,
      refetch: ctx.refetch,
      children: ctx.children,
      setCurrentChildId: ctx.setCurrentChildId,
    };
  }

  return {
    child: fallbackChild,
    childId: fallbackChild?.id ?? undefined,
    loading: fallbackLoading,
    error: fallbackError,
    refetch: fetchFallback,
    children: fallbackChild ? [fallbackChild] : [],
    setCurrentChildId: () => {},
  };
}
