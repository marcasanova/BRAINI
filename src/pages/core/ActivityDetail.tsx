import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import GeometricBackground from '@/components/GeometricBackground';
import Navbar from '@/components/navigation/Navbar';
import EmotionPuzzle from '@/components/activities/EmotionPuzzle';
import ActivityNavigation from '@/components/activities/ActivityNavigation';

interface Activity {
  id: number;
  titulo: string;
  descripcion: string;
  level_id: number;
}

const ActivityDetail: React.FC = () => {
  const { levelId, activityId } = useParams<{ levelId: string; activityId: string }>();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  // Obtener actividades del nivel
  useEffect(() => {
    if (!levelId) return;
    
    setLoading(true);
    supabase
      .from("activities")
      .select("id, titulo_actividad, descripcion_actividad, level_id")
      .eq("level_id", levelId)
      .order("id", { ascending: true })
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
        setLoading(false);
      });
  }, [levelId]);

  const handlePuzzleComplete = () => {
    // Navegar a la siguiente actividad si existe, sino volver al nivel
    const currentIndex = activities.findIndex(a => a.id === parseInt(activityId!));
    const nextActivity = currentIndex < activities.length - 1 ? activities[currentIndex + 1] : null;
    
    if (nextActivity) {
      navigate(`/nivel/${levelId}/actividad/${nextActivity.id}`);
    } else {
      navigate(`/nivel/${levelId}?fromActivity=true`);
    }
  };

  // Función para navegar entre actividades
  const handleActivityNavigate = (newActivityId: number) => {
    navigate(`/nivel/${levelId}/actividad/${newActivityId}`);
  };

  // Función para volver al nivel
  const handleBackToLevel = () => {
    navigate(`/nivel/${levelId}`);
  };

  // Obtener información de navegación
  const getNavigationInfo = () => {
    const currentIndex = activities.findIndex(a => a.id === parseInt(activityId!));
    const previousActivity = currentIndex > 0 ? activities[currentIndex - 1] : null;
    const nextActivity = currentIndex < activities.length - 1 ? activities[currentIndex + 1] : null;
    
    return {
      currentIndex,
      previousActivity,
      nextActivity,
      totalActivities: activities.length
    };
  };

  const renderActivity = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-braini-blue/10 via-white to-braini-pink/10 font-inter relative overflow-hidden flex flex-col">
          <GeometricBackground />
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center px-2 py-12 md:py-20 md:pl-80">
            <div className="text-center text-gray-500 py-8">Cargando actividad...</div>
          </div>
        </div>
      );
    }

    const { currentIndex, previousActivity, nextActivity, totalActivities } = getNavigationInfo();

    if (activityId === '1') {
      return (
        <div className="min-h-screen bg-gradient-to-br from-braini-blue/10 via-white to-braini-pink/10 font-inter relative overflow-hidden flex flex-col">
          <GeometricBackground />
          <Navbar />
          <div className="flex-1 flex flex-col items-center justify-center px-2 py-12 md:py-20 md:pl-80">
            <div className="bg-white/95 backdrop-blur-lg p-8 rounded-3xl shadow-2xl max-w-6xl w-full animate-fade-in border border-braini-blue/10">
              {/* Navegación entre actividades */}
              <ActivityNavigation
                currentActivityId={parseInt(activityId!)}
                previousActivity={previousActivity}
                nextActivity={nextActivity}
                currentIndex={currentIndex}
                totalActivities={totalActivities}
                onNavigate={handleActivityNavigate}
                onBackToLevel={handleBackToLevel}
              />
              
              <EmotionPuzzle onComplete={() => {}} />
            </div>
          </div>
        </div>
      );
    }
    
    // Placeholder para otras actividades
    return (
      <div className="min-h-screen bg-gradient-to-br from-braini-blue/10 via-white to-braini-pink/10 font-inter relative overflow-hidden flex flex-col">
        <GeometricBackground />
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center px-2 py-12 md:py-20 md:pl-80">
          <div className="bg-white/95 backdrop-blur-lg p-8 rounded-3xl shadow-2xl max-w-2xl w-full animate-fade-in border border-braini-blue/10">
            {/* Navegación entre actividades */}
            <ActivityNavigation
              currentActivityId={parseInt(activityId!)}
              previousActivity={previousActivity}
              nextActivity={nextActivity}
              currentIndex={currentIndex}
              totalActivities={totalActivities}
              onNavigate={handleActivityNavigate}
              onBackToLevel={handleBackToLevel}
            />
            
            <h2 className="text-3xl font-extrabold text-braini-blue mb-4 text-center">
              Actividad {activityId}
            </h2>
            <p className="text-gray-700 text-center mb-6">
              Esta actividad estará disponible próximamente.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return renderActivity();
};

export default ActivityDetail;
