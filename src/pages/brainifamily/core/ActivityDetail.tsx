import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCurrentChild } from '@/hooks/useCurrentChild';
import { useUserActivitiesByMission } from '@/hooks/useUserActivities';
import Backgrounds from '@/components/Backgrounds';
import ActivityNavigation from '@/components/activities/ActivityNavigation';
import ActivityRating from '@/components/activities/ActivityRating';
import ActivityPuzzleRenderer from '@/components/activities/ActivityPuzzleRenderer';
import { hasRegisteredActivityPuzzle } from '@/products/brainifamily/features/activities/content/registry';
import { formatearTexto } from '@/components/activities/utils/TextFormatter';
import { 
  getInstructionsContainerClasses,
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

  const handleBackToMission = () => {
    navigate(`/brainifamily/sesion/${missionIdParam}`);
  };

  const handleActivityNavigate = (newActivityId: number) => {
    navigate(`/brainifamily/sesion/${missionIdParam}/actividad/${newActivityId}`);
  };

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

  const getActivityColor = (activityType?: string): string => {
    switch (activityType) {
      case 'inteligencia_emocional':
        return '#7ea4df';
      case 'regulacion_emocional':
        return '#35bdb1';
      case 'vinculo_afectivo':
        return '#f5827b';
      case 'acompañamiento_emocional':
        return '#f8cd50';
      default:
        return '#7ea4df';
    }
  };

  const activityColor = currentActivity 
    ? getActivityColor(currentActivity.activities.tipo_actividad)
    : '#7ea4df';

  const puzzleProps = currentActivity && childId ? {
    userProgress: currentActivity,
    activityId: currentActivity.activities.id,
    missionId: missionIdParam!,
    userId: childId,
    activityType: currentActivity.activities.tipo_actividad,
    activityData: {
      duracion_min: currentActivity.activities.duracion_min,
      duracion_max: currentActivity.activities.duracion_max,
      como_se_juega: currentActivity.activities.como_se_juega,
      investigacion_beneficios: currentActivity.activities.investigacion_beneficios,
    },
    onPuzzleComplete: handleBackToMission,
  } : null;

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
            <div className="mb-4 md:mb-6 animate-fade-in flex-shrink-0 space-y-4">
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

            <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0">
              {loading || activitiesLoading ? (
                <div className="text-center text-white/90 py-8 font-medium">Cargando actividad...</div>
              ) : !currentActivity ? (
                <div className="text-center text-red-200 py-8 font-medium">Actividad no encontrada</div>
              ) : (
                <div className="space-y-4 md:space-y-5 pb-20 md:pb-4 overflow-x-hidden">
                  <div className="bg-white/95 backdrop-blur-lg p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-0 animate-fade-in overflow-x-hidden">
                    <div className="mb-8">
                      {puzzleProps && hasRegisteredActivityPuzzle(currentActivity.activities.id) ? (
                        <ActivityPuzzleRenderer
                          activityDbId={currentActivity.activities.id}
                          {...puzzleProps}
                        />
                      ) : (
                        <>
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

                    {childId && (
                      <ActivityRating 
                        activityId={parseInt(activityId!, 10)}
                        childId={childId}
                        missionId={missionId}
                        activityType={currentActivity?.activities.tipo_actividad}
                        onRatingSubmitted={() => {}}
                        onMedalEarned={() => {
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
