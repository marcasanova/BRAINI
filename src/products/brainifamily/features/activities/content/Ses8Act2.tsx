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

interface Ses8Act2Props {
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

interface WhaleStep {
  id: number;
  nombre: string;
  contenido: string;
  emoji: string;
}

const WHALE_STEPS: WhaleStep[] = [
  {
    id: 1,
    nombre: 'En la orilla del mar',
    contenido: 'Imagina que estás en la orilla del mar, tus pies tocan la arena suave y caliente.\n\nSientes el viento suave que acaricia tu cara y escuchas las olas... *shhh...* que van y vienen… *shhh…*',
    emoji: '🌊',
  },
  {
    id: 2,
    nombre: 'La Ballena Serena',
    contenido: 'De pronto, frente a ti aparece **la Ballena Serena**, una ballena azul juguetona y tranquila, que se acerca a la orilla.\n\nTiene los ojos grandes y brillantes… te sonríe con ternura.\n\nSe inclina un poquito, y te invita a subir a su lomo.',
    emoji: '🐋',
  },
  {
    id: 3,
    nombre: 'Sube a su lomo',
    contenido: 'Subes, tocas su piel, **suave y blandita**, huele muy bien.',
    emoji: '🤗',
  },
  {
    id: 4,
    nombre: 'Navegando por el mar',
    contenido: 'Juntos empezáis a navegar por el mar…\n\n**Surfeáis sobre las olas**, arriba… y abajo…\n\nEl sol brilla en el cielo azul, el agua del mar está muy limpia y puedes ver pasar **peces de colores**.',
    emoji: '☀️',
  },
  {
    id: 5,
    nombre: 'Respira con la ballena',
    contenido: '**Respiras al ritmo del oleaje.**\n\n**Inhalas**, respiras suave... y **exhalas**, sacas el aire muy despacito…\n\nTu cuerpo se relaja… tus hombros bajan… tus manos se sueltan… tus pies descansan…\n\n*La ballena respira contigo…*\n\n*Y tú respiras con ella.*',
    emoji: '🌬️',
  },
  {
    id: 6,
    nombre: 'La despedida',
    contenido: 'Ahora, la ballena se va acercando a la orilla otra vez.\n\n**Baja despacito**, le das un **abrazo enorme**.\n\nElla te guiña un ojo, sonríe y se despide, se sumerge en el mar y desaparece.',
    emoji: '👋',
  },
];

const TOTAL_STEPS = WHALE_STEPS.length;

/**
 * Actividad 2 - Sesión 8
 * La Ballena Serena: Actividad de visualización guiada y respiración para relajación profunda
 */
const Ses8Act2: React.FC<Ses8Act2Props> = ({ 
  userProgress, 
  activityId, 
  missionId, 
  userId,
  activityType = 'relajacion',
  activityData,
  onPuzzleComplete
}) => {
  // Estados principales
  const [phase, setPhase] = useState<'preparation' | 'steps' | 'awakening'>('preparation');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  const currentStep = phase === 'steps' ? WHALE_STEPS[currentStepIndex] : null;
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
      // Todos los pasos completados, ir a despertar
      setPhase('awakening');
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
            La Ballena Serena 🐋
          </h2>
          <p className="text-gray-600 text-base">
            Un viaje de relajación y respiración guiada
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
                  ¡Prepárate para el viaje!
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
                    <strong className={getMainTitleTextClasses(activityType)}>2º.</strong> Siéntate o túmbate cómodamente.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>3º.</strong> Cierra los ojos cuando estés listo para comenzar el viaje.
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button
                  onClick={startActivity}
                  className={getPrimaryButtonClasses(activityType)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Comenzar Viaje
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
                <div className="bg-linear-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border border-braini-turquoise/20 max-w-2xl mx-auto">
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

        {phase === 'awakening' && (
          <div className="space-y-6">
            <div className={getInstructionsContainerClasses(activityType)}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">✨</div>
                <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-3`}>
                  Abre los ojos
                </h3>
                <div className="space-y-4 text-left max-w-2xl mx-auto mt-6">
                  <div className="bg-linear-to-r from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-300">
                    <p className="text-lg text-gray-700 font-medium leading-relaxed mb-3">
                      <strong className={getMainTitleTextClasses(activityType)}>Abre los ojos</strong>, te sientes tranquilo/a, feliz.
                    </p>
                    <p className="text-lg text-gray-700 font-medium leading-relaxed">
                      Sabiendo que siempre puedes cerrar los ojos y <strong className={getMainTitleTextClasses(activityType)}>volver con la Ballena Serena</strong>, cada vez que lo necesites.
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

export default Ses8Act2;

