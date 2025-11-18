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
      navigate(`/sesion/${id}`, { replace: true });
      // Resetear después de un breve delay
      setTimeout(() => {
        setIsReturningFromActivity(false);
      }, 2000);
    }

    if (medalEarned === 'true' && userId) {
      // Verificar si se ganó medalla y mostrarla
      checkForMedal();
      // Limpiar el parámetro de la URL
      navigate(`/sesion/${id}`, { replace: true });
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
          setError("No se encontró la sesión o no tienes acceso.");
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
    navigate(`/sesion/${levelId}`);
  };

  // Función para manejar click en actividad
  const handleActivityClick = (activityId: number) => {
    navigate(`/sesion/${id}/actividad/${activityId}`);
  };

  // Función para cerrar la animación de medalla y navegar a home
  const handleMedalClose = () => {
    setEarnedMedal(null);
    // Siempre navegar a la página principal donde están todos los niveles
    navigate('/home');
  };

  // Obtener sesiones adyacentes para navegación
  const { previousSession, nextSession, currentIndex, totalSessions } = getAdjacentSessions(parseInt(id!));
  const isLastSession = currentIndex === totalSessions - 1;

  return (
    <Backgrounds 
      wrapWithCard={true} 
      enableInternalScroll={true}
      customGradient="linear-gradient(135deg, rgba(126, 164, 223, 1) 25%, rgba(53, 189, 177, 1) 75%)"
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 flex-1 flex flex-col min-h-0">
          <div className="max-w-5xl mx-auto w-full flex flex-col min-h-0">
            {/* Header con título - Fijo en la parte superior */}
            <div className="mb-4 md:mb-6 animate-fade-in flex-shrink-0">
              {loading || sessionsLoading || activitiesLoading ? (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white" style={{ fontWeight: 900 }}>
                  Cargando sesión...
                </h1>
              ) : error || activitiesError ? (
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white" style={{ fontWeight: 900 }}>
                  {error || activitiesError}
                </h1>
              ) : session ? (
                <>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2" style={{ fontWeight: 900 }}>
                    Sesión {session.levels.id}: {session.levels.titulo}
                  </h1>
                  <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium">
                    {session.levels.descripcion}
                  </p>
                </>
              ) : null}
            </div>

            {/* Área de contenido con scroll */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading || sessionsLoading || activitiesLoading ? (
                <div className="text-center text-white/90 py-8 font-medium">Cargando sesión...</div>
              ) : error || activitiesError ? (
                <div className="text-center text-red-200 py-8 font-medium">{error || activitiesError}</div>
              ) : !session ? (
                <div className="text-center text-white/90 py-8 font-medium">No se encontró la sesión</div>
              ) : (
                <div className="space-y-4 md:space-y-5 pb-4">
                  {/* Card principal con información de la sesión */}
                  <div className="bg-white/95 backdrop-blur-lg p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-0 animate-fade-in">
                    {/* Navegación entre sesiones */}
                    <div className="mb-6">
                      <SessionNavigation
                        currentLevelId={parseInt(id!)}
                        previousSession={previousSession}
                        nextSession={nextSession}
                        currentIndex={currentIndex}
                        totalSessions={totalSessions}
                        onNavigate={handleNavigate}
                      />
                    </div>
                    
                    {/* Estado de la sesión */}
                    <div className="mb-6 text-left">
                      <span className="font-bold text-gray-700">Estado: </span>
                      {session.status === SESSION_STATUS.CURRENT && <span className="text-braini-blue-dark font-black">Actual</span>}
                      {session.status === SESSION_STATUS.COMPLETED && <span className="text-braini-turquoise-dark font-black">Completada</span>}
                      {session.status === SESSION_STATUS.LOCKED && <span className="text-gray-500 font-black">Bloqueada</span>}
                    </div>
                    
                    {/* Título de actividades */}
                    <h3 className="text-2xl sm:text-3xl font-black mb-6 text-braini-blue-dark text-left" style={{ fontWeight: 800 }}>
                      Actividades de esta sesión
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