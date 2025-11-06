import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useUserActivitiesByLevel } from '@/hooks/useUserActivities';
import { UserActivity } from '@/hooks/useUserActivities';
import Backgrounds from '@/components/Backgrounds';
import Navbar from '@/components/navigation/Navbar';
import ActivityNavigation from '@/components/activities/ActivityNavigation';
import ActivityRating from '@/components/activities/ActivityRating';
import Ses1Act1 from '@/components/activities/content/Ses1Act1';
import Ses1Act2 from '@/components/activities/content/Ses1Act2';
import { formatearTexto } from '@/components/activities/utils/textFormatter';

const ActivityDetail: React.FC = () => {
  const { levelId, activityId } = useParams<{ levelId: string; activityId: string }>();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Obtener el usuario logeado
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id);
      setLoading(false);
    });
  }, []);

  // Obtener actividades del usuario para este nivel
  const { activities, loading: activitiesLoading } = useUserActivitiesByLevel(userId, parseInt(levelId || '0'));

  const handlePuzzleComplete = () => {
    // Navegar a la siguiente actividad si existe, sino volver a la sesión
    const currentIndex = activities.findIndex(a => a.activities.id === parseInt(activityId!));
    const nextActivity = currentIndex < activities.length - 1 ? activities[currentIndex + 1] : null;
    
    if (nextActivity) {
      navigate(`/sesion/${levelId}/actividad/${nextActivity.activities.id}`);
    } else {
      navigate(`/sesion/${levelId}?fromActivity=true`);
    }
  };

  // Función para navegar entre actividades
  const handleActivityNavigate = (newActivityId: number) => {
    navigate(`/sesion/${levelId}/actividad/${newActivityId}`);
  };

  // Función para volver a la sesión
  const handleBackToSession = () => {
    navigate(`/sesion/${levelId}`);
  };

  // Obtener información de navegación
  const getNavigationInfo = () => {
    const currentIndex = activities.findIndex(a => a.activities.id === parseInt(activityId!));
    const previousActivity = currentIndex > 0 ? activities[currentIndex - 1].activities : null;
    const nextActivity = currentIndex < activities.length - 1 ? activities[currentIndex + 1].activities : null;
    
    return {
      currentIndex,
      previousActivity,
      nextActivity,
      totalActivities: activities.length
    };
  };

  const renderActivity = () => {
    if (loading || activitiesLoading) {
      return (
        <div className="min-h-screen bg-white font-montserrat relative overflow-hidden flex flex-col">
          <Backgrounds />
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center px-2 py-12 md:py-20 md:pl-80 relative z-10">
            <div className="text-center text-gray-500 py-8 font-medium">Cargando actividad...</div>
          </div>
        </div>
      );
    }

    const { currentIndex, previousActivity, nextActivity, totalActivities } = getNavigationInfo();

    // Encontrar la actividad actual
    const currentActivity = activities.find(a => a.activities.id === parseInt(activityId!));
    
    if (!currentActivity) {
      return (
        <div className="min-h-screen bg-white font-montserrat relative overflow-hidden flex flex-col">
          <Backgrounds />
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center px-2 py-12 md:py-20 md:pl-80 relative z-10">
            <div className="text-center text-red-600 py-8 font-medium">Actividad no encontrada</div>
          </div>
        </div>
      );
    }

    const activity = currentActivity.activities;
    return (
      <div className="min-h-screen bg-white font-montserrat relative overflow-hidden flex flex-col">
        <Backgrounds />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-2 py-12 md:py-20 md:pl-80 relative z-10">
          <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl border-0 max-w-4xl w-full animate-fade-in">
            {/* Navegación entre actividades */}
            <ActivityNavigation
              currentActivityId={parseInt(activityId!)}
              previousActivity={previousActivity}
              nextActivity={nextActivity}
              currentIndex={currentIndex}
              totalActivities={totalActivities}
              onNavigate={handleActivityNavigate}
              onBackToLevel={handleBackToSession}
            />
            
            {/* Contenido de la actividad */}
            <div className="mb-8">
              <h2 className="text-3xl font-extrabold text-braini-blue mb-4 text-center">
                {activity.titulo_actividad}
              </h2>
              
              <div className="text-lg text-gray-700 mb-6 text-center">
                {activity.objetivo || 'Sin descripción disponible'}
              </div>

              {/* Detectar si es Sesión 1, Actividad 1 o 2 y renderizar componente específico */}
              {parseInt(levelId!) === 1 && parseInt(activityId!) === 1 ? (
                <Ses1Act1 
                  userProgress={currentActivity}
                  activityId={parseInt(activityId!)}
                  levelId={levelId!}
                  userId={userId!}
                  activityData={{
                    duracion_min: activity.duracion_min,
                    duracion_max: activity.duracion_max,
                    como_se_juega: activity.como_se_juega,
                    retroalimentacion: activity.retroalimentacion
                  }}
                />
              ) : parseInt(levelId!) === 1 && parseInt(activityId!) === 2 ? (
                <Ses1Act2 
                  userProgress={currentActivity}
                  activityId={parseInt(activityId!)}
                  levelId={levelId!}
                  userId={userId!}
                  activityData={{
                    duracion_min: activity.duracion_min,
                    duracion_max: activity.duracion_max,
                    como_se_juega: activity.como_se_juega,
                    retroalimentacion: activity.retroalimentacion
                  }}
                />
              ) : (
                // Contenido genérico para el resto de actividades
                <>
                  {/* Contenido específico según el tipo de actividad */}
                  {activity.tipo_actividad === 'vinculo_afectivo' && activity.contenido_vinculo && (
                    <div className="bg-braini-pink/10 p-6 rounded-xl border border-braini-pink/20">
                      <h3 className="text-xl font-bold text-braini-pink-dark mb-4">Actividad de Vínculo Afectivo</h3>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-braini-pink/30">
                          <h4 className="font-semibold text-braini-pink-dark mb-2">Acción:</h4>
                          <p className="text-gray-700">{activity.contenido_vinculo.accion}</p>
                        </div>
                        <div className="bg-white p-4 rounded-lg border border-braini-pink/30">
                          <h4 className="font-semibold text-braini-pink-dark mb-2">Frase:</h4>
                          <p className="text-gray-700 italic">"{activity.contenido_vinculo.frase}"</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {activity.tipo_actividad === 'acompañamiento_emocional' && activity.contenido_apoyo && (
                    <div className="bg-braini-yellow/10 p-6 rounded-xl border border-braini-yellow/20">
                      <h3 className="text-xl font-bold text-braini-yellow-dark mb-4">Acompañamiento Emocional</h3>
                      <div className="bg-white p-4 rounded-lg border border-braini-yellow/30">
                        <p className="text-gray-700 leading-relaxed">{activity.contenido_apoyo}</p>
                      </div>
                    </div>
                  )}

                  {/* Instrucciones generales */}
                  {activity.como_se_juega && (
                    <div className="bg-braini-blue/10 p-6 rounded-xl border border-braini-blue/20 mt-6">
                      <h3 className="text-xl font-bold text-braini-blue-dark mb-4">¿Cómo se juega?</h3>
                      <p className="text-gray-700 leading-relaxed">{activity.como_se_juega}</p>
                    </div>
                  )}

                  {/* Retroalimentación */}
                  {activity.retroalimentacion && (
                    <div className="bg-braini-turquoise/10 p-6 rounded-xl border border-braini-turquoise/20 mt-6">
                      <h3 className="text-xl font-bold text-braini-turquoise-dark mb-4">¡Excelente trabajo!</h3>
                      <p className="text-gray-700 leading-relaxed">{activity.retroalimentacion}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Investigación y beneficios - del backend */}
            {activity.investigacion_beneficios && (
              <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-200 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="text-xl font-bold text-indigo-800">
                    Base Científica
                  </h3>
                </div>
                <div className="text-gray-700 leading-relaxed">
                  {formatearTexto(activity.investigacion_beneficios)}
                </div>
              </div>
            )}

            {/* Componente de valoración */}
            {userId && (
              <ActivityRating 
                activityId={parseInt(activityId!)} 
                userId={userId}
                onRatingSubmitted={() => {
                  // Opcional: refrescar datos o mostrar mensaje
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return renderActivity();
};

export default ActivityDetail;
