import { describe, expect, it } from 'vitest';
import type { MissionWithProgress } from '@/integrations/supabase/queries/missions';
import { buildMapSquares, defaultSelectedMission } from './missionMapLayout';
import { MAP_TILES } from './missionMapBoard';

const mission = (id: number, status: MissionWithProgress['status']): MissionWithProgress => ({
  mission_id: id,
  status,
  missions: { id, titulo: `Misión ${id}`, descripcion: null },
});

describe('missionMapLayout', () => {
  it('genera una casilla por cada una de las 25 del tablero, en orden', () => {
    const squares = buildMapSquares([], null, new Map());
    expect(squares.map((s) => s.mission)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
    expect(squares.every((s, i) => s.tile === MAP_TILES[i])).toBe(true);
  });

  it('cruza progreso, contenido y medallas', () => {
    const squares = buildMapSquares(
      [mission(1, 'completed'), mission(2, 'current'), mission(3, 'locked'), mission(4, 'locked')],
      new Set([1, 2, 3]),
      new Map([[1, '2026-10-01']]),
    );

    expect(squares).toHaveLength(25);
    expect(squares[0]).toMatchObject({ status: 'completed', medalDate: '2026-10-01', titulo: 'Misión 1' });
    expect(squares[1].status).toBe('current');
    expect(squares[2].status).toBe('locked');
    // Sin actividades → en desarrollo aunque exista la fila
    expect(squares[3].status).toBe('in_development');
    // Sin fila en child_missions → en desarrollo
    expect(squares[24]).toMatchObject({ status: 'in_development', titulo: null });
  });

  it('selecciona por defecto la misión actual, o la última superada', () => {
    const withCurrent = buildMapSquares([mission(1, 'completed'), mission(2, 'current')], null, new Map());
    expect(defaultSelectedMission(withCurrent)).toBe(2);

    const allDone = buildMapSquares([mission(1, 'completed'), mission(2, 'completed')], null, new Map());
    expect(defaultSelectedMission(allDone)).toBe(2);

    expect(defaultSelectedMission(buildMapSquares([], null, new Map()))).toBe(1);
  });
});
