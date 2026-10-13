import { supabase } from '@/integrations/supabase/client';
import { unwrapRelation } from './lib';

export interface ChildProgressStats {
  medalsEarned: number;
  medalsTotal: number;
  activitiesRated: number;
  diaryDays: number;
  currentMissionTitle: string | null;
  currentMissionCount: number;
}

export async function fetchFamilyChildProgress(
  childIds: string[],
): Promise<Record<string, ChildProgressStats>> {
  const empty: Record<string, ChildProgressStats> = {};
  if (childIds.length === 0) return empty;

  const base = (): ChildProgressStats => ({
    medalsEarned: 0,
    medalsTotal: 0,
    activitiesRated: 0,
    diaryDays: 0,
    currentMissionTitle: null,
    currentMissionCount: 0,
  });

  for (const id of childIds) empty[id] = base();

  const [
    medalsCountRes,
    medalsRes,
    activitiesRes,
    diaryRes,
    currentRes,
  ] = await Promise.all([
    supabase.from('medals').select('id', { count: 'exact', head: true }),
    supabase.from('child_medals').select('child_id').in('child_id', childIds),
    supabase.from('child_activities').select('child_id, puntuacion').in('child_id', childIds),
    supabase.from('emotional_diary').select('child_id').in('child_id', childIds),
    supabase
      .from('child_missions')
      .select('child_id, mission_id, status, missions ( titulo )')
      .in('child_id', childIds)
      .eq('status', 'current')
      .order('mission_id', { ascending: true }),
  ]);

  if (medalsCountRes.error) throw medalsCountRes.error;
  if (medalsRes.error) throw medalsRes.error;
  if (activitiesRes.error) throw activitiesRes.error;
  if (diaryRes.error) throw diaryRes.error;
  if (currentRes.error) throw currentRes.error;

  const medalsTotal = medalsCountRes.count ?? 0;
  for (const id of childIds) {
    empty[id].medalsTotal = medalsTotal;
  }

  for (const row of medalsRes.data ?? []) {
    const id = (row as { child_id: string }).child_id;
    if (empty[id]) empty[id].medalsEarned += 1;
  }

  for (const row of activitiesRes.data ?? []) {
    const r = row as { child_id: string; puntuacion: number | null };
    if (empty[r.child_id] && r.puntuacion != null) {
      empty[r.child_id].activitiesRated += 1;
    }
  }

  for (const row of diaryRes.data ?? []) {
    const id = (row as { child_id: string }).child_id;
    if (empty[id]) empty[id].diaryDays += 1;
  }

  type CurrentRow = {
    child_id: string;
    missions: { titulo: string } | { titulo: string }[] | null;
  };
  for (const row of (currentRes.data ?? []) as CurrentRow[]) {
    if (!empty[row.child_id] || empty[row.child_id].currentMissionTitle) continue;
    const mission = unwrapRelation(row.missions);
    empty[row.child_id].currentMissionTitle = mission?.titulo ?? null;
    if (empty[row.child_id].currentMissionTitle) {
      empty[row.child_id].currentMissionCount = 1;
    }
  }

  return empty;
}
