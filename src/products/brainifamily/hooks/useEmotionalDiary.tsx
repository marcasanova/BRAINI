import { useCallback, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EMOTIONS_INFANTIL_URL } from '@/shared/lib/constants/emotionsStorage';
import {
  fetchDayEmotionEntry,
  fetchMonthEmotionEntries,
  upsertEmotionEntry,
  type EmotionalEntry,
} from '@/integrations/supabase/queries/emotional-diary';

export type { EmotionalEntry };

interface EmotionConfig {
  id: number;
  name: string;
  imageUrl: string;
  color: string;
  description: string;
}

const EMOTIONS_CONFIG: EmotionConfig[] = [
  {
    id: 1,
    name: 'Alegría',
    imageUrl: `${EMOTIONS_INFANTIL_URL}/1.%20Alegria.png`,
    color: '#FFD93D',
    description: 'Contento y feliz',
  },
  {
    id: 2,
    name: 'Contento',
    imageUrl: `${EMOTIONS_INFANTIL_URL}/18.%20Contento.png`,
    color: '#66BB6A',
    description: 'Tranquilo y a gusto',
  },
  {
    id: 3,
    name: 'Tristeza',
    imageUrl: `${EMOTIONS_INFANTIL_URL}/2.%20Tristeza.png`,
    color: '#74B9FF',
    description: 'Melancólico o apenado',
  },
  {
    id: 4,
    name: 'Miedo',
    imageUrl: `${EMOTIONS_INFANTIL_URL}/3.%20Miedo.png`,
    color: '#5F8DCA',
    description: 'Asustado o preocupado',
  },
  {
    id: 5,
    name: 'Rabia',
    imageUrl: `${EMOTIONS_INFANTIL_URL}/5.%20Rabia.png`,
    color: '#FF6B6B',
    description: 'Enojado o frustrado',
  },
];

export const useEmotionalDiary = (childId: string | undefined) => {
  const [error, setError] = useState<string | null>(null);

  const saveMutation = useMutation({
    mutationFn: async ({
      date,
      emotionNames,
      observations,
    }: {
      date: Date;
      emotionNames: string[];
      observations?: string;
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');
      if (!childId) throw new Error('Selecciona un niño para guardar el diario emocional');

      return upsertEmotionEntry({
        userId: user.id,
        childId,
        date,
        emotionNames,
        observations,
      });
    },
    onError: (err: unknown) => {
      setError(err instanceof Error ? err.message : 'Error al guardar');
    },
  });

  const saveEmotionEntry = useCallback(
    async (
      date: Date,
      emotionNames: string[],
      observations?: string,
    ): Promise<EmotionalEntry | null> => {
      setError(null);
      try {
        return await saveMutation.mutateAsync({ date, emotionNames, observations });
      } catch {
        return null;
      }
    },
    [saveMutation],
  );

  const getMonthEntries = useCallback(
    async (year: number, month: number): Promise<EmotionalEntry[]> => {
      if (!childId) return [];
      try {
        setError(null);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario no autenticado');
        return await fetchMonthEmotionEntries(user.id, childId, year, month);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al cargar entradas');
        return [];
      }
    },
    [childId],
  );

  const getDayEntry = useCallback(
    async (date: Date): Promise<EmotionalEntry | null> => {
      if (!childId) return null;
      try {
        setError(null);
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario no autenticado');
        return await fetchDayEmotionEntry(user.id, childId, date);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al cargar entrada');
        return null;
      }
    },
    [childId],
  );

  return {
    EMOTIONS_CONFIG,
    saveEmotionEntry,
    getMonthEntries,
    getDayEntry,
    loading: saveMutation.isPending,
    error,
    clearError: () => setError(null),
  };
};
