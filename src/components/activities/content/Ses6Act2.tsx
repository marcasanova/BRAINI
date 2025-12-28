import React, { useState, useEffect, useCallback } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import { Play, BookOpen, RotateCcw, CheckCircle } from 'lucide-react';
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
  getMainTitleTextClasses,
  getDurationTextClasses,
  getBorderClasses,
  getProgressBarColor,
  getSimpleButtonClasses,
  getScientificBaseTitleClasses,
  getScientificBaseIconClasses
} from '@/components/activities/utils/activityColors';

interface Ses6Act2Props {
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

interface ElephantStep {
  id: number;
  nombre: string;
  instruccion: string;
  emoji: string;
  tipo: 'inhale' | 'exhale';
}

const PASOS_ELEFANTE: ElephantStep[] = [
  {
    id: 1,
    nombre: 'Inhala',
    instruccion: '**Coge aire por la nariz profundamente** mientras levantas los brazos con las palmas de las manos juntas (tu trompa) e **hincha la barriga** como si estuviese llena de enfado.',
    emoji: '🌬️',
    tipo: 'inhale'
  },
  {
    id: 2,
    nombre: 'Exhala',
    instruccion: '**Suelta el aire por la boca** emitiendo un suave sonido como hacen los elefantes *"uuuuu"*, bajando la trompa y **deshinchando tu barriga**. Así verás como el enfado se va calmando.',
    emoji: '🐘',
    tipo: 'exhale'
  }
];

const REPETITIONS = 5;
const BREATH_DURATION = 5; // segundos para inhalar/exhalar

/**
 * Actividad 2 - Sesión 6
 * La Respiración del Elefante: Actividad de respiración activa con movimiento corporal
 */
const Ses6Act2: React.FC<Ses6Act2Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityType = 'relajacion',
  activityData,
  onPuzzleComplete
}) => {
  // Estados principales
  const [phase, setPhase] = useState<'preparation' | 'inhale' | 'exhale' | 'waitingRepeat' | 'completed'>('preparation');
  const [repetition, setRepetition] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  const currentStep = (phase === 'inhale' || phase === 'exhale') 
    ? PASOS_ELEFANTE.find(step => step.tipo === phase) 
    : null;

  // Función para iniciar la actividad
  const startActivity = () => {
    setPhase('inhale');
    setRepetition(1);
    setTimeRemaining(BREATH_DURATION);
    setIsRunning(true);
  };

  // Función para avanzar automáticamente entre fases
  const handlePhaseComplete = useCallback(() => {
    if (phase === 'inhale') {
      // Pasar de inhalar a exhalar automáticamente
      setPhase('exhale');
      setTimeRemaining(BREATH_DURATION);
    } else if (phase === 'exhale') {
      // Después de exhalar, detener y esperar confirmación del usuario
      setIsRunning(false);
      setPhase('waitingRepeat');
    }
  }, [phase]);

  // Función para repetir el ciclo (usuario hace clic en "Continuar")
  const handleRepeat = () => {
    if (repetition < REPETITIONS) {
      setRepetition((prev) => prev + 1);
      setPhase('inhale');
      setTimeRemaining(BREATH_DURATION);
      setIsRunning(true);
    } else {
      // Ya completó las 5 repeticiones
      handleComplete();
    }
  };

  // Función para completar la actividad
  const handleComplete = useCallback(() => {
    setIsRunning(false);
    setShowSuccessPopup(true);
  }, []);

  // Efecto para el temporizador automático
  useEffect(() => {
    if (!isRunning || phase === 'preparation' || phase === 'completed') return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handlePhaseComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, phase, handlePhaseComplete]);

  // Función para reiniciar
  const handleReset = () => {
    setPhase('preparation');
    setRepetition(0);
    setTimeRemaining(0);
    setIsRunning(false);
  };

  // Calcular progreso total
  const progressPercentage = (repetition / REPETITIONS) * 100;

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
            La Respiración del Elefante 🐘
          </h2>
          <p className="text-gray-600 text-base">
            Respira como un elefante y calma el enfado
          </p>
        </div>

        {/* Indicador de progreso */}
        {(phase === 'inhale' || phase === 'exhale' || phase === 'waitingRepeat') && (
          <div className="mb-6 p-4 bg-white/95 backdrop-blur-lg rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progreso de respiraciones</span>
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
          </div>
        )}

        {/* Contenido según la fase */}
        {phase === 'preparation' && (
          <div className="space-y-6">
            <div className={getInstructionsContainerClasses(activityType)}>
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🐘</div>
                <h3 className={`text-xl font-bold ${getMainTitleTextClasses(activityType)} mb-4`}>
                  Preparación
                </h3>
              </div>
              <div className="space-y-3 text-left max-w-2xl mx-auto">
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>1º.</strong> Ponte de pie, con las piernas ligeramente separadas.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>2º.</strong> Estira los brazos hacia abajo y junta las palmas de las manos.
                  </p>
                </div>
                <div className="bg-white/80 p-4 rounded-lg border border-gray-300">
                  <p className="text-gray-700 font-medium leading-relaxed">
                    <strong className={getMainTitleTextClasses(activityType)}>3º.</strong> Esas manos juntas serán tu <strong>trompa de elefante</strong>.
                  </p>
                </div>
                <div className="bg-gradient-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-4 rounded-lg border border-braini-turquoise/20 text-center">
                  <p className="text-lg font-bold text-gray-800">
                    ¡Ya eres un elefante y vas a respirar como ellos! 🐘
                  </p>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Button
                  onClick={startActivity}
                  className={getPrimaryButtonClasses(activityType)}
                >
                  <Play className="w-5 h-5 mr-2" />
                  Comenzar Respiración
                </Button>
              </div>
            </div>
          </div>
        )}

        {(phase === 'inhale' || phase === 'exhale') && currentStep && (
          <div className="space-y-6">
            {/* Paso actual con temporizador - Layout horizontal */}
            <div className={getInstructionsContainerClasses(activityType)}>
              <div className="grid grid-cols-1 md:grid-cols-[3fr_auto] gap-5 items-center">
                {/* Izquierda: Emoji + Instrucciones (más espacio) */}
                <div className="text-center md:text-left">
                  <div className="text-7xl mb-4">{currentStep.emoji}</div>
                  <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-3`}>
                    {currentStep.nombre}
                  </h3>
                  <div className="text-base text-gray-700 font-medium leading-relaxed">
                    {formatearTexto(currentStep.instruccion)}
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

        {phase === 'waitingRepeat' && (
          <div className="space-y-6">
            <div className={`${getInstructionsContainerClasses(activityType)} text-center`}>
              <div className="text-5xl mb-4">✨</div>
              <h3 className={`text-2xl font-bold ${getMainTitleTextClasses(activityType)} mb-3`}>
                ¡Respiración completada!
              </h3>
              <p className="text-lg text-gray-700 font-medium mb-6">
                Has completado {repetition} respiración{repetition !== 1 ? 'es' : ''} de elefante
              </p>

              {/* Botones de acción */}
              <div className="text-center">
                {repetition < REPETITIONS ? (
                  <Button
                    onClick={handleRepeat}
                    className={getPrimaryButtonClasses(activityType)}
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Continuar
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

export default Ses6Act2;

