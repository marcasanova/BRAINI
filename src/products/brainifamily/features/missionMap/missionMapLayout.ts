import { MISSION_STATUS } from '@/shared/lib/constants/missionStatus';
import type { MissionWithProgress } from '@/integrations/supabase/queries/missions';
import { MAP_TILES, type MapTile } from './missionMapBoard';

export type MapSquareStatus = 'completed' | 'current' | 'locked' | 'in_development';

export interface MapSquare {
  mission: number;
  /** Geometría de la casilla en el tablero (forma, centroide, color original) */
  tile: MapTile;
  status: MapSquareStatus;
  titulo: string | null;
  descripcion: string | null;
  medalDate: string | null;
}

export const MAP_SQUARE_STATUS_LABEL: Record<MapSquareStatus, string> = {
  completed: 'Superada',
  current: 'Disponible',
  locked: 'Por desbloquear',
  in_development: 'En desarrollo',
};

/** Se puede entrar en la misión (superada o actual). */
export function isPlayable(square: MapSquare): boolean {
  return square.status === 'completed' || square.status === 'current';
}

function toSquareStatus(status: string): MapSquareStatus {
  if (status === MISSION_STATUS.COMPLETED) return 'completed';
  if (status === MISSION_STATUS.CURRENT) return 'current';
  return 'locked';
}

/**
 * Cruza las 25 casillas del tablero con el progreso del niño (casilla N = misión con `missions.id = N`).
 * Una casilla está «en desarrollo» si la misión no tiene fila en `child_missions`
 * o no tiene actividades en el catálogo (`missionIdsWithContent`).
 */
export function buildMapSquares(
  missions: MissionWithProgress[],
  missionIdsWithContent: ReadonlySet<number> | null,
  medalDatesByMission: ReadonlyMap<number, string>,
): MapSquare[] {
  const byId = new Map(missions.map((m) => [m.missions.id, m]));

  return MAP_TILES.map((tile) => {
    const { mission } = tile;
    const progress = byId.get(mission);
    const hasContent = missionIdsWithContent == null || missionIdsWithContent.has(mission);
    return {
      mission,
      tile,
      status: progress && hasContent ? toSquareStatus(progress.status) : 'in_development',
      titulo: progress?.missions.titulo ?? null,
      descripcion: progress?.missions.descripcion ?? null,
      medalDate: medalDatesByMission.get(mission) ?? null,
    };
  });
}

/** Casilla seleccionada por defecto: la actual; si no hay, la última superada; si no, la primera. */
export function defaultSelectedMission(squares: MapSquare[]): number {
  const current = squares.find((s) => s.status === 'current');
  if (current) return current.mission;
  const completed = squares.filter((s) => s.status === 'completed');
  if (completed.length > 0) return completed[completed.length - 1].mission;
  return squares[0]?.mission ?? 1;
}
