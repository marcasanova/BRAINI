import React, { useId } from 'react';
import type { MapSquare, MapSquareStatus } from './missionMapLayout';
import { MAP_BOARD_HEIGHT, MAP_BOARD_URL, MAP_BOARD_WIDTH, tileBoundingBox } from './missionMapBoard';

interface MissionMapTilesProps {
  squares: MapSquare[];
  selectedMission: number;
  onSelect: (mission: number) => void;
  getLabel: (square: MapSquare) => string;
  highlightUnlocked?: number;
  highlightCompleted?: number;
  debug?: boolean;
}

const BRAND_BLUE = '#7ea4df';
/** Azul del barrido de la casilla actual: más intenso que el de marca para que se lea sobre cualquier color */
const SWEEP_BLUE = '#4f86e0';
const GOLD = '#f8cd50';

/** Número: blanco con borde verde (como el mapa original) o estilo blanco y negro si aún no se alcanzó. */
const NUMBER_STYLE: Record<MapSquareStatus, { fill: string; stroke: string }> = {
  completed: { fill: '#ffffff', stroke: '#3c9a40' },
  current: { fill: '#ffffff', stroke: '#3c9a40' },
  locked: { fill: '#ffffff', stroke: '#1f2937' },
  in_development: { fill: '#f3f4f6', stroke: '#9ca3af' },
};

const isReached = (status: MapSquareStatus) => status === 'completed' || status === 'current';

/**
 * Las 25 casillas dibujadas en SVG sobre la imagen base (camino en blanco, sin números),
 * en el mismo sistema de coordenadas que la imagen:
 * - superada / actual: loseta con su color original (los tablones, con su marrón);
 * - bloqueada: loseta en blanco y tablón en gris, número en blanco y negro;
 * - en desarrollo: como bloqueada, más lavada y con rayado diagonal.
 * La actual lleva un barrido de luz azul que la cruza cada pocos segundos. Todo recortado a la forma exacta.
 */
