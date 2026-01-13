import React, { useEffect, useState } from 'react';
import Backgrounds from '@/components/Backgrounds';
import { supabase } from '@/lib/supabaseClient';
import { useUserSessions } from '@/hooks/useUserLevels';
import { useUserMedals } from '@/hooks/useUserMedals';
import SessionList from '@/components/levels/LevelList';
import MedalShelf from '@/components/medals/MedalShelf';
import MapDownload from '@/components/MapDownload';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [userMedalsMap, setUserMedalsMap] = useState<Map<number, string>>(new Map()); // Map<levelId, fecha_obtencion>
  const [medalsLoading, setMedalsLoading] = useState(true);
  const { toast } = useToast();

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
  const { userMedals, totalMedals, loading: medalsShelfLoading } = useUserMedals();

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
            {/* Header con título - Fijo en la parte superior */}
            <div className="mb-4 md:mb-6 animate-fade-in flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white" style={{ fontWeight: 900 }}>
                {userName ? `Estas son tus sesiones, ${userName}` : 'Tus Sesiones'}
              </h1>
            </div>

            {/* Área de contenido con scroll */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {loading || medalsLoading ? (
                <div className="text-center text-white/90 py-8 font-medium">Cargando sesiones...</div>
              ) : error ? (
                <div className="text-center text-red-200 py-8 font-medium">{error}</div>
              ) : (
                <div className="space-y-4 md:space-y-5 pb-20 md:pb-4">
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
                      <li>
                        <div className="mb-4">
                          <div className="text-braini-blue font-bold text-2xl md:text-3xl flex items-center gap-2 mb-2" style={{ fontWeight: 700 }}>
                            Sesión0: <span className="text-xl md:text-2xl" style={{ fontWeight: 700 }}>Tutorial</span>
                          </div>
                        </div>
                        
                        {/* Layout: Mapa a la izquierda, Tipos de actividades a la derecha */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                          {/* Columna izquierda: Mapa y botón */}
                          <div className="flex flex-col gap-4">
                            <div className="w-full">
                              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                Mapa con las actividades
                              </h3>
                              <p className="text-sm md:text-base text-gray-600 mb-4 font-medium">
                                Descarga el mapa físico para seguir el progreso de las actividades en cada sesión.
                              </p>
                            </div>
                            <div className="w-full max-w-[280px] sm:max-w-xs md:max-w-md mx-auto rounded-lg overflow-hidden flex items-center justify-center">
                              <img 
                                src="https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/braini-map/Panel%20juego%20Rescate%20de%20Azon.jpg"
                                alt="Mapa Físico"
                                className="w-full h-auto object-contain"
                              />
                            </div>
                            <div className="flex justify-center">
                              <MapDownload />
                            </div>
                          </div>

                          {/* Columna derecha: Tipos de actividades en columna */}
                          <div className="flex flex-col">
                            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                              Tipos de actividades
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 mb-4 font-medium">
                              Cada sesión contiene <span className="font-bold">4 actividades</span> diferentes, cada una con su propio color para que las identifiques fácilmente:
                            </p>
                            
                            <div className="flex flex-col gap-3 md:gap-4">
                              {/* 1. Inteligencia Emocional */}
                              <div className="p-4 rounded-xl bg-gradient-to-br from-braini-blue/5 to-braini-blue/10 border-2 border-braini-blue/30 flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg bg-braini-blue/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xl font-black text-braini-blue-dark">1</span>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-braini-blue-dark text-base md:text-lg mb-1">
                                    Inteligencia Emocional
                                  </h4>
                                  <p className="text-sm text-gray-700 font-medium">
                                    Actividades para desarrollar habilidades emocionales y reconocer emociones.
                                  </p>
                                </div>
                              </div>

                              {/* 2. Regulación Emocional */}
                              <div className="p-4 rounded-xl bg-gradient-to-br from-braini-turquoise/5 to-braini-turquoise/10 border-2 border-braini-turquoise/30 flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg bg-braini-turquoise/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xl font-black text-braini-turquoise-dark">2</span>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-braini-turquoise-dark text-base md:text-lg mb-1">
                                    Regulación Emocional
                                  </h4>
                                  <p className="text-sm text-gray-700 font-medium">
                                    Ejercicios prácticos de relajación, respiración y técnicas corporales.
                                  </p>
                                </div>
                              </div>

                              {/* 3. Vínculo Afectivo */}
                              <div className="p-4 rounded-xl bg-gradient-to-br from-braini-pink/5 to-braini-pink/10 border-2 border-braini-pink/30 flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg bg-braini-pink/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xl font-black text-braini-pink-dark">3</span>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-braini-pink-dark text-base md:text-lg mb-1">
                                    Vínculo Afectivo
                                  </h4>
                                  <p className="text-sm text-gray-700 font-medium">
                                    Momentos de conexión y fortalecimiento del vínculo familiar.
                                  </p>
                                </div>
                              </div>

                              {/* 4. Acompañamiento Emocional */}
                              <div className="p-4 rounded-xl bg-gradient-to-br from-braini-yellow/5 to-braini-yellow/10 border-2 border-braini-yellow/30 flex items-start gap-3">
                                <div className="w-12 h-12 rounded-lg bg-braini-yellow/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xl font-black text-braini-yellow-dark">4</span>
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-bold text-braini-yellow-dark text-base md:text-lg mb-1">
                                    Acompañamiento Emocional
                                  </h4>
                                  <p className="text-sm text-gray-700 font-medium">
                                    Herramientas y recursos para el apoyo emocional en el día a día.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
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
        </div>
      </div>
    </Backgrounds>
  );
};

export default Home; 