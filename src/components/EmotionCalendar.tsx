import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

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
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month - 1, 1).getDay();
  };

  const getEmotionColor = (emotionName: string) => {
    const emotion = emotionsConfig.find(e => e.name === emotionName);
    return emotion?.color || '#E5E7EB';
  };

  const getEmotionForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return monthEntries.find(entry => entry.entry_date === dateString);
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
      days.push(<div key={`empty-${i}`} className="h-12" />);
    }
    
    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      const entry = getEmotionForDate(date);
      const emotionColor = entry ? getEmotionColor(entry.emotion_name) : '#E5E7EB';
      const hasEntry = !!entry;
      
      days.push(
        <button
          key={day}
          onClick={() => onDateSelect(date)}
          className={`
            relative h-12 rounded-lg transition-all duration-200 text-sm font-medium
            ${isSelected(date) 
              ? 'ring-2 ring-braini-blue bg-braini-blue/10' 
              : 'hover:bg-gray-50'
            }
            ${isToday(date) ? 'font-bold' : ''}
          `}
        >
          <span className={`
            absolute top-1 left-1 text-xs
            ${isToday(date) ? 'text-braini-blue' : 'text-gray-700'}
          `}>
            {day}
          </span>
          
          {/* Indicador de emoción */}
          {hasEntry && (
            <div 
              className="absolute bottom-1 left-1 right-1 h-2 rounded-full"
              style={{ backgroundColor: emotionColor }}
            />
          )}
          
          {/* Indicador de observaciones */}
          {entry?.observations && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
          )}
        </button>
      );
    }
    
    return days;
  };

  return (
    <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
          <Calendar className="w-5 h-5 text-braini-blue" />
          Calendario Emocional
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Navegación del mes */}
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigateMonth('prev')}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:border-braini-blue"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Mes anterior
          </Button>
          
          <h3 className="text-lg font-semibold text-gray-800 capitalize">
            {getMonthName(currentDate)}
          </h3>
          
          <Button
            onClick={() => navigateMonth('next')}
            variant="outline"
            size="sm"
            className="border-gray-300 text-gray-700 hover:border-braini-blue"
          >
            Mes siguiente
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        
        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendario */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendarDays()}
        </div>
        
        {/* Leyenda */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Leyenda:</h4>
          <div className="flex flex-wrap gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              <span>Con observaciones</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-400 rounded-full" />
              <span>Sin registro</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-braini-blue rounded-full" />
              <span>Hoy seleccionado</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmotionCalendar;
