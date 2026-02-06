/**
 * URL base del bucket de Supabase para assets de actividades infantiles.
 * Usado en Sesión 1 Actividad 2 (Gigantes y ratones): imágenes y videos.
 */
export const ACTIVIDADES_INFANTIL_URL =
  'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/actividades_infantil';

// Imágenes – Gigantes y ratones (Sesión 1, Actividad 2)
export const GIGANTE_IMAGE_URL = `${ACTIVIDADES_INFANTIL_URL}/Gigante.png`;
export const RATON_IMAGE_URL = `${ACTIVIDADES_INFANTIL_URL}/Raton.png`;

// Videos – patadas gigante / ratón (para uso en pasos de la actividad)
export const PATADAS_GIGANTE_VIDEO_URL = `${ACTIVIDADES_INFANTIL_URL}/PatadasGigante.mp4`;
export const PATADAS_RATON_VIDEO_URL = `${ACTIVIDADES_INFANTIL_URL}/PatadasRaton.mp4`;
