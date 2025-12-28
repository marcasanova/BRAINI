import React, { useState, useEffect, useCallback } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import { Footprints, Hand, Play, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import ActivityInstructions from '@/components/activities/utils/ActivityInstructions';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { 
  getPrimaryButtonClasses, 
  getSecondaryButtonClasses, 
  getInstructionsContainerClasses, 
  getDurationTextClasses,
  getMainTitleTextClasses,
  getSimpleButtonClasses,
  getOutlineButtonClasses,
  getTimerColorClasses,
  getBorderClasses,
  getScientificBaseTitleClasses,
  getScientificBaseIconClasses
} from '@/components/activities/utils/activityColors';

interface Ses1Act2Props {
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

type Phase = 'preparation' | 'legs' | 'legsDecision' | 'arms' | 'armsDecision' | 'completed';
type Step = 'giant' | 'ant' | 'alternate';

interface StepConfig {
  name: string;
  instruction: string;
  duration: number; // en segundos
}

const STEP_CONFIGS: Record<Step, StepConfig> = {
  giant: {
    name: 'Gigante',
    instruction: '¡Patadas fuertes contra el suelo! ¿Escuchas los golpes de los gigantes?',
    duration: 20,
  },
  ant: {
    name: 'Hormiga',
    instruction: 'Patadas suaves, lentas y delicadas como sus patitas… casi no se oyen.',
    duration: 20,
  },
  alternate: {
    name: 'Alternar',
    instruction: 'Caminamos como un gigante… ahora como una hormiga.',
    duration: 20,
  },
};

const ARMS_STEP_CONFIGS: Record<Step, StepConfig> = {
  giant: {
    name: 'Gigante',
    instruction: '¡Palmadas de gigante, fuertes!',
    duration: 20,
  },
  ant: {
    name: 'Hormiguita',
    instruction: 'Palmadas flojitas como de hormiguitas.',
    duration: 20,
  },
  alternate: {
    name: 'Alternar',
    instruction: 'Cambiar entre gigante y hormiguita varias veces.',
    duration: 20,
  },
};

/**
 * Actividad 2 - Sesión 1
 * Gigantes y hormigas: Actividad de relajación física interactiva
 */
const Ses1Act2: React.FC<Ses1Act2Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityType,
  activityData,
  onPuzzleComplete
}) => {
  // Estados principales
  const [phase, setPhase] = useState<Phase>('preparation');
  const [currentStep, setCurrentStep] = useState<Step>('giant');
  const [stepIndex, setStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  // Pasos de la fase actual
  const steps: Step[] = ['giant', 'ant', 'alternate'];
  const currentConfig = phase === 'legs' ? STEP_CONFIGS : ARMS_STEP_CONFIGS;
  const currentStepConfig = currentConfig[currentStep];

  // Función para resaltar palabras clave en el texto de instrucción
  const formatInstruction = (text: string): JSX.Element => {
    const keywords = ['gigante', 'hormiguita', 'hormiga', 'fuerte', 'fuertes', 'flojas', 'flojitas', 'suaves', 'lentas', 'delicadas'];
    
    // Crear una expresión regular que coincida con las palabras clave (case-insensitive)
    const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    const parts: Array<{ text: string; isKeyword: boolean }> = [];
    let lastIndex = 0;
    let match;
    
    while ((match = regex.exec(text)) !== null) {
      // Agregar texto antes de la coincidencia
      if (match.index > lastIndex) {
        parts.push({ text: text.substring(lastIndex, match.index), isKeyword: false });
      }
      // Agregar la palabra clave encontrada
      parts.push({ text: match[0], isKeyword: true });
      lastIndex = match.index + match[0].length;
    }
    
    // Agregar el texto restante
    if (lastIndex < text.length) {
      parts.push({ text: text.substring(lastIndex), isKeyword: false });
    }
    
    return (
      <>
        {parts.map((part, index) => {
          if (part.isKeyword) {
            return <strong key={index} className="font-bold">{part.text}</strong>;
          }
          return <span key={index}>{part.text}</span>;
        })}
      </>
    );
  };

  // Función para completar paso
  const handleStepComplete = useCallback(() => {
    if (stepIndex < steps.length - 1) {
      // Avanzar al siguiente paso
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      setCurrentStep(steps[nextIndex]);
      const config = phase === 'legs' ? STEP_CONFIGS : ARMS_STEP_CONFIGS;
      setTimeRemaining(config[steps[nextIndex]].duration);
    } else {
      // Todos los pasos completados, mostrar pantalla de decisión
      setIsRunning(false);
      if (phase === 'legs') {
        setPhase('legsDecision');
      } else if (phase === 'arms') {
        setPhase('armsDecision');
      }
    }
  }, [stepIndex, steps, phase]);

  // Efecto para el temporizador principal
  useEffect(() => {
    if (!isRunning || phase === 'completed' || phase === 'legsDecision' || phase === 'armsDecision') return;

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
  }, [isRunning, phase, handleStepComplete]);



  // Iniciar actividad desde preparación
  const startActivity = () => {
    setPhase('legs');
    setStepIndex(0);
    setCurrentStep('giant');
    setTimeRemaining(STEP_CONFIGS.giant.duration);
    setIsRunning(true);
  };

  // Repetir secuencia de piernas
  const repeatLegs = () => {
    setPhase('legs');
    setStepIndex(0);
    setCurrentStep('giant');
    setTimeRemaining(STEP_CONFIGS.giant.duration);
    setIsRunning(true);
  };

  // Ir a fase de brazos
  const goToArms = () => {
    setPhase('arms');
    setStepIndex(0);
    setCurrentStep('giant');
    setTimeRemaining(ARMS_STEP_CONFIGS.giant.duration);
    setIsRunning(true);
  };

  // Repetir secuencia de brazos
  const repeatArms = () => {
    setPhase('arms');
    setStepIndex(0);
    setCurrentStep('giant');
    setTimeRemaining(ARMS_STEP_CONFIGS.giant.duration);
    setIsRunning(true);
  };

  // Volver a piernas desde brazos
  const goBackToLegs = () => {
    setPhase('legs');
    setStepIndex(0);
    setCurrentStep('giant');
    setTimeRemaining(STEP_CONFIGS.giant.duration);
    setIsRunning(true);
  };

  // Finalizar actividad
  const finishActivity = () => {
    setPhase('completed');
    setShowSuccessPopup(true);
  };

  // Componente de visualización del paso actual
  const StepDisplay: React.FC<{ step: Step }> = ({ step }) => {
    const config = phase === 'legs' ? STEP_CONFIGS[step] : ARMS_STEP_CONFIGS[step];
    
    if (step === 'alternate') {
      return (
        <div className="flex flex-col items-center justify-center">
          <p className="text-3xl font-black text-gray-700 mb-2">
            {config.name}
          </p>
          <p className="text-lg text-gray-600 text-center">
            Alternar cada 2 segundos.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-3xl font-black text-gray-700 mb-2">
          {config.name}
        </p>
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
            className={`${getTimerColorClasses(activityType)} transition-all duration-1000`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-3xl font-bold ${getTimerColorClasses(activityType)}`}>{timeRemaining}</span>
        </div>
      </div>
    );
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

      {/* Card contenedora única con tamaño fijo (basado en legs/arms) */}
      <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
        {/* Área principal de la actividad */}
        {phase === 'preparation' && (
          <div className="text-center min-h-[350px] flex flex-col items-center justify-center">
            <div>
              <h2 className={`text-3xl font-black ${getMainTitleTextClasses(activityType)} mb-4`}>
                ¡Prepárate!
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Vamos a relajar nuestras piernas y nuestros pies.
                <br />
                <strong>¡Ponte de pie y prepárate para jugar!</strong>
              </p>
              <Button
                onClick={startActivity}
                className={getPrimaryButtonClasses(activityType)}
              >
                <Play className="w-5 h-5 mr-2" />
                Empezar Actividad
              </Button>
            </div>
          </div>
        )}

        {/* Fase de piernas */}
        {phase === 'legs' && (
          <div className="min-h-[350px] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <Footprints className="w-8 h-8 text-braini-turquoise-dark" />
              <h2 className="text-2xl md:text-3xl font-black text-braini-turquoise-dark">
                Ejercicio: Piernas y Pies
              </h2>
            </div>

            {/* Paso actual */}
            <div className="bg-gradient-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border-2 border-braini-turquoise/30 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Cronómetro a la izquierda */}
                <div className="flex items-center justify-center">
                  <CircularTimer timeRemaining={timeRemaining} totalTime={currentStepConfig.duration} />
                </div>

                {/* Instrucción a la derecha */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-4">
                    <span className="bg-braini-turquoise text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg inline-flex mr-3">
                      {stepIndex + 1}
                    </span>
                    <span className="text-2xl font-bold text-braini-turquoise-dark">
                      {currentStepConfig.name}
                    </span>
                  </div>
                  <p className="text-xl text-gray-700 leading-relaxed italic">
                    "{formatInstruction(currentStepConfig.instruction)}"
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
                      ? 'bg-braini-turquoise'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pantalla de decisión después de piernas */}
        {phase === 'legsDecision' && (
          <div className="text-center min-h-[350px] flex flex-col items-center justify-center">
            <div className="w-full">
              <h2 className="text-3xl font-black text-braini-turquoise-dark mb-4">
                ¡Secuencia de Piernas Completada!
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                ¿Qué quieres hacer ahora?
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                <Button
                  onClick={repeatLegs}
                  className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                >
                  <Footprints className="w-5 h-5 mr-2" />
                  Repetir Piernas
                </Button>
                <Button
                  onClick={goToArms}
                  className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                >
                  <Hand className="w-5 h-5 mr-2" />
                  Pasar a Brazos
                </Button>
                <Button
                  onClick={finishActivity}
                  className={getPrimaryButtonClasses(activityType)}
                >
                  Terminar Juego
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Fase de brazos */}
        {phase === 'arms' && (
          <div className="min-h-[350px] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
              <Hand className="w-8 h-8 text-braini-turquoise-dark" />
              <h2 className="text-2xl md:text-3xl font-black text-braini-turquoise-dark">
                Variante: Brazos y Manos
              </h2>
            </div>

            {/* Paso actual */}
            <div className="bg-gradient-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border-2 border-braini-turquoise/30 mb-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Cronómetro a la izquierda */}
                <div className="flex items-center justify-center">
                  <CircularTimer timeRemaining={timeRemaining} totalTime={currentStepConfig.duration} />
                </div>

                {/* Instrucción a la derecha */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-4">
                    <span className="bg-braini-turquoise text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg inline-flex mr-3">
                      {stepIndex + 1}
                    </span>
                    <span className="text-2xl font-bold text-braini-turquoise-dark">
                      {currentStepConfig.name}
                    </span>
                  </div>
                  <p className="text-xl text-gray-700 leading-relaxed italic">
                    "{formatInstruction(currentStepConfig.instruction)}"
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
                      ? 'bg-braini-turquoise'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pantalla de decisión después de brazos */}
        {phase === 'armsDecision' && (
          <div className="text-center min-h-[350px] flex flex-col items-center justify-center">
            <div className="w-full">
              <h2 className="text-3xl font-black text-braini-turquoise-dark mb-4">
                ¡Secuencia de Brazos Completada!
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                ¿Qué quieres hacer ahora?
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                <Button
                  onClick={repeatArms}
                  className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                >
                  <Hand className="w-5 h-5 mr-2" />
                  Repetir Brazos
                </Button>
                <Button
                  onClick={goBackToLegs}
                  className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                >
                  <Footprints className="w-5 h-5 mr-2" />
                  Pasar a Piernas
                </Button>
                <Button
                  onClick={finishActivity}
                  className={getPrimaryButtonClasses(activityType)}
                >
                  Terminar Juego
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => {
            setShowSuccessPopup(false);
            // No navegar inmediatamente, dejar que el usuario valore la actividad
            // La navegación se manejará desde ActivityRating cuando se complete la valoración
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

export default Ses1Act2;
