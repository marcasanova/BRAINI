import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { supabase } from "@/integrations/supabase/client";
import { MissionWithProgress } from "@/products/brainifamily/hooks/useMissions";
import { useCurrentChild } from "@/products/brainifamily/hooks/useCurrentChild";
import { useMissions } from "@/products/brainifamily/hooks/useMissions";
import { useUserActivitiesByMission } from "@/products/brainifamily/hooks/useUserActivities";
import { UserActivity } from "@/products/brainifamily/hooks/useUserActivities";
import Backgrounds from '@/shared/components/Backgrounds';
import MissionNavigation from '@/products/brainifamily/features/missions/MissionNavigation';
import MedalAnimation from '@/products/brainifamily/features/medals/MedalAnimation';
import ActivityList from '@/products/brainifamily/features/activities/ActivityList';
import { formatearDescripcionMision } from '@/products/brainifamily/features/activities/utils/TextFormatter';

interface Medal {
  id: number;
  mission_id: number;
  nombre: string;
  descripcion: string | null;
  icono: string;
  color: string;
}

const Activities: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { child, childId } = useCurrentChild();
  const [currentMission, setCurrentMission] = useState<MissionWithProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [earnedMedal, setEarnedMedal] = useState<Medal | null>(null);
  const [isReturningFromActivity, setIsReturningFromActivity] = useState(false);

  const { missions, loading: missionsLoading, getAdjacentMissions, refreshMissions } = useMissions(childId);

  // Función para manejar cuando se gana una medalla
  const handleMedalEarned = useCallback((medal: Medal) => {
    // Solo mostrar medalla si no estamos volviendo de una actividad
    if (!isReturningFromActivity) {
      setEarnedMedal(medal);
      refreshMissions();
    }
  }, [isReturningFromActivity, refreshMissions]);

  const checkForMedal = useCallback(async () => {
    if (!childId || !id) return;

    try {
      const { data: missionData, error: missionError } = await supabase
        .from('child_missions')
        .select('status, completed_at')
        .eq('child_id', childId)
        .eq('mission_id', parseInt(id!, 10))
        .single();

      if (missionError || !missionData) return;

      if (missionData.status === 'completed' && missionData.completed_at) {
        const { data: medalData, error: medalError } = await supabase
          .from('medals')
          .select('id, mission_id, nombre, descripcion, icono, color')
          .eq('mission_id', parseInt(id!, 10))
          .single();

        if (!medalError && medalData) {
          handleMedalEarned(medalData);
        }
      }
    } catch (error) {
      console.error('Error al verificar medalla:', error);
    }
  }, [childId, id, handleMedalEarned]);

  // Detectar si volvemos de una actividad o si se ganó medalla
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const fromActivity = urlParams.get('fromActivity');
    const medalEarned = urlParams.get('medalEarned');
    
    if (fromActivity === 'true') {
      setIsReturningFromActivity(true);
      // Limpiar el parámetro de la URL
      navigate(`/brainifamily/sesion/${id}`, { replace: true });
      // Resetear después de un breve delay
      setTimeout(() => {
        setIsReturningFromActivity(false);
      }, 2000);
    }

    if (medalEarned === 'true' && childId) {
      checkForMedal();
      navigate(`/brainifamily/sesion/${id}`, { replace: true });
    }
  }, [location.search, navigate, id, childId, checkForMedal]);

  useEffect(() => {
    if (!childId || !id) return;
    setLoading(true);
    setError(null);
    supabase
      .from("child_missions")
      .select(
        `
        mission_id,
        status,
        missions (
          id,
          titulo,
          descripcion
        )
        `
      )
      .eq("child_id", childId)
      .eq("mission_id", parseInt(id!, 10))
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError("No se encontró la misión o no tienes acceso.");
          setCurrentMission(null);
          setLoading(false);
        } else {
          const mapped = {
            ...data,
            missions: Array.isArray(data.missions) ? data.missions[0] : data.missions,
          } as MissionWithProgress;
          setCurrentMission(mapped);
          setLoading(false);
        }
      });
  }, [childId, id]);

  const { activities, loading: activitiesLoading, error: activitiesError } = useUserActivitiesByMission(childId, currentMission?.missions?.id ?? 0);

  // Función para navegar entre sesiones
  const handleNavigate = (missionId: number) => {
    navigate(`/brainifamily/sesion/${missionId}`);
  };

  // Función para manejar click en actividad
  const handleActivityClick = (activityId: number) => {
    navigate(`/brainifamily/sesion/${id}/actividad/${activityId}`);
  };

  const { previousMission, nextMission, currentIndex, totalMissions } = getAdjacentMissions(parseInt(id!, 10));

  const handleMedalClose = () => {
    const missionIdCompleted = parseInt(id!, 10);
    const missionIdNextUnlocked = nextMission?.missions?.id ?? undefined;
    setEarnedMedal(null);
    navigate('/brainifamily/home', {
      state: {
        playMedalAnimation: true,
        missionIdCompleted,
        missionIdNextUnlocked,
      },
    });
  };
  const isLastMission = currentIndex === totalMissions - 1;

  return (
    <Backgrounds 
      wrapWithCard={true} 
      enableInternalScroll={true}
      customColor="#7ea4df"
      showCircles={true}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 flex-1 flex flex-col min-h-0">
          <div className="max-w-5xl mx-auto w-full flex flex-col min-h-0">
            {/* Header fijo - No hace scroll */}
            <div className="mb-4 md:mb-6 animate-fade-in shrink-0 space-y-4">
              {/* Navegación entre sesiones - Arriba del todo */}
              {!loading && !missionsLoading && !activitiesLoading && currentMission && (
                <div className="mb-4">
                  <MissionNavigation
                    currentMissionId={parseInt(id!)}
                    previousMission={previousMission}
                    nextMission={nextMission}
                    currentIndex={currentIndex}
                    totalMissions={totalMissions}
                    onNavigate={(missionId) => handleNavigate(missionId)}
                  />
                </div>
              )}

              {/* Título y subtítulo de la sesión */}
              {loading || missionsLoading || activitiesLoading ? (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white" style={{ fontWeight: 900 }}>
                  Cargando misión...
                </h1>
              ) : error || activitiesError ? (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white" style={{ fontWeight: 900 }}>
                  {error || activitiesError}
                </h1>
              ) : currentMission ? (
                <>
                  <div className="mb-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1" style={{ fontWeight: 900 }}>
                      Misión {currentMission.missions.id}. <span className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ fontWeight: 700 }}>{currentMission.missions.titulo}</span>
                    </h1>
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium">
                    {formatearDescripcionMision(currentMission.missions.descripcion ?? '')}
                  </div>
                </>
              ) : null}
            </div>

            {/* Área de contenido con scroll */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading || missionsLoading || activitiesLoading ? (
                <div className="text-center text-white/90 py-8 font-medium">Cargando misión...</div>
              ) : error || activitiesError ? (
                <div className="text-center text-red-200 py-8 font-medium">{error || activitiesError}</div>
              ) : !currentMission ? (
                <div className="text-center text-white/90 py-8 font-medium">No se encontró la misión</div>
              ) : (
                <div className="space-y-4 md:space-y-5 pb-20 md:pb-4">
                  {/* Card principal con información de la sesión */}
                  <div className="bg-white/95 backdrop-blur-lg p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-0 animate-fade-in">
                    {/* Título de actividades */}
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-700 text-left" style={{ fontWeight: 700 }}>
                      <span className="md:hidden">Retos</span>
                      <span className="hidden md:inline">Retos de esta misión</span>
                    </h3>
                    
                    {/* Lista de actividades */}
                    <ActivityList 
                      activities={activities} 
                      onActivityClick={handleActivityClick}
                      loading={activitiesLoading}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animación de medalla */}
      {earnedMedal && (
        <MedalAnimation
          medal={earnedMedal}
          childNivelEducativo={child?.nivel_educativo ?? undefined}
          onClose={handleMedalClose}
        />
      )}
    </Backgrounds>
  );
};

export default Activities; 