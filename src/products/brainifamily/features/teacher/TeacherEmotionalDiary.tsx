import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

interface EmotionalEntry {
  id: number;
  entry_date: string;
  emotion_names: string[];
  observations: string | null;
}

interface TeacherEmotionalDiaryProps {
  childId: string;
}

const formatDate = (dateStr: string) =>
  new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

const TeacherEmotionalDiary: React.FC<TeacherEmotionalDiaryProps> = ({ childId }) => {
  const [entries, setEntries] = useState<EmotionalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);

  const loadMonth = useCallback(async () => {
    if (!childId) return;
    setLoading(true);
    setError(null);
    try {
      const start = `${year}-${String(month).padStart(2, '0')}-01`;
      const lastDay = new Date(year, month, 0).getDate();
      const end = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;

      const { data, error: fetchError } = await supabase
        .from('emotional_diary')
        .select('id, entry_date, emotion_names, observations')
        .eq('child_id', childId)
        .gte('entry_date', start)
        .lte('entry_date', end)
        .order('entry_date', { ascending: false });

      if (fetchError) throw fetchError;
      setEntries((data ?? []) as EmotionalEntry[]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar el diario');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [childId, year, month]);

  useEffect(() => {
    loadMonth();
  }, [loadMonth]);

  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
  ];
  const years = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Diario emocional</CardTitle>
        <div className="flex flex-wrap gap-2 pt-2">
          <Select value={String(month)} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m, i) => (
                <SelectItem key={m} value={String(i + 1)}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(year)} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>{y}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="py-8 text-center text-gray-500">Cargando entradas...</div>
        )}
        {error && (
          <div className="py-4 text-center text-red-600">{error}</div>
        )}
        {!loading && !error && entries.length === 0 && (
          <div className="py-8 text-center text-gray-500">
            No hay entradas en este mes.
          </div>
        )}
        {!loading && !error && entries.length > 0 && (
          <ul className="space-y-3">
            {entries.map((e) => (
              <li
                key={e.id}
                className="p-3 rounded-lg border border-gray-200 bg-gray-50/50"
              >
                <div className="font-medium text-gray-800">{formatDate(e.entry_date)}</div>
                <div className="text-sm text-gray-600 mt-1">
                  Emociones: {e.emotion_names?.length ? e.emotion_names.join(', ') : '—'}
                </div>
                {e.observations && (
                  <div className="text-sm text-gray-500 mt-1 italic">{e.observations}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default TeacherEmotionalDiary;
