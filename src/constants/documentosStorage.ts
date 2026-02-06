/**
 * URL base del bucket de Supabase para documentos (legales, etc.).
 * Documentos concretos se definen debajo.
 */
const DOCUMENTOS_STORAGE_URL =
  'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/documentos';

/** Política de Privacidad y Protección de Datos (PDF) */
export const POLITICA_PRIVACIDAD_URL = `${DOCUMENTOS_STORAGE_URL}/POLITICA%20DE%20PRIVACIDAD%20Y%20PROTECCION%20DE%20DATOS.pdf`;

/** Mapa de la aventura BRAINI - Panel juego Rescate de Azon (Home) */
export const MAPA_AVENTURA_URL = `${DOCUMENTOS_STORAGE_URL}/Panel%20juego%20Rescate%20de%20Azon.jpg`;
