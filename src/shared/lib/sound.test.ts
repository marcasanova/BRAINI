import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

type FakeNode = { connect: () => FakeNode; start: () => void; stop: () => void; frequency: { value: number }; gain: FakeGain; type: string };
type FakeGain = { setValueAtTime: () => void; exponentialRampToValueAtTime: () => void };

function installFakeAudio() {
  const oscillators: FakeNode[] = [];
  const gainNode = (): FakeNode => ({
    connect() {
      return this;
    },
    start() {},
    stop() {},
    frequency: { value: 0 },
    type: 'sine',
    gain: { setValueAtTime() {}, exponentialRampToValueAtTime() {} },
  });
  class FakeAudioContext {
    currentTime = 0;
    destination = {};
    resume = vi.fn(() => Promise.resolve());
    createOscillator = vi.fn(() => {
      const osc = gainNode();
      oscillators.push(osc);
      return osc;
    });
    createGain = vi.fn(() => gainNode());
  }
  vi.stubGlobal('AudioContext', FakeAudioContext);
  return { oscillators };
}

describe('sound', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('no sintetiza nada cuando está silenciado', async () => {
    const { oscillators } = installFakeAudio();
    const sound = await import('./sound');
    sound.setSoundMuted(true);
    sound.playSound('tap');
    expect(oscillators).toHaveLength(0);
  });

  it('sintetiza una nota por cada tono del sonido cuando está activado', async () => {
    const { oscillators } = installFakeAudio();
    const sound = await import('./sound');
    sound.playSound('success');
    // «success» tiene tres notas
    expect(oscillators).toHaveLength(3);
  });

  it('guarda el silencio en localStorage y lo lee de nuevo', async () => {
    installFakeAudio();
    const sound = await import('./sound');
    expect(sound.isSoundMuted()).toBe(false);

    sound.setSoundMuted(true);
    expect(localStorage.getItem('braini_sound_muted')).toBe('1');
    expect(sound.isSoundMuted()).toBe(true);

    sound.setSoundMuted(false);
    expect(localStorage.getItem('braini_sound_muted')).toBeNull();
    expect(sound.isSoundMuted()).toBe(false);
  });

  it('avisa a los suscriptores al cambiar el silencio', async () => {
    installFakeAudio();
    const sound = await import('./sound');
    const listener = vi.fn();
    const unsubscribe = sound.subscribeSoundMuted(listener);
    sound.setSoundMuted(true);
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    sound.setSoundMuted(false);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('no falla si localStorage no está disponible', async () => {
    installFakeAudio();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('denied');
    });
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('denied');
    });
    const sound = await import('./sound');
    expect(sound.isSoundMuted()).toBe(false);
    expect(() => sound.setSoundMuted(true)).not.toThrow();
  });

  it('no falla si el navegador no tiene Web Audio', async () => {
    vi.stubGlobal('AudioContext', undefined);
    const sound = await import('./sound');
    expect(() => sound.playSound('tap')).not.toThrow();
  });
});
