import React, { useState, useEffect, useCallback } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import { Play, Pause, RotateCcw, BookOpen, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Ses2Act2Props {
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

interface PizzaStep {
  id: number;
  nombre: string;
  instrucciones: string;
  areas: string[];
  emoji: string;
}

const PIZZA_STEPS: PizzaStep[] = [
  {
    id: 1,
    nombre: 'Amasar',
    instrucciones: 'Masajear con las yemas de los dedos: espalda, hombros y brazos, palma de manos y dedos. Glúteos, piernas, tobillos y pies. Bajamos y luego subimos, varias veces.',
    areas: ['Espalda', 'Hombros', 'Brazos', 'Palmas de manos', 'Dedos', 'Glúteos', 'Piernas', 'Tobillos', 'Pies'],
    emoji: '👋',
  },
  {
    id: 2,
    nombre: 'Estirar la masa',
    instrucciones: 'Deslizar con las palmas y yemas de los dedos: espalda, hombros, brazos, palmas de las manos. Piernas, tobillos y pies. Bajamos y subimos, varias veces.',
    areas: ['Espalda', 'Hombros', 'Brazos', 'Palmas de manos', 'Piernas', 'Tobillos', 'Pies'],
    emoji: '🤲',
  },
  {
    id: 3,
    nombre: 'Ingredientes',
    instrucciones: 'Ponemos los ingredientes, presionando suavemente con los dedos, como pellizquitos. ¡Qué buena pinta!',
    areas: ['Todo el cuerpo'],
    emoji: '🍕',
  },
  {
    id: 4,
    nombre: 'Hornear',
    instrucciones: 'Y para terminar solo nos queda hornear... ¡Casi está lista nuestra pizza!',
    areas: ['Masaje suave general'],
    emoji: '🔥',
  },
  {
    id: 5,
    nombre: '¡Disfrutar!',
    instrucciones: '¡Ñam ñam! Bocado tras bocado, este masaje titulado "Pizza para cenar" se ha acabado. ¡Qué rico!',
    areas: ['¡Todo listo!'],
    emoji: '😋',
  },
];

const STEP_TRANSITION_TIME = 5; // 5 segundos entre pasos

/**
 * Actividad 2 - Sesión 2
 * Pizza para cenar: Actividad de masaje y relajación corporal
 */
const Ses2Act2: React.FC<Ses2Act2Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityData,
  onPuzzleComplete
}) => {
  // Estados principales
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(STEP_TRANSITION_TIME);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);
  const [currentCook, setCurrentCook] = useState<'parent' | 'child'>('parent');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const currentStep = PIZZA_STEPS[currentStepIndex];
  const totalSteps = PIZZA_STEPS.length;
  const isLastStep = currentStepIndex === totalSteps - 1;

  // Función para avanzar al siguiente paso
  const handleNextStep = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      setIsTransitioning(true);
      setIsRunning(false);
      setTimeRemaining(STEP_TRANSITION_TIME);
      
      // Esperar 5 segundos antes de avanzar
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
        setIsTransitioning(false);
        setIsRunning(true);
      }, STEP_TRANSITION_TIME * 1000);
    } else {
      // Actividad completada
      setIsRunning(false);
      setShowActivityDialog(false);
      setShowSuccessPopup(true);
    }
  }, [currentStepIndex, totalSteps]);

  // Efecto para el temporizador de transición
  useEffect(() => {
    if (!isTransitioning) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTransitioning]);

  // Función para iniciar la actividad
  const startActivity = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  // Función para pausar/reanudar
  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Función para reiniciar
  const resetActivity = () => {
    setCurrentStepIndex(0);
    setIsRunning(false);
    setIsPaused(false);
    setTimeRemaining(STEP_TRANSITION_TIME);
    setIsTransitioning(false);
  };

  // Función para cambiar de cocinero
  const toggleCook = () => {
    setCurrentCook((prev) => prev === 'parent' ? 'child' : 'parent');
  };

  // Función para abrir el dialog
  const openActivityDialog = () => {
    resetActivity();
    setShowActivityDialog(true);
  };

  // Componente de cronómetro circular para transición
  const TransitionTimer: React.FC<{ timeRemaining: number }> = ({ timeRemaining }) => {
    const percentage = (timeRemaining / STEP_TRANSITION_TIME) * 100;
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative w-32 h-32">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="64"
            cy="64"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="text-braini-turquoise transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-braini-turquoise">{timeRemaining}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Instrucciones con datos del backend */}
      {activityData && (
        <div className="bg-gradient-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border border-braini-turquoise/20">
          {/* Duración del backend */}
          {activityData.duracion_min && activityData.duracion_max && (
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong className="text-braini-turquoise-dark">Duración:</strong> {activityData.duracion_min} - {activityData.duracion_max} minutos
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
              onClick={openActivityDialog}
              className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Empezar Actividad
            </Button>
            {activityData.investigacion_beneficios && (
              <Button
                onClick={() => setShowScientificBase(true)}
                variant="outline"
                className="bg-white/80 hover:bg-white border-braini-turquoise/30 text-braini-turquoise hover:text-braini-turquoise-dark hover:border-braini-turquoise transition-all duration-300 px-6 py-3 text-lg"
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg p-0">
          <div className="p-6 md:p-8">
            {/* Pantalla de transición entre pasos */}
            {isTransitioning && (
              <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl border-0 text-center">
                <div className="mb-6">
                  <TransitionTimer timeRemaining={timeRemaining} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-braini-turquoise-dark mb-4">
                  Preparando siguiente paso...
                </h2>
                <p className="text-lg text-gray-700">
                  {currentStepIndex < totalSteps - 1 
                    ? `Siguiente: ${PIZZA_STEPS[currentStepIndex + 1].nombre}`
                    : '¡Casi terminamos!'
                  }
                </p>
              </div>
            )}

            {/* Contenido principal de la actividad */}
            {!isTransitioning && (
              <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">{currentStep.emoji}</div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-braini-turquoise-dark">
                        Pizza para cenar
                      </h2>
                      <p className="text-sm text-gray-600">
                        Paso {currentStepIndex + 1} de {totalSteps}
                      </p>
                    </div>
                  </div>
                  
                  {/* Toggle de cocinero */}
                  <Button
                    onClick={toggleCook}
                    variant="outline"
                    className="border-braini-turquoise/30 text-braini-turquoise hover:bg-braini-turquoise/10"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    {currentCook === 'parent' ? 'Cambiar a niño/a' : 'Cambiar a adulto'}
                  </Button>
                </div>

                {/* Indicador de quién cocina */}
                <div className="mb-6 p-4 bg-braini-turquoise/10 rounded-xl border border-braini-turquoise/20">
                  <p className="text-center text-lg font-semibold text-braini-turquoise-dark">
                    {currentCook === 'parent' ? '👨‍🍳 El adulto está cocinando' : '👶 El niño/a está cocinando'}
                  </p>
                </div>

                {/* Paso actual */}
                <div className="bg-gradient-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border-2 border-braini-turquoise/30 mb-6">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Emoji grande */}
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-8xl mb-4">{currentStep.emoji}</div>
                      <h3 className="text-3xl font-black text-braini-turquoise-dark mb-4">
                        {currentStep.nombre}
                      </h3>
                    </div>

                    {/* Instrucciones */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <h4 className="text-xl font-bold text-gray-800 mb-3">Instrucciones:</h4>
                        <p className="text-lg text-gray-700 leading-relaxed italic">
                          "{currentStep.instrucciones}"
                        </p>
                      </div>
                      
                      {/* Áreas del cuerpo */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Áreas a trabajar:</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentStep.areas.map((area, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-white rounded-full text-sm font-medium text-braini-turquoise-dark border border-braini-turquoise/30"
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Indicador de progreso de pasos */}
                <div className="flex justify-center gap-2 mb-6">
                  {PIZZA_STEPS.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                        index < currentStepIndex
                          ? 'bg-green-500'
                          : index === currentStepIndex
                          ? 'bg-braini-turquoise'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Controles */}
                <div className="flex flex-wrap justify-center gap-3">
                  {!isRunning ? (
                    <Button
                      onClick={startActivity}
                      className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-6 py-2 rounded-lg shadow-lg"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {currentStepIndex === 0 ? 'Empezar' : 'Continuar'}
                    </Button>
                  ) : (
                    <Button
                      onClick={togglePause}
                      variant="outline"
                      className="border-braini-turquoise text-braini-turquoise hover:bg-braini-turquoise/10"
                    >
                      {isPaused ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Reanudar
                        </>
                      ) : (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pausar
                        </>
                      )}
                    </Button>
                  )}
                  
                  {!isLastStep && !isTransitioning && (
                    <Button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-6 py-2 rounded-lg shadow-lg"
                      disabled={!isRunning && currentStepIndex === 0}
                    >
                      Siguiente Paso
                    </Button>
                  )}
                  
                  {isLastStep && !isTransitioning && (
                    <Button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg"
                      disabled={!isRunning && currentStepIndex === 0}
                    >
                      Completar Actividad
                    </Button>
                  )}
                  
                  <Button
                    onClick={resetActivity}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reiniciar
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
            if (onPuzzleComplete) {
              onPuzzleComplete();
            }
          }}
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
              className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ses2Act2;

