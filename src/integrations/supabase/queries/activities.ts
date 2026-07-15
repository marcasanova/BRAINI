import { supabase } from '@/integrations/supabase/client';
import { unwrapRelation } from './lib';

export const activityKeys = {
  all: ['activities'] as const,
  byChild: (childId: string) => ['activities', childId] as const,
  byChildAndMission: (childId: string, missionId: number) =>
    ['activities', childId, missionId] as const,
};

export interface Activity {
  id: number;
  titulo_actividad: string;
  mission_id: number;
  objetivo?: string;
  duracion_min?: number;
  duracion_max?: number;
  como_se_juega?: string;
  investigacion_beneficios?: string;
  tipo_actividad?:
    | 'inteligencia_emocional'
    | 'regulacion_emocional'
    | 'vinculo_afectivo'
    | 'acompañamiento_emocional';
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

type UserActivityRow = Omit<UserActivity, 'activities'> & {
  activities: Activity | Activity[];
};

function mapUserActivities(rows: UserActivityRow[]): UserActivity[] {
  return rows.map((item) => ({
    ...item,
    activities: unwrapRelation(item.activities)!,
  }));
}

export async function fetchChildActivities(childId: string): Promise<UserActivity[]> {
  const { data, error } = await supabase
    .from('child_activities')
    .select(
      `
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
      `,
    )
    .eq('child_id', childId)
    .order('activity_id', { ascending: true });

  if (error) throw error;
  return mapUserActivities((data ?? []) as UserActivityRow[]);
}

export async function fetchChildActivitiesByMission(
  childId: string,
  missionId: number,
): Promise<UserActivity[]> {
  const { data: activityIds, error: activityError } = await supabase
    .from('activities')
    .select('id')
    .eq('mission_id', missionId);

  if (activityError) throw activityError;
  if (!activityIds?.length) return [];

  const ids = activityIds.map((a) => a.id);

  const { data, error } = await supabase
    .from('child_activities')
    .select(
      `
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
      `,
    )
    .eq('child_id', childId)
    .in('activity_id', ids)
    .order('activity_id', { ascending: true });

  if (error) throw error;
  return mapUserActivities((data ?? []) as UserActivityRow[]);
}
