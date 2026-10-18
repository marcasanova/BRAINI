import { beforeEach, describe, expect, it, vi } from 'vitest';

const { playSound, sonner } = vi.hoisted(() => ({
  playSound: vi.fn(),
  sonner: Object.assign(vi.fn(), { error: vi.fn() }),
}));

vi.mock('@/shared/lib/sound', () => ({ playSound: (name: string) => playSound(name) }));
vi.mock('sonner', () => ({ toast: sonner }));

import { toast } from './use-toast';

describe('toast', () => {
  beforeEach(() => {
    playSound.mockClear();
    sonner.mockClear();
    sonner.error.mockClear();
  });

  it('suena como éxito en los avisos normales', () => {
    toast({ title: 'Emociones registradas' });
    expect(playSound).toHaveBeenCalledWith('success');
    expect(sonner).toHaveBeenCalledTimes(1);
  });

  it('suena como error cuando la variante es destructive', () => {
    toast({ title: 'Error al guardar', variant: 'destructive' });
    expect(playSound).toHaveBeenCalledWith('error');
    expect(sonner.error).toHaveBeenCalledTimes(1);
  });
});
