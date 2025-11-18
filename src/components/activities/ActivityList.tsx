import React from 'react';
import { ActivityListProps } from '@/hooks/useUserActivities';
import { Star, Clock, CheckCircle } from 'lucide-react';

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
        No hay actividades disponibles para esta sesión.
      </div>
    );
  }

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'inteligencia_emocional':
        return 'Inteligencia Emocional';
      case 'actividad_tecnica':
        return 'Actividad Técnica';
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
      case 'actividad_tecnica':
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
    const baseClasses = 'w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-sm';
    
    switch (type) {
      case 'inteligencia_emocional':
        return `${baseClasses} bg-braini-blue/20 text-braini-blue-dark`;
      case 'actividad_tecnica':
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

  // Función para obtener clases de card según tipo
  const getCardClasses = (type: string) => {
    const baseClasses = 'p-6 rounded-2xl shadow-md flex flex-col gap-3 border-2 transition-all duration-300 cursor-pointer group';
    
    switch (type) {
      case 'inteligencia_emocional':
        return `${baseClasses} bg-gradient-to-br from-braini-blue/5 to-braini-blue/10 border-braini-blue/30 hover:shadow-xl hover:border-braini-blue/50`;
      case 'actividad_tecnica':
        return `${baseClasses} bg-gradient-to-br from-braini-turquoise/5 to-braini-turquoise/10 border-braini-turquoise/30 hover:shadow-xl hover:border-braini-turquoise/50`;
      case 'vinculo_afectivo':
        return `${baseClasses} bg-gradient-to-br from-braini-pink/5 to-braini-pink/10 border-braini-pink/30 hover:shadow-xl hover:border-braini-pink/50`;
      case 'acompañamiento_emocional':
        return `${baseClasses} bg-gradient-to-br from-braini-yellow/5 to-braini-yellow/10 border-braini-yellow/30 hover:shadow-xl hover:border-braini-yellow/50`;
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
      case 'actividad_tecnica':
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
      case 'actividad_tecnica':
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
      case 'actividad_tecnica':
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
      <div className="mb-6 p-4 bg-gradient-to-r from-braini-blue/10 to-braini-turquoise/10 rounded-xl border border-braini-blue/20">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Progreso de la sesión</span>
          <span className="text-sm font-bold text-braini-blue">{completedCount} / {totalCount}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
          <div 
            className={`h-2.5 rounded-full transition-all duration-500 ${
              allCompleted 
                ? 'bg-gradient-to-r from-braini-turquoise to-braini-turquoise-dark' 
                : 'bg-gradient-to-r from-braini-blue to-braini-turquoise'
            }`}
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          ></div>
        </div>
        {allCompleted && (
          <div className="flex items-center gap-2 text-braini-turquoise-dark font-semibold text-sm">
            <CheckCircle className="w-5 h-5" />
            <span>¡Todas las actividades completadas! 🎉</span>
          </div>
        )}
      </div>

      {activities.map((userActivity) => {
        const activity = userActivity.activities;
        const isCompleted = !!userActivity.completed_at;
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
                  
                  {/* Indicadores de estado */}
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-braini-turquoise-dark">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Completada</span>
                      </div>
                    )}
                    {isRated && (
                      <div className="flex items-center gap-1 text-braini-yellow-dark">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-medium">Valorada</span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className={getTitleClasses(activityType)} style={{ fontWeight: 900 }}>
                  {activity.titulo_actividad}
                </h3>
                
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed group-hover:text-gray-800 transition-colors font-medium">
                  {activity.objetivo || 'Sin descripción disponible'}
                </p>

                {/* Duración */}
                {activity.duracion_min && activity.duracion_max && (
                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                    <Clock className="w-4 h-4" />
                    <span>{activity.duracion_min}-{activity.duracion_max} minutos</span>
                  </div>
                )}

                {/* Valoración actual */}
                {isRated && userActivity.puntuacion && (
                  <div className="flex items-center gap-2 mt-3">
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
                      Tu valoración: {userActivity.puntuacion}/5
                    </span>
                  </div>
                )}
              </div>

              {/* Flecha de navegación */}
              <div className="ml-4 flex-shrink-0">
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
  );
};

export default ActivityList;
