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
import ChildSwitcher from '@/products/brainifamily/features/children/ChildSwitcher';
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

/** Los 4 tipos de actividad de cada misión; el color de cada uno se repite en toda la app. */
const MISSION_ACTIVITY_TYPES = [
  { name: 'Inteligencia emocional', color: 'bg-braini-blue', description: 'Reconocemos y ponemos nombre a lo que sentimos con juegos, historias y preguntas.' },
  { name: 'Regulación emocional', color: 'bg-braini-turquoise', description: 'Ejercicios sencillos para respirar, relajarnos y volver a la calma.' },
  { name: 'Vínculo afectivo', color: 'bg-braini-pink', description: 'Un gesto de cariño compartido para cerrar la sesión juntos.' },
  { name: 'Acompañamiento emocional', color: 'bg-braini-yellow', description: 'Un espacio para los adultos: ideas para acompañar con calma en el día a día.' },
];

const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { child, childId, loading: childLoading } = useCurrentChild();
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

  const isContentReady =
    !(childLoading || loading || medalsLoading || contentLoading || waitingForFreshData) && !error;

  return (
    <Backgrounds
      wrapWithCard
      tone="blue"
      title="Panel de juego"
      subtitle={child?.nombre ? `Sigue la aventura de ${child.nombre}, misión a misión.` : 'Sigue la aventura, misión a misión.'}
      actions={<ChildSwitcher />}
      headerExtra={
        // Se monta junto al contenido: la celebración necesita que aparezca ya con datos frescos
        isContentReady ? (
          <div className="bg-white/70 rounded-2xl px-4 py-3">
            <MedalShelf
              userMedals={userMedals}
              totalMedals={totalMedals}
              isLoading={medalsLoading}
              childNivelEducativo={child?.nivel_educativo ?? undefined}
              animateFrom={medalsAnimateFrom}
            />
          </div>
        ) : undefined
      }
    >
      {/* Área de contenido con scroll */}
      <div>
        {childLoading || loading || medalsLoading || contentLoading || waitingForFreshData ? (
          <div className="text-center text-ink/70 py-8 font-medium">Cargando misiones...</div>
        ) : error ? (
          <div className="text-center text-red-700 py-8 font-medium">{error}</div>
        ) : (
          <div className="space-y-4 md:space-y-5 pb-20 md:pb-4">
            {/* Misión 0: cómo funciona la aventura (antes del mapa) */}
            <section aria-labelledby="mision-0-title" className="bg-white rounded-2xl shadow-surface p-5 md:p-7">
              <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] gap-6 lg:gap-8 items-start">
                <div>
                  <h2 id="mision-0-title" className="font-display text-2xl md:text-3xl font-semibold text-ink">
                    Misión 0. Empieza la aventura
                  </h2>
                  <p className="mt-2 text-base text-ink/80 max-w-prose">
                    Mirad juntos el vídeo de bienvenida. Cada casilla del mapa es un pequeño paso de bienestar emocional
                    en familia, y en el mapa veréis por dónde vais y todo lo que vais consiguiendo.
                  </p>

                  <h3 className="mt-6 font-display text-lg font-semibold text-ink">Cada misión tiene 4 actividades, en este orden</h3>
                  <ol className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {MISSION_ACTIVITY_TYPES.map((type, index) => (
                      <li key={type.name} className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className={`shrink-0 w-8 h-8 rounded-lg ${type.color} flex items-center justify-center font-display font-semibold text-ink`}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-semibold text-ink">{type.name}</p>
                          <p className="text-sm text-ink/75">{type.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/D91r2nVlInE"
                    title="Vídeo de bienvenida a la aventura"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            </section>

            {/* Mapa de la aventura: tablero interactivo de misiones */}
            <section
              aria-labelledby="mapa-aventura-title"
              className="bg-white p-4 md:p-6 rounded-2xl shadow-surface"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                <h2 id="mapa-aventura-title" className="font-display text-2xl md:text-3xl font-semibold text-ink">
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