import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { medalKeys } from "@/integrations/supabase/queries/medals";
import { missionKeys } from "@/integrations/supabase/queries/missions";
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
  const queryClient = useQueryClient();
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
    // Forzar datos frescos en Home para animar el progreso desde N-1 hasta N
    if (childId) {
      void queryClient.invalidateQueries({ queryKey: medalKeys.byChild(childId) });
      void queryClient.invalidateQueries({ queryKey: missionKeys.byChild(childId) });
    }
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
      wrapWithCard
      tone="blue"
      header={
        !loading && !missionsLoading && !activitiesLoading && currentMission ? (
          <MissionNavigation
            currentMissionId={parseInt(id!)}
            previousMission={previousMission}
            nextMission={nextMission}
            currentIndex={currentIndex}
            totalMissions={totalMissions}
            onNavigate={(missionId) => handleNavigate(missionId)}
          />
        ) : undefined
      }
      title={
        loading || missionsLoading || activitiesLoading
          ? 'Cargando misión...'
          : error || activitiesError
            ? error || activitiesError
            : currentMission
              ? `Misión ${currentMission.missions.id}. ${currentMission.missions.titulo}`
              : undefined
      }
      subtitle={
        currentMission && !loading && !missionsLoading && !activitiesLoading && !(error || activitiesError)
          ? formatearDescripcionMision(currentMission.missions.descripcion ?? '')
          : undefined
      }
    >
            {/* Área de contenido con scroll */}
            <div>
              {loading || missionsLoading || activitiesLoading ? (
                <div className="text-center text-ink/70 py-8 font-medium">Cargando misión...</div>
              ) : error || activitiesError ? (
                <div className="text-center text-red-700 py-8 font-medium">{error || activitiesError}</div>
              ) : !currentMission ? (
                <div className="text-center text-ink/70 py-8 font-medium">No se encontró la misión</div>
              ) : (
                <div className="space-y-4 md:space-y-5 pb-20 md:pb-4">
                  {/* Card principal con información de la sesión */}
                  <div className="bg-white p-4 md:p-6 rounded-2xl shadow-surface">
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