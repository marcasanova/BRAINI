import React, { useEffect, useState } from 'react';
import Backgrounds from '@/components/Backgrounds';
import { supabase } from '@/lib/supabaseClient';
import { useUserSessions } from '@/hooks/useUserLevels';
import { useUserMedals } from '@/hooks/useUserMedals';
import SessionList from '@/components/levels/LevelList';
import MedalShelf from '@/components/medals/MedalShelf';
import MapDownload from '@/components/MapDownload';
import { useToast } from '@/hooks/use-toast';
import { Sparkles } from 'lucide-react';

const Home = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [userMedalsMap, setUserMedalsMap] = useState<Map<number, string>>(new Map()); // Map<levelId, fecha_obtencion>
  const [medalsLoading, setMedalsLoading] = useState(true);
  const { toast } = useToast();
  const { userMedals, totalMedals, loading: medalsShelfLoading } = useUserMedals();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUserId(user?.id);
      if (user?.id) {
        // Buscar el nombre del usuario en la tabla parents
        const { data: parentData, error } = await supabase
          .from('parents')
          .select('nombre')
          .eq('id', user.id)
          .single();
        if (parentData && parentData.nombre) {
          setUserName(parentData.nombre);
        }

        // Obtener medallas del usuario para el Map (usado en las sesiones)
        // El medal_id coincide con el level_id
        const { data: medalsData, error: medalsError } = await supabase
          .from('parents_medals')
          .select('medal_id, fecha_obtencion')
          .eq('user_id', user.id);

        if (medalsError) {
          console.error('Error al obtener medallas:', medalsError);
        } else {
          // Crear un Map con levelId -> fecha_obtencion
          const medalsMap = new Map<number, string>();
          medalsData?.forEach((medal) => {
            // medal_id es igual al level_id
            medalsMap.set(medal.medal_id, medal.fecha_obtencion);
          });
          setUserMedalsMap(medalsMap);
        }
        setMedalsLoading(false);
      }
    });
  }, []);

  const { sessions, loading, error } = useUserSessions(userId);

  return (
    <Backgrounds 
      wrapWithCard={true} 
      enableInternalScroll={true}
      customGradient="linear-gradient(135deg, rgba(126, 164, 223, 1) 25%, rgba(53, 189, 177, 1) 75%)"
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header con título */}
          <div className="mb-4 md:mb-6 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white" style={{ fontWeight: 900 }}>
              {userName ? `Estas son tus sesiones, ${userName}` : 'Tus Sesiones'}
            </h1>
          </div>

          {loading || medalsLoading ? (
            <div className="text-center text-white/90 py-8 font-medium">Cargando sesiones...</div>
          ) : error ? (
            <div className="text-center text-red-200 py-8 font-medium">{error}</div>
          ) : (
            <div className="space-y-4 md:space-y-5">
              {/* Sección de Medallas - Primera */}
              <div className="bg-white/95 backdrop-blur-lg p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-0 animate-fade-in">
                <MedalShelf 
                  userMedals={userMedals} 
                  totalMedals={totalMedals}
                  isLoading={medalsShelfLoading}
                />
              </div>

              {/* Sesión 0 - Tutorial - Hardcodeado */}
              <div className="bg-white/95 backdrop-blur-lg p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-0 animate-fade-in">
                <ul className="space-y-0">
                  <li className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-5 rounded-xl border-2 border-dashed border-braini-blue bg-gradient-to-br from-braini-blue/10 to-braini-turquoise/10 shadow-md hover:shadow-lg transition-all">
                    <div className="flex-1">
                      <div className="font-semibold text-base md:text-lg flex items-center gap-2">
                        <Sparkles className="w-4 h-4 md:w-5 md:h-5 text-braini-blue" />
                        Sesión 0 - Tutorial
                        <span className="ml-2 text-xs bg-braini-blue/20 text-braini-blue-dark px-2 py-0.5 rounded">Tutorial</span>
                      </div>
                      <div className="text-braini-blue font-black text-lg md:text-xl mt-1" style={{ fontWeight: 900 }}>
                        Aprende a usar Braini Emotions
                      </div>
                      <div className="text-gray-700 mt-1 text-sm md:text-base font-medium">
                        Descubre cómo funciona el sistema y aprovecha al máximo todas las funcionalidades
                      </div>
                    </div>
                    <div className="mt-3 md:mt-0 md:ml-6 flex items-center gap-3">
                      <MapDownload />
                    </div>
                  </li>
                </ul>
              </div>

              {/* Resto de sesiones */}
              <div className="bg-white/95 backdrop-blur-lg p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-0 animate-fade-in">
                <ul className="space-y-3 md:space-y-4">
                  <SessionList sessions={sessions} userMedals={userMedalsMap} />
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </Backgrounds>
  );
};

export default Home; 