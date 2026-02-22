import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentChild } from '@/hooks/useCurrentChild';
import { useUserActivitiesByMission } from '@/hooks/useUserActivities';
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
import Ses5Act1 from '@/components/activities/content/Ses5Act1';
import Ses5Act2 from '@/components/activities/content/Ses5Act2';
import Ses6Act1 from '@/components/activities/content/Ses6Act1';
import Ses6Act2 from '@/components/activities/content/Ses6Act2';
import Ses7Act1 from '@/components/activities/content/Ses7Act1';
import Ses7Act2 from '@/components/activities/content/Ses7Act2';
import Ses8Act1 from '@/components/activities/content/Ses8Act1';
import Ses8Act2 from '@/components/activities/content/Ses8Act2';
import Ses9Act1 from '@/components/activities/content/Ses9Act1';
import Ses9Act2 from '@/components/activities/content/Ses9Act2';
import Ses10Act1 from '@/components/activities/content/Ses10Act1';
import { formatearTexto } from '@/components/activities/utils/TextFormatter';
import { 
  getInstructionsContainerClasses,
  getDurationTextClasses,
  getBorderClasses,
  getMainTitleTextClasses
} from '@/components/activities/utils/ActivityColors';

const ActivityDetail: React.FC = () => {
  const { missionId: missionIdParam, activityId } = useParams<{ missionId: string; activityId: string }>();
  const navigate = useNavigate();
  const { childId } = useCurrentChild();
  const [loading, setLoading] = useState(true);

  const missionId = parseInt(missionIdParam || '0', 10);
  const { activities, loading: activitiesLoading } = useUserActivitiesByMission(childId, missionId);

  useEffect(() => {
    if (childId) setLoading(false);
  }, [childId]);

  const handlePuzzleComplete = () => {
    // Navegar a la siguiente actividad si existe, sino volver a la sesión
    const currentIndex = activities.findIndex(a => a.activities.id === parseInt(activityId!));
    const nextActivity = currentIndex < activities.length - 1 ? activities[currentIndex + 1] : null;
    
    if (nextActivity) {
      navigate(`/brainifamily/sesion/${missionIdParam}/actividad/${nextActivity.activities.id}`);
    } else {
      navigate(`/brainifamily/sesion/${missionIdParam}?fromActivity=true`);
    }
  };

  // Función para navegar entre actividades
  const handleActivityNavigate = (newActivityId: number) => {
    navigate(`/brainifamily/sesion/${missionIdParam}/actividad/${newActivityId}`);
  };

  // Función para volver a la sesión
  const handleBackToMission = () => {
    navigate(`/brainifamily/sesion/${missionIdParam}`);
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

  // Función para obtener el color según el tipo de actividad
  const getActivityColor = (activityType?: string): string => {
    switch (activityType) {
      case 'inteligencia_emocional':
        return '#7ea4df'; // Azul
      case 'regulacion_emocional':
        return '#35bdb1'; // Turquesa
      case 'vinculo_afectivo':
        return '#f5827b'; // Rosa
      case 'acompañamiento_emocional':
        return '#f8cd50'; // Amarillo
      default:
        return '#7ea4df'; // Azul por defecto
    }
  };

  // Obtener el color de la actividad actual
  const activityColor = currentActivity 
    ? getActivityColor(currentActivity.activities.tipo_actividad)
    : '#7ea4df';

  return (
    <Backgrounds 
      wrapWithCard={true} 
      enableInternalScroll={true}
      customColor={activityColor}
      showCircles={true}
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
                    onBackToMission={handleBackToMission}
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
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white" style={{ fontWeight: 900 }}>
                  {currentActivity.activities.titulo_actividad}
                </h1>
              )}
            </div>

            {/* Área de contenido con scroll */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
              {loading || activitiesLoading ? (
                <div className="text-center text-white/90 py-8 font-medium">Cargando actividad...</div>
              ) : !currentActivity ? (
                <div className="text-center text-red-200 py-8 font-medium">Actividad no encontrada</div>
              ) : (
                <div className="space-y-4 md:space-y-5 pb-20 md:pb-4 overflow-x-hidden">
                  {/* Card principal con contenido de la actividad */}
                  <div className="bg-white/95 backdrop-blur-lg p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-0 animate-fade-in overflow-x-hidden">
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
                        - ID 10: Sesión 5, Actividad 1 (Ses5Act1)
                      */}
                      {currentActivity.activities.id === 1 ? (
                        <Ses1Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 2 ? (
                        <Ses1Act2 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 3 ? (
                        <Ses2Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 4 ? (
                        <Ses2Act2 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 6 ? (
                        <Ses3Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 7 ? (
                        <Ses3Act2 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 8 ? (
                        <Ses4Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 9 ? (
                        <Ses4Act2 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 10 ? (
                        <Ses5Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 11 ? (
                        <Ses5Act2 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 24 ? (
                        <Ses6Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 25 ? (
                        <Ses7Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 26 ? (
                        <Ses8Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 27 ? (
                        <Ses9Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 28 ? (
                        <Ses10Act1 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 30 ? (
                        <Ses6Act2 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 31 ? (
                        <Ses7Act2 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 32 ? (
                        <Ses8Act2 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : currentActivity.activities.id === 33 ? (
                        <Ses9Act2 
                          userProgress={currentActivity}
                          activityId={currentActivity.activities.id}
                          missionId={missionIdParam!}
                          userId={childId!}
                          activityType={currentActivity.activities.tipo_actividad}
                          activityData={{
                            duracion_min: currentActivity.activities.duracion_min,
                            duracion_max: currentActivity.activities.duracion_max,
                            como_se_juega: currentActivity.activities.como_se_juega,
                            investigacion_beneficios: currentActivity.activities.investigacion_beneficios
                          }}
                          onPuzzleComplete={handleBackToMission}
                        />
                      ) : (
                        // Contenido genérico para el resto de actividades
                        <>
                          {/* Contenido específico según el tipo de actividad */}
                          {currentActivity.activities.tipo_actividad === 'vinculo_afectivo' && currentActivity.activities.contenido_vinculo && (
                            <div className={getInstructionsContainerClasses(currentActivity.activities.tipo_actividad)}>
                              <div className="space-y-4">
                                <div>
                                  <h4 className={`font-semibold ${getMainTitleTextClasses(currentActivity.activities.tipo_actividad)} mb-2`}>Acción:</h4>
                                  <p className="text-gray-700 leading-relaxed">{currentActivity.activities.contenido_vinculo.accion}</p>
                                </div>
                                <div>
                                  <h4 className={`font-semibold ${getMainTitleTextClasses(currentActivity.activities.tipo_actividad)} mb-2`}>Frase:</h4>
                                  <p className="text-gray-700 italic leading-relaxed">"{currentActivity.activities.contenido_vinculo.frase}"</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {currentActivity.activities.tipo_actividad === 'acompañamiento_emocional' && currentActivity.activities.contenido_apoyo && (
                            <div className={getInstructionsContainerClasses(currentActivity.activities.tipo_actividad)}>
                              <div className="text-gray-700 leading-relaxed">
                                {formatearTexto(currentActivity.activities.contenido_apoyo)}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Componente de valoración */}
{childId && (
                      <ActivityRating 
                        activityId={parseInt(activityId!, 10)}
                        childId={childId}
                        missionId={missionId}
                        activityType={currentActivity?.activities.tipo_actividad}
                        onRatingSubmitted={() => {
                          // Opcional: refrescar datos o mostrar mensaje
                        }}
                        onMedalEarned={(medal) => {
                          // Cuando se gana medalla, navegar de vuelta a la sesión
                          // La medalla se mostrará desde Activities.tsx
                          setTimeout(() => {
                            navigate(`/brainifamily/sesion/${missionIdParam}?medalEarned=true`);
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
