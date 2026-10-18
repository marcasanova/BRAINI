import Backgrounds from '@/shared/components/Backgrounds';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useCurrentChild } from '@/products/brainifamily/hooks/useCurrentChild';
import { useMissions } from '@/products/brainifamily/hooks/useMissions';
import { useUserMedals } from '@/products/brainifamily/hooks/useUserMedals';
import MissionMap from '@/products/brainifamily/features/missionMap/MissionMap';
import MissionDetailPanel from '@/products/brainifamily/features/missionMap/MissionDetailPanel';
import {
  buildMapSquares,
  defaultSelectedMission,
  isPlayable,
} from '@/products/brainifamily/features/missionMap/missionMapLayout';
import { useMissionsWithContent } from '@/products/brainifamily/hooks/useMissionsWithContent';
import MedalShelf from '@/products/brainifamily/features/medals/MedalShelf';
import {
  MEDAL_SHELF_ANIMATION_DELAY_MS,
  MEDAL_SHELF_ANIMATION_DURATION_MS,
  prefersReducedMotion,
} from '@/products/brainifamily/features/medals/celebration';
import MapDownload from '@/shared/components/MapDownload';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { playSound } from '@/shared/lib/sound';

interface MedalCelebration {
  missionIdCompleted: number;
  missionIdNextUnlocked?: number;
}

/** Fases de la celebración al volver de «Guardar medalla» */
type CelebrationPhase = 'waiting' | 'medals' | 'scroll' | 'highlight';

/** Pausa tras subir el progreso antes de bajar a la misión */
const PAUSE_AFTER_MEDALS_MS = 500;
/** Tiempo aproximado del scroll suave hasta la misión */
const SCROLL_DURATION_MS = 800;
/** Cuánto dura el resaltado de la misión desbloqueada */
const HIGHLIGHT_DURATION_MS = 4500;

