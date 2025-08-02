import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLocation } from "react-router-dom";

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
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const location = useLocation();

  // Función para forzar actualización
  const refreshLevels = () => {
    setRefreshTrigger(prev => prev + 1);
  };

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
  }, [userId, refreshTrigger]); // Añadido refreshTrigger como dependencia

  // Función para obtener niveles adyacentes
  const getAdjacentLevels = (currentLevelId: number) => {
    const currentIndex = levels.findIndex(l => l.levels.id === currentLevelId);
    const previousLevel = currentIndex > 0 ? levels[currentIndex - 1] : null;
    const nextLevel = currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;
    
    return { previousLevel, nextLevel, currentIndex, totalLevels: levels.length };
  };

  return { levels, loading, error, getAdjacentLevels, refreshLevels };
} 