import React, { useState, useEffect } from 'react';
import { UserActivity } from '@/products/brainifamily/hooks/useUserActivities';
import { CheckCircle, X, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { formatearTexto } from '@/products/brainifamily/features/activities/utils/TextFormatter';
import SuccessPopup from '@/products/brainifamily/features/activities/utils/SuccessPopup';
import ActivityInstructions from '@/products/brainifamily/features/activities/utils/ActivityInstructions';
import SciBasePopup from '@/products/brainifamily/features/activities/utils/SciBasePopup';
import { 
  getPrimaryButtonClasses, 
  getSecondaryButtonClasses, 
  getInstructionsContainerClasses, 
  getDurationTextClasses,
  getSimpleButtonClasses,
  getBorderClasses,
  getMainTitleTextClasses,
  getProgressBarColor
} from '@/products/brainifamily/features/activities/utils/ActivityColors';

interface Ses9Act1Props {
  userProgress?: UserActivity;
  activityId: number;
  missionId: string;
  userId: string;
  activityType?: string;
  activityData?: {
    duracion_min?: number;
    duracion_max?: number;
    como_se_juega?: string;
    investigacion_beneficios?: string;
  };
  onPuzzleComplete?: () => void;
}

interface Situacion {
  id: number;
  texto: string;
  respuestaCorrecta: 'solito' | 'contento';
}

// Páginas del cuento
const PAGINAS_CUENTO = [
  "Érase una vez, un lorito que siempre estaba cantando, riendo y parloteando… pero cuando sólo en casa se quedaba… lloraba y lloraba.\n\n• Hay, hay, hay que solito estoy. Hay hay hay que solito estoy.",
  "Un día al volver del colegio su dueño su llanto escuchó:\n\n• Hay, hay, hay que solito estoy. Hay hay hay que solito estoy.",
  "Se acercó hasta él, lo miro y le susurró al oído:\n\n• Lorito lorito, no llores más, aunque me vaya al colegio, y cerca de ti no esté, te quiero y te querré, aunque contigo en esos momentos no esté.",
  "El lorito llorón, mientras secaba sus lágrimas con una de sus plumas de color azul, sonrió y por su pico de colores mirando a su amigo exclamó:\n\n• Aunque no estés me quieres y te querré, así que ya no volveré a llorar ¡hay hay hay que contento estoy, hay hay hay que contento estoy!",
  "El lorito se puso a cantar y nunca más volvió a llorar:\n\n• ¡Hay hay hay que contento estoy, hay hay hay que contento estoy!",
];

// Página final con instrucción
const PAGINA_FINAL = {
  titulo: "Fin del cuento",
  instruccion: "Ahora a hacer la actividad:"
};

// Situaciones de la actividad
const SITUACIONES: Situacion[] = [
  {
    id: 1,
    texto: "El lorito juega con sus amigos en el colegio.",
    respuestaCorrecta: 'contento'
  },
  {
    id: 2,
    texto: "El lorito está compartiendo.",
    respuestaCorrecta: 'contento'
  },
  {
    id: 3,
    texto: "El lorito piensa que sus amigos no quieren jugar con él.",
    respuestaCorrecta: 'solito'
  },
  {
    id: 4,
    texto: "El lorito cree que nadie quiere compartir sus cosas.",
    respuestaCorrecta: 'solito'
  },
  {
    id: 5,
    texto: "El lorito está ayudando a un compañero.",
    respuestaCorrecta: 'contento'
  },
  {
    id: 6,
    texto: "El lorito está escuchando al compañero.",
    respuestaCorrecta: 'contento'
  },
  {
    id: 7,
    texto: "El lorito piensa que nadie quiere ayudarle.",
    respuestaCorrecta: 'solito'
  },
  {
    id: 8,
    texto: "El lorito piensa que nadie le escucha.",
    respuestaCorrecta: 'solito'
  }
];

/**
 * Actividad 1 - Sesión 9
 * El Lorito Llorón: Cuento interactivo y selección de frases para situaciones
 */
const Ses9Act1: React.FC<Ses9Act1Props> = ({ 
  userProgress, 
  activityId, 
  missionId, 
  userId,
  activityType,
  activityData,
  onPuzzleComplete
}) => {
  // Estados del cuento
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  
  // Estados del juego
  const [respuestas, setRespuestas] = useState<{ [situacionId: number]: 'solito' | 'contento' | null }>({});
  const [respuestasCorrectas, setRespuestasCorrectas] = useState<number[]>([]);
  const [respuestasIncorrectas, setRespuestasIncorrectas] = useState<number[]>([]);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  // Navegación del cuento
  const handleNextPage = () => {
    if (currentPage < PAGINAS_CUENTO.length - 1) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev + 1);
        setIsFlipping(false);
      }, 500);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage(prev => prev - 1);
        setIsFlipping(false);
      }, 500);
    }
  };

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === PAGINAS_CUENTO.length - 1;

  // Función para formatear el texto del cuento (destacar frases clave)
  const formatearTextoCuento = (texto: string) => {
    const lineas = texto.split('\n');
    const resultado: JSX.Element[] = [];

    lineas.forEach((linea, lineaIndex) => {
      if (linea.trim() === '') {
        resultado.push(<br key={`br-${lineaIndex}`} />);
        return;
      }

      // Detectar si es un diálogo (empieza con •)
      const esDialogo = linea.trim().startsWith('•');

      // Buscar todas las ocurrencias de frases clave en la línea
      const frasesClave = [
        'Hay, hay, hay que solito estoy',
        'Hay hay hay que solito estoy',
        'Hay hay hay que contento estoy',
        'hay hay hay que contento estoy'
      ];

      const matches: Array<{ start: number; end: number; text: string }> = [];

      // Buscar todas las ocurrencias de todas las frases
      frasesClave.forEach((frase) => {
        const regex = new RegExp(frase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        let match;
        while ((match = regex.exec(linea)) !== null) {
          matches.push({
            start: match.index,
            end: match.index + match[0].length,
            text: match[0]
          });
        }
      });

      // Ordenar matches por posición y eliminar overlaps
      matches.sort((a, b) => a.start - b.start);
      const matchesFinales: typeof matches = [];
      matches.forEach(match => {
        const tieneOverlap = matchesFinales.some(existente => 
          (match.start >= existente.start && match.start < existente.end) ||
          (match.end > existente.start && match.end <= existente.end)
        );
        if (!tieneOverlap) {
          matchesFinales.push(match);
        }
      });

      // Construir los elementos JSX
      const elementos: JSX.Element[] = [];
      let indiceActual = 0;

      matchesFinales.forEach((match, matchIndex) => {
        // Texto antes del match
        if (match.start > indiceActual) {
          elementos.push(
            <React.Fragment key={`text-${lineaIndex}-${matchIndex}`}>
              {linea.substring(indiceActual, match.start)}
            </React.Fragment>
          );
        }
        // El match en negrita
        elementos.push(
          <strong key={`frase-${lineaIndex}-${matchIndex}`} className="font-bold text-blue-600">
            {match.text}
          </strong>
        );
        indiceActual = match.end;
      });

      // Texto restante después del último match
      if (indiceActual < linea.length) {
        elementos.push(
          <React.Fragment key={`text-end-${lineaIndex}`}>
            {linea.substring(indiceActual)}
          </React.Fragment>
        );
      }

      // Si no hay matches, usar el texto original
      if (elementos.length === 0) {
        elementos.push(
          <React.Fragment key={`text-orig-${lineaIndex}`}>
            {linea}
          </React.Fragment>
        );
      }

      // Renderizar la línea
      resultado.push(
        <p 
          key={`linea-${lineaIndex}`} 
          className={`${esDialogo 
            ? 'italic text-gray-800 pl-6 pr-4 py-3 my-4 border-l-4 border-pink-300 bg-pink-50/50 rounded-r-lg shadow-xs' 
            : 'mb-4'
          }`}
        >
          {elementos}
        </p>
      );
    });

    return resultado;
  };

  // Función para manejar la selección de respuesta
  const handleRespuestaSelect = (situacionId: number, respuesta: 'solito' | 'contento') => {
    // Si ya está completada correctamente, no permitir cambiar
    const situacion = SITUACIONES.find(s => s.id === situacionId);
    if (!situacion) return;

    const respuestaActual = respuestas[situacionId];
    if (respuestaActual === situacion.respuestaCorrecta) {
      return; // Ya está correcta, no cambiar
    }

    const esCorrecta = respuesta === situacion.respuestaCorrecta;

    // Guardar respuesta
    const nuevasRespuestas = {
      ...respuestas,
      [situacionId]: respuesta
    };
    setRespuestas(nuevasRespuestas);

    if (esCorrecta) {
      // Remover de incorrectas si estaba
      setRespuestasIncorrectas(prev => prev.filter(id => id !== situacionId));
      // Agregar a correctas si no estaba
      setRespuestasCorrectas(prev => {
        if (!prev.includes(situacionId)) {
          return [...prev, situacionId];
        }
        return prev;
      });
    } else {
      // Remover de correctas si estaba
      setRespuestasCorrectas(prev => prev.filter(id => id !== situacionId));
      // Agregar a incorrectas y mostrar error temporal
      setRespuestasIncorrectas([...respuestasIncorrectas, situacionId]);
      // Limpiar error y respuesta después de 1 segundo
      setTimeout(() => {
        setRespuestasIncorrectas(prev => prev.filter(id => id !== situacionId));
        setRespuestas(prev => {
          const nuevas = { ...prev };
          delete nuevas[situacionId];
          return nuevas;
        });
      }, 1000);
    }
  };

  // Verificar si todas están completadas
  useEffect(() => {
    const todasCorrectas = SITUACIONES.every(s => respuestas[s.id] === s.respuestaCorrecta);
    const todasRespondidas = SITUACIONES.every(s => respuestas[s.id] !== null && respuestas[s.id] !== undefined);
    
    if (todasCorrectas && todasRespondidas && SITUACIONES.length > 0 && !isGameCompleted) {
      setIsGameCompleted(true);
      setTimeout(() => {
        setShowSuccessPopup(true);
      }, 500);
    }
  }, [respuestas, isGameCompleted]);

  // Función para reiniciar la actividad
  const resetActivity = () => {
    setCurrentPage(0);
    setRespuestas({});
    setRespuestasCorrectas([]);
    setRespuestasIncorrectas([]);
    setIsGameCompleted(false);
    setShowSuccessPopup(false);
    setIsFlipping(false);
  };

  const totalSituaciones = SITUACIONES.length;
  const respuestasCorrectasCount = respuestasCorrectas.length;

  return (
    <div className="space-y-6">
      {/* Instrucciones con datos del backend */}
      <ActivityInstructions
        activityType={activityType}
        duracionMin={activityData?.duracion_min}
        duracionMax={activityData?.duracion_max}
        comoSeJuega={activityData?.como_se_juega}
        investigacionBeneficios={activityData?.investigacion_beneficios}
        onShowScientificBase={() => setShowScientificBase(true)}
      />

      {/* Card del Cuento */}
      <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center border-b-2 border-gray-200 pb-3">
            El Lorito Llorón
          </h3>
          
          {/* Contenido de la página actual con animación de fade */}
          <div className="min-h-[200px] mb-6 relative">
            <div 
              className="w-full transition-opacity duration-500 ease-in-out"
              style={{
                opacity: isFlipping ? 0 : 1,
              }}
            >
              {!isLastPage ? (
                <div className="text-gray-800 leading-relaxed text-base md:text-lg space-y-2">
                  {formatearTextoCuento(PAGINAS_CUENTO[currentPage])}
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="text-gray-800 leading-relaxed text-base md:text-lg space-y-2">
                    {formatearTextoCuento(PAGINAS_CUENTO[currentPage])}
                  </div>
                  <h4 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} text-center pb-2 border-b-2 border-gray-200`}>
                    {PAGINA_FINAL.titulo}
                  </h4>
                  <div className={`mt-6 p-5 ${getInstructionsContainerClasses(activityType)} rounded-xl shadow-md border-2`}>
                    <p className="text-gray-800 leading-relaxed font-semibold text-base">
                      {PAGINA_FINAL.instruccion}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Navegación del cuento */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            {/* Barra de progreso visual */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Progreso del cuento</span>
              <span className={`text-sm font-semibold ${getMainTitleTextClasses(activityType)}`}>
                Página {currentPage + 1} de {PAGINAS_CUENTO.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((currentPage + 1) / PAGINAS_CUENTO.length) * 100}%`,
                  backgroundColor: getProgressBarColor(activityType)
                }}
              />
            </div>
            
            {/* Botones de navegación */}
            <div className="flex items-center justify-between">
              <Button
                onClick={handlePreviousPage}
                disabled={isFirstPage}
                className={getPrimaryButtonClasses(activityType) + " flex items-center gap-2"}
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>

              <Button
                onClick={handleNextPage}
                disabled={isLastPage}
                className={getPrimaryButtonClasses(activityType) + " flex items-center gap-2"}
              >
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Card de la Actividad - Siempre visible y operativo */}
      <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
        <div className="space-y-6">
          {/* Título de la actividad */}
          <div className="text-center mb-6 border-b-2 border-gray-200 pb-3">
            <h3 className={`text-xl font-bold ${getMainTitleTextClasses(activityType)} mb-2`}>
              ¿Qué diría el Lorito llorón?
            </h3>
            <p className="text-gray-700 text-sm">
              Elige: "Hay hay que solito estoy…" o "Hay hay que contento estoy."
            </p>
          </div>

          {/* Barra de progreso */}
          <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progreso</span>
              <span className={`text-sm font-semibold ${getMainTitleTextClasses(activityType)}`}>
                {respuestasCorrectasCount} de {totalSituaciones} correctas
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(respuestasCorrectasCount / totalSituaciones) * 100}%`,
                  backgroundColor: getProgressBarColor(activityType)
                }}
              />
            </div>
          </div>

          {/* Situaciones */}
          {!isGameCompleted ? (
            <div className="space-y-6">
              {SITUACIONES.map((situacion) => {
                const respuestaSeleccionada = respuestas[situacion.id];
                const esCorrecta = respuestaSeleccionada === situacion.respuestaCorrecta;
                const tieneError = respuestasIncorrectas.includes(situacion.id);
                const estaCompletada = respuestaSeleccionada !== null && respuestaSeleccionada !== undefined && esCorrecta;

                return (
                  <div 
                    key={situacion.id}
                    className={`${getInstructionsContainerClasses(activityType)} p-6 rounded-xl border-l-4`}
                    style={{ 
                      borderLeftColor: estaCompletada 
                        ? '#10b981' 
                        : tieneError 
                        ? '#ef4444' 
                        : getProgressBarColor(activityType)
                    }}
                  >
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      {situacion.texto}
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Botón "Solito" */}
                      <button
                        onClick={() => handleRespuestaSelect(situacion.id, 'solito')}
                        disabled={estaCompletada}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                          ${estaCompletada && situacion.respuestaCorrecta === 'solito'
                            ? 'bg-braini-green/10 border-braini-green shadow-lg'
                            : respuestaSeleccionada === 'solito' && tieneError
                            ? 'bg-braini-pink/10 border-braini-pink shadow-lg animate-shake'
                            : respuestaSeleccionada === 'solito'
                            ? 'bg-blue-100 border-blue-500 shadow-lg'
                            : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                          }
                        `}
                      >
                        <p className="text-gray-800 leading-relaxed font-medium text-base md:text-lg">
                          "Hay hay que solito estoy…"
                        </p>
                        
                        {estaCompletada && situacion.respuestaCorrecta === 'solito' && (
                          <div className="absolute top-2 right-2 bg-braini-green rounded-full p-1">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                        
                        {respuestaSeleccionada === 'solito' && tieneError && (
                          <div className="absolute top-2 right-2 bg-braini-pink rounded-full p-1 animate-pulse">
                            <X className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </button>

                      {/* Botón "Contento" */}
                      <button
                        onClick={() => handleRespuestaSelect(situacion.id, 'contento')}
                        disabled={estaCompletada}
                        className={`
                          relative p-4 rounded-xl border-2 transition-all duration-200 text-left
                          ${estaCompletada && situacion.respuestaCorrecta === 'contento'
                            ? 'bg-braini-green/10 border-braini-green shadow-lg'
                            : respuestaSeleccionada === 'contento' && tieneError
                            ? 'bg-braini-pink/10 border-braini-pink shadow-lg animate-shake'
                            : respuestaSeleccionada === 'contento'
                            ? 'bg-blue-100 border-blue-500 shadow-lg'
                            : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                          }
                        `}
                      >
                        <p className="text-gray-800 leading-relaxed font-medium text-base md:text-lg">
                          "Hay hay que contento estoy."
                        </p>
                        
                        {estaCompletada && situacion.respuestaCorrecta === 'contento' && (
                          <div className="absolute top-2 right-2 bg-braini-green rounded-full p-1">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        )}
                        
                        {respuestaSeleccionada === 'contento' && tieneError && (
                          <div className="absolute top-2 right-2 bg-braini-pink rounded-full p-1 animate-pulse">
                            <X className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-4`}>
                ¡Todas las situaciones completadas!
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg mb-6">
                Has identificado correctamente qué diría el Lorito Llorón en cada situación.
              </p>
              <Button
                onClick={resetActivity}
                className={getPrimaryButtonClasses(activityType)}
              >
                Repetir Actividad
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => {
            setShowSuccessPopup(false);
            // No reiniciar automáticamente, la actividad se queda completada
          }}
          activityType={activityType}
        />
      )}

      {/* Dialog de Base Científica */}
      <SciBasePopup
        open={showScientificBase}
        onOpenChange={setShowScientificBase}
        activityType={activityType}
        investigacionBeneficios={activityData?.investigacion_beneficios}
      />
    </div>
  );
};

export default Ses9Act1;

