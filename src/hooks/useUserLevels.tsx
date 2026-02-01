import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useLocation } from "react-router-dom";

export interface UserSession {
  level_id: number;
  status: "locked" | "current" | "completed";
  levels: {
    id: number;
    titulo: string;
    descripcion: string;
  };
}

export function useUserSessions(userId: string | undefined) {
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const location = useLocation();

  // Función para forzar actualización
  const refreshSessions = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const loadUserSessions = async () => {
      if (!userId) {
        setSessions([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
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
          .order("level_id", { ascending: true });

        if (error) throw error;

        // levels puede venir como array, cogemos el primer elemento
        const mapped = (data as any[]).map((item) => ({
          ...item,
          levels: Array.isArray(item.levels) ? item.levels[0] : item.levels,
        }));
        
        setSessions(mapped as UserSession[]);
        setError(null);
      } catch (err: any) {
        console.error('Error cargando sesiones:', err);
        setError(err.message || 'Error al cargar las sesiones');
        setSessions([]);
      } finally {
        // ✅ SIEMPRE ejecutar setLoading(false)
        setLoading(false);
      }
    };

    loadUserSessions();
  }, [userId, refreshTrigger]);

  // Función para obtener sesiones adyacentes
  const getAdjacentSessions = (currentLevelId: number) => {
    const currentIndex = sessions.findIndex(l => l.levels.id === currentLevelId);
    const previousSession = currentIndex > 0 ? sessions[currentIndex - 1] : null;
    const nextSession = currentIndex < sessions.length - 1 ? sessions[currentIndex + 1] : null;
    
    return { previousSession, nextSession, currentIndex, totalSessions: sessions.length };
  };

  return { sessions, loading, error, getAdjacentSessions, refreshSessions };
} 