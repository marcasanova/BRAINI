import { supabase } from '@/integrations/supabase/client';
import { unwrapRelation } from './lib';

export const missionKeys = {
  all: ['missions'] as const,
  byChild: (childId: string) => ['missions', childId] as const,
};

export interface MissionWithProgress {
  mission_id: number;
  status: 'locked' | 'current' | 'completed';
  missions: {
    id: number;
    titulo: string;
    descripcion: string | null;
  };
}

type MissionRow = {
  mission_id: number;
  status: string;
  missions: MissionWithProgress['missions'] | MissionWithProgress['missions'][];
};

export async function fetchChildMissions(childId: string): Promise<MissionWithProgress[]> {
  const { data, error } = await supabase
    .from('child_missions')
    .select(
      `
      mission_id,
      status,
      missions (
        id,
        titulo,
        descripcion
      )
      `,
    )
    .eq('child_id', childId)
    .order('mission_id', { ascending: true });

  if (error) throw error;

  return ((data ?? []) as MissionRow[]).map((item) => ({
    mission_id: item.mission_id,
    status: item.status as MissionWithProgress['status'],
    missions: unwrapRelation(item.missions)!,
  }));
}
