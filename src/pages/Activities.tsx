import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { LEVEL_STATUS } from "@/constants/levelStatus";
import { UserLevel } from "@/hooks/useUserLevels";

interface Activity {
  id: number;
  titulo: string;
  descripcion: string;
  level_id: number;
}

const Activities: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [level, setLevel] = useState<UserLevel | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Obtener el usuario logeado
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id);
    });
  }, []);

  // Obtener el nivel del usuario
  useEffect(() => {
    if (!userId || !id) return;
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
      .eq("level_id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError("No se encontró el nivel o no tienes acceso.");
          setLevel(null);
          setLoading(false);
        } else {
          const mapped = {
            ...data,
            levels: Array.isArray(data.levels) ? data.levels[0] : data.levels,
          } as UserLevel;
          setLevel(mapped);
          setLoading(false);
        }
      });
  }, [userId, id]);

  // Redirigir si el nivel está bloqueado
  useEffect(() => {
    if (level && level.status === LEVEL_STATUS.LOCKED) {
      setError("Este nivel está bloqueado. No puedes acceder.");
      setTimeout(() => {
        navigate("/home");
      }, 2000);
    }
  }, [level, navigate]);

  // Obtener actividades del nivel
  useEffect(() => {
    if (!level) return;
    supabase
      .from("actividades")
      .select("id, titulo, descripcion, level_id")
      .eq("level_id", level.level_id)
      .then(({ data, error }) => {
        if (error) {
          setActivities([]);
        } else {
          setActivities(data || []);
        }
      });
  }, [level]);

  if (loading) {
    return <div className="text-center py-12">Cargando nivel...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 py-12">{error}</div>;
  }
  if (!level) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter">
      <div className="bg-white/90 p-8 rounded-xl shadow-lg max-w-2xl w-full animate-fade-in">
        <h2 className="text-2xl font-bold text-braini-blue mb-2">Nivel {level.levels.id}: {level.levels.titulo}</h2>
        <div className="text-gray-700 mb-4">{level.levels.descripcion}</div>
        <div className="mb-6">
          Estado: {level.status === LEVEL_STATUS.CURRENT && <span className="text-blue-700 font-semibold">Actual</span>}
          {level.status === LEVEL_STATUS.COMPLETED && <span className="text-green-700 font-semibold">Completado</span>}
        </div>
        <h3 className="text-xl font-semibold mb-2">Actividades de este nivel</h3>
        {activities.length === 0 ? (
          <div className="text-gray-500">No hay actividades para este nivel.</div>
        ) : (
          <ul className="space-y-3">
            {activities.map((activity) => (
              <li key={activity.id} className="p-4 bg-gray-100 rounded-lg shadow">
                <div className="font-bold text-braini-blue">{activity.titulo}</div>
                <div className="text-gray-700">{activity.descripcion}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Activities; 