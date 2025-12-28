import React, { useState, useEffect } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

interface Ses4Act1Props {
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

interface ParEmociones {
  id: number;
  emocion1: Emocion;
  emocion2: Emocion;
}

const SUPABASE_STORAGE_URL = 'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images';

// Pares de emociones originales (se randomizará el orden al iniciar)
const PARES_ORIGINALES: ParEmociones[] = [
  {
    id: 1,
    emocion1: { id: 1, nombre: "Alegría", imagen: `${SUPABASE_STORAGE_URL}/1.%20Alegria.jpg` },
    emocion2: { id: 2, nombre: "Tristeza", imagen: `${SUPABASE_STORAGE_URL}/2.%20Tristeza.jpg` }
  },
  {
    id: 2,
    emocion1: { id: 18, nombre: "Contento", imagen: `${SUPABASE_STORAGE_URL}/18.%20Contento.jpg` },
    emocion2: { id: 20, nombre: "Enfado", imagen: `${SUPABASE_STORAGE_URL}/20.%20Enfado.jpg` }
  },
  {
    id: 3,
    emocion1: { id: 21, nombre: "Paciencia", imagen: `${SUPABASE_STORAGE_URL}/21.%20Paciencia.jpg` },
    emocion2: { id: 16, nombre: "Impaciencia", imagen: `${SUPABASE_STORAGE_URL}/16.%20Impaciencia.jpg` }
  },
  {
    id: 4,
    emocion1: { id: 12, nombre: "Tranquilidad", imagen: `${SUPABASE_STORAGE_URL}/12.%20Tranquilidad.jpg` },
    emocion2: { id: 16, nombre: "Nerviosismo", imagen: `${SUPABASE_STORAGE_URL}/16.%20Nervioso.jpg` }
  },
  {
    id: 5,
    emocion1: { id: 3, nombre: "Miedo", imagen: `${SUPABASE_STORAGE_URL}/3.%20Miedo.jpg` },
    emocion2: { id: 13, nombre: "Felicidad", imagen: `${SUPABASE_STORAGE_URL}/13.%20Felicidad.jpg` }
  }
];

/**
 * Actividad 1 - Sesión 4
 * Que viene que viene: Expresión corporal y facial de emociones en pares
 */
const Ses4Act1: React.FC<Ses4Act1Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityType,
  activityData,
  onPuzzleComplete
}) => {
  const { toast } = useToast();
  
  // Estados del juego
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);
  const [paresOrdenados, setParesOrdenados] = useState<ParEmociones[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [completedPairs, setCompletedPairs] = useState<number[]>([]);
  const [isActivityCompleted, setIsActivityCompleted] = useState(false);

  // Randomizar pares al montar el componente
  useEffect(() => {
    const shuffled = [...PARES_ORIGINALES].sort(() => Math.random() - 0.5);
    setParesOrdenados(shuffled);
    setCurrentPairIndex(0);
    setCompletedPairs([]);
  }, []);

  // Obtener par actual
  const currentPair = paresOrdenados.length > 0 && currentPairIndex < paresOrdenados.length
    ? paresOrdenados[currentPairIndex]
    : null;

  const totalPairs = paresOrdenados.length;

  // Función para avanzar al siguiente par
  const handleNextPair = () => {
    if (currentPair) {
      setCompletedPairs(prev => [...prev, currentPair.id]);
      
      if (currentPairIndex < totalPairs - 1) {
        setCurrentPairIndex(prev => prev + 1);
      } else {
        // Todos los pares completados
        setIsActivityCompleted(true);
        setShowSuccessPopup(true);
      }
    }
  };

  // Función para retroceder al par anterior
  const handlePreviousPair = () => {
    if (currentPairIndex > 0) {
      setCurrentPairIndex(prev => prev - 1);
      // Remover de completados si estaba
      const newIndex = currentPairIndex - 1;
      const previousPair = paresOrdenados[newIndex];
      if (previousPair) {
        setCompletedPairs(prev => prev.filter(id => id !== previousPair.id));
      }
    }
  };

  // Verificar si el par actual está completado
  const isPairCompleted = (pairId: number) => {
    return completedPairs.includes(pairId);
  };

  // Función para reiniciar la actividad con parejas aleatorias
  const resetActivity = () => {
    const shuffled = [...PARES_ORIGINALES].sort(() => Math.random() - 0.5);
    setParesOrdenados(shuffled);
    setCurrentPairIndex(0);
    setCompletedPairs([]);
    setIsActivityCompleted(false);
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
      {paresOrdenados.length > 0 && (
        <div className="space-y-6">
          {/* Indicador de progreso */}
          <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progreso</span>
              <span className={`text-sm font-semibold ${getMainTitleTextClasses(activityType)}`}>
                Par {currentPairIndex + 1} de {totalPairs}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((currentPairIndex + 1) / totalPairs) * 100}%`,
                  backgroundColor: getProgressBarColor(activityType)
                }}
              />
            </div>
          </div>

          {/* Contenido del par actual */}
          {currentPair && (
            <div className="space-y-6">
              {/* Grid de las dos emociones del par */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Emoción 1 */}
                <div className={`bg-white border-2 ${getBorderClasses(activityType).replace('/20', '/30')} rounded-xl p-4 shadow-md`}>
                  <div className="text-center mb-3">
                    <div className="w-24 h-24 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img
                        src={currentPair.emocion1.imagen}
                        alt={currentPair.emocion1.nombre}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj57Y3VycmVudFBhaXIuZW1vY2lvbjEubm9tYnJlfTwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                    </div>
                    <h3 className={`text-xl font-black ${getMainTitleTextClasses(activityType)} mb-2`}>
                      {currentPair.emocion1.nombre}
                    </h3>
                  </div>

                  {/* Textos de ejemplo (sin input) */}
                  <div className="space-y-3 mt-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        ¿En qué parte del cuerpo notas esta emoción?
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        Ej: En el pecho, en el estómago...
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        ¿Qué haces cuando sientes esta emoción?
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        Ej: Salto de alegría, me quedo quieto...
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        ¿Cómo podrías gestionarla mejor?
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        Ej: Respirar profundo, hablar con alguien...
                      </p>
                    </div>
                  </div>
                </div>

                {/* Emoción 2 */}
                <div className={`bg-white border-2 ${getBorderClasses(activityType).replace('/20', '/30')} rounded-xl p-4 shadow-md`}>
                  <div className="text-center mb-3">
                    <div className="w-24 h-24 mx-auto mb-3 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                      <img
                        src={currentPair.emocion2.imagen}
                        alt={currentPair.emocion2.nombre}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj57Y3VycmVudFBhaXIuZW1vY2lvbjIubm9tYnJlfTwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                    </div>
                    <h3 className={`text-xl font-black ${getMainTitleTextClasses(activityType)} mb-2`}>
                      {currentPair.emocion2.nombre}
                    </h3>
                  </div>

                  {/* Textos de ejemplo (sin input) */}
                  <div className="space-y-3 mt-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        ¿En qué parte del cuerpo notas esta emoción?
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        Ej: En el pecho, en el estómago...
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        ¿Qué haces cuando sientes esta emoción?
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        Ej: Salto de alegría, me quedo quieto...
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        ¿Cómo podrías gestionarla mejor?
                      </p>
                      <p className="text-xs text-gray-500 italic">
                        Ej: Respirar profundo, hablar con alguien...
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navegación */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                {!isActivityCompleted ? (
                  <>
                    <Button
                      onClick={handlePreviousPair}
                      disabled={currentPairIndex === 0}
                      className={getPrimaryButtonClasses(activityType) + " flex items-center gap-2"}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Anterior
                    </Button>

                    <div className="flex items-center gap-2">
                      {isPairCompleted(currentPair.id) && (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">Par completado</span>
                        </div>
                      )}
                    </div>

                    <Button
                      onClick={handleNextPair}
                      className={getPrimaryButtonClasses(activityType) + " flex items-center gap-2"}
                    >
                      {currentPairIndex < totalPairs - 1 ? (
                        <>
                          Siguiente
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Completar Actividad
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <div className="w-full flex justify-center">
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

export default Ses4Act1;

