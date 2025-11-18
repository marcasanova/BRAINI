import React, { useState, useEffect, useCallback } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import { Play, BookOpen, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Ses4Act2Props {
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

interface RespirationStep {
  id: number;
  nombre: string;
  instruccion: string;
  duracion: number; // en segundos
  emoji: string;
}

const RESPIRATION_STEPS: RespirationStep[] = [
  {
    id: 1,
    nombre: 'Inhala',
    instruccion: 'Inhala, respira profundamente por la nariz durante 5 segundos, mientras se hincha la barriga.',
    duracion: 5,
    emoji: '🌬️',
  },
  {
    id: 2,
    nombre: 'Aguanta',
    instruccion: 'Aguanta el aire durante 3 segundos.',
    duracion: 3,
    emoji: '⏸️',
  },
  {
    id: 3,
    nombre: 'Exhala',
    instruccion: 'Exhala y saca el aire poco a poco mientras imitas el sonido de la serpiente que dure lo máximo posible "Zzzzzz".',
    duracion: 7,
    emoji: '🐍',
  },
];

const REPETITIONS = 5; // Número de repeticiones

/**
 * Actividad 2 - Sesión 4
 * La serpiente: Actividad de respiración guiada para autorregulación emocional
 */
const Ses4Act2: React.FC<Ses4Act2Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityData,
  onPuzzleComplete
}) => {
  // Estados principales
  const [phase, setPhase] = useState<'preparation' | 'breathing' | 'waitingRepeat' | 'completed'>('preparation');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [repetition, setRepetition] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  const currentStep = phase === 'breathing' ? RESPIRATION_STEPS[currentStepIndex] : null;
  const totalSteps = RESPIRATION_STEPS.length;

  // Función para iniciar la respiración
  const startBreathing = () => {
    setPhase('breathing');
    setCurrentStepIndex(0);
    setRepetition(1);
    const firstStep = RESPIRATION_STEPS[0];
    setTimeRemaining(firstStep.duracion);
    setIsRunning(true);
  };

  // Función para avanzar al siguiente paso automáticamente
  const handleStepComplete = useCallback(() => {
    if (phase === 'breathing') {
      if (currentStepIndex < totalSteps - 1) {
        // Avanzar al siguiente paso automáticamente
        const nextIndex = currentStepIndex + 1;
        setCurrentStepIndex(nextIndex);
        const nextStep = RESPIRATION_STEPS[nextIndex];
        setTimeRemaining(nextStep.duracion);
      } else {
        // Todos los pasos completados (inhala, aguanta, exhala)
        // Detener el temporizador y mostrar botón de repetir
        setIsRunning(false);
        setPhase('waitingRepeat');
      }
    }
  }, [phase, currentStepIndex, totalSteps]);

  // Función para repetir el ciclo
  const handleRepeat = () => {
    if (repetition < REPETITIONS) {
      // Nueva repetición
      setRepetition((prev) => prev + 1);
      setCurrentStepIndex(0);
      const firstStep = RESPIRATION_STEPS[0];
      setTimeRemaining(firstStep.duracion);
      setPhase('breathing');
      setIsRunning(true);
    } else {
      // Actividad completamente terminada
      setPhase('completed');
      setIsRunning(false);
      setShowActivityDialog(false);
      setShowSuccessPopup(true);
    }
  };

  // Función para completar actividad
  const handleComplete = () => {
    setShowActivityDialog(false);
    setShowSuccessPopup(true);
  };

  // Efecto para el temporizador automático
  useEffect(() => {
    if (!isRunning || phase !== 'breathing') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleStepComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, handleStepComplete]);

  // Función para reiniciar
  const handleReset = () => {
    setPhase('preparation');
    setCurrentStepIndex(0);
    setRepetition(1);
    setTimeRemaining(0);
    setIsRunning(false);
  };

  // Función para abrir dialog de actividad
  const openActivityDialog = () => {
    handleReset();
    setShowActivityDialog(true);
  };

  // Calcular porcentaje para el círculo
  const getProgressPercentage = () => {
    if (!currentStep || timeRemaining === 0) return 0;
    return ((currentStep.duracion - timeRemaining) / currentStep.duracion) * 100;
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg p-0">
          <div className="p-6 md:p-8">
            {/* Header */}
            <div className="mb-6 text-center">
              <h2 className="text-2xl md:text-3xl font-black text-braini-turquoise-dark mb-2">
                La serpiente 🐍
              </h2>
              <p className="text-gray-600">
                Aprende a respirar y calma tus emociones
              </p>
            </div>

            {/* Indicador de repetición */}
            {(phase === 'breathing' || phase === 'waitingRepeat') && (
              <div className="mb-6 p-4 bg-gradient-to-r from-braini-turquoise/10 to-braini-turquoise/5 rounded-xl border border-braini-turquoise/20 text-center">
                <p className="text-lg font-bold text-braini-turquoise-dark">
                  Repetición {repetition} de {REPETITIONS}
                </p>
              </div>
            )}

            {/* Contenido según la fase */}
            {phase === 'preparation' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border border-braini-turquoise/20">
                  <h3 className="text-2xl font-bold text-braini-turquoise-dark mb-4 text-center">
                    Preparación
                  </h3>
                  <div className="space-y-3 text-left max-w-2xl mx-auto">
                    <div className="bg-white/80 p-4 rounded-lg border border-braini-turquoise/20">
                      <p className="text-gray-700 font-medium leading-relaxed">
                        <strong className="text-braini-turquoise-dark">1º.</strong> Sentado con la espalda recta.
                      </p>
                    </div>
                    <div className="bg-white/80 p-4 rounded-lg border border-braini-turquoise/20">
                      <p className="text-gray-700 font-medium leading-relaxed">
                        <strong className="text-braini-turquoise-dark">2º.</strong> Manos en la barriga.
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <Button
                      onClick={startBreathing}
                      className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                    >
                      <Play className="w-5 h-5 mr-2" />
                      Comenzar Respiración
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {phase === 'breathing' && currentStep && (
              <div className="space-y-6">
                {/* Paso actual */}
                <div className="bg-gradient-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border border-braini-turquoise/20">
                  <div className="text-center mb-6">
                    <div className="text-5xl mb-4">{currentStep.emoji}</div>
                    <h3 className="text-2xl font-bold text-braini-turquoise-dark mb-3">
                      {currentStep.nombre}
                    </h3>
                    <p className="text-lg text-gray-700 font-medium leading-relaxed max-w-2xl mx-auto">
                      {currentStep.instruccion}
                    </p>
                  </div>

                  {/* Temporizador circular */}
                  <div className="flex justify-center mb-6">
                    <div className="relative w-48 h-48">
                      {/* Círculo de fondo */}
                      <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        {/* Círculo de progreso */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#35bdb1"
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 45}`}
                          strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgressPercentage() / 100)}`}
                          className="transition-all duration-1000 ease-linear"
                        />
                      </svg>
                      {/* Tiempo restante */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl font-black text-braini-turquoise-dark">
                            {timeRemaining}
                          </div>
                          <div className="text-sm text-gray-600 font-medium">
                            segundos
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {phase === 'waitingRepeat' && (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border border-braini-turquoise/20 text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-2xl font-bold text-braini-turquoise-dark mb-3">
                    ¡Repetición completada!
                  </h3>
                  <p className="text-lg text-gray-700 font-medium mb-6">
                    Has completado: Inhala → Aguanta → Exhala
                  </p>
                  
                  {repetition < REPETITIONS ? (
                    <Button
                      onClick={handleRepeat}
                      className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                    >
                      <RotateCcw className="w-5 h-5 mr-2" />
                      Repetir
                    </Button>
                  ) : (
                    <Button
                      onClick={handleComplete}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Completar Actividad
                    </Button>
                  )}
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

export default Ses4Act2;
