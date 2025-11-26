import React, { useState, useEffect } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { BookOpen, Play, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Ses4Act1Props {
  userProgress?: UserActivity;
  activityId: number;
  levelId: string;
  userId: string;
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
  activityData,
  onPuzzleComplete
}) => {
  const { toast } = useToast();
  
  // Estados del juego
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);
  const [paresOrdenados, setParesOrdenados] = useState<ParEmociones[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [completedPairs, setCompletedPairs] = useState<number[]>([]);

  // Randomizar pares cuando se abre el Dialog
  useEffect(() => {
    if (showActivityDialog) {
      const shuffled = [...PARES_ORIGINALES].sort(() => Math.random() - 0.5);
      setParesOrdenados(shuffled);
      setCurrentPairIndex(0);
      setCompletedPairs([]);
    }
  }, [showActivityDialog]);

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
        setShowActivityDialog(false);
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

  return (
    <div className="space-y-6">
      {/* Instrucciones con datos del backend */}
      {activityData && (
        <div className="bg-gradient-to-r from-braini-blue/10 to-braini-blue/5 p-6 rounded-xl border border-braini-blue/20">
          {/* Duración del backend */}
          {activityData.duracion_min && activityData.duracion_max && (
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong className="text-braini-blue-dark">Duración:</strong> {activityData.duracion_min} - {activityData.duracion_max} minutos
            </p>
          )}
          {/* ¿Cómo se juega? del backend - Con formateo */}
          {activityData.como_se_juega && (
            <div className="text-gray-700 leading-relaxed mb-4">
              {formatearTexto(activityData.como_se_juega)}
            </div>
          )}
          {/* Botones de acción */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              onClick={() => setShowActivityDialog(true)}
              className="bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Empezar Actividad
            </Button>
            {activityData.investigacion_beneficios && (
              <Button
                onClick={() => setShowScientificBase(true)}
                variant="outline"
                className="bg-white/80 hover:bg-white border-braini-blue/30 text-braini-blue hover:text-braini-blue-dark hover:border-braini-blue transition-all duration-300 px-6 py-3 text-lg"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Ver Base Científica
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Dialog de la actividad interactiva */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg p-0">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-black text-braini-blue-dark mb-2">
                Que viene que viene…
              </h2>
            </div>

            {/* Indicador de progreso */}
            <div className="mb-6 p-4 bg-gradient-to-r from-braini-blue/10 to-braini-blue/5 rounded-xl border border-braini-blue/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Progreso</span>
                <span className="text-sm font-bold text-braini-blue">
                  Par {currentPairIndex + 1} de {totalPairs}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-gradient-to-r from-braini-blue to-braini-blue-light h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${((currentPairIndex + 1) / totalPairs) * 100}%` }}
                />
              </div>
            </div>

            {/* Contenido del par actual */}
            {currentPair && (
              <div className="space-y-6">
                {/* Instrucción principal */}
                <div className="bg-gradient-to-r from-braini-blue/10 to-braini-blue/5 p-4 rounded-xl border border-braini-blue/20 text-center">
                  <p className="text-lg font-semibold text-braini-blue-dark">
                    Conviértete en cada emoción, pero atención, que vienen de dos en dos.
                  </p>
                  <p className="text-base text-gray-700 mt-2">
                    Expresa con tu cara, cuerpo y voz, para ser el mejor.
                  </p>
                </div>

                {/* Grid de las dos emociones del par */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Emoción 1 */}
                  <div className="bg-white border-2 border-braini-blue/30 rounded-xl p-4 shadow-md">
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
                      <h3 className="text-xl font-black text-braini-blue-dark mb-2">
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
                  <div className="bg-white border-2 border-braini-blue/30 rounded-xl p-4 shadow-md">
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
                      <h3 className="text-xl font-black text-braini-blue-dark mb-2">
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
                  <Button
                    onClick={handlePreviousPair}
                    disabled={currentPairIndex === 0}
                    variant="outline"
                    className="flex items-center gap-2"
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
                    className="bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  >
                    {currentPairIndex < totalPairs - 1 ? (
                      <>
                        Siguiente
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Completar Actividad
                        <CheckCircle className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => {
            setShowSuccessPopup(false);
            // Al cerrar el popup, nos quedamos en la misma página para poder valorar la actividad
          }}
          activityType={activityType}
        />
      )}

      {/* Dialog de Base Científica */}
      <Dialog open={showScientificBase} onOpenChange={setShowScientificBase}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-indigo-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Base Científica
            </DialogTitle>
            <DialogDescription className="text-gray-600">
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
              className="bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
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

