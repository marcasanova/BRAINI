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

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'inteligencia_emocional':
        return 'bg-braini-blue/10 text-braini-blue-dark border-braini-blue/20';
      case 'actividad_tecnica':
        return 'bg-braini-turquoise/10 text-braini-turquoise-dark border-braini-turquoise/20';
      case 'vinculo_afectivo':
        return 'bg-braini-pink/10 text-braini-pink-dark border-braini-pink/20';
      case 'acompañamiento_emocional':
        return 'bg-braini-yellow/10 text-braini-yellow-dark border-braini-yellow/20';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

  return (
    <div className="space-y-4">
      {activities.map((userActivity) => {
        const activity = userActivity.activities;
        const isCompleted = !!userActivity.completed_at;
        const isRated = !!userActivity.puntuacion;

        return (
          <div
            key={activity.id}
            onClick={() => onActivityClick(activity.id)}
            className="p-6 bg-white rounded-2xl shadow-md flex flex-col gap-3 border border-braini-blue/20 hover:shadow-lg hover:border-braini-blue/40 transition-all duration-300 cursor-pointer group"
          >
            {/* Header con tipo y estado */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getActivityTypeColor(activity.tipo_actividad || '')}`}>
                    {getActivityTypeLabel(activity.tipo_actividad || '')}
                  </span>
                  
                  {/* Indicadores de estado */}
                  <div className="flex items-center gap-2">
                    {isCompleted && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-4 h-4" />
                        <span className="text-xs font-medium">Completada</span>
                      </div>
                    )}
                    {isRated && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-xs font-medium">Valorada</span>
                      </div>
                    )}
                  </div>
                </div>

                <h3 className="font-black text-braini-blue text-xl sm:text-2xl mb-2 group-hover:text-braini-blue-dark transition-colors" style={{ fontWeight: 900 }}>
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
                <div className="w-10 h-10 bg-braini-blue/10 rounded-full flex items-center justify-center group-hover:bg-braini-blue/20 transition-colors">
                  <svg className="w-5 h-5 text-braini-blue group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Acción */}
            <div className="text-sm text-braini-blue mt-2 flex items-center gap-2 group-hover:text-braini-blue-dark transition-colors">
              <div className="w-2 h-2 bg-braini-blue rounded-full group-hover:scale-125 transition-transform"></div>
              <span className="font-medium">
                {isCompleted ? 'Ver actividad' : 'Hacer actividad'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityList;
