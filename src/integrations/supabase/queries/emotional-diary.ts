import { supabase } from '@/integrations/supabase/client';

export const emotionalDiaryKeys = {
  all: ['emotional-diary'] as const,
  month: (userId: string, childId: string, year: number, month: number) =>
    ['emotional-diary', userId, childId, year, month] as const,
  day: (userId: string, childId: string, entryDate: string) =>
    ['emotional-diary', userId, childId, 'day', entryDate] as const,
};

export interface EmotionalEntry {
  id: number;
  user_id: string;
  child_id: string;
  emotion_names: string[];
  observations: string | null;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

export function formatDateToLocalString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export interface UpsertEmotionEntryInput {
  userId: string;
  childId: string;
  date: Date;
  emotionNames: string[];
  observations?: string;
}

export async function upsertEmotionEntry(
  input: UpsertEmotionEntryInput,
): Promise<EmotionalEntry | null> {
  const entryDate = formatDateToLocalString(input.date);
  const payload = {
    user_id: input.userId,
    child_id: input.childId,
    entry_date: entryDate,
    emotion_names: input.emotionNames,
    observations: input.observations ?? null,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('emotional_diary')
    .upsert(payload, {
      onConflict: 'user_id,child_id,entry_date',
      returning: 'representation',
    });

  if (error) throw error;
  return Array.isArray(data) ? (data[0] ?? null) : data;
}

export async function fetchMonthEmotionEntries(
  userId: string,
  childId: string,
  year: number,
  month: number,
): Promise<EmotionalEntry[]> {
  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  const { data, error } = await supabase
    .from('emotional_diary')
    .select('*')
    .eq('user_id', userId)
    .eq('child_id', childId)
    .gte('entry_date', formatDateToLocalString(startDate))
    .lte('entry_date', formatDateToLocalString(endDate))
    .order('entry_date', { ascending: true });

  if (error) throw error;
  return data ?? [];
}

export async function fetchDayEmotionEntry(
  userId: string,
  childId: string,
  date: Date,
): Promise<EmotionalEntry | null> {
  const { data, error } = await supabase
    .from('emotional_diary')
    .select('*')
    .eq('user_id', userId)
    .eq('child_id', childId)
    .eq('entry_date', formatDateToLocalString(date))
    .maybeSingle();

  if (error) throw error;
  return data;
}
