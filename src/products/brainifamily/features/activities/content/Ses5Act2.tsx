import React, { useState } from 'react';
import { UserActivity } from '@/products/brainifamily/hooks/useUserActivities';
import { formatearTexto } from '@/products/brainifamily/features/activities/utils/TextFormatter';
import { Play, BookOpen, RotateCcw, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import SuccessPopup from '@/products/brainifamily/features/activities/utils/SuccessPopup';
import ActivityInstructions from '@/products/brainifamily/features/activities/utils/ActivityInstructions';
import SciBasePopup from '@/products/brainifamily/features/activities/utils/SciBasePopup';
import { 
  getPrimaryButtonClasses, 
  getSecondaryButtonClasses, 
  getInstructionsContainerClasses, 
  getMainTitleTextClasses,
  getDurationTextClasses,
  getBorderClasses,
  getProgressBarColor,
  getSimpleButtonClasses,
} from '@/products/brainifamily/features/activities/utils/ActivityColors';

interface Ses5Act2Props {
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

interface HadaStep {
  id: number;
  nombre: string;
  instruccion: string;
  emoji: string;
}

const PASOS_HADA: HadaStep[] = [
  {
    id: 1,
    nombre: 'Respira',
    instruccion: '**Inhala**, respira por la nariz, imaginando que entra la tranquilidad del mar.\n\n**Exhala** con la boca bien abierta, soltando las fuertes olas bravas y enfadadas.',
    emoji: '🌬️',
  },
  {
    id: 2,
    nombre: 'Varita mágica',
    instruccion: 'Con tu varita mágica toca la parte del cuerpo donde sientes el enfado y di:\n\n*"Aquí ruge mi enfado… y con mi varita voy a calmarlo."*',
    emoji: '⭐',
  },
  {
    id: 3,
    nombre: 'Volamos como el hada',
    instruccion: 'Mientras respiras, acaricia suavemente donde sientas el enfado y dile:\n\n*"Enfado, ya te puedes ir, quiero recibir a la tranquilidad."*',
    emoji: '🧚‍♀️',
  },
];

const REPETITIONS = 3; // Número de repeticiones del ciclo completo
const TOTAL_STEPS = PASOS_HADA.length;

/**
 * Actividad 2 - Sesión 5
 * El Hada Coralina: Actividad de respiración, mindfulness corporal y visualización guiada
 */
const Ses5Act2: React.FC<Ses5Act2Props> = ({ 
  userProgress, 
  activityId, 
  missionId, 
  userId,
  activityType = 'relajacion',
  activityData,
  onPuzzleComplete
}) => {
  // Estados principales
  const [phase, setPhase] = useState<'preparation' | 'steps' | 'waitingRepeat' | 'finalization' | 'completed'>('preparation');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [repetition, setRepetition] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  const currentStep = phase === 'steps' ? PASOS_HADA[currentStepIndex] : null;

  // Función para iniciar la actividad
  const startActivity = () => {
    setPhase('steps');
    setCurrentStepIndex(0);
    setRepetition(1);
  };

  // Función para avanzar al siguiente paso
  const handleNextStep = () => {
    if (currentStepIndex < TOTAL_STEPS - 1) {
      // Avanzar al siguiente paso dentro del mismo ciclo
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Todos los pasos del ciclo completados
      if (repetition < REPETITIONS) {
        // Mostrar pantalla de confirmación para repetir
        setPhase('waitingRepeat');
      } else {
        // Última repetición completada, ir a finalización
        setPhase('finalization');
      }
    }
  };

  // Función para repetir el ciclo
  const handleRepeat = () => {
    setRepetition((prev) => prev + 1);
    setCurrentStepIndex(0);
    setPhase('steps');
  };

  // Función para completar la finalización
  const handleFinalizationComplete = () => {
    setShowSuccessPopup(true);
  };

  // Función para reiniciar
  const handleReset = () => {
    setPhase('preparation');
    setCurrentStepIndex(0);
    setRepetition(1);
  };

  // Calcular progreso total
  const totalCycles = REPETITIONS;
  const progressPercentage = ((repetition - 1) / totalCycles) * 100 + ((currentStepIndex + 1) / TOTAL_STEPS / totalCycles) * 100;

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
            El Hada Coralina 🧚‍♀️
          </h2>
          <p className="text-gray-600 text-base">
            Aprende a calmar el enfado con respiración mágica
          </p>
        </div>

        {/* Indicador de progreso */}
        {(phase === 'steps' || phase === 'waitingRepeat') && (
          <div className="mb-6 p-4 bg-white/95 backdrop-blur-lg rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progreso</span>
              <span className={`text-sm font-semibold ${getMainTitleTextClasses(activityType)}`}>
                Repetición {repetition} de {REPETITIONS}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: getProgressBarColor(activityType)
                }}
              />
            </div>
            {phase === 'steps' && (
              <div className="mt-2 text-center">
                <span className="text-xs text-gray-600">
                  Paso {currentStepIndex + 1} de {TOTAL_STEPS}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Contenido según la fase */}
        {phase === 'preparation' && (
          <div className="space-y-6">
            <div className={getInstructionsContainerClasses(activityType)}>
              <h3 className={`text-xl font-bold ${getMainTitleTextClasses(activityType)} mb-4 text-center`}>
                Preparación
              </h3>
              <div className="space-y-4 text-left max-w-2xl mx-auto">
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>1º.</strong> Busca un lugar tranquilo donde puedas estar cómodo.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>2º.</strong> Imagina que tienes una varita mágica en tu mano.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>3º.</strong> Prepárate para respirar como el mar: tranquilo y profundo.
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button
                  onClick={startActivity}
                  className={getPrimaryButtonClasses(activityType)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Comenzar Actividad
                </Button>
              </div>
            </div>
          </div>
        )}

        {phase === 'steps' && currentStep && (
          <div className="space-y-6">
            {/* Paso actual */}
            <div className={getInstructionsContainerClasses(activityType)}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{currentStep.emoji}</div>
                <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-3`}>
                  {currentStep.nombre}
                </h3>
                <div className="text-lg text-gray-700 font-medium leading-relaxed max-w-2xl mx-auto">
                  {formatearTexto(currentStep.instruccion)}
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={handleNextStep}
                  className={getPrimaryButtonClasses(activityType)}
                >
                  {currentStepIndex < TOTAL_STEPS - 1 ? (
                    <>
                      Siguiente
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  ) : (
                    <>
                      Continuar
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {phase === 'waitingRepeat' && (
          <div className="space-y-6">
            <div className={`${getInstructionsContainerClasses(activityType)} text-center`}>
              <div className="text-5xl mb-4">✨</div>
              <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-3`}>
                ¡Ciclo completado!
              </h3>
              <p className="text-lg text-gray-700 font-medium mb-6">
                Has completado un ciclo de respiración del Hada Coralina
              </p>
              <p className="text-base text-gray-600 mb-6">
                Repeticiones completadas: {repetition} de {REPETITIONS}
              </p>
              
              <Button
                onClick={handleRepeat}
                className={getPrimaryButtonClasses(activityType)}
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Repetir ciclo
              </Button>
            </div>
          </div>
        )}

        {phase === 'finalization' && (
          <div className="space-y-6">
            <div className={getInstructionsContainerClasses(activityType)}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">❤️</div>
                <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-3`}>
                  Agradecimiento final
                </h3>
                <div className="bg-gradient-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border border-braini-turquoise/20 max-w-2xl mx-auto mb-6">
                  <p className="text-lg text-gray-700 font-medium leading-relaxed italic">
                    Pon la mano en el corazón y di:
                  </p>
                  <p className="text-xl text-gray-800 font-semibold leading-relaxed mt-4">
                    "Gracias, Hada Coralina, por enseñarme a respirar, alejar el enfado y recibir a la tranquilidad. Ahora mi mar en calma está."
                  </p>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={handleFinalizationComplete}
                  className={getPrimaryButtonClasses(activityType)}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Completar Actividad
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

export default Ses5Act2;

