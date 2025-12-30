import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar, Edit3 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

interface EmotionCalendarProps {
  currentDate: Date;
  monthEntries: EmotionalEntry[];
  emotionsConfig: EmotionConfig[];
  onDateSelect: (date: Date) => void;
  onMonthChange: (year: number, month: number) => void;
  selectedDate: Date;
}

const EmotionCalendar: React.FC<EmotionCalendarProps> = ({
  currentDate,
  monthEntries,
  emotionsConfig,
  onDateSelect,
  onMonthChange,
  selectedDate
}) => {
  const getMonthName = (date: Date) => {
    const month = date.toLocaleDateString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    // Capitalizar solo la primera letra del mes
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    return `${capitalizedMonth} ${year}`;
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const getEmotionColor = (emotionName: string) => {
    // Colores específicos para cada emoción (basados en la imagen compartida)
    const emotionColors: { [key: string]: string } = {
      'Alegría': '#FFD93D',    // Amarillo brillante (sun-like)
      'Tristeza': '#74B9FF',   // Azul claro (light blue)
      'Miedo': '#5F8DCA',      // Azul medio (con sombra oscura)
      'Pena': '#81C7E8',       // Azul claro (con corazón roto)
      'Rabia': '#FF6B6B'       // Rojo intenso (con llamas)
    };
    
    return emotionColors[emotionName] || '#E5E7EB';
  };

  const getEmotionForDate = (date: Date) => {
    const dateString = formatDateToLocalString(date);
    return monthEntries.find(entry => entry.entry_date === dateString);
  };

  // Función para formatear fecha preservando zona horaria local
  const formatDateToLocalString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    onMonthChange(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const renderCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Días vacíos del mes anterior
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 sm:h-12" />);
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const entry = getEmotionForDate(date);
      const emotionColor = entry ? getEmotionColor(entry.emotion_name) : '#E5E7EB';
      const hasEntry = !!entry;
      
      days.push(
        <TooltipProvider key={day}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => onDateSelect(date)}
                className={`
                  relative h-10 sm:h-12 rounded-lg transition-all duration-200 text-sm font-medium
                  ${isSelected(date) 
                    ? '' 
                    : 'hover:bg-gray-50'
                  }
                  ${isToday(date) ? 'font-bold' : ''}
                `}
                style={isSelected(date) ? {
                  boxShadow: '0 0 0 2px #35bdb1',
                  backgroundColor: '#35bdb120'
                } : {}}
              >
                <span className={`
                  absolute top-0.5 left-0.5 sm:top-1 sm:left-1 text-[10px] sm:text-xs
                  ${isToday(date) ? 'text-braini-blue' : 'text-gray-700'}
                `}>
                  {day}
                </span>
                
                {/* Indicador de emoción - más prominente */}
                {hasEntry && (
                  <div 
                    className="absolute bottom-0.5 left-0.5 right-0.5 sm:bottom-1 sm:left-1 sm:right-1 h-2 sm:h-3 rounded-full shadow-sm"
                    style={{ backgroundColor: emotionColor }}
                  />
                )}
                
                {/* Indicador de observaciones */}
                {entry?.observations && (
                  <div className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1">
                    <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600" strokeWidth={2.5} />
                  </div>
                )}
              </button>
            </TooltipTrigger>
            
            {/* Tooltip con información de la emoción */}
            {hasEntry && (
              <TooltipContent side="top" className="bg-gray-800 text-white text-sm px-3 py-2">
                <div className="text-center">
                  <div className="font-medium">{entry.emotion_name}</div>
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return days;
  };

  return (
    <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-gray-800">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-braini-blue" />
          Calendario Emocional
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {/* Navegación del mes */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 gap-1 sm:gap-2">
          <Button
            onClick={() => navigateMonth('prev')}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:border-braini-blue flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>
          
          <h3 className="text-xs sm:text-sm md:text-lg font-semibold text-gray-800 text-center flex-1 min-w-0 px-1 sm:px-2">
            {getMonthName(currentDate)}
          </h3>
          
          <Button
            onClick={() => navigateMonth('next')}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:border-braini-blue flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1" />
          </Button>
        </div>
        
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-[10px] sm:text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendario */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {renderCalendarDays()}
        </div>
        
        {/* Leyenda Simplificada - Solo Emociones */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-200">
          <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
            Emociones del Calendario
          </h4>
          
          {/* Grid: 3 columnas en todas las pantallas (2 filas: 3+2) */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg border border-gray-100">
              <div className="h-2.5 sm:h-3 rounded-full shadow-sm flex-shrink-0" style={{ width: '28px', backgroundColor: '#FFD93D' }} />
              <span className="text-[10px] sm:text-xs text-gray-700 font-medium">Alegría</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg border border-gray-100">
              <div className="h-2.5 sm:h-3 rounded-full shadow-sm flex-shrink-0" style={{ width: '28px', backgroundColor: '#74B9FF' }} />
              <span className="text-[10px] sm:text-xs text-gray-700 font-medium">Tristeza</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg border border-gray-100">
              <div className="h-2.5 sm:h-3 rounded-full shadow-sm flex-shrink-0" style={{ width: '28px', backgroundColor: '#5F8DCA' }} />
              <span className="text-[10px] sm:text-xs text-gray-700 font-medium">Miedo</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg border border-gray-100">
              <div className="h-2.5 sm:h-3 rounded-full shadow-sm flex-shrink-0" style={{ width: '28px', backgroundColor: '#81C7E8' }} />
              <span className="text-[10px] sm:text-xs text-gray-700 font-medium">Pena</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg border border-gray-100">
              <div className="h-2.5 sm:h-3 rounded-full shadow-sm flex-shrink-0" style={{ width: '28px', backgroundColor: '#FF6B6B' }} />
              <span className="text-[10px] sm:text-xs text-gray-700 font-medium">Rabia</span>
            </div>
          </div>
          
          {/* Indicador de observaciones */}
          <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2 p-1.5 sm:p-2 bg-white rounded-lg border border-gray-100">
              <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600 flex-shrink-0" strokeWidth={2.5} />
              <span className="text-[10px] sm:text-xs text-gray-700 font-medium">Días con observaciones</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionCalendar;
