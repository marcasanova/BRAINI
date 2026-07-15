import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCurrentChild } from '@/products/brainifamily/hooks/useCurrentChild';
import { useMissions } from '@/products/brainifamily/hooks/useMissions';
import { useUserMedals } from '@/products/brainifamily/hooks/useUserMedals';
import MissionList from '@/products/brainifamily/features/missions/MissionList';
import MedalShelf from '@/products/brainifamily/features/medals/MedalShelf';
import MapDownload from '@/shared/components/MapDownload';
import { useToast } from '@/shared/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';

interface MedalHighlightState {
  missionIdCompleted?: number;
  missionIdNextUnlocked?: number;
}

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { child, childId, children: childrenList, setCurrentChildId, loading: childLoading } = useCurrentChild();
  const [medalHighlight, setMedalHighlight] = useState<MedalHighlightState>({});
  const { toast } = useToast();

  const { missions, loading, error } = useMissions(childId);
  const { userMedals, totalMedals, loading: medalsLoading } = useUserMedals(childId);

  const userMedalsMap = useMemo(() => {
    const map = new Map<number, string>();
    userMedals.forEach((medal) => {
      map.set(medal.medal_id, medal.fecha_obtencion);
    });
    return map;
  }, [userMedals]);

  // Al llegar desde "Guardar medalla", mostrar highlights en la lista de misiones y limpiar location.state
  useEffect(() => {
    const state = location.state as { playMedalAnimation?: boolean; missionIdCompleted?: number; missionIdNextUnlocked?: number } | null;
    if (state?.playMedalAnimation && state.missionIdCompleted != null) {
      setMedalHighlight({
        missionIdCompleted: state.missionIdCompleted,
        missionIdNextUnlocked: state.missionIdNextUnlocked,
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Quitar highlights tras 2.5s
  useEffect(() => {
    if (medalHighlight.missionIdCompleted == null) return;
    const t = setTimeout(() => setMedalHighlight({}), 2500);
    return () => clearTimeout(t);
  }, [medalHighlight.missionIdCompleted]);

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
            {/* Header con título y selector de hijo (solo si hay más de uno) */}
            <div className="mb-4 md:mb-6 animate-fade-in flex-shrink-0 flex flex-col sm:flex-row sm:items-center gap-3">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white" style={{ fontWeight: 900 }}>
                {child?.nombre ? `${child.nombre} ¡Empieza la aventura!` : '¡Empieza la aventura!'}
              </h1>
              {childrenList.length > 1 && (
                <Select value={child?.id ?? ''} onValueChange={setCurrentChildId}>
                  <SelectTrigger className="w-full sm:w-auto min-w-[180px] bg-white/95 border-white text-gray-800 font-medium shadow-md hover:bg-white">
                    <SelectValue placeholder="Elegir niño/a" />
                  </SelectTrigger>
                  <SelectContent>
                    {childrenList.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.school_name ? `${c.nombre} · ${c.school_name}` : c.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Área de contenido con scroll */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {childLoading || loading || medalsLoading ? (
                <div className="text-center text-white/90 py-8 font-medium">Cargando misiones...</div>
              ) : error ? (
                <div className="text-center text-red-200 py-8 font-medium">{error}</div>
              ) : (
                <div className="space-y-4 md:space-y-5 pb-20 md:pb-4">
                  {/* Sección de Medallas - Primera */}
                  <div className="bg-white/95 backdrop-blur-lg p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-0 animate-fade-in">
                    <MedalShelf 
                      userMedals={userMedals} 
                      totalMedals={totalMedals}
                      isLoading={medalsLoading}
                      childNivelEducativo={child?.nivel_educativo ?? undefined}
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
                                src="https://www.youtube.com/embed/D91r2nVlInE"
                                title="Misión 0 - Vídeo introducción"
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

                  {/* Resto de misiones */}
                  <div className="bg-white/95 backdrop-blur-lg p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-0 animate-fade-in">
                    <ul className="space-y-3 md:space-y-4">
                      <MissionList
                        missions={missions}
                        userMedals={userMedalsMap}
                        childNivelEducativo={child?.nivel_educativo ?? undefined}
                        highlightMissionCompleted={medalHighlight.missionIdCompleted}
                        highlightMissionUnlocked={medalHighlight.missionIdNextUnlocked}
                      />
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