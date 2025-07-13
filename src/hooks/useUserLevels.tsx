import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export interface UserLevel {
  level_id: number;
  status: "locked" | "current" | "completed";
  levels: {
    id: number;
    titulo: string;
    descripcion: string;
  };
}

export function useUserLevels(userId: string | undefined) {
  const [levels, setLevels] = useState<UserLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLevels([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    supabase
      .from("parents_levels")
      .select(
        `
        level_id,
        status,
        levels (
          id,
          titulo,
          descripcion
        )
        `
      )
      .eq("user_id", userId)
      .order("level_id", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setLevels([]);
        } else {
          // levels puede venir como array, cogemos el primer elemento
          const mapped = (data as any[]).map((item) => ({
            ...item,
            levels: Array.isArray(item.levels) ? item.levels[0] : item.levels,
          }));
          setLevels(mapped as UserLevel[]);
        }
        setLoading(false);
      });
  }, [userId]);

  return { levels, loading, error };
} 