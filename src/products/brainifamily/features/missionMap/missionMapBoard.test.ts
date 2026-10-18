import { describe, expect, it } from 'vitest';
import { MAP_BOARD_HEIGHT, MAP_BOARD_WIDTH, MAP_TILES, tileBoundingBox } from './missionMapBoard';

const PLANKS = [1, 3, 7, 11, 15, 19, 25];

describe('MAP_TILES', () => {
  it('define las 25 casillas en orden', () => {
    expect(MAP_TILES.map((t) => t.mission)).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
  });

  it('marca como tablón exactamente las casillas de madera', () => {
    expect(MAP_TILES.filter((t) => t.kind === 'plank').map((t) => t.mission)).toEqual(PLANKS);
  });

  it.each(MAP_TILES.map((t) => [t.mission, t] as const))('la casilla %i es coherente', (_, tile) => {
    expect(tile.d).toMatch(/^M[\d.\sL]+Z$/);
    expect(tile.color).toMatch(/^#[0-9a-f]{6}$/);
    expect(tile.size).toBeGreaterThan(40);

    const box = tileBoundingBox(tile.d);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(MAP_BOARD_WIDTH);
    expect(box.y + box.height).toBeLessThanOrEqual(MAP_BOARD_HEIGHT);
    // El número se pinta en el centroide: debe caer dentro de la casilla
    expect(tile.cx).toBeGreaterThan(box.x);
    expect(tile.cx).toBeLessThan(box.x + box.width);
    expect(tile.cy).toBeGreaterThan(box.y);
    expect(tile.cy).toBeLessThan(box.y + box.height);
  });
});