const MissionMapTiles: React.FC<MissionMapTilesProps> = ({
  squares,
  selectedMission,
  onSelect,
  getLabel,
  highlightUnlocked,
  highlightCompleted,
  debug = false,
}) => {
  // useId puede contener caracteres no válidos dentro de url(#…)
  const uid = `mm${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const ref = (name: string) => `url(#${uid}-${name})`;

  const handleKeyDown = (mission: number) => (e: React.KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(mission);
    }
  };

  return (
    <svg
      viewBox={`0 0 ${MAP_BOARD_WIDTH} ${MAP_BOARD_HEIGHT}`}
      className="absolute inset-0 w-full h-full"
      role="group"
      aria-label="Casillas del mapa"
    >
      <defs>
        <filter id={`${uid}-gray`} colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.9" intercept="0.12" />
            <feFuncG type="linear" slope="0.9" intercept="0.12" />
            <feFuncB type="linear" slope="0.9" intercept="0.12" />
          </feComponentTransfer>
        </filter>
        <filter id={`${uid}-gray-light`} colorInterpolationFilters="sRGB">
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncR type="linear" slope="0.5" intercept="0.45" />
            <feFuncG type="linear" slope="0.5" intercept="0.45" />
            <feFuncB type="linear" slope="0.5" intercept="0.45" />
          </feComponentTransfer>
        </filter>
        <filter id={`${uid}-blur`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <pattern id={`${uid}-hatch`} width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="3" height="9" fill="#9ca3af" opacity="0.35" />
        </pattern>
        <linearGradient id={`${uid}-sweep`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="white" stopOpacity="0" />
          <stop offset="0.5" stopColor="white" stopOpacity="0.85" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-sweep-blue`} x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor={SWEEP_BLUE} stopOpacity="0" />
          <stop offset="0.3" stopColor={SWEEP_BLUE} stopOpacity="0.85" />
          <stop offset="0.5" stopColor="white" stopOpacity="0.9" />
          <stop offset="0.7" stopColor={SWEEP_BLUE} stopOpacity="0.85" />
          <stop offset="1" stopColor={SWEEP_BLUE} stopOpacity="0" />
        </linearGradient>
        <pattern id={`${uid}-board`} width={MAP_BOARD_WIDTH} height={MAP_BOARD_HEIGHT} patternUnits="userSpaceOnUse">
          <image href={MAP_BOARD_URL} width={MAP_BOARD_WIDTH} height={MAP_BOARD_HEIGHT} />
        </pattern>
        {squares.map((s) => (
          <clipPath key={s.mission} id={`${uid}-tile-${s.mission}`}>
            <path d={s.tile.d} />
          </clipPath>
        ))}
      </defs>

      {squares.map((square) => {
        const { tile, status } = square;
        const { d } = tile;
        const reached = isReached(status);
        const isSelected = square.mission === selectedMission;
        const isJustUnlocked = square.mission === highlightUnlocked;
        const isJustCompleted = square.mission === highlightCompleted;
        const box = tileBoundingBox(d);
        const number = NUMBER_STYLE[status];
        const fontSize = tile.size * 0.46;

        return (
          <g
            key={square.mission}
            id={`mission-${square.mission}`}
            role="button"
            tabIndex={0}
            aria-label={getLabel(square)}
            aria-pressed={isSelected}
            aria-disabled={status === 'in_development' || undefined}
            onClick={() => onSelect(square.mission)}
            onKeyDown={handleKeyDown(square.mission)}
            className="group cursor-pointer outline-hidden"
          >
            {/* Celebración: halo azul en la recién desbloqueada, dorado en la recién completada */}
            {(isJustUnlocked || isJustCompleted) && (
              <path
                d={d}
                fill="none"
                stroke={isJustCompleted ? GOLD : BRAND_BLUE}
                strokeWidth={isJustUnlocked ? 16 : 11}
                strokeLinejoin="round"
                filter={ref('blur')}
                className={isJustUnlocked ? 'map-tile-breathe-fast' : 'map-tile-breathe'}
                pointerEvents="none"
              />
            )}

            {/* Color de la casilla: se «enciende» con una transición al alcanzarla */}
            {tile.kind === 'path' ? (
              <path
                d={d}
                fill={tile.color}
                fillOpacity={reached ? 1 : 0}
                className="transition-[fill-opacity] duration-700 ease-out"
                pointerEvents="none"
              />
            ) : (
              // Tablón pendiente: la propia ilustración (pattern) en gris, con la forma exacta
              <path
                d={d}
                fill={ref('board')}
                filter={ref(status === 'in_development' ? 'gray-light' : 'gray')}
                opacity={reached ? 0 : 1}
                className="transition-opacity duration-700 ease-out"
                pointerEvents="none"
              />
            )}
            {status === 'in_development' && <path d={d} fill={ref('hatch')} pointerEvents="none" />}

            {/* Barrido dentro de la casilla: azul periódico en la actual; blanco en la celebración de desbloqueo */}
            {(status === 'current' || isJustUnlocked) && (
              <g clipPath={ref(`tile-${square.mission}`)} pointerEvents="none">
                <rect
                  x={box.x}
                  y={box.y}
                  width={box.width * 0.7}
                  height={box.height}
                  fill={ref(isJustUnlocked ? 'sweep' : 'sweep-blue')}
                  className={isJustUnlocked ? 'animate-unlock-sweep' : 'map-tile-current-sweep'}
                  style={{ transformBox: 'fill-box' }}
                />
              </g>
            )}

            {/* Zona de clic = forma exacta; velo suave al pasar por encima */}
            <path d={d} fill="white" className="opacity-0 transition-opacity duration-200 group-hover:opacity-20" />

            <text
              x={tile.cx}
              y={tile.cy}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="Fredoka, Montserrat, sans-serif"
              fontWeight={600}
              fontSize={fontSize}
              fill={number.fill}
              stroke={number.stroke}
              strokeWidth={fontSize * 0.14}
              strokeLinejoin="round"
              paintOrder="stroke"
              aria-hidden="true"
              pointerEvents="none"
              className="select-none transition-[fill,stroke] duration-700"
            >
              {square.mission}
            </text>

            {/* Foco de teclado */}
            <path
              d={d}
              fill="none"
              stroke={GOLD}
              strokeWidth={5}
              strokeLinejoin="round"
              className="opacity-0 group-focus-visible:opacity-100"
              pointerEvents="none"
            />

            {debug && <path d={d} fill="none" stroke="#ff00ff" strokeWidth={1.5} pointerEvents="none" />}
          </g>
        );
      })}

      {/* Contorno de la seleccionada en capa superior: así no lo tapan las casillas vecinas */}
      <g pointerEvents="none" aria-hidden="true">
        {squares
          .filter((s) => s.mission === selectedMission)
          .map(({ mission, tile }) => (
            <path
              key={mission}
              d={tile.d}
              fill="none"
              stroke="white"
              strokeWidth={4.5}
              strokeLinejoin="round"
              style={{ filter: 'drop-shadow(0 0 4px rgba(126,164,223,0.95)) drop-shadow(0 3px 6px rgba(0,0,0,0.25))' }}
            />
          ))}
      </g>
    </svg>
  );
};

export default MissionMapTiles;
