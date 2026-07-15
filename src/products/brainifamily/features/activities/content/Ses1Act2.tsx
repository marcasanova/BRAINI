import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UserActivity } from '@/products/brainifamily/hooks/useUserActivities';
import { formatearTexto } from '@/products/brainifamily/features/activities/utils/TextFormatter';
import { Footprints, Play } from 'lucide-react';
import {
  GIGANTE_IMAGE_URL,
  RATON_IMAGE_URL,
  PATADAS_GIGANTE_VIDEO_URL,
  PATADAS_RATON_VIDEO_URL,
} from '@/shared/lib/constants/actividadesInfantilStorage';
import { Button } from '@/shared/ui/button';
import SuccessPopup from '@/products/brainifamily/features/activities/utils/SuccessPopup';
import ActivityInstructions from '@/products/brainifamily/features/activities/utils/ActivityInstructions';
import SciBasePopup from '@/products/brainifamily/features/activities/utils/SciBasePopup';
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
} from '@/products/brainifamily/features/activities/utils/ActivityColors';

interface Ses1Act2Props {
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

type Phase = 'preparation' | 'legs' | 'legsDecision' | 'completed';
type Step = 'giant' | 'raton' | 'alternate';

interface StepConfig {
  name: string;
  instruction: string;
  duration: number; // en segundos
}

const STEP_CONFIGS: Record<Step, StepConfig> = {
  giant: {
    name: 'Gigantes',
    instruction: 'Pisamos fuerte el suelo como gigantes muy grandes.\nApretamos las piernas y los pies… sentimos cómo se ponen fuertes.\n¿Notas lo grandes y fuertes que son tus pasos de gigante?',
    duration: 20,
  },
  raton: {
    name: 'Ratones',
    instruction: 'Los ratones caminan muy suave y despacio. Apoyamos los pies con cuidado, las piernas se aflojan, los pies tocan suavemente el suelo… los pasos de ratoncito casi no se oyen.\n¿Notas cómo tus piernas y pies descansan y relajan?',
    duration: 20,
  },
  alternate: {
    name: 'Vamos cambiando',
    instruction: 'Primero somos gigantes… pisamos fuerte el suelo.\nAhora somos ratoncitos… apoyamos los pies suavemente.\nVamos cambiando despacio y sentimos cómo el cuerpo se relaja y calma.',
    duration: 20,
  },
};

/**
 * Actividad 2 - Sesión 1
 * Gigantes y ratones: Actividad de relajación física interactiva
 */
const Ses1Act2: React.FC<Ses1Act2Props> = ({ 
  userProgress, 
  activityId, 
  missionId, 
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

  // Pasos de la fase actual (solo piernas)
  const steps: Step[] = ['giant', 'raton', 'alternate'];
  const currentStepConfig = STEP_CONFIGS[currentStep];
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoGiganteRef = useRef<HTMLVideoElement>(null);
  const videoRatonRef = useRef<HTMLVideoElement>(null);

  // Función para resaltar palabras clave en una línea de texto
  const highlightKeywordsInLine = (line: string) => {
    const keywords = ['gigante', 'gigantes', 'ratones', 'ratón', 'ratoncito', 'ratoncitos', 'fuerte', 'fuertes', 'flojas', 'flojitas', 'suaves', 'lentas', 'delicadas'];
    const regex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'gi');
    const parts: Array<{ text: string; isKeyword: boolean }> = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(line)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: line.substring(lastIndex, match.index), isKeyword: false });
      }
      parts.push({ text: match[0], isKeyword: true });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < line.length) {
      parts.push({ text: line.substring(lastIndex), isKeyword: false });
    }
    return parts;
  };

  // Función para resaltar palabras clave en el texto de instrucción (soporta saltos de línea)
  const formatInstruction = (text: string): JSX.Element => {
    const lines = text.split('\n').filter((l) => l.trim() !== '');
    return (
      <>
        {lines.map((line, lineIndex) => {
          const parts = highlightKeywordsInLine(line);
          return (
            <React.Fragment key={lineIndex}>
              {lineIndex > 0 && <br />}
              {parts.map((part, index) => {
                if (part.isKeyword) {
                  return <strong key={index} className="font-bold">{part.text}</strong>;
                }
                return <span key={index}>{part.text}</span>;
              })}
            </React.Fragment>
          );
        })}
      </>
    );
  };

  // Función para completar paso (para el video al terminar el tiempo)
  const handleStepComplete = useCallback(() => {
    if (currentStep === 'alternate') {
      videoGiganteRef.current?.pause();
      videoGiganteRef.current && (videoGiganteRef.current.currentTime = 0);
      videoRatonRef.current?.pause();
      videoRatonRef.current && (videoRatonRef.current.currentTime = 0);
    } else {
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    }
    if (stepIndex < steps.length - 1) {
      const nextIndex = stepIndex + 1;
      setStepIndex(nextIndex);
      setCurrentStep(steps[nextIndex]);
      setTimeRemaining(STEP_CONFIGS[steps[nextIndex]].duration);
    } else {
      setIsRunning(false);
      setPhase('legsDecision');
    }
  }, [stepIndex, steps, currentStep]);

  // Efecto para el temporizador principal
  useEffect(() => {
    if (!isRunning || phase === 'completed' || phase === 'legsDecision') return;

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

  // Reproducir o pausar video según el paso actual
  useEffect(() => {
    if (phase !== 'legs') return;
    if (currentStep === 'giant' || currentStep === 'raton') {
      const video = videoRef.current;
      if (video) {
        video.play().catch(() => {});
      }
    } else if (currentStep === 'alternate') {
      const gigante = videoGiganteRef.current;
      const raton = videoRatonRef.current;
      if (gigante && raton) {
        // Asegurar que ambos videos están pausados y reseteados
        raton.pause();
        raton.currentTime = 0;
        gigante.currentTime = 0;
        // Iniciar con el gigante
        gigante.play().catch((err) => {
          console.error('Error al iniciar gigante:', err);
        });
      }
    }
  }, [phase, currentStep]);

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

  // Finalizar actividad
  const finishActivity = () => {
    setPhase('completed');
    setShowSuccessPopup(true);
  };

  // Componente de visualización del paso actual
  const StepDisplay: React.FC<{ step: Step }> = ({ step }) => {
    const config = STEP_CONFIGS[step];
    
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
          <div className="min-h-[350px] flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl">
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8">
                {/* Izquierda: Imagen Gigante */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <img
                    src={GIGANTE_IMAGE_URL}
                    alt="Gigante"
                    className="h-40 sm:h-52 md:h-56 w-auto object-contain drop-shadow-md"
                  />
                  <span className="text-sm font-bold text-braini-turquoise-dark">Gigante</span>
                </div>

                {/* Centro: Texto de preparación */}
                <div className="flex-1 text-center">
                  <h2 className={`text-3xl font-black ${getMainTitleTextClasses(activityType)} mb-4`}>
                    ¡Preparados y preparadas!
                  </h2>
                  <p className="text-xl text-gray-700 mb-8">
                    Vamos a jugar con nuestras piernas y nuestros pies.
                    <br />
                    A veces serán fuertes como gigantes… y otras veces blanditos como ratones.
                    <br />
                    <strong>¡Nos ponemos de pie y empezamos!</strong>
                  </p>
                  <Button
                    onClick={startActivity}
                    className={getPrimaryButtonClasses(activityType)}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Empezar Reto
                  </Button>
                </div>

                {/* Derecha: Imagen Ratón */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <img
                    src={RATON_IMAGE_URL}
                    alt="Ratón"
                    className="h-40 sm:h-52 md:h-56 w-auto object-contain drop-shadow-md"
                  />
                  <span className="text-sm font-bold text-braini-turquoise-dark">Ratón</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fase de piernas */}
        {phase === 'legs' && (
          <div className="min-h-[350px] flex flex-col">
            {/* Paso actual: izquierda = video + temporizador; derecha = texto */}
            <div className="bg-linear-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border-2 border-braini-turquoise/30 mb-6">
              <div className="flex flex-col md:flex-row items-center md:items-center gap-6">
                {/* Izquierda: video(s) */}
                <div className="flex flex-col items-center shrink-0">
                  {(currentStep === 'giant' || currentStep === 'raton') && (
                    <div className="w-full max-w-[150px]">
                      <video
                        ref={videoRef}
                        src={currentStep === 'giant' ? PATADAS_GIGANTE_VIDEO_URL : PATADAS_RATON_VIDEO_URL}
                        loop
                        muted
                        playsInline
                        className="w-full h-auto rounded-lg object-contain border-2 border-braini-turquoise/30 bg-black/5"
                        onCanPlay={() => {
                          if (isRunning && (currentStep === 'giant' || currentStep === 'raton')) {
                            videoRef.current?.play();
                          }
                        }}
                      />
                    </div>
                  )}
                  {currentStep === 'alternate' && (
                    <div className="flex items-center gap-3">
                      <video
                        ref={videoGiganteRef}
                        src={PATADAS_GIGANTE_VIDEO_URL}
                        muted
                        playsInline
                        preload="auto"
                        className="w-[120px] h-auto rounded-lg object-contain border-2 border-braini-turquoise/30 bg-black/5"
                        onEnded={() => {
                          const g = videoGiganteRef.current;
                          const r = videoRatonRef.current;
                          if (currentStep === 'alternate' && r) {
                            g?.pause();
                            if (g) g.currentTime = 0;
                            if (r) {
                              r.currentTime = 0;
                              r.play().catch((err) => {
                                console.error('Error al reproducir ratón:', err);
                              });
                            }
                          }
                        }}
                      />
                      <video
                        ref={videoRatonRef}
                        src={PATADAS_RATON_VIDEO_URL}
                        muted
                        playsInline
                        preload="auto"
                        className="w-[120px] h-auto rounded-lg object-contain border-2 border-braini-turquoise/30 bg-black/5"
                        onEnded={() => {
                          const g = videoGiganteRef.current;
                          const r = videoRatonRef.current;
                          if (currentStep === 'alternate' && g) {
                            r?.pause();
                            if (r) r.currentTime = 0;
                            if (g) {
                              g.currentTime = 0;
                              g.play().catch((err) => {
                                console.error('Error al reproducir gigante:', err);
                              });
                            }
                          }
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Derecha: temporizador arriba + instrucción */}
                <div className="flex-1 text-center md:text-left min-w-0">
                  {/* Temporizador alineado a la izquierda, justo encima del letrero */}
                  <div className="text-left mb-3">
                    <span className={`text-3xl md:text-4xl font-bold ${getTimerColorClasses(activityType)}`}>
                      {timeRemaining}
                    </span>
                    <span className="text-lg md:text-xl text-gray-600 ml-2">segundos</span>
                  </div>
                  {/* Instrucción */}
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
                ¡Secuencia completada!
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                ¿Qué quieres hacer ahora?
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4">
                <Button
                  onClick={repeatLegs}
                  className="bg-linear-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                >
                  <Footprints className="w-5 h-5 mr-2" />
                  Repetir
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
            setPhase('preparation');
            setStepIndex(0);
            setCurrentStep('giant');
            setTimeRemaining(STEP_CONFIGS.giant.duration);
            setIsRunning(false);
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

export default Ses1Act2;
