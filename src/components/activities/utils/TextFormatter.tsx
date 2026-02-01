import React from 'react';

/**
 * Función para formatear texto plano con marcadores especiales
 * 
 * Marcadores soportados:
 * - || separador de párrafos
 * - **texto** negrita
 * - - o • lista
 * - ### título de sección
 * - \n saltos de línea normales
 * 
 * @param texto - Texto plano con marcadores
 * @returns JSX formateado
 */
export const formatearTexto = (texto: string) => {
  if (!texto) return null;
  
  // Primero, convertir marcadores || en saltos de línea
  const textoConSaltos = texto.replace(/\|\|/g, '\n');
  
  // Normalizar: detectar cualquier tipo de salto de línea
  const lineas = textoConSaltos
    .replace(/\r\n/g, '\n')    // Windows
    .replace(/\r/g, '\n')       // Mac antiguo
    .split('\n')
    .filter(linea => linea.trim() !== '' || linea.includes(' ')); // Mantener líneas con espacios para crear saltos
  
  return lineas.map((linea, index) => {
    // Si la línea está vacía pero tiene espacio, es un salto de párrafo intencional
    if (linea.trim() === '' && index !== 0) {
      return <br key={index} className="block mb-2" />;
    }
    
    // Negrita con **texto**
    if (linea.includes('**')) {
      const parts = linea.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={index} className="mb-2">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              const boldText = part.slice(2, -2);
              return <strong key={i} className="font-semibold text-gray-800">{boldText}</strong>;
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    }
    
    // Lista con - o •
    if (linea.trim().startsWith('-') || linea.trim().startsWith('•')) {
      const textoSinBullet = linea.replace(/^[-•]\s*/, '');
      return (
        <li key={index} className="ml-4 mb-1 list-disc">
          {textoSinBullet}
        </li>
      );
    }
    
    // Título con ###
    if (linea.trim().startsWith('###')) {
      const titulo = linea.replace(/^###\s*/, '');
      return <h4 key={index} className="font-bold text-lg text-gray-800 mb-2 mt-4">{titulo}</h4>;
    }
    
    // Texto normal con posible negrita en el medio
    if (linea.includes('**')) {
      const parts = linea.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={index} className="mb-2">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              const boldText = part.slice(2, -2);
              return <strong key={i} className="font-semibold text-gray-800">{boldText}</strong>;
            }
            return <span key={i}>{part}</span>;
          })}
        </p>
      );
    }
    
    // Texto normal
    return <p key={index} className="mb-2">{linea}</p>;
  });
};

/**
 * Función específica para formatear descripciones de misiones
 * Solo maneja saltos de línea para estructurar mejor la información
 * 
 * @param texto - Texto de descripción de misión
 * @returns JSX con saltos de línea aplicados
 */
export const formatearDescripcionMision = (texto: string) => {
  if (!texto) return null;
  
  // Convertir marcadores || en saltos de línea
  const textoConSaltos = texto.replace(/\|\|/g, '\n');
  
  // Normalizar cualquier tipo de salto de línea
  const lineas = textoConSaltos
    .replace(/\r\n/g, '\n')    // Windows
    .replace(/\r/g, '\n')      // Mac antiguo
    .split('\n')
    .filter(linea => linea.trim() !== ''); // Eliminar líneas completamente vacías
  
  return lineas.map((linea, index) => (
    <p key={index} className={index > 0 ? "mt-2" : ""}>
      {linea.trim()}
    </p>
  ));
};
