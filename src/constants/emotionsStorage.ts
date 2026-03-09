/**
 * URLs base de los buckets de Supabase para imágenes de emociones.
 *
 * - EMOTIONS_INFANTIL_URL: usado en actividades, diario y medallas.
 *   Formato general emociones: "{numero}.%20{Nombre}.png"
 *
 * - EMOTIONS_PRIMARIA_STORAGE_URL: usado en LandingPage y landings (BrainiFamilyLanding).
 *   Formato general emociones: "{numero}.%20{Nombre}.jpg"
 */
export const EMOTIONS_INFANTIL_URL =
  'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emociones_infantil';

export const EMOTIONS_PRIMARIA_STORAGE_URL =
  'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emociones_primaria';

// URLs específicas para medallas (infantil)
export const MEDAL_INFANTIL_3_URL = `${EMOTIONS_INFANTIL_URL}/Medalla3anos.png`;
export const MEDAL_INFANTIL_4_URL = `${EMOTIONS_INFANTIL_URL}/Medalla4anos.png`;
export const MEDAL_INFANTIL_5_URL = `${EMOTIONS_INFANTIL_URL}/Medalla5anos.png`;

// Imagen por defecto de medalla (orgullo) cuando no es infantil
export const MEDAL_ORGULLO_URL = `${EMOTIONS_INFANTIL_URL}/23.%20Orgullo.png`;

/**
 * Devuelve la URL de la imagen de medalla en función del nivel educativo del niño.
 *
 * - infantil_3 -> Medalla3anos
 * - infantil_4 -> Medalla4anos
 * - infantil_5 -> Medalla5anos
 * - cualquier otro valor o undefined -> medalla de Orgullo actual
 */
export const getMedalImageForNivelEducativo = (
  nivelEducativo?: string | null
): string => {
  switch (nivelEducativo) {
    case 'infantil_3':
      return MEDAL_INFANTIL_3_URL;
    case 'infantil_4':
      return MEDAL_INFANTIL_4_URL;
    case 'infantil_5':
      return MEDAL_INFANTIL_5_URL;
    default:
      return MEDAL_ORGULLO_URL;
  }
};
