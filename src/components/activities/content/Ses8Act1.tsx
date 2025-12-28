import React, { useState, useEffect } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
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

interface Ses8Act1Props {
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
}

interface Situacion {
  id: number;
  texto: string;
}

const SUPABASE_STORAGE_URL = 'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images';

// Emociones disponibles (8 emociones)
const EMOCIONES_DISPONIBLES: Omit<Emocion, 'id' | 'imagen'>[] = [
  { nombre: "Celos" },
  { nombre: "Tristeza" },
  { nombre: "Enfado" },
  { nombre: "Rabia" },
  { nombre: "Pena" },
  { nombre: "Nervioso" },
  { nombre: "Miedo" },
  { nombre: "Frustración" },
];

// Situaciones
const SITUACIONES: Situacion[] = [
  {
    id: 1,
    texto: "Cuando mi madre abraza a otros niños, a veces yo siento…"
  },
  {
    id: 2,
    texto: "Hoy en el recreo mi amigo no me ha dejado jugar con él y me he sentido…"
  },
  {
    id: 3,
    texto: "Yo quería comerme una chuche pero mi padre no me ha dejado, y he sentido…"
  },
  {
    id: 4,
    texto: "Teníamos que ir al parque, pero al final, mi mamá me ha dicho que no, que otro día. Y yo he sentido…"
  }
];

/**
 * Actividad 1 - Sesión 8
 * Tutifruti Emocional: Seleccionar emociones para cada situación
 */
