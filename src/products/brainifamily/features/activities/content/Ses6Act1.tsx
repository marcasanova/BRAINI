import React, { useState, useEffect } from 'react';
import { UserActivity } from '@/products/brainifamily/hooks/useUserActivities';
import { CheckCircle, X, BookOpen, Utensils } from 'lucide-react';
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
import { EMOTIONS_INFANTIL_URL } from '@/shared/lib/constants/emotionsStorage';

interface Ses6Act1Props {
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

interface Emocion {
  id: number;
  nombre: string;
  imagen: string;
  esNegativa: boolean; // true si debe eliminarse (Enfado, Frustración, Rabia, Celos)
}

// Emociones negativas (a eliminar)
const EMOCIONES_NEGATIVAS: Omit<Emocion, 'id' | 'imagen'>[] = [
  { nombre: "Enfado", esNegativa: true },
  { nombre: "Frustración", esNegativa: true },
  { nombre: "Rabia", esNegativa: true },
  { nombre: "Celos", esNegativa: true },
];

// Emociones positivas/neutras (a mantener)
const EMOCIONES_POSITIVAS: Omit<Emocion, 'id' | 'imagen'>[] = [
  { nombre: "Alegría", esNegativa: false },
  { nombre: "Tranquilidad", esNegativa: false },
  { nombre: "Ilusión", esNegativa: false },
  { nombre: "Paciencia", esNegativa: false },
  { nombre: "Curiosidad", esNegativa: false },
];

/**
 * Actividad 1 - Sesión 6
 * Ensalada Emocional: Eliminar emociones negativas del bol
 */
const Ses6Act1: React.FC<Ses6Act1Props> = ({ 
  userProgress, 
  activityId, 
  missionId, 
  userId,
  activityType,
  activityData,
  onPuzzleComplete
}) => {
  // Estados del juego
  const [emociones, setEmociones] = useState<Emocion[]>([]);
  const [emocionesEliminadas, setEmocionesEliminadas] = useState<number[]>([]);
  const [emocionError, setEmocionError] = useState<number | null>(null);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);
  const [emocionesAnimando, setEmocionesAnimando] = useState<number[]>([]);

  // Mapeo de nombres de emociones a IDs e imágenes
  const emocionMap: { [key: string]: { id: number; imagen: string } } = {
    "Enfado": { id: 20, imagen: `${EMOTIONS_INFANTIL_URL}/20.%20Enfado.png` },
    "Frustración": { id: 11, imagen: `${EMOTIONS_INFANTIL_URL}/11.%20Frustracion.png` },
    "Rabia": { id: 5, imagen: `${EMOTIONS_INFANTIL_URL}/5.%20Rabia.png` },
    "Celos": { id: 6, imagen: `${EMOTIONS_INFANTIL_URL}/6.%20Celos.png` },
    "Alegría": { id: 1, imagen: `${EMOTIONS_INFANTIL_URL}/1.%20Alegria.png` },
    "Tranquilidad": { id: 12, imagen: `${EMOTIONS_INFANTIL_URL}/12.%20Tranquilidad.png` },
    "Ilusión": { id: 10, imagen: `${EMOTIONS_INFANTIL_URL}/10.%20Ilusion.png` },
    "Paciencia": { id: 21, imagen: `${EMOTIONS_INFANTIL_URL}/21.%20Paciencia.png` },
    "Curiosidad": { id: 24, imagen: `${EMOTIONS_INFANTIL_URL}/24.%20Curiosidad.png` },
  };

  // Función para inicializar emociones mezcladas
  const inicializarEmociones = () => {
    // Combinar todas las emociones
    const todasEmociones: Emocion[] = [
      ...EMOCIONES_NEGATIVAS.map((emo) => ({
        ...emo,
        id: emocionMap[emo.nombre]?.id || 0,
        imagen: emocionMap[emo.nombre]?.imagen || '',
      })),
      ...EMOCIONES_POSITIVAS.map((emo) => ({
        ...emo,
        id: emocionMap[emo.nombre]?.id || 0,
        imagen: emocionMap[emo.nombre]?.imagen || '',
      })),
    ];

    // Mezclar aleatoriamente
    const shuffled = [...todasEmociones].sort(() => Math.random() - 0.5);
    return shuffled;
  };

  // Inicializar emociones al montar el componente
  useEffect(() => {
    const emocionesIniciales = inicializarEmociones();
    setEmociones(emocionesIniciales);
    setEmocionesEliminadas([]);
    setEmocionError(null);
    setIsGameCompleted(false);
    setEmocionesAnimando([]);
  }, []);

