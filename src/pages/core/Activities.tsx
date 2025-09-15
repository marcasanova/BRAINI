import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { LEVEL_STATUS } from "@/constants/levelStatus";
import { UserLevel } from "@/hooks/useUserLevels";
import { useUserLevels } from "@/hooks/useUserLevels";
import GeometricBackground from '@/components/GeometricBackground';
import Navbar from '@/components/navigation/Navbar';
import LevelRating from '@/components/levels/LevelRating';
import LevelNavigation from '@/components/levels/LevelNavigation';
import MedalAnimation from '@/components/medals/MedalAnimation';

interface Activity {
  id: number;
  titulo: string;
  descripcion: string;
  level_id: number;
}

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
  const [level, setLevel] = useState<UserLevel | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [earnedMedal, setEarnedMedal] = useState<Medal | null>(null); // Estado para la medalla ganada
  const [isReturningFromActivity, setIsReturningFromActivity] = useState(false); // Control para evitar medallas al volver de actividades

  // Obtener el usuario logeado
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id);
    });
  }, []);

  // Detectar si volvemos de una actividad
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const fromActivity = urlParams.get('fromActivity');
    
    if (fromActivity === 'true') {
      setIsReturningFromActivity(true);
      // Limpiar el parámetro de la URL
      navigate(`/nivel/${id}`, { replace: true });
      // Resetear después de un breve delay
      setTimeout(() => {
        setIsReturningFromActivity(false);
      }, 2000);
    }
  }, [location.search, navigate, id]);

  // Obtener todos los niveles del usuario para navegación
  const { levels, loading: levelsLoading, getAdjacentLevels, refreshLevels } = useUserLevels(userId);

  // Obtener el nivel del usuario
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
          setError("No se encontró el nivel o no tienes acceso.");
          setLevel(null);
          setLoading(false);
        } else {
          const mapped = {
            ...data,
            levels: Array.isArray(data.levels) ? data.levels[0] : data.levels,
          } as UserLevel;
          setLevel(mapped);
          setLoading(false);
        }
      });
  }, [userId, id]);

  // Obtener actividades del nivel (corregido)
  useEffect(() => {
    if (!level) return;
    supabase
      .from("activities")
      .select("id, titulo_actividad, descripcion_actividad, level_id")
      .eq("level_id", level.levels.id)
      .then(({ data, error }) => {
        if (error) {
          setActivities([]);
        } else {
          setActivities(
            (data || []).map((a: any) => ({
              id: a.id,
              titulo: a.titulo_actividad,
              descripcion: a.descripcion_actividad,
              level_id: a.level_id,
            }))
          );
        }
      });
  }, [level]);

  // Función para navegar entre niveles
  const handleNavigate = (levelId: number) => {
    navigate(`/nivel/${levelId}`);
  };

  // Función para manejar click en actividad
  const handleActivityClick = (activityId: number) => {
    navigate(`/nivel/${id}/actividad/${activityId}`);
  };

  // Función para manejar cuando se gana una medalla
  const handleMedalEarned = (medal: Medal) => {
    // Solo mostrar medalla si no estamos volviendo de una actividad
    if (!isReturningFromActivity) {
      setEarnedMedal(medal);
      // Refrescar los niveles para mostrar el progreso actualizado
      refreshLevels();
    }
  };

  // Función para cerrar la animación de medalla y navegar al siguiente nivel
  const handleMedalClose = () => {
    setEarnedMedal(null);
    // Obtener el siguiente nivel y navegar
    const { nextLevel } = getAdjacentLevels(parseInt(id!));
    if (nextLevel) {
      navigate(`/nivel/${nextLevel.levels.id}`);
    } else {
      // Si es el último nivel, ir a home
      navigate('/home');
    }
  };

  if (loading || levelsLoading) {
    return <div className="text-center py-12">Cargando nivel...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 py-12">{error}</div>;
  }
  if (!level) {
    return null;
  }

  // Obtener niveles adyacentes para navegación
  const { previousLevel, nextLevel, currentIndex, totalLevels } = getAdjacentLevels(parseInt(id!));
  const isLastLevel = currentIndex === totalLevels - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-braini-blue/10 via-white to-braini-pink/10 font-inter relative overflow-hidden flex flex-col">
      <GeometricBackground />
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center px-2 py-12 md:py-20 md:pl-80">
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-3xl shadow-2xl max-w-2xl w-full animate-fade-in border border-braini-blue/10">
          <h2 className="text-3xl font-extrabold text-braini-blue mb-2 text-left">
            Nivel {level.levels.id}: {level.levels.titulo}
          </h2>
          
          {/* Navegación entre niveles */}
          <LevelNavigation
            currentLevelId={parseInt(id!)}
            previousLevel={previousLevel}
            nextLevel={nextLevel}
            currentIndex={currentIndex}
            totalLevels={totalLevels}
            onNavigate={handleNavigate}
          />
          
          <div className="text-lg text-gray-700 mb-6 text-left">{level.levels.descripcion}</div>
          <div className="mb-8 text-left">
            <span className="font-semibold text-gray-700">Estado: </span>
            {level.status === LEVEL_STATUS.CURRENT && <span className="text-blue-700 font-bold">Actual</span>}
            {level.status === LEVEL_STATUS.COMPLETED && <span className="text-green-700 font-bold">Completado</span>}
          </div>
          <h3 className="text-2xl font-bold mb-6 text-braini-blue-dark text-left">Actividades de este nivel</h3>
          {activities.length === 0 ? (
            <div className="text-gray-400 text-left">No hay actividades para este nivel.</div>
          ) : (
            <ul className="space-y-6">
              {activities.map((activity) => (
                <li key={activity.id} 
                    className="p-6 bg-white rounded-2xl shadow-md flex flex-col gap-2 border border-braini-blue/20 hover:shadow-lg hover:border-braini-blue/40 transition-all duration-300 cursor-pointer group"
                    onClick={() => handleActivityClick(activity.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-braini-blue text-xl mb-1 group-hover:text-braini-blue-dark transition-colors">
                        {activity.titulo}
                      </div>
                      <div className="text-gray-700 text-base leading-relaxed group-hover:text-gray-800 transition-colors">
                        {activity.descripcion}
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <div className="w-10 h-10 bg-braini-blue/10 rounded-full flex items-center justify-center group-hover:bg-braini-blue/20 transition-colors">
                        <svg className="w-5 h-5 text-braini-blue group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-braini-blue mt-2 flex items-center gap-2 group-hover:text-braini-blue-dark transition-colors">
                    <div className="w-2 h-2 bg-braini-blue rounded-full group-hover:scale-125 transition-transform"></div>
                    <span className="font-medium">Hacer actividad</span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Componente de Valoración */}
          {userId && level.levels.id && (
            <LevelRating 
              levelId={level.levels.id} 
              userId={userId} 
              onMedalEarned={handleMedalEarned}
            />
          )}
        </div>
      </div>

      {/* Animación de medalla */}
      {earnedMedal && (
        <MedalAnimation
          medal={earnedMedal}
          isLastLevel={isLastLevel}
          onClose={handleMedalClose}
        />
      )}
    </div>
  );
};

export default Activities; 