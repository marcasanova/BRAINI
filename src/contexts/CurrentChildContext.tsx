import { useOutlet } from "react-router-dom";
import { useOutlet } from "react-router-dom";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const STORAGE_KEY = "brainifamily_selected_child_id";

export interface Child {
  id: string;
  parent_id: string;
  nombre: string;
  apellidos: string | null;
  nivel_educativo: string | null;
  course_id: number | null;
  profile_completed: boolean;
}

interface CurrentChildContextValue {
  children: Child[];
  currentChild: Child | null;
  currentChildId: string | undefined;
  setCurrentChildId: (id: string) => void;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

const CurrentChildContext = createContext<CurrentChildContextValue | null>(null);

function getStoredChildId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function setStoredChildId(id: string) {
  try {
    localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // ignore
  }
}

export function CurrentChildProvider({ children }: { children: React.ReactNode }) {
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(() => getStoredChildId());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchChildren = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        setChildrenList([]);
        setSelectedId(null);
        setLoading(false);
        return;
      }
      const { data, error: fetchError } = await supabase
        .from("children")
        .select("id, parent_id, nombre, apellidos, nivel_educativo, course_id, profile_completed")
        .eq("parent_id", user.id)
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;
      const list = (data ?? []) as Child[];
      setChildrenList(list);

      const stored = getStoredChildId();
      const validStored = list.some((c) => c.id === stored);
      if (!validStored || !stored) {
        const firstId = list[0]?.id ?? null;
        setSelectedId(firstId);
        if (firstId) setStoredChildId(firstId);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al cargar los hijos");
      setChildrenList([]);
      setSelectedId(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  const setCurrentChildId = useCallback((id: string) => {
    setSelectedId(id);
    setStoredChildId(id);
  }, []);

  const currentChild =
    selectedId && childrenList.length > 0
      ? childrenList.find((c) => c.id === selectedId) ?? childrenList[0]
      : childrenList[0] ?? null;
  const currentChildId = currentChild?.id ?? undefined;

  const value: CurrentChildContextValue = {
    children: childrenList,
    currentChild,
    currentChildId,
    setCurrentChildId,
    loading,
    error,
    refetch: fetchChildren,
  };

  return (
    <CurrentChildContext.Provider value={value}>
      {children}
    </CurrentChildContext.Provider>
  );
}

export function useCurrentChildContext() {
  const ctx = useContext(CurrentChildContext);
  return ctx;
}
