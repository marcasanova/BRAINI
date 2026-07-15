import React from 'react';
import { ActivityListProps } from '@/products/brainifamily/hooks/useUserActivities';
import { Star, CheckCircle } from 'lucide-react';

const ActivityList: React.FC<ActivityListProps> = ({ 
  activities, 
  onActivityClick, 
  loading = false 
}) => {
  if (loading) {
    return (
      <div className="text-center text-gray-500 py-8">
        Cargando actividades...
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center text-gray-400 py-8">
        No hay actividades disponibles para esta misión.
      </div>
    );
  }

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'inteligencia_emocional':
        return 'Inteligencia Emocional';
      case 'regulacion_emocional':
        return 'Regulación Emocional';
      case 'vinculo_afectivo':
        return 'Vínculo Afectivo';
      case 'acompañamiento_emocional':
        return 'Acompañamiento Emocional';
      default:
        return 'Actividad';
    }
  };

  // Función para obtener el número de actividad según tipo
  const getActivityNumber = (type: string): number | null => {
    switch (type) {
      case 'inteligencia_emocional':
        return 1;
      case 'regulacion_emocional':
        return 2;
      case 'vinculo_afectivo':
        return 3;
      case 'acompañamiento_emocional':
        return 4;
      default:
        return null;
    }
  };

  // Función para obtener clases del número según tipo
  const getNumberClasses = (type: string) => {
    const baseClasses = 'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 font-black text-sm';
    
    switch (type) {
      case 'inteligencia_emocional':
        return `${baseClasses} bg-braini-blue/20 text-braini-blue-dark`;
      case 'regulacion_emocional':
        return `${baseClasses} bg-braini-turquoise/20 text-braini-turquoise-dark`;
      case 'vinculo_afectivo':
        return `${baseClasses} bg-braini-pink/20 text-braini-pink-dark`;
      case 'acompañamiento_emocional':
        return `${baseClasses} bg-braini-yellow/20 text-braini-yellow-dark`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  // Calcular progreso
  const completedCount = activities.filter(a => a.puntuacion && a.puntuacion > 0).length;
  const totalCount = activities.length;
  const allCompleted = completedCount === totalCount && totalCount > 0;

  // Función para obtener el mensaje de progreso
  const getProgressMessage = (completed: number, total: number) => {
    if (total !== 4) return null; // Solo mostrar mensajes para misiones con 4 actividades
    
    switch (completed) {
      case 0:
        return { text: "La misión acaba de empezar", icon: null };
      case 1:
        return { text: "¡Buen comienzo!", icon: null };
      case 2:
        return { text: "Seguimos avanzando", icon: null };
      case 3:
        return { text: "¡Ya casi lo conseguimos!", icon: null };
      case 4:
        return { text: "¡Misión completada! 🎉", icon: null };
      default:
        return null;
    }
  };

  const progressMessage = getProgressMessage(completedCount, totalCount);

  // Función para obtener clases de card según tipo
  const getCardClasses = (type: string) => {
    const baseClasses = 'p-6 rounded-2xl shadow-md flex flex-col gap-3 border-2 transition-all duration-300 cursor-pointer group';
    
    switch (type) {
      case 'inteligencia_emocional':
        return `${baseClasses} bg-linear-to-br from-braini-blue/5 to-braini-blue/10 border-braini-blue/30 hover:shadow-xl hover:border-braini-blue/50`;
      case 'regulacion_emocional':
        return `${baseClasses} bg-linear-to-br from-braini-turquoise/5 to-braini-turquoise/10 border-braini-turquoise/30 hover:shadow-xl hover:border-braini-turquoise/50`;
      case 'vinculo_afectivo':
        return `${baseClasses} bg-linear-to-br from-braini-pink/5 to-braini-pink/10 border-braini-pink/30 hover:shadow-xl hover:border-braini-pink/50`;
      case 'acompañamiento_emocional':
        return `${baseClasses} bg-linear-to-br from-braini-yellow/5 to-braini-yellow/10 border-braini-yellow/30 hover:shadow-xl hover:border-braini-yellow/50`;
      default:
        return `${baseClasses} bg-white border-gray-200 hover:shadow-lg hover:border-gray-300`;
    }
  };

  // Función para obtener clases de badge según tipo
  const getBadgeClasses = (type: string) => {
    const baseClasses = 'px-3 py-1.5 rounded-full text-xs font-bold border-2';
    
    switch (type) {
      case 'inteligencia_emocional':
        return `${baseClasses} bg-braini-blue/20 text-braini-blue-dark border-braini-blue/40`;
      case 'regulacion_emocional':
        return `${baseClasses} bg-braini-turquoise/20 text-braini-turquoise-dark border-braini-turquoise/40`;
      case 'vinculo_afectivo':
        return `${baseClasses} bg-braini-pink/20 text-braini-pink-dark border-braini-pink/40`;
      case 'acompañamiento_emocional':
        return `${baseClasses} bg-braini-yellow/20 text-braini-yellow-dark border-braini-yellow/40`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 border-gray-200`;
    }
  };

  // Función para obtener clases de título según tipo
  const getTitleClasses = (type: string) => {
    const baseClasses = 'font-black text-xl sm:text-2xl mb-2 transition-colors';
    
    switch (type) {
      case 'inteligencia_emocional':
        return `${baseClasses} text-braini-blue-dark group-hover:text-braini-blue`;
      case 'regulacion_emocional':
        return `${baseClasses} text-braini-turquoise-dark group-hover:text-braini-turquoise`;
      case 'vinculo_afectivo':
        return `${baseClasses} text-braini-pink-dark group-hover:text-braini-pink`;
      case 'acompañamiento_emocional':
        return `${baseClasses} text-braini-yellow-dark group-hover:text-braini-yellow`;
      default:
        return `${baseClasses} text-gray-800 group-hover:text-gray-900`;
    }
  };

  // Función para obtener clases de icono según tipo
  const getIconClasses = (type: string) => {
    const baseClasses = 'w-10 h-10 rounded-full flex items-center justify-center transition-colors';
    const iconBaseClasses = 'w-5 h-5 group-hover:scale-110 transition-transform';
    
    switch (type) {
      case 'inteligencia_emocional':
        return {
          container: `${baseClasses} bg-braini-blue/20 group-hover:bg-braini-blue/30`,
          icon: `${iconBaseClasses} text-braini-blue`
        };
      case 'regulacion_emocional':
        return {
          container: `${baseClasses} bg-braini-turquoise/20 group-hover:bg-braini-turquoise/30`,
          icon: `${iconBaseClasses} text-braini-turquoise`
        };
      case 'vinculo_afectivo':
        return {
          container: `${baseClasses} bg-braini-pink/20 group-hover:bg-braini-pink/30`,
          icon: `${iconBaseClasses} text-braini-pink`
        };
      case 'acompañamiento_emocional':
        return {
          container: `${baseClasses} bg-braini-yellow/20 group-hover:bg-braini-yellow/30`,
          icon: `${iconBaseClasses} text-braini-yellow`
        };
      default:
        return {
          container: `${baseClasses} bg-gray-100 group-hover:bg-gray-200`,
          icon: `${iconBaseClasses} text-gray-600`
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Indicador de progreso */}
      <div className="mb-6 p-4 sm:p-5 bg-linear-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/60 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-gray-700">Progreso de esta misión</span>
          <span className="text-sm font-bold text-braini-blue">{completedCount} / {totalCount}</span>
        </div>
        <div className="w-full bg-gray-200/80 rounded-full h-3 overflow-hidden shadow-inner">
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out bg-linear-to-r from-braini-blue to-braini-blue-dark shadow-xs relative overflow-hidden"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          >
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
          </div>
        </div>
        {progressMessage && (
          <div className="flex items-center gap-2 text-braini-blue-dark font-semibold text-sm mt-3">
            {progressMessage.icon && <progressMessage.icon className="w-5 h-5" />}
            <span>{progressMessage.text}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {activities.map((userActivity) => {
          const activity = userActivity.activities;
          const isRated = !!userActivity.puntuacion;
          const activityType = activity.tipo_actividad || '';
          const iconClasses = getIconClasses(activityType);

          return (
            <div
              key={activity.id}
              onClick={() => onActivityClick(activity.id)}
              className={getCardClasses(activityType)}
            >
            {/* Header con tipo y estado */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className={getBadgeClasses(activityType)}>
                    {getActivityNumber(activityType) !== null && (
                      <span className="mr-1.5">{getActivityNumber(activityType)}.</span>
                    )}
                    {getActivityTypeLabel(activityType)}
                  </span>
                  
                  {/* Indicador de valoración con estrellas (oculto en móvil) */}
                  {isRated && userActivity.puntuacion && (
                    <div className="hidden md:flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= userActivity.puntuacion! 
                                ? 'text-braini-yellow fill-current' 
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {userActivity.puntuacion}/5
                      </span>
                    </div>
                  )}
                </div>

                <h3 className={getTitleClasses(activityType)} style={{ fontWeight: 900 }}>
                  {activity.titulo_actividad}
                </h3>
                
                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed group-hover:text-gray-800 transition-colors font-medium">
                  {activity.objetivo || 'Sin descripción disponible'}
                </p>


              </div>

              {/* Flecha de navegación */}
              <div className="ml-4 shrink-0">
                <div className={iconClasses.container}>
                  <svg className={iconClasses.icon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityList;
