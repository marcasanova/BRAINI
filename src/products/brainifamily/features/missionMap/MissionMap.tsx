import React from 'react';
import { Construction } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { MAP_SQUARE_STATUS_LABEL, type MapSquare } from './missionMapLayout';
import { MAP_BOARD_HEIGHT, MAP_BOARD_URL, MAP_BOARD_WIDTH } from './missionMapBoard';
import MissionMapTiles from './MissionMapTiles';

interface MissionMapProps {
  squares: MapSquare[];
  selectedMission: number;
  onSelect: (mission: number) => void;
  /** Casilla recién desbloqueada / completada (celebración al volver de «Guardar medalla») */
  highlightUnlocked?: number;
  highlightCompleted?: number;
  className?: string;
}

/** `?mapDebug=1` en desarrollo: contornos de las casillas visibles y coordenadas al hacer clic. */
function isMapDebug(): boolean {
  return import.meta.env.DEV && new URLSearchParams(window.location.search).has('mapDebug');
}

/** «Misiones 11–25» si son consecutivas; si no, «N misiones». */
function describeMissionRange(missions: number[]): string {
  if (missions.length === 1) return `Misión ${missions[0]}`;
  const first = missions[0];
  const last = missions[missions.length - 1];
  return last - first + 1 === missions.length ? `Misiones ${first}–${last}` : `${missions.length} misiones`;
}

/** Coordenadas del clic en el sistema de la imagen base (para revisar o ajustar contornos). */
function logClickPosition(e: React.MouseEvent<HTMLDivElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  const x = (((e.clientX - rect.left) / rect.width) * MAP_BOARD_WIDTH).toFixed(1);
  const y = (((e.clientY - rect.top) / rect.height) * MAP_BOARD_HEIGHT).toFixed(1);
  console.info(`[mapDebug] x: ${x}, y: ${y}`);
}

const labelOf = (square: MapSquare) =>
  `Misión ${square.mission}${square.titulo ? `: ${square.titulo}` : ''}, ${MAP_SQUARE_STATUS_LABEL[square.status].toLowerCase()}`;

/** Tablero de misiones: imagen base del camino + casillas interactivas dibujadas en SVG. */
const MissionMap: React.FC<MissionMapProps> = ({
  squares,
  selectedMission,
  onSelect,
  highlightUnlocked,
  highlightCompleted,
  className,
}) => {
  const debug = isMapDebug();
  const inDevelopment = squares.filter((s) => s.status === 'in_development');

  return (
    <div
      className={cn('relative w-full rounded-2xl overflow-hidden shadow-lg ring-1 ring-black/5 bg-braini-blue/10', className)}
      style={{ aspectRatio: `${MAP_BOARD_WIDTH} / ${MAP_BOARD_HEIGHT}` }}
      onClickCapture={debug ? logClickPosition : undefined}
    >
      <img
        src={MAP_BOARD_URL}
        alt="Mapa de la aventura BRAINI: el camino de las 25 misiones hasta el castillo"
        width={MAP_BOARD_WIDTH}
        height={MAP_BOARD_HEIGHT}
        className="absolute inset-0 w-full h-full object-cover select-none"
        draggable={false}
      />

      <MissionMapTiles
        squares={squares}
        selectedMission={selectedMission}
        onSelect={onSelect}
        getLabel={labelOf}
        highlightUnlocked={highlightUnlocked}
        highlightCompleted={highlightCompleted}
        debug={debug}
      />

      {inDevelopment.length > 0 && (
        <p className="absolute top-[2.5%] left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/90 px-3 py-1 text-[11px] sm:text-xs font-semibold text-gray-700 shadow-md pointer-events-none">
          <Construction className="w-3.5 h-3.5 text-braini-yellow-dark" aria-hidden="true" />
          {describeMissionRange(inDevelopment.map((s) => s.mission))} en desarrollo
        </p>
      )}
    </div>
  );
};

export default MissionMap;
