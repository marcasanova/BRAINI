import React, { useState, useEffect } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { formatearTexto } from '@/components/activities/utils/TextFormatter';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import ActivityInstructions from '@/components/activities/utils/ActivityInstructions';
import SciBasePopup from '@/components/activities/utils/SciBasePopup';
import { 
  getPrimaryButtonClasses, 
  getSecondaryButtonClasses, 
  getInstructionsContainerClasses, 
  getDurationTextClasses,
  getSimpleButtonClasses,
  getBorderClasses,
  getMainTitleTextClasses,
  getProgressBarColor
} from '@/components/activities/utils/ActivityColors';
import { EMOTIONS_INFANTIL_URL } from '@/constants/emotionsStorage';

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

// Pares de emociones originales (bucket emociones_infantil) (se randomizará el orden al iniciar)
const PARES_ORIGINALES: ParEmociones[] = [
  {
    id: 1,
    emocion1: { id: 1, nombre: "Alegría", imagen: `${EMOTIONS_INFANTIL_URL}/1.%20Alegria.png` },
    emocion2: { id: 2, nombre: "Tristeza", imagen: `${EMOTIONS_INFANTIL_URL}/2.%20Tristeza.png` }
  },
  {
    id: 2,
    emocion1: { id: 18, nombre: "Contento", imagen: `${EMOTIONS_INFANTIL_URL}/18.%20Contento.png` },
    emocion2: { id: 20, nombre: "Enfado", imagen: `${EMOTIONS_INFANTIL_URL}/20.%20Enfado.png` }
  },
  {
    id: 3,
    emocion1: { id: 21, nombre: "Paciencia", imagen: `${EMOTIONS_INFANTIL_URL}/21.%20Paciencia.png` },
    emocion2: { id: 16, nombre: "Impaciencia", imagen: `${EMOTIONS_INFANTIL_URL}/16.%20Impaciencia.png` }
  },
  {
    id: 4,
    emocion1: { id: 12, nombre: "Tranquilidad", imagen: `${EMOTIONS_INFANTIL_URL}/12.%20Tranquilidad.png` },
    emocion2: { id: 16, nombre: "Nerviosismo", imagen: `${EMOTIONS_INFANTIL_URL}/16.%20Nerviosismo.png` }
  },
  {
    id: 5,
    emocion1: { id: 3, nombre: "Miedo", imagen: `${EMOTIONS_INFANTIL_URL}/3.%20Miedo.png` },
    emocion2: { id: 13, nombre: "Felicidad", imagen: `${EMOTIONS_INFANTIL_URL}/13.%20Felicidad.png` }
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
      <SciBasePopup
        open={showScientificBase}
        onOpenChange={setShowScientificBase}
        activityType={activityType}
        investigacionBeneficios={activityData?.investigacion_beneficios}
      />
    </div>
  );
};

export default Ses4Act1;

