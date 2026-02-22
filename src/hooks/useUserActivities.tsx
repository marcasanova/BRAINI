import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export interface Activity {
  id: number;
  titulo_actividad: string;
  mission_id: number;
  objetivo?: string;
  duracion_min?: number;
  duracion_max?: number;
  como_se_juega?: string;
  investigacion_beneficios?: string;
  tipo_actividad?: 'inteligencia_emocional' | 'regulacion_emocional' | 'vinculo_afectivo' | 'acompañamiento_emocional';
  contenido_vinculo?: {
    accion: string;
    frase: string;
  };
  contenido_apoyo?: string;
}

export interface UserActivity {
  activity_id: number;
  puntuacion: number | null;
  opinion: string | null;
  started_at: string | null;
  activities: Activity;
}

export interface ActivityWithProgress extends Activity {
  userProgress?: {
    puntuacion: number | null;
    opinion: string | null;
    started_at: string | null;
  };
}

export interface ActivityRating {
  puntuacion: number;
  opinion: string;
}

export interface ActivityNavigationProps {
  currentActivityId: number;
  previousActivity: Activity | null;
  nextActivity: Activity | null;
  currentIndex: number;
  totalActivities: number;
  onNavigate: (activityId: number) => void;
  onBackToMission: () => void;
}

export interface ActivityRatingProps {
  activityId: number;
  childId: string;
  missionId?: number;
  activityType?: string;
  onRatingSubmitted?: () => void;
  onMedalEarned?: (medal: { id: number; mission_id: number; nombre: string; descripcion: string | null; icono: string; color: string }) => void;
}

export interface ActivityListProps {
  activities: UserActivity[];
  onActivityClick: (activityId: number) => void;
  loading?: boolean;
}

export function useUserActivities(childId: string | undefined) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refreshActivities = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    if (!childId) {
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    supabase
      .from("child_activities")
      .select(`
        activity_id,
        puntuacion,
        opinion,
        started_at,
        activities (
          id,
          titulo_actividad,
          mission_id,
          objetivo,
          duracion_min,
          duracion_max,
          como_se_juega,
          investigacion_beneficios,
          tipo_actividad,
          contenido_vinculo,
          contenido_apoyo
        )
      `)
      .eq("child_id", childId)
      .order("activity_id", { ascending: true })
      .then(({ data, error }) => {
        if (error) {
          setError(error.message);
          setActivities([]);
        } else {
          const mapped = (data as any[]).map((item) => ({
            ...item,
            activities: Array.isArray(item.activities) ? item.activities[0] : item.activities,
          }));
          setActivities(mapped as UserActivity[]);
        }
        setLoading(false);
      });
  }, [childId, refreshTrigger]);

  return { activities, loading, error, refreshActivities };
}

export function useUserActivitiesByMission(childId: string | undefined, missionId: number) {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!childId || !missionId) {
      setActivities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    supabase
      .from("activities")
      .select("id")
      .eq("mission_id", missionId)
      .then(({ data: activityIds, error: activityError }) => {
        if (activityError) {
          setError(activityError.message);
          setActivities([]);
          setLoading(false);
          return;
        }

        if (!activityIds || activityIds.length === 0) {
          setActivities([]);
          setLoading(false);
          return;
        }

        const ids = activityIds.map((a) => a.id);

        supabase
          .from("child_activities")
          .select(`
            activity_id,
            puntuacion,
            opinion,
            started_at,
            activities (
              id,
              titulo_actividad,
              mission_id,
              objetivo,
              duracion_min,
              duracion_max,
              como_se_juega,
              investigacion_beneficios,
              tipo_actividad,
              contenido_vinculo,
              contenido_apoyo
            )
          `)
          .eq("child_id", childId)
          .in("activity_id", ids)
          .order("activity_id", { ascending: true })
          .then(({ data, error }) => {
            if (error) {
              setError(error.message);
              setActivities([]);
            } else {
              const mapped = (data as any[]).map((item) => ({
                ...item,
                activities: Array.isArray(item.activities) ? item.activities[0] : item.activities,
              }));
              setActivities(mapped as UserActivity[]);
            }
            setLoading(false);
          });
      });
  }, [childId, missionId]);

  return { activities, loading, error };
}
