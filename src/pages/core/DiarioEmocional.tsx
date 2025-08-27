import React, { useState, useEffect } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import Navbar from '@/components/navigation/Navbar';
import EmotionSelector from '@/components/emotionalDiary/EmotionSelector';
import EmotionEntry from '@/components/emotionalDiary/EmotionEntry';
import EmotionCalendar from '@/components/emotionalDiary/EmotionCalendar';
import { useEmotionalDiary } from '@/hooks/useEmotionalDiary';
import { useToast } from '@/hooks/use-toast';
import { Heart, Calendar } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 md:pl-80 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-braini-blue to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              <span className="text-braini-blue">Diario Emocional</span>
            </h1>
            <p className="text-xl text-gray-600">
              Registra y observa las emociones de tu hijo/a día a día
            </p>
          </div>

          {/* Fecha seleccionada */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md border border-gray-200">
              <Calendar className="w-5 h-5 text-braini-blue" />
              <span className="font-medium text-gray-700">
                {selectedDate.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Columna izquierda: Selector de emociones y observaciones */}
            <div className="space-y-6">
              {/* Selector de emociones */}
              <EmotionSelector
                emotions={EMOTIONS_CONFIG}
                selectedEmotion={selectedEmotion}
                onEmotionSelect={handleEmotionSelect}
                disabled={loading}
              />

              {/* Formulario de observaciones */}
              <EmotionEntry
                observations={observations}
                onObservationsChange={handleObservationsChange}
                disabled={!selectedEmotion}
              />

              {/* Botón de guardar */}
              <div className="flex justify-center">
                <button
                  onClick={handleSave}
                  disabled={!selectedEmotion || loading}
                  className={`
                    px-8 py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform
                    ${selectedEmotion && !loading
                      ? 'bg-gradient-to-r from-braini-blue to-purple-600 hover:from-braini-blue-dark hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }
                  `}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
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
            <div>
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
  );
};

export default DiarioEmocional;
