import React, { useState, useEffect } from 'react';
import Backgrounds from '@/components/Backgrounds';
import EmotionSelector from '@/components/emotionalDiary/EmotionSelector';
import EmotionEntry from '@/components/emotionalDiary/EmotionEntry';
import EmotionCalendar from '@/components/emotionalDiary/EmotionCalendar';
import { useEmotionalDiary } from '@/hooks/useEmotionalDiary';
import { useToast } from '@/hooks/use-toast';

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

  // Estados del componente
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEmotion, setSelectedEmotion] = useState<any>(null);
  const [observations, setObservations] = useState('');
  const [monthEntries, setMonthEntries] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1
  });

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

  // Cargar entrada del día
  const loadDayEntry = async () => {
    const entry = await getDayEntry(selectedDate);
    if (entry) {
      setSelectedEmotion(EMOTIONS_CONFIG.find(e => e.name === entry.emotion_name));
      setObservations(entry.observations || '');
    } else {
      setSelectedEmotion(null);
      setObservations('');
    }
  };

  // Cambiar mes del calendario
  const handleMonthChange = (year: number, month: number) => {
    setCurrentMonth({ year, month });
  };

  // Seleccionar fecha del calendario
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // Seleccionar emoción
  const handleEmotionSelect = (emotion: any) => {
    setSelectedEmotion(emotion);
  };

  // Cambiar observaciones
  const handleObservationsChange = (newObservations: string) => {
    setObservations(newObservations);
  };

  // Guardar entrada
  const handleSave = async () => {
    if (!selectedEmotion) {
      toast({
        title: "Emoción no seleccionada",
        description: "Por favor selecciona una emoción antes de guardar",
        variant: "destructive"
      });
      return;
    }

    try {
      const result = await saveEmotionEntry(
        selectedDate,
        selectedEmotion.name,
        observations
      );

      if (result) {
        toast({
          title: "¡Emoción registrada!",
          description: `Se ha guardado la emoción "${selectedEmotion.name}" para ${selectedDate.toLocaleDateString('es-ES')}`,
        });

        // Recargar entradas del mes para actualizar el calendario
        await loadMonthEntries();
      }
    } catch (err) {
      toast({
        title: "Error al guardar",
        description: "No se pudo guardar la emoción. Inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  // Limpiar error si existe
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
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
                    Registra y observa las emociones de tu hijo/a día a día
                  </p>
                </div>
              </div>
            </div>

          {/* Área de contenido con scroll */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Grid simétrico de dos columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 pb-4">
            {/* Columna izquierda: Selector de emociones y observaciones */}
            <div className="flex flex-col space-y-6">
              {/* Selector de emociones */}
              <div className="flex-shrink-0">
                <EmotionSelector
                  emotions={EMOTIONS_CONFIG}
                  selectedEmotion={selectedEmotion}
                  onEmotionSelect={handleEmotionSelect}
                  disabled={loading}
                />
              </div>

              {/* Formulario de observaciones */}
              <div className="flex-1">
                <EmotionEntry
                  observations={observations}
                  onObservationsChange={handleObservationsChange}
                  disabled={!selectedEmotion}
                />
              </div>

              {/* Botón de guardar */}
              <div className="flex-shrink-0 flex justify-center pt-2">
                <button
                  onClick={handleSave}
                  disabled={!selectedEmotion || loading}
                    className={`
                    w-full max-w-md px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform
                    ${selectedEmotion && !loading
                      ? 'bg-braini-turquoise hover:bg-braini-turquoise-dark text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Guardando...
                    </div>
                  ) : (
                    'Guardar Emoción del Día'
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
