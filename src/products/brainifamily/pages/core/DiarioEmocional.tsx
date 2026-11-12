import React, { useState, useEffect } from 'react';
import Backgrounds from '@/shared/components/Backgrounds';
import EmotionSelector from '@/products/brainifamily/features/emotionalDiary/EmotionSelector';
import EmotionEntry from '@/products/brainifamily/features/emotionalDiary/EmotionEntry';
import EmotionCalendar from '@/products/brainifamily/features/emotionalDiary/EmotionCalendar';
import { useEmotionalDiary } from '@/products/brainifamily/hooks/useEmotionalDiary';
import type { EmotionalEntry } from '@/integrations/supabase/queries/emotional-diary';
import { useCurrentChild } from '@/products/brainifamily/hooks/useCurrentChild';
import { useToast } from '@/shared/hooks/use-toast';
import ChildSwitcher from '@/products/brainifamily/features/children/ChildSwitcher';

/** «Hoy, jueves 12 de noviembre» o el día elegido en el calendario. */
function formatDayLabel(date: Date): string {
  const label = date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday ? `Hoy, ${label}` : label.charAt(0).toUpperCase() + label.slice(1);
}

const DiarioEmocional = () => {
  const { toast } = useToast();
  const { child, childId } = useCurrentChild();
  const {
    EMOTIONS_CONFIG,
    saveEmotionEntry,
    getMonthEntries,
    getDayEntry,
    loading,
    error,
    clearError
  } = useEmotionalDiary(childId);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmotions, setSelectedEmotions] = useState<{ id: number; name: string; imageUrl: string; color: string; description: string }[]>([]);
  const [observations, setObservations] = useState('');
  const [monthEntries, setMonthEntries] = useState<EmotionalEntry[]>([]);
  const [currentMonth, setCurrentMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

  // Recargar entradas del mes al cambiar mes o hijo seleccionado
  useEffect(() => {
    loadMonthEntries();
  }, [currentMonth, childId]);

  // Recargar entrada del día al cambiar fecha o hijo seleccionado
  useEffect(() => {
    loadDayEntry();
  }, [selectedDate, childId]);

  // Cargar entradas del mes
  const loadMonthEntries = async () => {
    const entries = await getMonthEntries(currentMonth.year, currentMonth.month);
    setMonthEntries(entries);
  };

  // Cargar entrada del día (emotion_names es array)
  const loadDayEntry = async () => {
    const entry = await getDayEntry(selectedDate);
    const names = Array.isArray(entry?.emotion_names) ? entry.emotion_names : [];
    if (names.length > 0) {
      const configs = names
        .map((name: string) => EMOTIONS_CONFIG.find(e => e.name === name))
        .filter(Boolean) as { id: number; name: string; imageUrl: string; color: string; description: string }[];
      setSelectedEmotions(configs);
    } else {
      setSelectedEmotions([]);
    }
    setObservations(entry?.observations ?? '');
  };

  // Cambiar mes del calendario
  const handleMonthChange = (year: number, month: number) => {
    setCurrentMonth({ year, month });
  };

  // Seleccionar fecha del calendario
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Toggle emoción (añadir o quitar de la selección)
  const handleEmotionSelect = (emotion: { id: number; name: string; imageUrl: string; color: string; description: string }) => {
    setSelectedEmotions(prev =>
      prev.some(e => e.id === emotion.id)
        ? prev.filter(e => e.id !== emotion.id)
        : [...prev, emotion]
    );
  };

  // Cambiar observaciones
  const handleObservationsChange = (newObservations: string) => {
    setObservations(newObservations);
  };

  // Formatear fecha a YYYY-MM-DD (para comparar con entry_date del backend)
  const formatEntryDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Guardar entrada (una o varias emociones)
  const handleSave = async () => {
    if (selectedEmotions.length === 0) {
      toast({
        title: "Elige una emoción",
        description: "Para guardar el día, elige al menos una emoción.",
        variant: "destructive"
      });
      return;
    }

    const emotionNames = selectedEmotions.map(e => e.name);
    const entryDateStr = formatEntryDate(selectedDate);

    // Actualización optimista: actualizar el calendario al instante con los datos que vamos a guardar
    const nowIso = new Date().toISOString();
    const optimisticEntry: EmotionalEntry = {
      id: -1,
      user_id: '',
      child_id: childId ?? '',
      entry_date: entryDateStr,
      emotion_names: emotionNames,
      observations: observations || null,
      created_at: nowIso,
      updated_at: nowIso,
    };
    setMonthEntries((prev) => {
      const withoutDate = prev.filter((e) => e.entry_date !== entryDateStr);
      return [...withoutDate, optimisticEntry].sort((a, b) =>
        a.entry_date.localeCompare(b.entry_date)
      );
    });

    try {
      const result = await saveEmotionEntry(selectedDate, emotionNames, observations);

      if (result) {
        toast({
          title: "Emociones guardadas",
          description: emotionNames.length === 1
            ? "Puedes verla en el calendario del mes."
            : "Puedes verlas en el calendario del mes.",
        });
        // Sustituir la entrada optimista por la respuesta del servidor (con id, etc.)
        setMonthEntries((prev) => {
          const withoutDate = prev.filter((e) => e.entry_date !== entryDateStr);
          return [...withoutDate, result].sort((a, b) =>
            a.entry_date.localeCompare(b.entry_date)
          );
        });
      } else {
        // Si falló el guardado, revertir la actualización optimista
        loadMonthEntries();
      }
    } catch (err) {
      toast({
        title: "No se han guardado las emociones",
        description: "Revisa la conexión y vuelve a pulsar «Guardar emociones».",
        variant: "destructive"
      });
      // Revertir: volver a cargar desde el servidor
      loadMonthEntries();
    }
  };

  // Limpiar error si existe
  useEffect(() => {
    if (error) {
      toast({
        title: "No se ha podido cargar el diario",
        description: error || "Revisa la conexión y recarga la página.",
        variant: "destructive"
      });
      clearError();
    }
  }, [error, toast, clearError]);

  return (
    <Backgrounds
      wrapWithCard
      tone="turquoise"
      title="Así me siento hoy"
      subtitle={
        child?.nombre
          ? `Registra cómo se siente ${child.nombre} cada día y mira cómo cambia a lo largo del mes.`
          : childId
            ? 'Cargando...'
            : 'Elige a tu hijo o hija para ver su diario.'
      }
      actions={<ChildSwitcher />}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6 items-start">
        {/* Protagonista: el registro del día */}
        <section aria-labelledby="diario-dia" className="bg-white rounded-2xl shadow-surface p-5 sm:p-7 space-y-7">
          <p id="diario-dia" className="text-base font-semibold text-braini-turquoise-strong">
            {formatDayLabel(selectedDate)}
          </p>

          <EmotionSelector
            emotions={EMOTIONS_CONFIG}
            selectedEmotions={selectedEmotions}
            onEmotionSelect={handleEmotionSelect}
            disabled={loading || !childId}
            childName={child?.nombre ?? ''}
          />

          <EmotionEntry
            observations={observations}
            onObservationsChange={handleObservationsChange}
            disabled={selectedEmotions.length === 0}
            childName={child?.nombre ?? ''}
          />

          <button
            type="button"
            onClick={handleSave}
            disabled={selectedEmotions.length === 0 || loading || !childId}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-base transition-colors bg-braini-turquoise-strong text-white hover:bg-ink disabled:bg-ink/10 disabled:text-ink/50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
          >
            {loading ? 'Guardando…' : 'Guardar emociones'}
          </button>
          {selectedEmotions.length === 0 && !loading && (
            <p className="-mt-4 text-sm text-ink/70">Elige al menos una emoción para guardar el día.</p>
          )}
        </section>

        {/* Secundario: el mes */}
        <EmotionCalendar
          currentDate={new Date(currentMonth.year, currentMonth.month - 1)}
          monthEntries={monthEntries}
          emotionsConfig={EMOTIONS_CONFIG}
          onDateSelect={handleDateSelect}
          onMonthChange={handleMonthChange}
          selectedDate={selectedDate}
        />
      </div>
    </Backgrounds>
  );
};

export default DiarioEmocional;
