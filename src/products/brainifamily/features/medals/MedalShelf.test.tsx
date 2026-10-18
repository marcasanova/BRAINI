import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import MedalShelf from './MedalShelf';

const medals = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, medal_id: i + 1, fecha_obtencion: '2026-10-01' }));

describe('MedalShelf', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sin animateFrom muestra directamente el progreso real', () => {
    render(<MedalShelf userMedals={medals(3)} totalMedals={10} isLoading={false} />);
    expect(screen.getByText('3 / 10 misiones')).toBeTruthy();
    expect(screen.getByText('30%')).toBeTruthy();
  });

  it('con animateFrom sube de N-1 a N y muestra el +1', async () => {
    render(<MedalShelf userMedals={medals(3)} totalMedals={10} isLoading={false} animateFrom={2} />);

    expect(screen.getByText('2 / 10 misiones')).toBeTruthy();
    expect(screen.getByText('20%')).toBeTruthy();
    expect(screen.queryByText('+1')).toBeNull();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2000);
    });

    expect(screen.getByText('3 / 10 misiones')).toBeTruthy();
    expect(screen.getByText('30%')).toBeTruthy();
    expect(screen.getByText('+1')).toBeTruthy();
  });
});