  // Verificar si el juego está completado
  useEffect(() => {
    const emocionesNegativasIds = EMOCIONES_NEGATIVAS.map(e => emocionMap[e.nombre]?.id).filter(Boolean);
    const todasEliminadas = emocionesNegativasIds.every(id => emocionesEliminadas.includes(id));
    
    if (todasEliminadas && emocionesNegativasIds.length > 0 && !isGameCompleted) {
      setIsGameCompleted(true);
      setTimeout(() => {
        setShowSuccessPopup(true);
      }, 500);
    }
  }, [emocionesEliminadas, isGameCompleted]);

  // Función para manejar el clic en una emoción
  const handleEmocionClick = (emocion: Emocion) => {
    // Si ya está eliminada o el juego está completado, no hacer nada
    if (emocionesEliminadas.includes(emocion.id) || isGameCompleted) {
      return;
    }

    if (emocion.esNegativa) {
      // ✅ CORRECTA: Emoción negativa que debe eliminarse
      setEmocionesAnimando([...emocionesAnimando, emocion.id]);
      
      // Después de la animación, agregar a eliminadas
      setTimeout(() => {
        setEmocionesEliminadas([...emocionesEliminadas, emocion.id]);
        setEmocionesAnimando(prev => prev.filter(id => id !== emocion.id));
      }, 500);
    } else {
      // ❌ ERROR: Emoción positiva que no debe eliminarse
      setEmocionError(emocion.id);
      setTimeout(() => {
        setEmocionError(null);
      }, 500);
    }
  };

  // Función para reiniciar la actividad (mezclar posiciones)
  const resetActivity = () => {
    const emocionesNuevas = inicializarEmociones();
    setEmociones(emocionesNuevas);
    setEmocionesEliminadas([]);
    setEmocionError(null);
    setIsGameCompleted(false);
    setShowSuccessPopup(false);
    setEmocionesAnimando([]);
  };

  // Contador de emociones eliminadas
  const totalNegativas = EMOCIONES_NEGATIVAS.length;
  const eliminadas = emocionesEliminadas.length;

  // Verificar si una emoción está eliminada
  const estaEliminada = (emocionId: number) => emocionesEliminadas.includes(emocionId);
  const estaAnimando = (emocionId: number) => emocionesAnimando.includes(emocionId);
  const tieneError = (emocionId: number) => emocionError === emocionId;

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

