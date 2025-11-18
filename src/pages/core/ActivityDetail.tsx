import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useUserActivitiesByLevel } from '@/hooks/useUserActivities';
import { UserActivity } from '@/hooks/useUserActivities';
import Backgrounds from '@/components/Backgrounds';
import ActivityNavigation from '@/components/activities/ActivityNavigation';
import ActivityRating from '@/components/activities/ActivityRating';
import Ses1Act1 from '@/components/activities/content/Ses1Act1';
import Ses1Act2 from '@/components/activities/content/Ses1Act2';
import Ses2Act1 from '@/components/activities/content/Ses2Act1';
import Ses2Act2 from '@/components/activities/content/Ses2Act2';
import Ses3Act1 from '@/components/activities/content/Ses3Act1';
import Ses3Act2 from '@/components/activities/content/Ses3Act2';
import Ses4Act1 from '@/components/activities/content/Ses4Act1';
import Ses4Act2 from '@/components/activities/content/Ses4Act2';
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

  const { currentIndex, previousActivity, nextActivity, totalActivities } = getNavigationInfo();
  const currentActivity = activities.find(a => a.activities.id === parseInt(activityId!));

  return (
    <Backgrounds 
      wrapWithCard={true} 
      enableInternalScroll={true}
      customGradient="linear-gradient(135deg, rgba(126, 164, 223, 1) 25%, rgba(53, 189, 177, 1) 75%)"
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 flex-1 flex flex-col min-h-0">
          <div className="max-w-5xl mx-auto w-full flex flex-col min-h-0">
            {/* Header fijo - No hace scroll */}
            <div className="mb-4 md:mb-6 animate-fade-in flex-shrink-0 space-y-4">
              {/* Navegación entre actividades - Arriba del todo */}
              {!loading && !activitiesLoading && currentActivity && (
                <div className="mb-4">
                  <ActivityNavigation
                    currentActivityId={parseInt(activityId!)}
                    previousActivity={previousActivity}
                    nextActivity={nextActivity}
                    currentIndex={currentIndex}
                    totalActivities={totalActivities}
                    onNavigate={handleActivityNavigate}
                    onBackToLevel={handleBackToSession}
                  />
                </div>
              )}

              {/* Título y subtítulo de la actividad */}
              {loading || activitiesLoading ? (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white" style={{ fontWeight: 900 }}>
                  Cargando actividad...
                </h1>
              ) : !currentActivity ? (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white" style={{ fontWeight: 900 }}>
                  Actividad no encontrada
                </h1>
              ) : (
                <>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2" style={{ fontWeight: 900 }}>
                    {currentActivity.activities.titulo_actividad}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium">
                    {currentActivity.activities.objetivo || 'Sin descripción disponible'}
                  </p>
                </>
              )}
            </div>

            {/* Área de contenido con scroll */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading || activitiesLoading ? (
                <div className="text-center text-white/90 py-8 font-medium">Cargando actividad...</div>
              ) : !currentActivity ? (
                <div className="text-center text-red-200 py-8 font-medium">Actividad no encontrada</div>
              ) : (
                <div className="space-y-4 md:space-y-5 pb-4">
                  {/* Card principal con contenido de la actividad */}
                  <div className="bg-white/95 backdrop-blur-lg p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-0 animate-fade-in">
                    {/* Contenido de la actividad */}
                    <div className="mb-8">
                      {/* 
                        Detectar actividades específicas por su ID real de la base de datos:
                        - ID 1: Sesión 1, Actividad 1 (Ses1Act1)
                        - ID 2: Sesión 1, Actividad 2 (Ses1Act2)
                        - ID 3: Sesión 2, Actividad 1 (Ses2Act1)
                        - ID 4: Sesión 2, Actividad 2 (Ses2Act2)
                        - ID 6: Sesión 3, Actividad 1 (Ses3Act1)
                        - ID 7: Sesión 3, Actividad 2 (Ses3Act2)
                        - ID 8: Sesión 4, Actividad 1 (Ses4Act1)
                        - ID 9: Sesión 4, Actividad 2 (Ses4Act2)
                      */}
                      {currentActivity.activities.id === 1 ? (
                        <Ses1Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          levelId={levelId!}
                          userId={userId!}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToSession}
                        />
                      ) : currentActivity.activities.id === 2 ? (
                        <Ses1Act2 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          levelId={levelId!}
                          userId={userId!}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                        />
                      ) : currentActivity.activities.id === 3 ? (
                        <Ses2Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          levelId={levelId!}
                          userId={userId!}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToSession}
                        />
                      ) : currentActivity.activities.id === 4 ? (
                        <Ses2Act2 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          levelId={levelId!}
                          userId={userId!}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToSession}
                        />
                      ) : currentActivity.activities.id === 6 ? (
                        <Ses3Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          levelId={levelId!}
                          userId={userId!}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToSession}
                        />
                      ) : currentActivity.activities.id === 7 ? (
                        <Ses3Act2 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          levelId={levelId!}
                          userId={userId!}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToSession}
                        />
                      ) : currentActivity.activities.id === 8 ? (
                        <Ses4Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          levelId={levelId!}
                          userId={userId!}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToSession}
                        />
                      ) : currentActivity.activities.id === 9 ? (
                        <Ses4Act2 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          levelId={levelId!}
                          userId={userId!}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToSession}
                        />
                      ) : (
                        // Contenido genérico para el resto de actividades
                        <>
                          {/* Contenido específico según el tipo de actividad */}
                          {currentActivity.activities.tipo_actividad === 'vinculo_afectivo' && currentActivity.activities.contenido_vinculo && (
                            <div className="bg-braini-pink/10 p-6 rounded-xl border border-braini-pink/20">
                              <h3 className="text-xl font-bold text-braini-pink-dark mb-4">Actividad de Vínculo Afectivo</h3>
                              <div className="space-y-4">
                                <div className="bg-white p-4 rounded-lg border border-braini-pink/30">
                                  <h4 className="font-semibold text-braini-pink-dark mb-2">Acción:</h4>
                                  <p className="text-gray-700">{currentActivity.activities.contenido_vinculo.accion}</p>
                                </div>
                                <div className="bg-white p-4 rounded-lg border border-braini-pink/30">
                                  <h4 className="font-semibold text-braini-pink-dark mb-2">Frase:</h4>
                                  <p className="text-gray-700 italic">"{currentActivity.activities.contenido_vinculo.frase}"</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentActivity.activities.tipo_actividad === 'acompañamiento_emocional' && currentActivity.activities.contenido_apoyo && (
                            <div className="bg-braini-yellow/10 p-6 rounded-xl border border-braini-yellow/20">
                              <h3 className="text-xl font-bold text-braini-yellow-dark mb-4">Acompañamiento Emocional</h3>
                              <div className="bg-white p-4 rounded-lg border border-braini-yellow/30">
                                <p className="text-gray-700 leading-relaxed">{currentActivity.activities.contenido_apoyo}</p>
                              </div>
                            </div>
                          )}

                          {/* Instrucciones generales */}
                          {currentActivity.activities.como_se_juega && (
                            <div className="bg-braini-blue/10 p-6 rounded-xl border border-braini-blue/20 mt-6">
                              <h3 className="text-xl font-bold text-braini-blue-dark mb-4">¿Cómo se juega?</h3>
                              <p className="text-gray-700 leading-relaxed">{currentActivity.activities.como_se_juega}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Componente de valoración */}
                    {userId && (
                      <ActivityRating 
                        activityId={parseInt(activityId!)} 
                        userId={userId}
                        levelId={parseInt(levelId!)}
                        onRatingSubmitted={() => {
                          // Opcional: refrescar datos o mostrar mensaje
                        }}
                        onMedalEarned={(medal) => {
                          // Cuando se gana medalla, navegar de vuelta a la sesión
                          // La medalla se mostrará desde Activities.tsx
                          setTimeout(() => {
                            navigate(`/sesion/${levelId}?medalEarned=true`);
                          }, 1000);
                        }}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Backgrounds>
  );
};

export default ActivityDetail;
