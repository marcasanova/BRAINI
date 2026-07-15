/**
 * Utilidades para obtener los colores corporativos según el tipo de actividad
 */

export type ActivityType = 'inteligencia_emocional' | 'regulacion_emocional' | 'vinculo_afectivo' | 'acompañamiento_emocional';

/**
 * Obtiene las clases CSS para el botón principal "Empezar Actividad"
 */
export const getPrimaryButtonClasses = (activityType?: string): string => {
  const baseClasses = "text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg";
  
  switch (activityType) {
    case 'inteligencia_emocional':
      return `${baseClasses} bg-linear-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue`;
    case 'regulacion_emocional':
      return `${baseClasses} bg-linear-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise`;
    case 'vinculo_afectivo':
      return `${baseClasses} bg-linear-to-r from-braini-pink to-braini-pink-light hover:from-braini-pink-dark hover:to-braini-pink`;
    case 'acompañamiento_emocional':
      return `${baseClasses} bg-linear-to-r from-braini-yellow to-braini-yellow-light hover:from-braini-yellow-dark hover:to-braini-yellow`;
    default:
      return `${baseClasses} bg-linear-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue`;
  }
};

/**
 * Obtiene las clases CSS para el botón secundario "Ver Base Científica"
 */
export const getSecondaryButtonClasses = (activityType?: string): string => {
  const baseClasses = "bg-white/80 hover:bg-white transition-all duration-300 px-6 py-3 text-lg";
  
  switch (activityType) {
    case 'inteligencia_emocional':
      return `${baseClasses} border-braini-blue/30 text-braini-blue hover:text-braini-blue-dark hover:border-braini-blue`;
    case 'regulacion_emocional':
      return `${baseClasses} border-braini-turquoise/30 text-braini-turquoise hover:text-braini-turquoise-dark hover:border-braini-turquoise`;
    case 'vinculo_afectivo':
      return `${baseClasses} border-braini-pink/30 text-braini-pink hover:text-braini-pink-dark hover:border-braini-pink`;
    case 'acompañamiento_emocional':
      return `${baseClasses} border-braini-yellow/30 text-braini-yellow hover:text-braini-yellow-dark hover:border-braini-yellow`;
    default:
      return `${baseClasses} border-braini-blue/30 text-braini-blue hover:text-braini-blue-dark hover:border-braini-blue`;
  }
};

/**
 * Obtiene las clases CSS para el contenedor de instrucciones
 */
export const getInstructionsContainerClasses = (activityType?: string): string => {
  const baseClasses = "p-6 rounded-xl border";
  
  switch (activityType) {
    case 'inteligencia_emocional':
      return `${baseClasses} bg-linear-to-r from-braini-blue/10 to-braini-blue/5 border-braini-blue/20`;
    case 'regulacion_emocional':
      return `${baseClasses} bg-linear-to-r from-braini-turquoise/10 to-braini-turquoise/5 border-braini-turquoise/20`;
    case 'vinculo_afectivo':
      return `${baseClasses} bg-linear-to-r from-braini-pink/10 to-braini-pink/5 border-braini-pink/20`;
    case 'acompañamiento_emocional':
      return `${baseClasses} bg-linear-to-r from-braini-yellow/10 to-braini-yellow/5 border-braini-yellow/20`;
    default:
      return `${baseClasses} bg-linear-to-r from-braini-blue/10 to-braini-blue/5 border-braini-blue/20`;
  }
};

/**
 * Obtiene las clases CSS para el texto de duración
 */
export const getDurationTextClasses = (activityType?: string): string => {
  switch (activityType) {
    case 'inteligencia_emocional':
      return 'text-braini-blue-dark';
    case 'regulacion_emocional':
      return 'text-braini-turquoise-dark';
    case 'vinculo_afectivo':
      return 'text-braini-pink-dark';
    case 'acompañamiento_emocional':
      return 'text-braini-yellow-dark';
    default:
      return 'text-braini-blue-dark';
  }
};

/**
 * Obtiene las clases CSS para botones simples (sin gradiente)
 */
export const getSimpleButtonClasses = (activityType?: string): string => {
  const baseClasses = "text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200";
  
  switch (activityType) {
    case 'inteligencia_emocional':
      return `${baseClasses} bg-braini-blue hover:bg-braini-blue-dark`;
    case 'regulacion_emocional':
      return `${baseClasses} bg-braini-turquoise hover:bg-braini-turquoise-dark`;
    case 'vinculo_afectivo':
      return `${baseClasses} bg-braini-pink hover:bg-braini-pink-dark`;
    case 'acompañamiento_emocional':
      return `${baseClasses} bg-braini-yellow hover:bg-braini-yellow-dark`;
    default:
      return `${baseClasses} bg-braini-blue hover:bg-braini-blue-dark`;
  }
};

