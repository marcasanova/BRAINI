import React, { useState, useEffect } from 'react';
import Backgrounds from '@/components/Backgrounds';
import EmotionSelector from '@/components/emotionalDiary/EmotionSelector';
import EmotionEntry from '@/components/emotionalDiary/EmotionEntry';
import EmotionCalendar from '@/components/emotionalDiary/EmotionCalendar';
import { useEmotionalDiary } from '@/hooks/useEmotionalDiary';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

const DiarioEmocional = () => {
  const { toast } = useToast();
  const {
    EMOTIONS_CONFIG,
    saveEmotionEntry,
    getMonthEntries,
    getDayEntry,
    loading,
    error,
    clearError
  } = useEmotionalDiary();

  // Estados del componente (varias emociones por día)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmotions, setSelectedEmotions] = useState<{ id: number; name: string; imageUrl: string; color: string; description: string }[]>([]);
  const [observations, setObservations] = useState('');
  const [monthEntries, setMonthEntries] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });
  const [childName, setChildName] = useState<string>('');

  // Cargar nombre del child
  useEffect(() => {
    const fetchChildName = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: childData } = await supabase
          .from('children')
          .select('nombre')
          .eq('parent_id', user.id)
          .single();

        if (childData?.nombre) {
          setChildName(childData.nombre);
        }
      } catch (err) {
        console.error('Error al cargar el nombre del child:', err);
      }
    };

    fetchChildName();
  }, []);

  // Cargar entradas del mes actual al montar el componente
  useEffect(() => {
    loadMonthEntries();
  }, [currentMonth]);

  // Cargar entrada del día seleccionado
  useEffect(() => {
    loadDayEntry();
  }, [selectedDate]);

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
        title: "😊 Paramos un momento",
        description: "Antes de guardar, elige al menos una emoción para este día.",
        variant: "destructive"
      });
      return;
    }

    const emotionNames = selectedEmotions.map(e => e.name);
    const entryDateStr = formatEntryDate(selectedDate);

    // Actualización optimista: actualizar el calendario al instante con los datos que vamos a guardar
    const optimisticEntry = {
      entry_date: entryDateStr,
      emotion_names: emotionNames,
      observations: observations || null
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
          title: "✨ Emociones registradas",
          description: emotionNames.length === 1
            ? "La emoción de hoy ha quedado registrada. Gracias por cuidar sus emociones."
            : "Las emociones de hoy han quedado registradas. Gracias por cuidar sus emociones.",
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
        title: "🌱 No se ha guardado aún",
        description: "No se ha podido guardar en este momento. ¿Lo intentamos de nuevo?",
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
        title: "❌ Error en el diario emocional",
        description: error || "Ha ocurrido un error inesperado. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
      clearError();
    }
  }, [error, toast, clearError]);

  return (
    <Backgrounds 
      wrapWithCard={true}
      enableInternalScroll={true}
      customColor="#35bdb1"
      showCircles={true}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 flex-1 flex flex-col min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col min-h-0">
            {/* Header con título - Fijo en la parte superior */}
            <div className="mb-6 md:mb-8 animate-fade-in flex-shrink-0">
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2" style={{ fontWeight: 900 }}>
                    Diario Emocional
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium">
                    {childName 
                      ? (
                        <>
                          Registra y observa las emociones de <span className="font-black" style={{ fontWeight: 800 }}>{childName}</span> día a día
                        </>
                      )
                      : 'Registra y observa las emociones día a día'
                    }
                  </p>
                </div>
              </div>
            </div>

          {/* Área de contenido con scroll */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Grid simétrico de dos columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 pb-20 md:pb-4">
            {/* Columna izquierda: Selector de emociones y observaciones */}
            <div className="flex flex-col space-y-4 sm:space-y-5 md:space-y-6">
              {/* Selector de emociones */}
              <div className="flex-shrink-0">
                <EmotionSelector
                  emotions={EMOTIONS_CONFIG}
                  selectedEmotions={selectedEmotions}
                  onEmotionSelect={handleEmotionSelect}
                  disabled={loading}
                  childName={childName}
                />
              </div>

              {/* Formulario de observaciones */}
              <div className="flex-1">
                <EmotionEntry
                  observations={observations}
                  onObservationsChange={handleObservationsChange}
                  disabled={selectedEmotions.length === 0}
                  childName={childName}
                />
              </div>

              {/* Botón de guardar */}
              <div className="flex-shrink-0 flex justify-center pt-2">
                <button
                  onClick={handleSave}
                  disabled={selectedEmotions.length === 0 || loading}
                  className={`
                    w-full max-w-md px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base md:text-lg transition-all duration-300 transform
                    ${selectedEmotions.length > 0 && !loading
                      ? 'bg-white border-2 border-braini-turquoise text-braini-turquoise hover:bg-braini-turquoise hover:text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed border-2 border-gray-300'
                    }
                  `}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm sm:text-base">Guardando...</span>
                    </div>
                  ) : (
                    'Guardar emociones del día'
                  )}
                </button>
              </div>
            </div>

            {/* Columna derecha: Calendario */}
            <div className="flex flex-col">
              <div className="h-full">
                <EmotionCalendar
                  currentDate={new Date(currentMonth.year, currentMonth.month - 1)}
                  monthEntries={monthEntries}
                  emotionsConfig={EMOTIONS_CONFIG}
                  onDateSelect={handleDateSelect}
                  onMonthChange={handleMonthChange}
                  selectedDate={selectedDate}
                />
              </div>
            </div>
          </div>
            </div>
          </div>
        </div>
      </div>
    </Backgrounds>
  );
};

export default DiarioEmocional;