const Ses8Act1: React.FC<Ses8Act1Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityType,
  activityData,
  onPuzzleComplete
}) => {
  // Estados del juego
  const [emociones, setEmociones] = useState<Emocion[]>([]);
  const [currentSituationIndex, setCurrentSituationIndex] = useState(0);
  const [seleccionesPorSituacion, setSeleccionesPorSituacion] = useState<{ [situacionId: number]: number[] }>({});
  const [isActivityCompleted, setIsActivityCompleted] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  // Mapeo de nombres de emociones a IDs e imágenes
  const emocionMap: { [key: string]: { id: number; imagen: string } } = {
    "Celos": { id: 6, imagen: `${SUPABASE_STORAGE_URL}/6.%20Celos.jpg` },
    "Tristeza": { id: 2, imagen: `${SUPABASE_STORAGE_URL}/2.%20Tristeza.jpg` },
    "Enfado": { id: 20, imagen: `${SUPABASE_STORAGE_URL}/20.%20Enfado.jpg` },
    "Rabia": { id: 5, imagen: `${SUPABASE_STORAGE_URL}/5.%20Rabia.jpg` },
    "Pena": { id: 4, imagen: `${SUPABASE_STORAGE_URL}/4.%20Pena.jpg` },
    "Nervioso": { id: 16, imagen: `${SUPABASE_STORAGE_URL}/16.%20Nervioso.jpg` },
    "Miedo": { id: 3, imagen: `${SUPABASE_STORAGE_URL}/3.%20Miedo.jpg` },
    "Frustración": { id: 11, imagen: `${SUPABASE_STORAGE_URL}/11.%20Frustracion.jpg` },
  };

  // Inicializar emociones al montar el componente
  useEffect(() => {
    const emocionesIniciales: Emocion[] = EMOCIONES_DISPONIBLES.map((emo) => ({
      ...emo,
      id: emocionMap[emo.nombre]?.id || 0,
      imagen: emocionMap[emo.nombre]?.imagen || '',
    }));

    // Mezclar aleatoriamente
    const shuffled = [...emocionesIniciales].sort(() => Math.random() - 0.5);
    setEmociones(shuffled);
    setSeleccionesPorSituacion({});
    setCurrentSituationIndex(0);
    setIsActivityCompleted(false);
  }, []);

  // Obtener situación actual
  const currentSituation = SITUACIONES[currentSituationIndex];
  const totalSituaciones = SITUACIONES.length;
  const isFirstSituation = currentSituationIndex === 0;
  const isLastSituation = currentSituationIndex === totalSituaciones - 1;

  // Obtener emociones seleccionadas para la situación actual
  const emocionesSeleccionadas = seleccionesPorSituacion[currentSituation?.id] || [];
  const tieneSeleccion = emocionesSeleccionadas.length > 0;

  // Función para manejar el clic en una emoción
  const handleEmocionClick = (emocionId: number) => {
    if (!currentSituation) return;

    const seleccionesActuales = seleccionesPorSituacion[currentSituation.id] || [];
    
    if (seleccionesActuales.includes(emocionId)) {
      // Deseleccionar
      setSeleccionesPorSituacion({
        ...seleccionesPorSituacion,
        [currentSituation.id]: seleccionesActuales.filter(id => id !== emocionId)
      });
    } else {
      // Seleccionar
      setSeleccionesPorSituacion({
        ...seleccionesPorSituacion,
        [currentSituation.id]: [...seleccionesActuales, emocionId]
      });
    }
  };

  // Función para avanzar a la siguiente situación
  const handleNextSituation = () => {
    if (!tieneSeleccion) return; // No avanzar si no hay selección

    if (currentSituationIndex < totalSituaciones - 1) {
      setCurrentSituationIndex(prev => prev + 1);
    } else {
      // Todas las situaciones completadas
      setIsActivityCompleted(true);
      setShowSuccessPopup(true);
    }
  };

  // Función para retroceder a la situación anterior
  const handlePreviousSituation = () => {
    if (currentSituationIndex > 0) {
      setCurrentSituationIndex(prev => prev - 1);
    }
  };

  // Función para reiniciar la actividad
  const resetActivity = () => {
    // Mezclar emociones de nuevo
    const emocionesIniciales: Emocion[] = EMOCIONES_DISPONIBLES.map((emo) => ({
      ...emo,
      id: emocionMap[emo.nombre]?.id || 0,
      imagen: emocionMap[emo.nombre]?.imagen || '',
    }));
    const shuffled = [...emocionesIniciales].sort(() => Math.random() - 0.5);
    setEmociones(shuffled);
    
    // Resetear selecciones y estado
    setSeleccionesPorSituacion({});
    setCurrentSituationIndex(0);
    setIsActivityCompleted(false);
    setShowSuccessPopup(false);
  };

  // Verificar si una emoción está seleccionada
  const estaSeleccionada = (emocionId: number) => {
    if (!currentSituation) return false;
    const selecciones = seleccionesPorSituacion[currentSituation.id] || [];
    return selecciones.includes(emocionId);
  };

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

      {/* Área de la actividad */}
      {!isActivityCompleted && emociones.length > 0 && (
        <div className="space-y-6">
          {/* Indicador de progreso */}
          <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progreso</span>
              <span className={`text-sm font-semibold ${getMainTitleTextClasses(activityType)}`}>
                Situación {currentSituationIndex + 1} de {totalSituaciones}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((currentSituationIndex + 1) / totalSituaciones) * 100}%`,
                  backgroundColor: getProgressBarColor(activityType)
                }}
              />
            </div>
          </div>

          {/* Card de la situación actual */}
          <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
            <div className="mb-6">
              <div className="text-center mb-6 border-b-2 border-gray-200 pb-3">
                <h3 className={`text-3xl font-bold ${getMainTitleTextClasses(activityType)} mb-2`}>
                  Situación {currentSituation.id}:
                </h3>
                <h4 className="text-2xl font-semibold text-gray-800">
                  {currentSituation.texto}
                </h4>
              </div>

              {/* Contenido de la situación */}
              <div className="min-h-[200px] mb-6 relative">
                {/* Contador de emociones seleccionadas */}
                <div className={`${getInstructionsContainerClasses(activityType)} p-4 rounded-xl mb-6`}>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg font-semibold">
                    Emociones seleccionadas: <span className={`${getMainTitleTextClasses(activityType)} font-bold`}>{emocionesSeleccionadas.length}</span>
                  </p>
                </div>

                {/* Grid de emociones */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {emociones.map((emocion) => {
                    const seleccionada = estaSeleccionada(emocion.id);

                    return (
                      <button
                        key={emocion.id}
                        onClick={() => handleEmocionClick(emocion.id)}
                        className={`
                          relative p-2 rounded-xl border-2 transition-all duration-200
                          ${seleccionada
                            ? 'bg-braini-green/10 border-braini-green shadow-lg transform scale-105'
                            : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                          }
                        `}
                      >
                        {emocion.imagen ? (
                          <div className="w-full h-20 mb-1.5 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
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
                          <div className="w-full h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-1.5">
                            <span className="text-xl">{emocion.nombre.charAt(0)}</span>
                          </div>
                        )}
                        <p className="text-xs font-medium text-gray-700 text-center leading-tight">
                          {emocion.nombre}
                        </p>
                        
                        {/* Icono de selección */}
                        {seleccionada && (
                          <div className="absolute top-1 right-1 bg-braini-green rounded-full p-1">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Navegación dentro de la tarjeta */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Button
                onClick={handlePreviousSituation}
                disabled={isFirstSituation}
                className={getPrimaryButtonClasses(activityType) + " flex items-center gap-2"}
              >
                <ArrowLeft className="w-4 h-4" />
                Anterior
              </Button>

              {!isLastSituation ? (
                <Button
                  onClick={handleNextSituation}
                  disabled={!tieneSeleccion}
                  className={getPrimaryButtonClasses(activityType) + " flex items-center gap-2"}
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleNextSituation}
                  disabled={!tieneSeleccion}
                  className={getPrimaryButtonClasses(activityType) + " flex items-center gap-2"}
                >
                  Completar Actividad
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pantalla de actividad completada */}
      {isActivityCompleted && (
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl border-0 text-center">
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <h2 className={`text-3xl font-black ${getMainTitleTextClasses(activityType)} mb-4`}>
              ¡Actividad Completada!
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Has seleccionado las emociones para todas las situaciones.
            </p>
          </div>
          <Button
            onClick={resetActivity}
            className={getPrimaryButtonClasses(activityType)}
          >
            Repetir Actividad
          </Button>
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

export default Ses8Act1;

