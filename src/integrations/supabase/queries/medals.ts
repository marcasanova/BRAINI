import { supabase } from '@/integrations/supabase/client';

export const medalKeys = {
  all: ['medals'] as const,
  byChild: (childId: string) => ['medals', childId] as const,
};

export interface UserMedal {
  id: number;
  child_id: string;
  medal_id: number;
  fecha_obtencion: string;
}

export interface ChildMedalsResult {
  userMedals: UserMedal[];
  totalMedals: number;
}

export async function fetchChildMedals(childId: string): Promise<ChildMedalsResult> {
  const { data: userMedalsData, error: userMedalsError } = await supabase
    .from('child_medals')
    .select('id, child_id, medal_id, fecha_obtencion')
    .eq('child_id', childId);

  if (userMedalsError) throw userMedalsError;

  const { count, error: medalsCountError } = await supabase
    .from('medals')
    .select('*', { count: 'exact', head: true });

  if (medalsCountError) throw medalsCountError;

  return {
    userMedals: userMedalsData ?? [],
    totalMedals: count ?? 0,
  };
}
