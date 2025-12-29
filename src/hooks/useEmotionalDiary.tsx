import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface EmotionalEntry {
  id: number;
  user_id: string;
  child_id: string;
  emotion_name: string;
  observations: string | null;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

interface EmotionConfig {
  id: number;
  name: string;
  imageUrl: string;
  color: string;
  description: string;
}

export const useEmotionalDiary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para formatear fecha preservando zona horaria local
  const formatDateToLocalString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Configuración de las 5 emociones
  const EMOTIONS_CONFIG: EmotionConfig[] = [
    {
      id: 1,
      name: "Alegría",
      imageUrl: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/1.%20Alegria.jpg",
      color: "#FFD93D",  // Amarillo brillante (sun-like)
      description: "Contento y feliz"
    },
    {
      id: 2,
      name: "Tristeza",
      imageUrl: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/2.%20Tristeza.jpg",
      color: "#74B9FF",  // Azul claro (light blue)
      description: "Melancólico o apenado"
    },
    {
      id: 3,
      name: "Miedo",
      imageUrl: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/3.%20Miedo.jpg",
      color: "#5F8DCA",  // Azul medio (con sombra oscura)
      description: "Asustado o preocupado"
    },
    {
      id: 4,
      name: "Pena",
      imageUrl: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/4.%20Pena.jpg",
      color: "#81C7E8",  // Azul claro (con corazón roto)
      description: "Triste o desanimado"
    },
    {
      id: 5,
      name: "Rabia",
      imageUrl: "https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/5.%20Rabia.jpg",
      color: "#FF6B6B",  // Rojo intenso (con llamas)
      description: "Enojado o frustrado"
    }
  ];

  // Guardar entrada emocional (INSERT/UPDATE)
  const saveEmotionEntry = useCallback(async (
    date: Date,
    emotionName: string,
    observations?: string,
    childId?: string
  ): Promise<EmotionalEntry | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // Obtener el ID del niño del usuario autenticado
      let finalChildId = childId;
      
      if (!finalChildId) {
        // Si no se proporciona childId, buscar en la tabla children
        const { data: children, error: childrenError } = await supabase
          .from('children')
          .select('id')
          .eq('parent_id', user.id)
          .limit(1);

        if (childrenError) {
          throw new Error('No se pudo obtener la información del niño');
        }

        if (!children || children.length === 0) {
          throw new Error('No se encontró ningún niño asociado a tu cuenta');
        }

        finalChildId = children[0].id;
      }

      // Verificar que finalChildId es un UUID válido
      if (!finalChildId || typeof finalChildId !== 'string' || finalChildId.length !== 36) {
        throw new Error('ID del niño no válido');
      }

      // Llamar a la función upsert_emotional_diary con los parámetros exactos que espera
      const { data, error: upsertError } = await supabase.rpc('upsert_emotional_diary', {
        p_user_id: user.id,
        p_child_id: finalChildId,
        p_emotion_name: emotionName,
        p_observations: observations || null,
        p_entry_date: formatDateToLocalString(date) // Formato YYYY-MM-DD preservando zona horaria local
      });

      if (upsertError) throw upsertError;

      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener entradas del mes
  const getMonthEntries = useCallback(async (
    year: number,
    month: number
  ): Promise<EmotionalEntry[]> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // Calcular primer y último día del mes
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      const { data, error } = await supabase
        .from('emotional_diary')
        .select('*')
        .eq('user_id', user.id)
        .gte('entry_date', formatDateToLocalString(startDate))
        .lte('entry_date', formatDateToLocalString(endDate))
        .order('entry_date', { ascending: true });

      if (error) throw error;

      return data || [];
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener entrada de un día específico
  const getDayEntry = useCallback(async (
    date: Date
  ): Promise<EmotionalEntry | null> => {
    try {
      setLoading(true);
      setError(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // Usar maybeSingle() en lugar de single() para evitar errores cuando no hay datos
      const { data, error } = await supabase
        .from('emotional_diary')
        .select('*')
        .eq('user_id', user.id)
        .eq('entry_date', formatDateToLocalString(date))
        .maybeSingle(); // Esto no lanza error si no hay datos

      if (error) throw error;

      // Si no hay datos, data será null (no error)
      return data;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    EMOTIONS_CONFIG,
    saveEmotionEntry,
    getMonthEntries,
    getDayEntry,
    loading,
    error,
    clearError: () => setError(null)
  };
};
