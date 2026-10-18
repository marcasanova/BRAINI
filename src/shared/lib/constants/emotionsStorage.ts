/**
 * URLs base de los buckets de Supabase para imágenes de emociones.
 *
 * - EMOTIONS_INFANTIL_URL: usado en actividades y diario.
 *   Formato general emociones: "{numero}.%20{Nombre}.png"
 *
 * - EMOTIONS_PRIMARIA_STORAGE_URL: usado en LandingPage y landings (BrainiFamilyLanding).
 *   Formato general emociones: "{numero}.%20{Nombre}.jpg"
 *
 * La medalla de logro es un asset de producto en `public/logo/medalla-braini.png`
 * (misma imagen para todos los niveles educativos).
 */
export const EMOTIONS_INFANTIL_URL =
  'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emociones_infantil';

export const EMOTIONS_PRIMARIA_STORAGE_URL =
  'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emociones_primaria';

export const MEDAL_IMAGE_URL = '/logo/medalla-braini.png';

/**
 * Imagen de medalla de misión. Una sola pieza de marca; el argumento se
 * conserva por compatibilidad con los consumidores existentes.
 */
export const getMedalImageForNivelEducativo = (
  _nivelEducativo?: string | null
): string => MEDAL_IMAGE_URL;