      {/* Área del juego */}
      {emociones.length > 0 && (
        <div className="space-y-6">
          {/* Contador de progreso */}
          <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progreso</span>
              <span className={`text-sm font-semibold ${getMainTitleTextClasses(activityType)}`}>
                {eliminadas} de {totalNegativas} eliminadas
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(eliminadas / totalNegativas) * 100}%`,
                  backgroundColor: getProgressBarColor(activityType)
                }}
              />
            </div>
          </div>

          {/* Layout de dos columnas: Bowl + Emociones Eliminadas */}
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-6">
            
            {/* COLUMNA IZQUIERDA: Bol con ensalada */}
            <div className="relative">
              {/* Título */}
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                🥗 Ensalada Emocional
              </h3>

              {/* Instrucción */}
              <p className="text-center text-gray-700 mb-6 font-medium">
                Sacar de la ensalada las emociones que no nos gustan
              </p>

              {/* Bol visual (CSS) */}
              <div className="relative mx-auto max-w-4xl">
              {/* Bol */}
              <div 
                className="relative mx-auto border-4 border-amber-800 bg-gradient-to-b from-amber-50 via-amber-100 to-amber-200 shadow-2xl overflow-hidden"
                style={{
                  width: '100%',
                  maxWidth: '700px',
                  minHeight: '500px',
                  borderRadius: '40px',
                  padding: '20px',
                }}
              >
                {/* Borde interno para profundidad */}
                <div 
                  className="absolute inset-3 border-2 border-amber-700/30"
                  style={{
                    borderRadius: '32px',
                  }}
                />

                {/* Cuchara (icono) */}
                <div className="absolute top-6 right-6 z-10">
                  <div className="bg-amber-200 rounded-lg p-3 shadow-lg transform rotate-12 border-2 border-amber-700/50">
                    <Utensils className="w-8 h-8 text-amber-800" />
                  </div>
                </div>

                {/* Grid de emociones dentro del bol */}
                <div className="relative w-full h-full flex items-center justify-center pt-12 pb-8">
                  <div className="grid grid-cols-3 gap-4 w-full max-w-lg">
                    {emociones.map((emocion) => {
                      const eliminada = estaEliminada(emocion.id);
                      const animando = estaAnimando(emocion.id);
                      const error = tieneError(emocion.id);

                      return (
                        <button
                          key={emocion.id}
                          onClick={() => handleEmocionClick(emocion)}
                          disabled={eliminada || isGameCompleted}
                          className={`
                            relative p-2 rounded-xl border-2 transition-all duration-500
                            ${eliminada || animando
                              ? 'opacity-0 scale-0 transform translate-y-[-50px] pointer-events-none'
                              : error
                              ? 'bg-braini-pink/10 border-braini-pink shadow-lg animate-shake'
                              : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                            }
                          `}
                          style={{
                            transition: eliminada || animando 
                              ? 'opacity 0.5s ease-out, transform 0.5s ease-out' 
                              : 'all 0.2s ease-in-out'
                          }}
                        >
                          {emocion.imagen ? (
                            <div className="w-full h-24 mb-1.5 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
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
                            <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center mb-1.5">
                              <span className="text-2xl">{emocion.nombre.charAt(0)}</span>
                            </div>
                          )}
                          <p className="text-xs font-medium text-gray-700 text-center leading-tight">
                            {emocion.nombre}
                          </p>
                          
                          {/* Iconos de feedback */}
                          {error && (
                            <div className="absolute top-1 right-1 bg-braini-pink rounded-full p-1 animate-pulse">
                              <X className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            </div>

            {/* COLUMNA DERECHA: Zona de Emociones Eliminadas (SIEMPRE VISIBLE) */}
            <div className="lg:sticky lg:top-6 flex flex-col">
              <h4 className="text-lg font-bold text-gray-700 mb-4 text-center">
                🗑️ Emociones Eliminadas
              </h4>
              
              {/* Contenedor con borde rosa - misma altura que el bowl */}
              <div className={`${getInstructionsContainerClasses(activityType)} p-6 rounded-xl border-2 border-braini-pink/50 flex-1 flex flex-col`} style={{ minHeight: '500px' }}>
                {/* Contenedor con placeholder o emociones */}
                <div className="p-4 bg-white/50 rounded-lg border-2 border-dashed border-gray-300 flex-1 flex flex-col">
                {emocionesEliminadas.length === 0 ? (
                  /* Placeholder cuando está vacío */
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-12">
                    <div className="text-6xl mb-4">👈</div>
                    <p className="text-sm font-medium">
                      Aquí aparecerán las emociones que elimines de la ensalada
                    </p>
                  </div>
                ) : (
                  /* Grid de emociones eliminadas - 1 columna */
                  <div className="grid grid-cols-1 gap-3">
                    {emociones
                      .filter(emo => emocionesEliminadas.includes(emo.id))
                      .map((emocion) => (
                        <div
                          key={`eliminada-${emocion.id}`}
                          className="relative bg-white p-2 rounded-lg border-2 border-braini-pink/50 shadow-md opacity-60"
                        >
                          {emocion.imagen ? (
                            <div className="w-full h-20 mb-1 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
                              <img
                                src={emocion.imagen}
                                alt={emocion.nombre}
                                className="w-full h-full object-contain grayscale"
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
                          <p className="text-xs font-medium text-gray-700 text-center leading-tight line-through">
                            {emocion.nombre}
                          </p>
                          <div className="absolute top-1 right-1 bg-braini-pink rounded-full p-1">
                            <X className="w-3 h-3 text-white" />
                          </div>
                        </div>
                      ))}
                  </div>
                )}
                </div>
              </div>
            </div>

          </div>

          {/* Mensaje de completado - Fuera del grid, debajo de ambas columnas */}
          {isGameCompleted && (
            <div className="mt-6 text-center">
              <div className={`inline-block ${getInstructionsContainerClasses(activityType)} p-6 rounded-xl`}>
                <p className="text-2xl font-bold text-gray-800 mb-2">
                  ¡Mmm qué riquísima está! 🥗
                </p>
                <p className="text-gray-700">
                  Has eliminado todas las emociones que no nos gustan
                </p>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          {isGameCompleted && (
            <div className="flex justify-center gap-4 pt-4">
              <Button
                onClick={resetActivity}
                className={getPrimaryButtonClasses(activityType)}
              >
                Repetir Actividad
              </Button>
            </div>
          )}
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
      <SciBasePopup
        open={showScientificBase}
        onOpenChange={setShowScientificBase}
        activityType={activityType}
        investigacionBeneficios={activityData?.investigacion_beneficios}
      />
    </div>
  );
};

export default Ses6Act1;