/**
 * Obtiene las clases CSS para títulos y textos destacados (usando color corporativo principal)
 */
export const getMainTitleTextClasses = (activityType?: string): string => {
  switch (activityType) {
    case 'inteligencia_emocional':
      return 'text-braini-blue';
    case 'regulacion_emocional':
      return 'text-braini-turquoise';
    case 'vinculo_afectivo':
      return 'text-braini-pink';
    case 'acompañamiento_emocional':
      return 'text-braini-yellow';
    default:
      return 'text-braini-blue';
  }
};

/**
 * Obtiene las clases CSS para bordes y elementos destacados
 */
export const getBorderClasses = (activityType?: string): string => {
  switch (activityType) {
    case 'inteligencia_emocional':
      return 'border-braini-blue/20';
    case 'regulacion_emocional':
      return 'border-braini-turquoise/20';
    case 'vinculo_afectivo':
      return 'border-braini-pink/20';
    case 'acompañamiento_emocional':
      return 'border-braini-yellow/20';
    default:
      return 'border-braini-blue/20';
  }
};

/**
 * Obtiene las clases CSS para fondos ligeros
 */
export const getLightBgClasses = (activityType?: string): string => {
  switch (activityType) {
    case 'inteligencia_emocional':
      return 'bg-braini-blue/10';
    case 'regulacion_emocional':
      return 'bg-braini-turquoise/10';
    case 'vinculo_afectivo':
      return 'bg-braini-pink/10';
    case 'acompañamiento_emocional':
      return 'bg-braini-yellow/10';
    default:
      return 'bg-braini-blue/10';
  }
};

/**
 * Obtiene las clases CSS para botones outline con borde y texto del color de la actividad
 */
export const getOutlineButtonClasses = (activityType?: string): string => {
  const baseClasses = "transition-all duration-300";
  
  switch (activityType) {
    case 'inteligencia_emocional':
      return `${baseClasses} border-braini-blue text-braini-blue hover:bg-braini-blue/10`;
    case 'regulacion_emocional':
      return `${baseClasses} border-braini-turquoise text-braini-turquoise hover:bg-braini-turquoise/10`;
    case 'vinculo_afectivo':
      return `${baseClasses} border-braini-pink text-braini-pink hover:bg-braini-pink/10`;
    case 'acompañamiento_emocional':
      return `${baseClasses} border-braini-yellow text-braini-yellow hover:bg-braini-yellow/10`;
    default:
      return `${baseClasses} border-braini-blue text-braini-blue hover:bg-braini-blue/10`;
  }
};

/**
 * Obtiene las clases CSS para el color del texto del cronómetro
 */
export const getTimerColorClasses = (activityType?: string): string => {
  switch (activityType) {
    case 'inteligencia_emocional':
      return 'text-braini-blue';
    case 'regulacion_emocional':
      return 'text-braini-turquoise';
    case 'vinculo_afectivo':
      return 'text-braini-pink';
    case 'acompañamiento_emocional':
      return 'text-braini-yellow';
    default:
      return 'text-braini-blue';
  }
};

/**
 * Obtiene las clases CSS para el título del Dialog de Base Científica
 */
export const getScientificBaseTitleClasses = (activityType?: string): string => {
  switch (activityType) {
    case 'inteligencia_emocional':
      return 'text-braini-blue-dark';
    case 'regulacion_emocional':
      return 'text-braini-turquoise-dark';
    case 'vinculo_afectivo':
      return 'text-braini-pink-dark';
    case 'acompañamiento_emocional':
      return 'text-braini-yellow-dark';
    default:
      return 'text-braini-blue-dark';
  }
};

/**
 * Obtiene las clases CSS para el icono del Dialog de Base Científica
 */
export const getScientificBaseIconClasses = (activityType?: string): string => {
  switch (activityType) {
    case 'inteligencia_emocional':
      return 'text-braini-blue';
    case 'regulacion_emocional':
      return 'text-braini-turquoise';
    case 'vinculo_afectivo':
      return 'text-braini-pink';
    case 'acompañamiento_emocional':
      return 'text-braini-yellow';
    default:
      return 'text-braini-blue';
  }
};

/**
 * Obtiene el color hexadecimal para la barra de progreso
 */
export const getProgressBarColor = (activityType?: string): string => {
  switch (activityType) {
    case 'inteligencia_emocional':
      return '#5a8bc4'; // braini-blue
    case 'regulacion_emocional':
      return '#2a9d8f'; // braini-turquoise
    case 'vinculo_afectivo':
      return '#e76f51'; // braini-pink
    case 'acompañamiento_emocional':
      return '#e9c46a'; // braini-yellow
    default:
      return '#5a8bc4'; // braini-blue por defecto
  }
};
