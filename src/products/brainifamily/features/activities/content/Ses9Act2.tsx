import React, { useState } from 'react';
import { UserActivity } from '@/products/brainifamily/hooks/useUserActivities';
import { formatearTexto } from '@/products/brainifamily/features/activities/utils/TextFormatter';
import { Play, BookOpen, CheckCircle, ArrowRight } from 'lucide-react';
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
  getProgressBarColor,
  getSimpleButtonClasses,
  getBorderClasses,
} from '@/products/brainifamily/features/activities/utils/ActivityColors';

interface Ses9Act2Props {
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

interface BubbleStep {
  id: number;
  nombre: string;
  contenido: string;
  emoji: string;
}

const BUBBLE_STEPS: BubbleStep[] = [
  {
    id: 1,
    nombre: 'Crea tu burbuja mágica',
    contenido: 'Imagina que tienes en tus manos una **burbuja mágica**.\n\n**Sopla** y verás como crece, cada vez más grande, **gigante, inmensa**.',
    emoji: '🫧',
  },
  {
    id: 2,
    nombre: 'Observa tu burbuja',
    contenido: '**¿De qué color es?**\n\n**¿Cómo es de grande?**\n\n¿Ves como **brilla**? porque es muy mágica.',
    emoji: '✨',
  },
  {
    id: 3,
    nombre: 'Entra a tu burbuja',
    contenido: 'Es tan grande y mágica que puedes entrar dentro de ella.\n\n**¿Te atreves?** ¡Entra despacio para que no explote!',
    emoji: '🚪',
  },
  {
    id: 4,
    nombre: '¡Estás dentro!',
    contenido: '¡Lo lograste, **estás dentro**!\n\nEs tan mágica que te ayuda a sentirte como quieras.',
    emoji: '🌟',
  },
  {
    id: 5,
    nombre: '¿Cómo te quieres sentir?',
    contenido: '**¿Cómo te quieres sentir?**\n\nPídeselo y te ayudará.',
    emoji: '💭',
  },
];

const TOTAL_STEPS = BUBBLE_STEPS.length;

/**
 * Actividad 2 - Sesión 9
 * La Burbuja Mágica: Actividad de visualización guiada interactiva para regulación emocional
 */
const Ses9Act2: React.FC<Ses9Act2Props> = ({ 
  userProgress, 
  activityId, 
  missionId, 
  userId,
  activityType = 'relajacion',
  activityData,
  onPuzzleComplete
}) => {
  // Estados principales
  const [phase, setPhase] = useState<'preparation' | 'steps' | 'learning'>('preparation');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  const currentStep = phase === 'steps' ? BUBBLE_STEPS[currentStepIndex] : null;
  const isLastStep = currentStepIndex === TOTAL_STEPS - 1;

  // Función para iniciar la actividad
  const startActivity = () => {
    setPhase('steps');
    setCurrentStepIndex(0);
  };

  // Función para avanzar al siguiente paso
  const handleNextStep = () => {
    if (currentStepIndex < TOTAL_STEPS - 1) {
      // Avanzar al siguiente paso
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Todos los pasos completados, ir a mensaje educativo
      setPhase('learning');
    }
  };

  // Función para completar la actividad
  const handleComplete = () => {
    setShowSuccessPopup(true);
  };

  // Función para reiniciar
  const handleReset = () => {
    setPhase('preparation');
    setCurrentStepIndex(0);
  };

  // Calcular progreso
  const progressPercentage = ((currentStepIndex + 1) / TOTAL_STEPS) * 100;

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
            La Burbuja Mágica 🫧
          </h2>
          <p className="text-gray-600 text-base">
            Un espacio mágico para sentirte como quieras
          </p>
        </div>

        {/* Indicador de progreso */}
        {phase === 'steps' && (
          <div className="mb-6 p-4 bg-white/95 backdrop-blur-lg rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progreso del viaje</span>
              <span className={`text-sm font-semibold ${getMainTitleTextClasses(activityType)}`}>
                Paso {currentStepIndex + 1} de {TOTAL_STEPS}
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
          </div>
        )}

        {/* Contenido según la fase */}
        {phase === 'preparation' && (
          <div className="space-y-6">
            <div className={getInstructionsContainerClasses(activityType)}>
              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold ${getMainTitleTextClasses(activityType)} mb-4`}>
                  ¡Prepárate para la magia!
                </h3>
              </div>
              <div className="space-y-3 text-left max-w-2xl mx-auto">
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>1º.</strong> Busca un lugar tranquilo donde puedas estar cómodo.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>2º.</strong> Siéntate cómodamente.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>3º.</strong> Prepárate para imaginar y crear tu burbuja mágica.
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
            <div className={getInstructionsContainerClasses(activityType)}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">{currentStep.emoji}</div>
                <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-3`}>
                  {currentStep.nombre}
                </h3>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200 max-w-2xl mx-auto">
                  <div className="text-lg text-gray-700 font-medium leading-relaxed">
                    {formatearTexto(currentStep.contenido)}
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={handleNextStep}
                  className={getPrimaryButtonClasses(activityType)}
                >
                  {isLastStep ? (
                    <>
                      Continuar
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

        {phase === 'learning' && (
          <div className="space-y-6">
            <div className={getInstructionsContainerClasses(activityType)}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">💡</div>
                <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-3`}>
                  Recuerda
                </h3>
                <div className="space-y-4 text-left max-w-2xl mx-auto mt-6">
                  <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl border-2 border-purple-300">
                    <p className="text-lg text-gray-700 font-medium leading-relaxed">
                      Como ves, si algún día estás <strong className={getMainTitleTextClasses(activityType)}>triste</strong>, sientes <strong className={getMainTitleTextClasses(activityType)}>miedo</strong>, o te <strong className={getMainTitleTextClasses(activityType)}>enfadas</strong>, puedes entrar en la burbuja mágica para sentirte mejor.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={handleComplete}
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
            // Reiniciar la actividad para poder volver a hacerla
            handleReset();
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

export default Ses9Act2;

