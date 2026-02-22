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
        .select("id, parent_id, nombre, apellidos, nivel_educativo, course_id, profile_completed")
        .eq("parent_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();
      if (fetchError) throw fetchError;
      setFallbackChild(data ?? null);
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
