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
  const [childName, setChildName] = useState<string | undefined>(undefined);
  const [childNivelEducativo, setChildNivelEducativo] = useState<string | undefined>(undefined);
  const [userMedalsMap, setUserMedalsMap] = useState<Map<number, string>>(new Map()); // Map<levelId, fecha_obtencion>
  const [medalsLoading, setMedalsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          console.error('Error de autenticación:', authError);
          setMedalsLoading(false);
          return;
        }

        setUserId(user?.id);
        
        if (user?.id) {
          try {
            // Buscar el nombre del niño en la tabla children
            const { data: childData, error } = await supabase
              .from('children')
              .select('nombre, nivel_educativo')
              .eq('parent_id', user.id)
              .single();
            
            if (childData?.nombre) {
              setChildName(childData.nombre);
            }
          if (childData?.nivel_educativo) {
            setChildNivelEducativo(childData.nivel_educativo);
          }

            // Obtener medallas del usuario para el Map
            const { data: medalsData, error: medalsError } = await supabase
              .from('parents_medals')
              .select('medal_id, fecha_obtencion')
              .eq('user_id', user.id);

            if (medalsError) {
              console.error('Error al obtener medallas:', medalsError);
            } else {
              const medalsMap = new Map<number, string>();
              medalsData?.forEach((medal) => {
                medalsMap.set(medal.medal_id, medal.fecha_obtencion);
              });
              setUserMedalsMap(medalsMap);
            }
          } catch (error) {
            console.error('Error cargando datos del usuario:', error);
          }
        }
      } catch (error) {
        console.error('Error general:', error);
      } finally {
        // ✅ SIEMPRE ejecutar setMedalsLoading(false)
        setMedalsLoading(false);
      }
    };

    loadUserData();
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
                {childName ? `${childName} ¡Empieza la aventura!` : '¡Empieza la aventura!'}
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
                      childNivelEducativo={childNivelEducativo}
                    />
                  </div>

                  {/* Misión 0 - ¡Comienza la aventura! - Hardcodeado */}
                  <div className="bg-white/95 backdrop-blur-lg p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-0 animate-fade-in">
                    <ul className="space-y-0">
                      <li>
                        {/* Misión 0: Título + bullets a la izquierda, vídeo a la derecha */}
                        <div className="mb-6 grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 items-start">
                          {/* Columna izquierda: título + bullets */}
                          <div>
                            <div
                              className="text-braini-blue font-bold text-2xl md:text-3xl flex items-center gap-2 mb-4"
                              style={{ fontWeight: 700 }}
                            >
                              Misión 0.{' '}
                              <span className="text-xl md:text-2xl" style={{ fontWeight: 700 }}>
                                ¡Comienza la aventura!
                              </span>
                            </div>
                            <ul className="text-sm md:text-base text-gray-600 font-medium space-y-2">
                              <li className="flex items-start">
                                <span className="mr-3">•</span>
                                <span>Esta misión es solo para entender el recorrido y empezar con calma.</span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-3">•</span>
                                <span>
                                  Cada casilla del mapa es un pequeño paso de neurobienestar emocional en familia.
                                </span>
                              </li>
                              <li className="flex items-start">
                                <span className="mr-3">•</span>
                                <span>Con él veremos por dónde vamos y todo lo que vamos logrando juntos.</span>
                              </li>
                            </ul>
                          </div>

                          {/* Columna derecha: vídeo de presentación (YouTube) */}
                          <div className="w-full">
                            <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden shadow-md">
                              <iframe
                                className="absolute inset-0 w-full h-full"
                                src="https://www.youtube.com/embed/yXWxs8n0Jjs"
                                title="Pizza para cenar - Misión 0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                              />
                            </div>
                          </div>
                        </div>

                        {/* Dos columnas: mapa a la izquierda, tipos de actividades a la derecha */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                          {/* Columna izquierda: mapa y botón de descarga */}
                          <div className="flex flex-col">
                            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                              Mapa de misiones
                            </h3>
                            <MapDownload
                              showImage
                              buttonText="¡Descarga el mapa para vivir la aventura!"
                            />
                          </div>

                          {/* Columna derecha: tipos de actividades */}
                          <div className="flex flex-col">
                            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                              Así son nuestras misiones de BRAINI:
                            </h3>
                            <p className="text-sm md:text-base text-gray-600 mb-4 font-medium">
                              Cada misión contiene <span className="font-bold">4 actividades</span> diferentes, cada una con su propio color para que las identifiques fácilmente:
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
                                  <p className="text-sm font-semibold text-gray-800 mb-2">
                                    Aprendemos a reconocer cómo nos sentimos
                                  </p>
                                  <p className="text-sm text-gray-700 font-medium">
                                    Jugamos juntos para descubrir, nombrar y entender nuestras emociones a través de juegos, historias y preguntas.
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
                                  <p className="text-sm font-semibold text-gray-800 mb-2">
                                    Descubrimos cómo calmarnos y escuchar nuestro cuerpo
                                  </p>
                                  <p className="text-sm text-gray-700 font-medium">
                                    Aprendemos ejercicios sencillos para respirar, relajarnos y volver a la calma cuando lo necesitamos.
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
                                  <p className="text-sm font-semibold text-gray-800 mb-2">
                                    Cerramos la sesión con un momento especial juntos
                                  </p>
                                  <p className="text-sm text-gray-700 font-medium">
                                    Compartimos un gesto de cariño (abrazo, mirada, palabras bonitas) para conectar y cerrar la aventura juntos.
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
                                  <p className="text-sm font-semibold text-gray-800 mb-2">
                                    Un espacio solo para las personas adultas
                                  </p>
                                  <p className="text-sm text-gray-700 font-medium">
                                    Información y orientaciones para acompañar emocionalmente a tu hijo/a con calma en el día a día.
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
                      <SessionList sessions={sessions} userMedals={userMedalsMap} childNivelEducativo={childNivelEducativo} />
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