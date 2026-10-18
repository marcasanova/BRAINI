/** Tiempos y utilidades compartidas por la celebración de medalla (MedalShelf + Home). */

/** Retardo antes de empezar a subir el progreso, para que el usuario vea el estado anterior */
export const MEDAL_SHELF_ANIMATION_DELAY_MS = 350;
/** Duración de la subida del contador y de la barra */
export const MEDAL_SHELF_ANIMATION_DURATION_MS = 1000;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
