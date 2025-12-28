import React, { useState, useEffect } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { CheckCircle, X, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import ActivityInstructions from '@/components/activities/utils/ActivityInstructions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  getPrimaryButtonClasses, 
  getSecondaryButtonClasses, 
  getInstructionsContainerClasses, 
  getDurationTextClasses,
  getSimpleButtonClasses,
  getBorderClasses,
  getScientificBaseTitleClasses,
  getScientificBaseIconClasses,
  getMainTitleTextClasses,
  getProgressBarColor
} from '@/components/activities/utils/activityColors';

interface Ses5Act1Props {
  userProgress?: UserActivity;
  activityId: number;
  levelId: string;
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

interface Emocion {
  id: number;
  nombre: string;
  imagen: string;
  esCorrecta: boolean; // true si aparece en el cuento, false si no
}

// Emociones que aparecen en el cuento (correctas)
const EMOCIONES_CORRECTAS: Omit<Emocion, 'id' | 'imagen'>[] = [
  { nombre: "Rabia", esCorrecta: true },
  { nombre: "Enfado", esCorrecta: true },
  { nombre: "Frustración", esCorrecta: true },
  { nombre: "Tristeza", esCorrecta: true },
  { nombre: "Pena", esCorrecta: true },
  { nombre: "Amabilidad", esCorrecta: true },
  { nombre: "Ternura", esCorrecta: true },
  { nombre: "Alegría", esCorrecta: true },
  { nombre: "Felicidad", esCorrecta: true },
];

// Emociones que NO aparecen en el cuento (incorrectas)
const EMOCIONES_INCORRECTAS: Omit<Emocion, 'id' | 'imagen'>[] = [
  { nombre: "Esperanza", esCorrecta: false },
  { nombre: "Vergüenza", esCorrecta: false },
  { nombre: "Miedo", esCorrecta: false },
];

// Páginas del cuento (combinadas para reducir número de páginas)
const PAGINAS_CUENTO = [
  "Érase una vez un pirata que siempre gritaba y gritaba. Por eso, todo el mundo lo acabó llamando \"El Pirata Gritón\".\n\nCada día se enfadaba por cualquier cosa, y cuando algo no salía como quería, la frustración y la rabia se apoderaban de él.\n\nUn día, la tripulación, cansada de tanto aguantar, decidió marcharse y alejarse de su mal humor. Y así, el Pirata Gritón, solo en su barco, se quedó.",
  "Al principio no le importó, pero con el tiempo, la soledad sintió en su corazón. La tristeza y la pena sentía cada día, y por mucho que lo intentaba no conseguía que se marcharan de su vida.\n\nUna noche, mientras navegaba solo por el mar, al Hada Coralina, reina del mar, le preguntó:\n\n— Hada Coralina, tú que todo lo ves… explícame, por favor, cómo puedo superar esta pena.",
  "Y el Hada Coralina respondió, con voz amable y llena de ternura:\n\n— Pirata, pirata, gritando siempre estabas… y emociones como la rabia, el enfado y la frustración a los demás les dabas. Por eso nadie a tu lado quiere estar.\n\nEl pirata entendió que tenía que cambiar, hablar con respeto, escuchar y aceptar a los demás, si de nuevo su barco y su vida de amigos quería llenar.",
  "A partir de entonces, empezó a hablar con amabilidad, a tratar con ternura, y a sonreír con alegría y contagiar felicidad.\n\nPoco a poco, sus amigos regresaron y juntos muchos tesoros encontraron.\n\nPero sabía que el mejor tesoro de todos era su tripulación, su familia del mar, y la felicidad que sentía cuando respetaba, cuidaba y compartía con los demás.",
];

// Página final con preguntas
const PAGINA_FINAL = {
  titulo: "Fin del cuento",
  preguntas: [
    "¿Qué emociones han aparecido en el cuento?",
    "¿Qué has aprendido del cuento?"
  ],
  instruccion: "Ahora haz la actividad: selecciona las emociones que aparecen en el cuento."
};

/**
 * Actividad 1 - Sesión 5
 * El Pirata Gritón: Cuento interactivo y juego de identificación de emociones
 */
const Ses5Act1: React.FC<Ses5Act1Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityType,
  activityData,
  onPuzzleComplete
}) => {
  // Estados del cuento
  const [currentPage, setCurrentPage] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState<'next' | 'prev'>('next');
  
  // Estados del juego
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);
  const [emociones, setEmociones] = useState<Emocion[]>([]);
  const [emocionesSeleccionadas, setEmocionesSeleccionadas] = useState<number[]>([]);
  const [emocionError, setEmocionError] = useState<number | null>(null);
  const [isGameCompleted, setIsGameCompleted] = useState(false);

  // Inicializar emociones mezcladas al montar el componente
  useEffect(() => {
    const SUPABASE_STORAGE_URL = 'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images';
    
    // Mapeo de nombres de emociones a IDs e imágenes (basado en las otras actividades)
    const emocionMap: { [key: string]: { id: number; imagen: string } } = {
      "Rabia": { id: 5, imagen: `${SUPABASE_STORAGE_URL}/5.%20Rabia.jpg` },
      "Enfado": { id: 20, imagen: `${SUPABASE_STORAGE_URL}/20.%20Enfado.jpg` },
      "Frustración": { id: 11, imagen: `${SUPABASE_STORAGE_URL}/11.%20Frustracion.jpg` },
      "Tristeza": { id: 2, imagen: `${SUPABASE_STORAGE_URL}/2.%20Tristeza.jpg` },
      "Pena": { id: 4, imagen: `${SUPABASE_STORAGE_URL}/4.%20Pena.jpg` },
      "Amabilidad": { id: 22, imagen: `${SUPABASE_STORAGE_URL}/22.%20Amabilidad.jpg` },
      "Ternura": { id: 23, imagen: `${SUPABASE_STORAGE_URL}/23.%20Ternura.jpg` },
      "Alegría": { id: 1, imagen: `${SUPABASE_STORAGE_URL}/1.%20Alegria.jpg` },
      "Felicidad": { id: 13, imagen: `${SUPABASE_STORAGE_URL}/13.%20Felicidad.jpg` },
      "Esperanza": { id: 14, imagen: `${SUPABASE_STORAGE_URL}/14.%20Esperanza.jpg` },
      "Vergüenza": { id: 7, imagen: `${SUPABASE_STORAGE_URL}/7.%20Vergueza.jpg` },
      "Miedo": { id: 3, imagen: `${SUPABASE_STORAGE_URL}/3.%20Miedo.jpg` },
    };

    // Combinar todas las emociones
    const todasEmociones: Emocion[] = [
      ...EMOCIONES_CORRECTAS.map((emo, index) => ({
        ...emo,
        id: emocionMap[emo.nombre]?.id || index + 1,
        imagen: emocionMap[emo.nombre]?.imagen || '',
      })),
      ...EMOCIONES_INCORRECTAS.map((emo, index) => ({
        ...emo,
        id: emocionMap[emo.nombre]?.id || index + 10,
        imagen: emocionMap[emo.nombre]?.imagen || '',
      })),
    ];

    // Mezclar aleatoriamente
    const shuffled = [...todasEmociones].sort(() => Math.random() - 0.5);
    setEmociones(shuffled);
  }, []);

  // Navegación del cuento
  const handleNextPage = () => {
    if (currentPage < PAGINAS_CUENTO.length - 1 && !isFlipping) {
      setFlipDirection('next');
      setIsFlipping(true);
      // Fade out: 0.5 segundos
      setTimeout(() => {
        // Cambiar página cuando el fade out termine
        setCurrentPage(prev => prev + 1);
        // Fade in: 0.5 segundos después de cambiar la página
        setTimeout(() => {
          setIsFlipping(false);
        }, 50); // Pequeño delay para que el contenido nuevo se renderice
      }, 500); // Duración del fade out
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0 && !isFlipping) {
      setFlipDirection('prev');
      setIsFlipping(true);
      // Fade out: 0.5 segundos
      setTimeout(() => {
        // Cambiar página cuando el fade out termine
        setCurrentPage(prev => prev - 1);
        // Fade in: 0.5 segundos después de cambiar la página
        setTimeout(() => {
          setIsFlipping(false);
        }, 50); // Pequeño delay para que el contenido nuevo se renderice
      }, 500); // Duración del fade out
    }
  };

  const isLastPage = currentPage === PAGINAS_CUENTO.length - 1;
  const isFirstPage = currentPage === 0;

  // Función para formatear el texto del cuento
  const formatearTextoCuento = (texto: string): JSX.Element[] => {
    // Lista de todas las emociones (correctas e incorrectas) para buscar en el texto
    const todasLasEmociones = [
      ...EMOCIONES_CORRECTAS.map(e => e.nombre),
      ...EMOCIONES_INCORRECTAS.map(e => e.nombre)
    ];

    // Dividir el texto por líneas
    const lineas = texto.split('\n');
    const resultado: JSX.Element[] = [];

    lineas.forEach((linea, lineaIndex) => {
      if (linea.trim() === '') {
        resultado.push(<br key={`br-${lineaIndex}`} />);
        return;
      }

      // Detectar si es un diálogo (empieza con —)
      const esDialogo = linea.trim().startsWith('—');

      // Procesar la línea para encontrar matches
      const matches: Array<{ start: number; end: number; text: string; tipo: 'hada' | 'emocion' }> = [];

      // Buscar "Hada Coralina" (case insensitive)
      const regexHada = /(Hada Coralina)/gi;
      let matchHada;
      while ((matchHada = regexHada.exec(linea)) !== null) {
        matches.push({
          start: matchHada.index,
          end: matchHada.index + matchHada[0].length,
          text: matchHada[0],
          tipo: 'hada'
        });
      }

      // Buscar emociones
      todasLasEmociones.forEach(emocion => {
        const regexEmocion = new RegExp(`\\b(${emocion.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\b`, 'gi');
        let matchEmocion;
        while ((matchEmocion = regexEmocion.exec(linea)) !== null) {
          // Verificar que no esté dentro de "Hada Coralina"
          const estaDentroDeHada = matches.some(m => 
            m.tipo === 'hada' && matchEmocion.index >= m.start && matchEmocion.index < m.end
          );
          if (!estaDentroDeHada) {
            matches.push({
              start: matchEmocion.index,
              end: matchEmocion.index + matchEmocion[0].length,
              text: matchEmocion[0],
              tipo: 'emocion'
            });
          }
        }
      });

      // Ordenar matches por posición
      matches.sort((a, b) => a.start - b.start);

      // Eliminar overlaps (mantener solo el primero)
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
      const elementosJSX: JSX.Element[] = [];
      let indiceActual = 0;

      matchesFinales.forEach((match, matchIndex) => {
        // Texto antes del match
        if (match.start > indiceActual) {
          elementosJSX.push(
            <React.Fragment key={`text-${lineaIndex}-${matchIndex}`}>
              {linea.substring(indiceActual, match.start)}
            </React.Fragment>
          );
        }

        // El match formateado
        if (match.tipo === 'hada') {
          elementosJSX.push(
            <strong 
              key={`hada-${lineaIndex}-${matchIndex}`} 
              className="font-bold text-pink-500"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
            >
              {match.text}
            </strong>
          );
        } else {
          elementosJSX.push(
            <strong 
              key={`emocion-${lineaIndex}-${matchIndex}`} 
              className="font-bold text-blue-600"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.1)' }}
            >
              {match.text}
            </strong>
          );
        }

        indiceActual = match.end;
      });

      // Texto restante después del último match
      if (indiceActual < linea.length) {
        elementosJSX.push(
          <React.Fragment key={`text-end-${lineaIndex}`}>
            {linea.substring(indiceActual)}
          </React.Fragment>
        );
      }

      // Si no hay matches, usar el texto original
      if (elementosJSX.length === 0) {
        elementosJSX.push(
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
            ? 'italic text-gray-800 pl-6 pr-4 py-3 my-4 border-l-4 border-pink-300 bg-pink-50/50 rounded-r-lg shadow-sm' 
            : 'mb-4'
          }`}
        >
          {elementosJSX}
        </p>
      );
    });

    return resultado;
  };

  // Funciones del juego
  const handleEmocionClick = (emocion: Emocion) => {
    // Si ya está seleccionada correctamente, no hacer nada
    if (emocionesSeleccionadas.includes(emocion.id) && emocion.esCorrecta) {
      return;
    }

    // Si es incorrecta, mostrar error temporal
    if (!emocion.esCorrecta) {
      setEmocionError(emocion.id);
      setTimeout(() => {
        setEmocionError(null);
      }, 500);
      return;
    }

    // Si es correcta, agregarla a seleccionadas
    if (emocion.esCorrecta && !emocionesSeleccionadas.includes(emocion.id)) {
      const nuevasSeleccionadas = [...emocionesSeleccionadas, emocion.id];
      setEmocionesSeleccionadas(nuevasSeleccionadas);

      // Verificar si se completó el juego
      if (nuevasSeleccionadas.length === EMOCIONES_CORRECTAS.length) {
        setIsGameCompleted(true);
        // Mostrar popup solo una vez cuando se completa
        if (!showSuccessPopup) {
          setTimeout(() => {
            setShowSuccessPopup(true);
          }, 500);
        }
      }
    }
  };

  const estaSeleccionada = (emocionId: number) => {
    return emocionesSeleccionadas.includes(emocionId);
  };

  const tieneError = (emocionId: number) => {
    return emocionError === emocionId;
  };

  // Función para reiniciar la actividad
  const resetActivity = () => {
    setCurrentPage(0);
    setEmocionesSeleccionadas([]);
    setEmocionError(null);
    setIsGameCompleted(false);
    setShowSuccessPopup(false);
    // Re-mezclar emociones
    const shuffled = [...emociones].sort(() => Math.random() - 0.5);
    setEmociones(shuffled);
  };

  const totalCorrectas = EMOCIONES_CORRECTAS.length;
  const seleccionadasCorrectas = emocionesSeleccionadas.length;

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
            El Pirata Gritón
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
                  <h4 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} text-center pb-2 border-b-2 border-gray-200`}>
                    {PAGINA_FINAL.titulo}
                  </h4>
                  <div className="space-y-4 pt-2">
                    {PAGINA_FINAL.preguntas.map((pregunta, index) => (
                      <div key={index} className="bg-blue-50/50 p-4 rounded-lg border-l-4 border-blue-400">
                        <p className="text-gray-800 leading-relaxed font-semibold text-lg">
                          {pregunta}
                        </p>
                      </div>
                    ))}
                  </div>
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

      {/* Card del Juego - Siempre visible y operativo */}
      {emociones.length > 0 && (
        <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
          <div className="space-y-6">
            {/* Barra de progreso */}
            <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-md border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Progreso</span>
                <span className={`text-sm font-semibold ${getMainTitleTextClasses(activityType)}`}>
                  {seleccionadasCorrectas} de {totalCorrectas} emociones encontradas
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${(seleccionadasCorrectas / totalCorrectas) * 100}%`,
                    backgroundColor: getProgressBarColor(activityType)
                  }}
                />
              </div>
            </div>

            {/* Grid de emociones */}
            {!isGameCompleted ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-700 mb-4">
                    Selecciona las emociones que aparecen en el cuento
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {emociones.map((emocion) => {
                      const seleccionada = estaSeleccionada(emocion.id);
                      const error = tieneError(emocion.id);

                      return (
                        <button
                          key={emocion.id}
                          onClick={() => handleEmocionClick(emocion)}
                          disabled={seleccionada && emocion.esCorrecta}
                          className={`
                            relative p-2 rounded-xl border-2 transition-all duration-200
                            ${seleccionada && emocion.esCorrecta
                              ? 'bg-braini-green/10 border-braini-green opacity-75 cursor-not-allowed'
                              : error
                              ? 'bg-braini-pink/10 border-braini-pink shadow-lg animate-shake'
                              : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                            }
                          `}
                        >
                          {emocion.imagen ? (
                            <div className="w-full h-32 mb-1.5 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                              <img
                                src={emocion.imagen}
                                alt={emocion.nombre}
                                className="w-full h-full object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj57ZW1vY2lvbi5ub21icmV9PC90ZXh0Pjwvc3ZnPg==';
                                }}
                              />
                            </div>
                          ) : (
                            <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-1.5">
                              <span className="text-2xl">{emocion.nombre.charAt(0)}</span>
                            </div>
                          )}
                          <p className="text-xs font-medium text-gray-700 text-center leading-tight">
                            {emocion.nombre}
                          </p>
                          
                          {error && (
                            <div className="absolute top-1 right-1 bg-braini-pink rounded-full p-1 animate-pulse">
                              <X className="w-4 h-4 text-white" />
                            </div>
                          )}
                          
                          {seleccionada && emocion.esCorrecta && (
                            <div className="absolute top-1 right-1 bg-braini-green rounded-full p-1">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Barco del Pirata Gritón */}
                <div className={`${getInstructionsContainerClasses(activityType)} p-6 rounded-xl border-2`}>
                  <h4 className="text-lg font-bold text-gray-700 mb-4 text-center">
                    🚢 Barco del Pirata Gritón
                  </h4>
                  <div className="min-h-[120px] p-4 bg-white/50 rounded-lg border-2 border-dashed border-gray-300">
                    {emocionesSeleccionadas.length === 0 ? (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        <p className="text-sm italic">Las emociones seleccionadas aparecerán aquí</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                        {emociones
                          .filter(emo => emocionesSeleccionadas.includes(emo.id) && emo.esCorrecta)
                          .map((emocion) => (
                            <div
                              key={`barco-${emocion.id}`}
                              className="relative bg-white p-2 rounded-lg border-2 border-braini-green shadow-md"
                            >
                              {emocion.imagen ? (
                                <div className="w-full h-20 mb-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                                  <img
                                    src={emocion.imagen}
                                    alt={emocion.nombre}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj57ZW1vY2lvbi5ub21icmV9PC90ZXh0Pjwvc3ZnPg==';
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-1">
                                  <span className="text-xl">{emocion.nombre.charAt(0)}</span>
                                </div>
                              )}
                              <p className="text-xs font-medium text-gray-700 text-center leading-tight">
                                {emocion.nombre}
                              </p>
                              <div className="absolute top-1 right-1 bg-braini-green rounded-full p-1">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Barco del Pirata Gritón - Completado */}
                <div className={`${getInstructionsContainerClasses(activityType)} p-6 rounded-xl border-2`}>
                  <h4 className="text-lg font-bold text-gray-700 mb-4 text-center">
                    🚢 Barco del Pirata Gritón
                  </h4>
                  <div className="p-4 bg-white/50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {emociones
                        .filter(emo => emocionesSeleccionadas.includes(emo.id) && emo.esCorrecta)
                        .map((emocion) => (
                          <div
                            key={`barco-completed-${emocion.id}`}
                            className="relative bg-white p-2 rounded-lg border-2 border-braini-green shadow-md"
                          >
                            {emocion.imagen ? (
                              <div className="w-full h-20 mb-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                                <img
                                  src={emocion.imagen}
                                  alt={emocion.nombre}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj57ZW1vY2lvbi5ub21icmV9PC90ZXh0Pjwvc3ZnPg==';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-1">
                                <span className="text-xl">{emocion.nombre.charAt(0)}</span>
                              </div>
                            )}
                            <p className="text-xs font-medium text-gray-700 text-center leading-tight">
                              {emocion.nombre}
                            </p>
                            <div className="absolute top-1 right-1 bg-braini-green rounded-full p-1">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                {/* Botón Repetir Actividad */}
                <div className="w-full flex justify-center">
                  <Button
                    onClick={resetActivity}
                    className={getPrimaryButtonClasses(activityType)}
                  >
                    Repetir Actividad
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

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
      <Dialog open={showScientificBase} onOpenChange={setShowScientificBase}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className={`text-3xl font-bold ${getScientificBaseTitleClasses(activityType)} flex items-center gap-2`}>
              <svg className={`w-7 h-7 ${getScientificBaseIconClasses(activityType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Base Científica
            </DialogTitle>
            <DialogDescription className="text-gray-700 font-semibold text-base">
              Información respaldada por investigaciones científicas
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {activityData?.investigacion_beneficios && (
              <div className="text-gray-700 leading-relaxed">
                {formatearTexto(activityData.investigacion_beneficios)}
              </div>
            )}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={() => setShowScientificBase(false)}
              className={getSimpleButtonClasses(activityType) + " hover:shadow-xl transform hover:scale-105"}
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ses5Act1;

