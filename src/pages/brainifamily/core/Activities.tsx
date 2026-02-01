import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { SESSION_STATUS } from "@/constants/levelStatus";
import { UserSession } from "@/hooks/useUserLevels";
import { useUserSessions } from "@/hooks/useUserLevels";
import { useUserActivitiesByLevel } from "@/hooks/useUserActivities";
import { UserActivity } from "@/hooks/useUserActivities";
import Backgrounds from '@/components/Backgrounds';
import SessionNavigation from '@/components/levels/LevelNavigation';
import MedalAnimation from '@/components/medals/MedalAnimation';
import ActivityList from '@/components/activities/ActivityList';
import { formatearDescripcionMision } from '@/components/activities/utils/TextFormatter';

interface Medal {
  id: number;
  level_id: number;
  nombre: string;
  descripcion: string;
  icono: string;
  color: string;
}

const Activities: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [session, setSession] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [earnedMedal, setEarnedMedal] = useState<Medal | null>(null);
  const [isReturningFromActivity, setIsReturningFromActivity] = useState(false);

  // Obtener el usuario logeado
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id);
    });
  }, []);

  // Obtener todas las sesiones del usuario para navegación
  const { sessions, loading: sessionsLoading, getAdjacentSessions, refreshSessions } = useUserSessions(userId);

  // Función para manejar cuando se gana una medalla
  const handleMedalEarned = useCallback((medal: Medal) => {
    // Solo mostrar medalla si no estamos volviendo de una actividad
    if (!isReturningFromActivity) {
      setEarnedMedal(medal);
      // Refrescar las sesiones para mostrar el progreso actualizado
      refreshSessions();
    }
  }, [isReturningFromActivity, refreshSessions]);

  // Función para verificar si se ganó medalla
  const checkForMedal = useCallback(async () => {
    if (!userId || !id) return;

    try {
      // Verificar si el nivel está completado
      const { data: levelData, error: levelError } = await supabase
        .from('parents_levels')
        .select('status, completed_at')
        .eq('user_id', userId)
        .eq('level_id', id)
        .single();

      if (levelError || !levelData) return;

      // Si el nivel se completó, obtener la medalla
      if (levelData.status === 'completed' && levelData.completed_at) {
        const { data: medalData, error: medalError } = await supabase
          .from('medals')
          .select('id, level_id, nombre, descripcion, icono, color')
          .eq('level_id', parseInt(id!))
          .single();

        if (!medalError && medalData) {
          handleMedalEarned(medalData);
        }
      }
    } catch (error) {
      console.error('Error al verificar medalla:', error);
    }
  }, [userId, id, handleMedalEarned]);

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

    if (medalEarned === 'true' && userId) {
      // Verificar si se ganó medalla y mostrarla
      checkForMedal();
      // Limpiar el parámetro de la URL
      navigate(`/brainifamily/sesion/${id}`, { replace: true });
    }
  }, [location.search, navigate, id, userId, checkForMedal]);

  // Obtener la sesión del usuario
  useEffect(() => {
    if (!userId || !id) return;
    setLoading(true);
    setError(null);
    supabase
      .from("parents_levels")
      .select(
        `
        level_id,
        status,
        levels (
          id,
          titulo,
          descripcion
        )
        `
      )
      .eq("user_id", userId)
      .eq("level_id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError("No se encontró la misión o no tienes acceso.");
          setSession(null);
          setLoading(false);
        } else {
          const mapped = {
            ...data,
            levels: Array.isArray(data.levels) ? data.levels[0] : data.levels,
          } as UserSession;
          setSession(mapped);
          setLoading(false);
        }
      });
  }, [userId, id]);

  // Obtener actividades del usuario para este nivel
  const { activities, loading: activitiesLoading, error: activitiesError } = useUserActivitiesByLevel(userId, session?.levels.id || 0);

  // Función para navegar entre sesiones
  const handleNavigate = (levelId: number) => {
    navigate(`/brainifamily/sesion/${levelId}`);
  };

  // Función para manejar click en actividad
  const handleActivityClick = (activityId: number) => {
    navigate(`/brainifamily/sesion/${id}/actividad/${activityId}`);
  };

  // Función para cerrar la animación de medalla y navegar a home
  const handleMedalClose = () => {
    setEarnedMedal(null);
    // Siempre navegar a la página principal donde están todos los niveles
    navigate('/brainifamily/home');
  };

  // Obtener sesiones adyacentes para navegación
  const { previousSession, nextSession, currentIndex, totalSessions } = getAdjacentSessions(parseInt(id!));
  const isLastSession = currentIndex === totalSessions - 1;

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
            <div className="mb-4 md:mb-6 animate-fade-in flex-shrink-0 space-y-4">
              {/* Navegación entre sesiones - Arriba del todo */}
              {!loading && !sessionsLoading && !activitiesLoading && session && (
                <div className="mb-4">
                  <SessionNavigation
                    currentLevelId={parseInt(id!)}
                    previousSession={previousSession}
                    nextSession={nextSession}
                    currentIndex={currentIndex}
                    totalSessions={totalSessions}
                    onNavigate={handleNavigate}
                  />
                </div>
              )}

              {/* Título y subtítulo de la sesión */}
              {loading || sessionsLoading || activitiesLoading ? (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white" style={{ fontWeight: 900 }}>
                  Cargando misión...
                </h1>
              ) : error || activitiesError ? (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white" style={{ fontWeight: 900 }}>
                  {error || activitiesError}
                </h1>
              ) : session ? (
                <>
                  <div className="mb-2">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1" style={{ fontWeight: 900 }}>
                      Misión {session.levels.id}. <span className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ fontWeight: 700 }}>{session.levels.titulo}</span>
                    </h1>
                  </div>
                  <div className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium">
                    {formatearDescripcionMision(session.levels.descripcion)}
                  </div>
                </>
              ) : null}
            </div>

            {/* Área de contenido con scroll */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading || sessionsLoading || activitiesLoading ? (
                <div className="text-center text-white/90 py-8 font-medium">Cargando misión...</div>
              ) : error || activitiesError ? (
                <div className="text-center text-red-200 py-8 font-medium">{error || activitiesError}</div>
              ) : !session ? (
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
          onClose={handleMedalClose}
        />
      )}
    </Backgrounds>
  );
};

export default Activities; 