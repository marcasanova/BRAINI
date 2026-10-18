import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import type { MissionWithProgress } from '@/integrations/supabase/queries/missions';
import MissionMap from './MissionMap';
import MissionDetailPanel from './MissionDetailPanel';
import { buildMapSquares } from './missionMapLayout';

const mission = (id: number, status: MissionWithProgress['status']): MissionWithProgress => ({
  mission_id: id,
  status,
  missions: { id, titulo: `Reto ${id}`, descripcion: null },
});

const squares = buildMapSquares(
  [mission(1, 'completed'), mission(2, 'current'), mission(3, 'locked')],
  new Set([1, 2, 3]),
  new Map([[1, '2026-10-01']]),
);

describe('MissionMap', () => {
  it('pinta una casilla-botón por misión con su estado accesible', () => {
    render(<MissionMap squares={squares} selectedMission={2} onSelect={() => {}} />);

    expect(screen.getAllByRole('button')).toHaveLength(25);
    expect(screen.getByRole('button', { name: 'Misión 1: Reto 1, superada' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Misión 2: Reto 2, disponible' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: 'Misión 3: Reto 3, por desbloquear' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Misión 25, en desarrollo' }).getAttribute('aria-disabled')).toBe('true');
  });

  it('avisa de la casilla pulsada, incluidas las que están en desarrollo', () => {
    const onSelect = vi.fn();
    render(<MissionMap squares={squares} selectedMission={2} onSelect={onSelect} />);

    fireEvent.click(screen.getByRole('button', { name: 'Misión 1: Reto 1, superada' }));
    fireEvent.click(screen.getByRole('button', { name: 'Misión 25, en desarrollo' }));
    expect(onSelect).toHaveBeenNthCalledWith(1, 1);
    expect(onSelect).toHaveBeenNthCalledWith(2, 25);
  });

  it('la casilla actual lleva el barrido azul y las demás no', () => {
    const { container } = render(<MissionMap squares={squares} selectedMission={1} onSelect={() => {}} />);
    const sweeps = container.querySelectorAll('.map-tile-current-sweep');
    expect(sweeps).toHaveLength(1);
    expect(sweeps[0].closest('[role="button"]')?.id).toBe('mission-2');
  });

  it('las casillas con forma exacta (SVG) se activan con teclado', () => {
    const onSelect = vi.fn();
    render(<MissionMap squares={squares} selectedMission={2} onSelect={onSelect} />);

    const tile = screen.getByRole('button', { name: 'Misión 1: Reto 1, superada' });
    expect(tile.tagName.toLowerCase()).toBe('g');
    expect(tile.getAttribute('tabindex')).toBe('0');
    fireEvent.keyDown(tile, { key: 'Enter' });
    fireEvent.keyDown(tile, { key: ' ' });
    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith(1);
  });
});

describe('MissionDetailPanel', () => {
  it('permite acceder a una misión jugable', () => {
    render(
      <MemoryRouter>
        <MissionDetailPanel square={squares[1]} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('link', { name: 'Acceder' }).getAttribute('href')).toBe('/brainifamily/sesion/2');
  });

  it('muestra «¡Muy pronto!» en una misión en desarrollo', () => {
    render(
      <MemoryRouter>
        <MissionDetailPanel square={squares[24]} />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: '¡Muy pronto!' })).toBeTruthy();
    expect(screen.queryByRole('link')).toBeNull();
  });
});
