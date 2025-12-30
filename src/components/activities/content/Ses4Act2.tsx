import React, { useState, useEffect, useCallback } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { formatearTexto } from '@/components/activities/utils/TextFormatter';
import { Play, BookOpen, RotateCcw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import ActivityInstructions from '@/components/activities/utils/ActivityInstructions';
import SciBasePopup from '@/components/activities/utils/SciBasePopup';
import { 
  getPrimaryButtonClasses, 
  getSecondaryButtonClasses, 
  getInstructionsContainerClasses, 
  getMainTitleTextClasses,
  getDurationTextClasses,
  getBorderClasses,
  getProgressBarColor,
  getSimpleButtonClasses,
  getScientificBaseIconClasses
} from '@/components/activities/utils/ActivityColors';

interface Ses4Act2Props {
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
  activityType = 'relajacion',
  activityData,
  onPuzzleComplete
}) => {
  // Estados principales
  const [phase, setPhase] = useState<'preparation' | 'breathing' | 'waitingRepeat' | 'completed'>('preparation');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [repetition, setRepetition] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
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
    }
  };

  // Función para completar actividad
  const handleComplete = () => {
    setIsRunning(false);
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

  // Calcular porcentaje para el círculo
  const getProgressPercentage = () => {
    if (!currentStep || timeRemaining === 0) return 0;
    return ((currentStep.duracion - timeRemaining) / currentStep.duracion) * 100;
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

      {/* Card principal de la actividad */}
      <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
        {/* Header */}
        <div className="mb-6 text-center border-b-2 border-gray-200 pb-4">
          <h2 className={`text-2xl md:text-3xl font-bold ${getMainTitleTextClasses(activityType)} mb-2`}>
            La serpiente 🐍
          </h2>
          <p className="text-gray-600 text-base">
            Aprende a respirar y calma tus emociones
          </p>
        </div>

        {/* Indicador de repetición */}
        {(phase === 'breathing' || phase === 'waitingRepeat') && (
          <div className="mb-6 p-4 bg-white/95 backdrop-blur-lg rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Progreso</span>
              <span className={`text-sm font-semibold ${getMainTitleTextClasses(activityType)}`}>
                Repetición {repetition} de {REPETITIONS}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(repetition / REPETITIONS) * 100}%`,
                  backgroundColor: getProgressBarColor(activityType)
                }}
              />
            </div>
          </div>
        )}

        {/* Contenido según la fase */}
        {phase === 'preparation' && (
          <div className="space-y-6">
            <div className={getInstructionsContainerClasses(activityType)}>
              <h3 className={`text-xl font-bold ${getMainTitleTextClasses(activityType)} mb-4 text-center`}>
                Preparación
              </h3>
              <div className="space-y-3 text-left max-w-2xl mx-auto">
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>1º.</strong> Sentado con la espalda recta.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>2º.</strong> Manos en la barriga.
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button
                  onClick={startBreathing}
                  className={getPrimaryButtonClasses(activityType)}
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
            <div className={getInstructionsContainerClasses(activityType)}>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">{currentStep.emoji}</div>
                <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-3`}>
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
                      stroke={getProgressBarColor(activityType)}
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
                      <div className={`text-5xl font-black ${getMainTitleTextClasses(activityType)}`}>
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
            <div className={`${getInstructionsContainerClasses(activityType)} text-center`}>
              <div className="text-5xl mb-4">✅</div>
              <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-3`}>
                ¡Repetición completada!
              </h3>
              <p className="text-lg text-gray-700 font-medium mb-6">
                Has completado: Inhala → Aguanta → Exhala
              </p>
              
              {repetition < REPETITIONS ? (
                <Button
                  onClick={handleRepeat}
                  className={getPrimaryButtonClasses(activityType)}
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Repetir
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className={getPrimaryButtonClasses(activityType)}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Completar Actividad
                </Button>
              )}
            </div>
          </div>
        )}

      </div>

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
      <SciBasePopup
        open={showScientificBase}
        onOpenChange={setShowScientificBase}
        activityType={activityType}
        investigacionBeneficios={activityData?.investigacion_beneficios}
      />
    </div>
  );
};

export default Ses4Act2;
