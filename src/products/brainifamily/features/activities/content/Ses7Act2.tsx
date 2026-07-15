import React, { useState, useEffect, useCallback } from 'react';
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

interface Ses7Act2Props {
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

const BREATHING_DURATION = 20; // Duración de la respiración en segundos

/**
 * Actividad 2 - Sesión 7
 * El Caracol: Actividad de relajación y respiración guiada
 */
const Ses7Act2: React.FC<Ses7Act2Props> = ({ 
  userProgress, 
  activityId, 
  missionId, 
  userId,
  activityType = 'relajacion',
  activityData,
  onPuzzleComplete
}) => {
  // Estados principales
  const [phase, setPhase] = useState<'preparation' | 'enteringShell' | 'breathing' | 'wakingUp'>('preparation');
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  // Función para iniciar la actividad
  const startActivity = () => {
    setPhase('enteringShell');
  };

  // Función para avanzar a la fase de respiración
  const handleEnterShellComplete = () => {
    setPhase('breathing');
    setTimeRemaining(BREATHING_DURATION);
    setIsRunning(true);
  };

  // Función para completar la respiración (cuando termina el temporizador)
  const handleBreathingComplete = useCallback(() => {
    setIsRunning(false);
    setPhase('wakingUp');
  }, []);

  // Función para completar la actividad
  const handleComplete = () => {
    setShowSuccessPopup(true);
  };

  // Función para reiniciar
  const handleReset = () => {
    setPhase('preparation');
    setTimeRemaining(0);
    setIsRunning(false);
  };

  // Efecto para el temporizador automático
  useEffect(() => {
    if (!isRunning || phase !== 'breathing') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleBreathingComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, handleBreathingComplete]);

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
            El Caracol 🐌
          </h2>
          <p className="text-gray-600 text-base">
            Relájate y respira dentro de tu caparazón
          </p>
        </div>


        {/* Contenido según la fase */}
        {phase === 'preparation' && (
          <div className="space-y-6">
            <div className={getInstructionsContainerClasses(activityType)}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🐌</div>
                <h3 className={`text-xl font-bold ${getMainTitleTextClasses(activityType)} mb-4`}>
                  Preparación
                </h3>
              </div>
              <div className="space-y-3 text-left max-w-2xl mx-auto">
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>1º.</strong> Túmbate boca abajo en la cama o en el suelo.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>2º.</strong> Estira los brazos y las piernas.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>3º.</strong> Siente todo tu cuerpo.
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

        {phase === 'enteringShell' && (
          <div className="space-y-6">
            <div className={getInstructionsContainerClasses(activityType)}>
              <div className="text-center mb-6">
                <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-3`}>
                  Es de noche... ¡Métete en tu caparazón!
                </h3>
                <div className="space-y-4 text-left max-w-2xl mx-auto mt-6">
                  <div className="bg-linear-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-5 rounded-xl border border-braini-turquoise/20">
                    <p className="text-lg text-gray-700 font-medium leading-relaxed mb-4">
                      <strong className={getMainTitleTextClasses(activityType)}>Encoge</strong>, dobla tus piernas poco a poco, hasta que tus rodillas lleguen a tu cabeza.
                    </p>
                    <p className="text-lg text-gray-700 font-medium leading-relaxed mb-4">
                      <strong className={getMainTitleTextClasses(activityType)}>Sujétalas</strong> con tus manos.
                    </p>
                    <p className="text-lg text-gray-700 font-medium leading-relaxed">
                      <strong className={getMainTitleTextClasses(activityType)}>Cierra los ojos</strong>.
                    </p>
                  </div>
                  <div className="bg-linear-to-r from-braini-turquoise/20 to-braini-turquoise/10 p-5 rounded-xl border-2 border-braini-turquoise/30 text-center">
                    <p className="text-xl font-bold text-gray-800">
                      ¡Ya estás dentro de tu caparazón! 🐌
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 text-center">
                <Button
                  onClick={handleEnterShellComplete}
                  className={getPrimaryButtonClasses(activityType)}
                >
                  Continuar
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {phase === 'breathing' && (
          <div className="space-y-6">
            <div className={getInstructionsContainerClasses(activityType)}>
              <div className="grid grid-cols-1 md:grid-cols-[3fr_auto] gap-5 items-center">
                {/* Izquierda: Emoji + Instrucciones (más espacio) */}
                <div className="text-center md:text-left">
                  <div className="text-7xl mb-4">🐌</div>
                  <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-3`}>
                    Respira dentro de tu caparazón
                  </h3>
                  <div className="bg-linear-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border border-braini-turquoise/20">
                    <p className="text-base text-gray-700 font-medium leading-relaxed mb-3">
                      Mientras duermes dentro de tu caparazón:
                    </p>
                    <ul className="text-base text-gray-700 font-medium leading-relaxed space-y-2 text-left list-disc list-inside">
                      <li>Tu cuerpo se relaja</li>
                      <li>Tu mente se relaja</li>
                      <li>Tu corazón también se relaja</li>
                    </ul>
                    <p className="text-base text-gray-700 font-medium leading-relaxed mt-4">
                      <strong className={getMainTitleTextClasses(activityType)}>Respira profundamente</strong>
                    </p>
                  </div>
                </div>

                {/* Derecha: Countdown simple (menos espacio) */}
                <div className="flex justify-center">
                  <div className="text-center">
                    <div className={`text-7xl font-black ${getMainTitleTextClasses(activityType)} mb-2`}>
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
        )}

        {phase === 'wakingUp' && (
          <div className="space-y-6">
            <div className={getInstructionsContainerClasses(activityType)}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">☀️</div>
                <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-3`}>
                  ¡Ya sale el sol!
                </h3>
                <div className="space-y-4 text-left max-w-2xl mx-auto mt-6">
                  <div className="bg-linear-to-r from-yellow-50 to-yellow-100 p-5 rounded-xl border border-yellow-300">
                    <p className="text-lg text-gray-700 font-medium leading-relaxed mb-3">
                      <strong className={getMainTitleTextClasses(activityType)}>Baja las rodillas</strong> lentamente.
                    </p>
                    <p className="text-lg text-gray-700 font-medium leading-relaxed mb-3">
                      <strong className={getMainTitleTextClasses(activityType)}>Estira las piernas</strong>.
                    </p>
                    <p className="text-lg text-gray-700 font-medium leading-relaxed">
                      <strong className={getMainTitleTextClasses(activityType)}>Abre los ojos</strong> lentamente.
                    </p>
                  </div>
                  <div className="bg-linear-to-r from-yellow-100 to-yellow-200 p-6 rounded-xl border-2 border-yellow-400 text-center">
                    <p className="text-xl font-bold text-gray-800 italic">
                      "¡Relax, todo está bien!"
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

export default Ses7Act2;