function readCelebrationFromState(state: unknown): MedalCelebration | null {
  const s = state as { playMedalAnimation?: boolean; missionIdCompleted?: number; missionIdNextUnlocked?: number } | null;
  if (!s?.playMedalAnimation || s.missionIdCompleted == null) return null;
  return { missionIdCompleted: s.missionIdCompleted, missionIdNextUnlocked: s.missionIdNextUnlocked };
}

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { child, childId, children: childrenList, setCurrentChildId, loading: childLoading } = useCurrentChild();
  // Se lee en el primer render para que MedalShelf monte ya en el estado «antes» (N-1)
  const [celebration, setCelebration] = useState<MedalCelebration | null>(() =>
    readCelebrationFromState(location.state),
  );
  const [phase, setPhase] = useState<CelebrationPhase>('waiting');

  const { missions, loading, fetching: missionsFetching, error } = useMissions(childId);
  const { userMedals, totalMedals, loading: medalsLoading, fetching: medalsFetching } = useUserMedals(childId);

  const { missionIdsWithContent, loading: contentLoading } = useMissionsWithContent();

  const squares = useMemo(() => {
    const medalDates = new Map(userMedals.map((m) => [m.medal_id, m.fecha_obtencion]));
    return buildMapSquares(missions, missionIdsWithContent, medalDates);
  }, [missions, missionIdsWithContent, userMedals]);

  const [selectedMission, setSelectedMission] = useState<number | null>(null);
  const effectiveSelected = selectedMission ?? defaultSelectedMission(squares);
  const selectedSquare = squares.find((s) => s.mission === effectiveSelected) ?? squares[0];
  const detailPanelRef = useRef<HTMLDivElement>(null);

  const handleSelectMission = (mission: number) => {
    const square = squares.find((s) => s.mission === mission);
    playSound(square && isPlayable(square) ? 'select' : 'locked');
    setSelectedMission(mission);
    // En móvil/tablet el panel está debajo del mapa: acercarlo para que se vea
    if (!window.matchMedia('(min-width: 1024px)').matches) {
      requestAnimationFrame(() => detailPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    }
  };

  // Limpiar location.state para que la celebración no se repita al recargar
  useEffect(() => {
    if (readCelebrationFromState(location.state)) {
      setCelebration(readCelebrationFromState(location.state));
      setPhase('waiting');
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  // Hasta tener medallas y misiones frescas no arrancamos (evita animar con datos en caché)
  const waitingForFreshData = celebration != null && phase === 'waiting' && (medalsFetching || missionsFetching);

  /** Se baja a la misión desbloqueada si es jugable; si está en desarrollo, a la recién completada */
  const celebrationTarget = useCallback(
    (c: MedalCelebration): number => {
      const unlocked = squares.find((s) => s.mission === c.missionIdNextUnlocked);
      return unlocked && isPlayable(unlocked) ? unlocked.mission : c.missionIdCompleted;
    },
    [squares],
  );

  const celebrationTimersRef = useRef<number[]>([]);
  useEffect(() => () => celebrationTimersRef.current.forEach((t) => window.clearTimeout(t)), []);

  // Secuencia: subir progreso de medallas → bajar a la misión desbloqueada → iluminarla
  useEffect(() => {
    if (!celebration || phase !== 'waiting') return;
    if (childLoading || loading || medalsLoading || contentLoading || waitingForFreshData) return;

    const reduced = prefersReducedMotion();
    const timers: number[] = [];
    const after = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    setPhase('medals');
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });

    const medalsMs = reduced ? 0 : MEDAL_SHELF_ANIMATION_DELAY_MS + MEDAL_SHELF_ANIMATION_DURATION_MS + PAUSE_AFTER_MEDALS_MS;
    after(medalsMs, () => {
      setPhase('scroll');
      const targetId = celebrationTarget(celebration);
      setSelectedMission(targetId);
      document
        .getElementById(`mission-${targetId}`)
        ?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    });
    after(medalsMs + (reduced ? 0 : SCROLL_DURATION_MS), () => {
      if (celebration.missionIdNextUnlocked != null) playSound('unlock');
      setPhase('highlight');
    });
    after(medalsMs + (reduced ? 0 : SCROLL_DURATION_MS) + HIGHLIGHT_DURATION_MS, () => {
      setCelebration(null);
      setPhase('waiting');
    });
    // Los timers se limpian solo al desmontar: el cambio de fase no debe cancelar la secuencia
    celebrationTimersRef.current = timers;
  }, [celebration, celebrationTarget, phase, childLoading, loading, medalsLoading, contentLoading, waitingForFreshData]);

  const medalsAnimateFrom = celebration ? Math.max(0, userMedals.length - 1) : undefined;
  const highlightActive = celebration != null && phase === 'highlight';
  const highlightMissionUnlocked =
    highlightActive && celebrationTarget(celebration) === celebration.missionIdNextUnlocked
      ? celebration.missionIdNextUnlocked
      : undefined;
  const highlightMissionCompleted = highlightActive ? celebration.missionIdCompleted : undefined;

  return (
    <Backgrounds
      wrapWithCard={true}
      customColor="#7ea4df"
      showCircles={true}
    >
      {/* Header con título y selector de hijo (solo si hay más de uno) */}
      <div className="mb-4 md:mb-6 animate-fade-in shrink-0 flex flex-col sm:flex-row sm:items-center gap-3">
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
      <div>
        {childLoading || loading || medalsLoading || contentLoading || waitingForFreshData ? (
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
                animateFrom={medalsAnimateFrom}
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

                    {/* Columna derecha: vídeo de presentación (YouTube), acotado para no dominar la fila */}
                    <div className="w-full md:w-4/5 md:justify-self-end">
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

                  {/* Tipos de actividades */}
                  <div>
                      <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                        Así son nuestras misiones de BRAINI:
                      </h3>
                      <p className="text-sm md:text-base text-gray-600 mb-4 font-medium">
                        Cada misión contiene <span className="font-bold">4 actividades</span> diferentes, cada una con su propio color para que las identifiques fácilmente:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {/* 1. Inteligencia Emocional */}
                        <div className="p-4 rounded-xl bg-linear-to-br from-braini-blue/5 to-braini-blue/10 border-2 border-braini-blue/30 flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-braini-blue/20 flex items-center justify-center shrink-0">
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
                        <div className="p-4 rounded-xl bg-linear-to-br from-braini-turquoise/5 to-braini-turquoise/10 border-2 border-braini-turquoise/30 flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-braini-turquoise/20 flex items-center justify-center shrink-0">
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
                        <div className="p-4 rounded-xl bg-linear-to-br from-braini-pink/5 to-braini-pink/10 border-2 border-braini-pink/30 flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-braini-pink/20 flex items-center justify-center shrink-0">
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
                        <div className="p-4 rounded-xl bg-linear-to-br from-braini-yellow/5 to-braini-yellow/10 border-2 border-braini-yellow/30 flex items-start gap-3">
                          <div className="w-12 h-12 rounded-lg bg-braini-yellow/20 flex items-center justify-center shrink-0">
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
                </li>
              </ul>
            </div>

            {/* Mapa de la aventura: tablero interactivo de misiones */}
            <section
              aria-labelledby="mapa-aventura-title"
              className="bg-white/95 backdrop-blur-lg p-4 md:p-6 rounded-xl md:rounded-2xl shadow-xl border-0 animate-fade-in"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                <h2 id="mapa-aventura-title" className="text-braini-blue font-bold text-2xl md:text-3xl" style={{ fontWeight: 700 }}>
                  Mapa de la aventura
                </h2>
                <MapDownload buttonText="¡Descarga el mapa para vivir la aventura!" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[auto_minmax(0,1fr)] gap-4 md:gap-6 items-start">
                <MissionMap
                  squares={squares}
                  selectedMission={effectiveSelected}
                  onSelect={handleSelectMission}
                  highlightUnlocked={highlightMissionUnlocked}
                  highlightCompleted={highlightMissionCompleted}
                  className="lg:w-[min(64vh,38rem)]"
                />
                {selectedSquare && (
                  <div className="lg:sticky lg:top-6">
                    <MissionDetailPanel
                      ref={detailPanelRef}
                      square={selectedSquare}
                      childNivelEducativo={child?.nivel_educativo ?? undefined}
                      highlighted={highlightMissionUnlocked != null && selectedSquare.mission === highlightMissionUnlocked}
                    />
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </Backgrounds>
  );
};

export default Home; 