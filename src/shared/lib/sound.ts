/**
 * Sonidos de interfaz sintetizados con la Web Audio API (sin ficheros de audio).
 * Tono senoidal, muy bajo y corto (ninguno supera ~0,6 s) para que no moleste al repetirse.
 *
 * El silencio es una preferencia del dispositivo y se guarda en localStorage; no es un dato
 * del niño ni de la familia, así que no va a Supabase.
 */

export type SoundName =
  | 'tap'
  | 'select'
  | 'confirm'
  | 'success'
  | 'error'
  | 'locked'
  | 'tick'
  | 'unlock'
  | 'medal';

interface Note {
  /** Frecuencia en Hz */
  freq: number;
  /** Inicio desde el comienzo del sonido, en segundos */
  start?: number;
  /** Duración de la nota, en segundos */
  dur: number;
}

const SOUNDS: Record<SoundName, { notes: Note[]; peak?: number }> = {
  tap: { notes: [{ freq: 880, dur: 0.06 }] },
  select: { notes: [{ freq: 720, dur: 0.07 }] },
  confirm: { notes: [{ freq: 660, dur: 0.06 }, { freq: 880, start: 0.06, dur: 0.07 }] },
  success: {
    notes: [
      { freq: 660, dur: 0.08 },
      { freq: 784, start: 0.08, dur: 0.08 },
      { freq: 988, start: 0.16, dur: 0.1 },
    ],
  },
  error: { notes: [{ freq: 440, dur: 0.1 }, { freq: 330, start: 0.1, dur: 0.1 }] },
  locked: { notes: [{ freq: 220, dur: 0.12 }], peak: 0.05 },
  tick: { notes: [{ freq: 1000, dur: 0.03 }], peak: 0.05 },
  unlock: { notes: [{ freq: 523, dur: 0.12 }, { freq: 784, start: 0.12, dur: 0.18 }] },
  medal: {
    notes: [
      { freq: 523, dur: 0.12 },
      { freq: 659, start: 0.12, dur: 0.12 },
      { freq: 784, start: 0.24, dur: 0.12 },
      { freq: 1046, start: 0.36, dur: 0.19 },
    ],
  },
};

const STORAGE_KEY = 'braini_sound_muted';
const DEFAULT_PEAK = 0.08;

const listeners = new Set<() => void>();
let context: AudioContext | null = null;

function readMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1';
  } catch {
    return false;
  }
}

function writeMuted(muted: boolean) {
  try {
    if (muted) localStorage.setItem(STORAGE_KEY, '1');
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Sin localStorage (modo privado, cookies bloqueadas): el silencio dura solo esta sesión
  }
}

/** Crea el AudioContext la primera vez; siempre llega desde un gesto del usuario. */
function getContext(): AudioContext | null {
  if (context) return context;
  try {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
    return context;
  } catch {
    return null;
  }
}

export function isSoundMuted(): boolean {
  return readMuted();
}

export function setSoundMuted(muted: boolean) {
  writeMuted(muted);
  listeners.forEach((listener) => listener());
}

/** Suscripción para componentes que muestran el estado del silencio (useSyncExternalStore). */
export function subscribeSoundMuted(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function playSound(name: SoundName) {
  if (readMuted()) return;
  const ctx = getContext();
  if (!ctx) return;
  try {
    void ctx.resume();
    const { notes, peak = DEFAULT_PEAK } = SOUNDS[name];
    const now = ctx.currentTime;
    for (const note of notes) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const start = now + (note.start ?? 0);
      const end = start + note.dur;
      osc.type = 'sine';
      osc.frequency.value = note.freq;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(peak, start + 0.005);
      gain.gain.exponentialRampToValueAtTime(0.0001, end + 0.12);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(end + 0.13);
    }
  } catch {
    // Un fallo de audio nunca debe romper la interacción
  }
}
