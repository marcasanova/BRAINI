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
                <div className="space-y-4 md:space-y-5 pb-4">
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
                          <div className="font-semibold text-base md:text-lg flex items-center gap-2 mb-2">
                            Sesión 0. Descubre como aprender con Braini Emotions
                            <span className="ml-2 text-xs bg-braini-blue/20 text-braini-blue-dark px-2 py-0.5 rounded">Tutorial</span>
                          </div>
                          <div className="text-gray-700 mt-2 text-sm md:text-base font-medium leading-relaxed">
                            En esta sesión aprenderás a usar la app, en qué consisten los retos y desafíos, los aprendizajes, formación y acompañamiento emocional para tu día a día.
                          </div>
                        </div>
                        <div className="mt-3 md:mt-0 md:ml-6 flex items-center gap-3">
                          <MapDownload />
                        </div>
                      </li>
                    </ul>

                    {/* Explicación de tipos de actividades */}
                    <div className="mt-6 p-4 md:p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-200">
                      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        Tipos de actividades en cada sesión
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mb-4 font-medium">
                        Cada sesión contiene 4 actividades diferentes, cada una con su propio color para que las identifiques fácilmente:
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
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
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-6 h-6 rounded border-2 border-braini-blue/40 bg-braini-blue/20"></div>
                              <span className="text-xs font-semibold text-braini-blue-dark">Color Azul</span>
                            </div>
                          </div>
                        </div>

                        {/* 2. Actividad Técnica */}
                        <div className="p-4 rounded-xl bg-gradient-to-br from-braini-turquoise/5 to-braini-turquoise/10 border-2 border-braini-turquoise/30 flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-braini-turquoise/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl font-black text-braini-turquoise-dark">2</span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-braini-turquoise-dark text-base md:text-lg mb-1">
                              Actividad Técnica
                            </h4>
                            <p className="text-sm text-gray-700 font-medium">
                              Ejercicios prácticos de relajación, respiración y técnicas corporales.
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-6 h-6 rounded border-2 border-braini-turquoise/40 bg-braini-turquoise/20"></div>
                              <span className="text-xs font-semibold text-braini-turquoise-dark">Color Verde</span>
                            </div>
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
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-6 h-6 rounded border-2 border-braini-pink/40 bg-braini-pink/20"></div>
                              <span className="text-xs font-semibold text-braini-pink-dark">Color Rosa</span>
                            </div>
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
                            <div className="mt-2 flex items-center gap-2">
                              <div className="w-6 h-6 rounded border-2 border-braini-yellow/40 bg-braini-yellow/20"></div>
                              <span className="text-xs font-semibold text-braini-yellow-dark">Color Amarillo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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