import React, { useState, useEffect, useCallback } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import { Footprints, Hand, Play, Pause, RotateCcw, ChevronRight, BookOpen, Timer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Ses1Act2Props {
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

type Phase = 'preparation' | 'legs' | 'arms' | 'completed';
type Step = 'giant' | 'ant' | 'alternate';

interface StepConfig {
  name: string;
  instruction: string;
  duration: number; // en segundos
  emoji: string;
}

const STEP_CONFIGS: Record<Step, StepConfig> = {
  giant: {
    name: 'Gigante',
    instruction: '¡Patadas fuertes contra el suelo! ¿Escuchas los golpes de los gigantes?',
    duration: 20,
    emoji: '👹',
  },
  ant: {
    name: 'Hormiga',
    instruction: 'Patadas suaves, lentas y delicadas como sus patitas… casi no se oyen.',
    duration: 20,
    emoji: '🐜',
  },
  alternate: {
    name: 'Alternar',
    instruction: 'Caminamos como un gigante… ahora como una hormiga.',
    duration: 40,
    emoji: '🔄',
  },
};

const ARMS_STEP_CONFIGS: Record<Step, StepConfig> = {
  giant: {
    name: 'Gigante',
    instruction: '¡Palmadas de gigante, fuertes!',
    duration: 20,
    emoji: '👹',
  },
  ant: {
    name: 'Hormiguita',
    instruction: 'Palmadas flojitas como de hormiguitas.',
    duration: 20,
    emoji: '🐜',
  },
  alternate: {
    name: 'Alternar',
    instruction: 'Cambiar entre gigante y hormiguita varias veces.',
    duration: 40,
    emoji: '🔄',
  },
};

const REPETITIONS = 2; // Número de repeticiones por fase

/**
 * Actividad 2 - Sesión 1
 * Gigantes y hormigas: Actividad de relajación física interactiva
 */
const Ses1Act2: React.FC<Ses1Act2Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityData,
  onPuzzleComplete
}) => {
  // Estados principales
  const [phase, setPhase] = useState<Phase>('preparation');
  const [currentStep, setCurrentStep] = useState<Step>('giant');
  const [stepIndex, setStepIndex] = useState(0);
  const [repetition, setRepetition] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(10); // Preparación: 10 segundos
  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);
  const [alternateMode, setAlternateMode] = useState<'giant' | 'ant'>('giant');
  const [alternateCount, setAlternateCount] = useState(0);

  // Pasos de la fase actual
  const steps: Step[] = ['giant', 'ant', 'alternate'];
  const currentConfig = phase === 'legs' ? STEP_CONFIGS : ARMS_STEP_CONFIGS;
  const currentStepConfig = currentConfig[currentStep];

  // Función para completar paso
  const handleStepComplete = useCallback(() => {
    if (stepIndex < steps.length - 1) {
      // Avanzar al siguiente paso
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      setCurrentStep(steps[nextIndex]);
      const config = phase === 'legs' ? STEP_CONFIGS : ARMS_STEP_CONFIGS;
      setTimeRemaining(config[steps[nextIndex]].duration);
      setAlternateMode('giant');
      setAlternateCount(0);
    } else {
      // Todos los pasos completados, verificar repeticiones
      if (repetition < REPETITIONS) {
        // Nueva repetición
        setRepetition((prev) => prev + 1);
        setStepIndex(0);
        setCurrentStep(steps[0]);
        const config = phase === 'legs' ? STEP_CONFIGS : ARMS_STEP_CONFIGS;
        setTimeRemaining(config[steps[0]].duration);
        setAlternateMode('giant');
        setAlternateCount(0);
      } else {
        // Fase completada
        if (phase === 'legs') {
          // Completar fase de piernas, preguntar si quiere hacer brazos
          setIsRunning(false);
          setPhase('arms');
        } else if (phase === 'arms') {
          // Actividad completamente terminada
          setPhase('completed');
          setIsRunning(false);
          setShowActivityDialog(false);
          setShowSuccessPopup(true);
        }
      }
    }
  }, [stepIndex, steps, repetition, phase]);

  // Efecto para el temporizador
  useEffect(() => {
    if (!isRunning || isPaused || phase === 'completed') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Tiempo terminado, avanzar al siguiente paso
          handleStepComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isPaused, phase, handleStepComplete]);

  // Efecto para alternar en modo alternate
  useEffect(() => {
    if (currentStep !== 'alternate' || !isRunning || isPaused) return;

    const alternateInterval = setInterval(() => {
      setAlternateMode((prev) => (prev === 'giant' ? 'ant' : 'giant'));
      setAlternateCount((prev) => prev + 1);
    }, 7000); // Cambiar cada 7 segundos

    return () => clearInterval(alternateInterval);
  }, [currentStep, isRunning, isPaused]);


  const openActivityDialog = () => {
    // Resetear todo al abrir el dialog
    setPhase('preparation');
    setStepIndex(0);
    setCurrentStep('giant');
    setTimeRemaining(10);
    setRepetition(1);
    setIsRunning(false);
    setIsPaused(false);
    setAlternateMode('giant');
    setAlternateCount(0);
    setShowActivityDialog(true);
  };

  const startActivity = () => {
    if (phase === 'preparation') {
      setPhase('legs');
      setStepIndex(0);
      setCurrentStep('giant');
      setTimeRemaining(STEP_CONFIGS.giant.duration);
      setRepetition(1);
    } else if (phase === 'legs' && !isRunning) {
      // Continuar desde donde quedó
      setTimeRemaining(currentStepConfig.duration);
    } else if (phase === 'arms' && !isRunning) {
      // Empezar fase de brazos
      setStepIndex(0);
      setCurrentStep('giant');
      setTimeRemaining(ARMS_STEP_CONFIGS.giant.duration);
      setRepetition(1);
    }
    setIsRunning(true);
    setIsPaused(false);
  };

  const startArmsPhase = () => {
    setPhase('arms');
    setStepIndex(0);
    setCurrentStep('giant');
    setTimeRemaining(ARMS_STEP_CONFIGS.giant.duration);
    setRepetition(1);
    setIsRunning(true);
    setIsPaused(false);
  };

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  const resetActivity = () => {
    if (phase === 'legs') {
      setStepIndex(0);
      setCurrentStep('giant');
      setTimeRemaining(STEP_CONFIGS.giant.duration);
      setRepetition(1);
    } else if (phase === 'arms') {
      setStepIndex(0);
      setCurrentStep('giant');
      setTimeRemaining(ARMS_STEP_CONFIGS.giant.duration);
      setRepetition(1);
    }
    setIsRunning(false);
    setIsPaused(false);
    setAlternateMode('giant');
    setAlternateCount(0);
  };

  const skipToArms = () => {
    setPhase('arms');
    setStepIndex(0);
    setCurrentStep('giant');
    setTimeRemaining(ARMS_STEP_CONFIGS.giant.duration);
    setRepetition(1);
    setIsRunning(false);
    setIsPaused(false);
  };

  // Componente de animación visual
  const StepAnimation: React.FC<{ step: Step; alternateMode?: 'giant' | 'ant' }> = ({ step, alternateMode }) => {
    if (step === 'alternate' && alternateMode) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className={`text-8xl mb-4 transition-all duration-500 ${alternateMode === 'giant' ? 'scale-150 animate-bounce' : 'scale-75'}`}>
            {alternateMode === 'giant' ? '👹' : '🐜'}
          </div>
          <p className="text-xl font-bold text-gray-700">
            {alternateMode === 'giant' ? '¡GIGANTE!' : '¡HORMIGA!'}
          </p>
        </div>
      );
    }

    const config = phase === 'legs' ? STEP_CONFIGS[step] : ARMS_STEP_CONFIGS[step];
    return (
      <div className="flex flex-col items-center justify-center">
        <div className={`text-8xl mb-4 ${step === 'giant' ? 'animate-bounce scale-150' : 'scale-75'}`}>
          {config.emoji}
        </div>
        <p className="text-xl font-bold text-gray-700">{config.name}</p>
      </div>
    );
  };

  // Componente de cronómetro circular
  const CircularTimer: React.FC<{ timeRemaining: number; totalTime: number }> = ({ timeRemaining, totalTime }) => {
    const percentage = (timeRemaining / totalTime) * 100;
    const circumference = 2 * Math.PI * 45; // radio de 45
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
            className="text-braini-blue transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-braini-blue">{timeRemaining}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Instrucciones con datos del backend */}
      {activityData && (
        <div className="bg-gradient-to-r from-braini-blue/10 to-braini-turquoise/10 p-6 rounded-xl border border-braini-blue/20">
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
              onClick={openActivityDialog}
              className="bg-gradient-to-r from-braini-blue to-braini-turquoise hover:from-braini-blue-dark hover:to-braini-turquoise-dark text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
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
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg p-0">
          <div className="p-6 md:p-8">
            {/* Área principal de la actividad */}
            {phase === 'preparation' && (
              <div className="text-center">
                <div className="text-6xl mb-6">🚶</div>
                <h2 className="text-3xl font-black text-braini-blue-dark mb-4">
                  ¡Prepárate!
                </h2>
                <p className="text-xl text-gray-700 mb-8">
                  Vamos a relajar nuestras piernas y nuestros pies.
                  <br />
                  <strong>¡Ponte de pie y prepárate para jugar!</strong>
                </p>
                <Button
                  onClick={startActivity}
                  className="bg-gradient-to-r from-braini-blue to-braini-turquoise hover:from-braini-blue-dark hover:to-braini-turquoise-dark text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Empezar
                </Button>
              </div>
            )}

            {/* Fase de piernas */}
            {phase === 'legs' && (
        <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Footprints className="w-8 h-8 text-braini-yellow-dark" />
            <h2 className="text-2xl md:text-3xl font-black text-braini-yellow-dark">
              Ejercicio: Piernas y Pies
            </h2>
          </div>

          {/* Indicador de repetición */}
          <div className="mb-6 text-center">
            <span className="bg-braini-yellow/20 text-braini-yellow-dark px-4 py-2 rounded-full text-sm font-semibold">
              Repetición {repetition} de {REPETITIONS}
            </span>
          </div>

          {/* Paso actual */}
          <div className="bg-gradient-to-r from-braini-yellow/10 to-braini-yellow/5 p-6 rounded-xl border-2 border-braini-yellow/30 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Animación y cronómetro */}
              <div className="flex-1 flex flex-col items-center">
                <StepAnimation step={currentStep} alternateMode={currentStep === 'alternate' ? alternateMode : undefined} />
                <div className="mt-6">
                  <CircularTimer timeRemaining={timeRemaining} totalTime={currentStepConfig.duration} />
                </div>
              </div>

              {/* Instrucción */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4">
                  <span className="bg-braini-yellow text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg inline-flex mr-3">
                    {stepIndex + 1}
                  </span>
                  <span className="text-2xl font-bold text-braini-yellow-dark">
                    {currentStepConfig.name}
                  </span>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed italic">
                  "{currentStepConfig.instruction}"
                </p>
              </div>
            </div>
          </div>

          {/* Indicador de progreso de pasos */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  index < stepIndex
                    ? 'bg-green-500'
                    : index === stepIndex
                    ? 'bg-braini-yellow'
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
                className="bg-gradient-to-r from-braini-blue to-braini-turquoise hover:from-braini-blue-dark hover:to-braini-turquoise-dark text-white font-semibold px-6 py-2 rounded-lg shadow-lg"
              >
                <Play className="w-4 h-4 mr-2" />
                {stepIndex === 0 && repetition === 1 ? 'Empezar' : 'Continuar'}
              </Button>
            ) : (
              <Button
                onClick={togglePause}
                variant="outline"
                className="border-braini-blue text-braini-blue hover:bg-braini-blue/10"
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
            <Button
              onClick={resetActivity}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reiniciar
            </Button>
            <Button
              onClick={skipToArms}
              variant="outline"
              className="border-braini-pink text-braini-pink hover:bg-braini-pink/10"
            >
              Saltar a Brazos
            </Button>
          </div>
        </div>
      )}

            {/* Transición entre fases */}
            {phase === 'arms' && !isRunning && stepIndex === 0 && repetition === 1 && (
              <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl border-0 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-black text-braini-pink-dark mb-4">
            ¡Fase de Piernas Completada!
          </h2>
          <p className="text-xl text-gray-700 mb-8">
            ¿Quieres hacer la variante con brazos y manos?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={startArmsPhase}
              className="bg-gradient-to-r from-braini-pink to-braini-pink-dark hover:from-braini-pink-dark hover:to-braini-pink text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
            >
              <Hand className="w-5 h-5 mr-2" />
              Hacer Variante de Brazos
            </Button>
            <Button
              onClick={() => {
                setPhase('completed');
                setShowActivityDialog(false);
                setShowSuccessPopup(true);
              }}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100 px-8 py-3 text-lg"
            >
              Finalizar Actividad
            </Button>
          </div>
        </div>
      )}

      {/* Fase de brazos */}
      {phase === 'arms' && isRunning && (
        <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Hand className="w-8 h-8 text-braini-pink-dark" />
            <h2 className="text-2xl md:text-3xl font-black text-braini-pink-dark">
              Variante: Brazos y Manos
            </h2>
          </div>

          {/* Indicador de repetición */}
          <div className="mb-6 text-center">
            <span className="bg-braini-pink/20 text-braini-pink-dark px-4 py-2 rounded-full text-sm font-semibold">
              Repetición {repetition} de {REPETITIONS}
            </span>
          </div>

          {/* Paso actual */}
          <div className="bg-gradient-to-r from-braini-pink/10 to-braini-pink/5 p-6 rounded-xl border-2 border-braini-pink/30 mb-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* Animación y cronómetro */}
              <div className="flex-1 flex flex-col items-center">
                <StepAnimation step={currentStep} alternateMode={currentStep === 'alternate' ? alternateMode : undefined} />
                <div className="mt-6">
                  <CircularTimer timeRemaining={timeRemaining} totalTime={currentStepConfig.duration} />
                </div>
              </div>

              {/* Instrucción */}
              <div className="flex-1 text-center md:text-left">
                <div className="mb-4">
                  <span className="bg-braini-pink text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg inline-flex mr-3">
                    {stepIndex + 1}
                  </span>
                  <span className="text-2xl font-bold text-braini-pink-dark">
                    {currentStepConfig.name}
                  </span>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed italic">
                  "{currentStepConfig.instruction}"
                </p>
              </div>
            </div>
          </div>

          {/* Indicador de progreso de pasos */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((step, index) => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  index < stepIndex
                    ? 'bg-green-500'
                    : index === stepIndex
                    ? 'bg-braini-pink'
                    : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Controles */}
          <div className="flex flex-wrap justify-center gap-3">
            {isRunning && (
              <Button
                onClick={togglePause}
                variant="outline"
                className="border-braini-pink text-braini-pink hover:bg-braini-pink/10"
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
              className="bg-gradient-to-r from-braini-blue to-braini-turquoise hover:from-braini-blue-dark hover:to-braini-turquoise-dark text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ses1Act2;
