import React, { useState } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { BookOpen, ArrowLeft, ArrowRight, CheckCircle, Heart } from 'lucide-react';
import { formatearTexto } from '@/components/activities/utils/TextFormatter';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import ActivityInstructions from '@/components/activities/utils/ActivityInstructions';
import SciBasePopup from '@/components/activities/utils/SciBasePopup';
import { 
  getPrimaryButtonClasses, 
  getSecondaryButtonClasses, 
  getInstructionsContainerClasses, 
  getDurationTextClasses,
  getSimpleButtonClasses,
  getBorderClasses,
  getMainTitleTextClasses,
  getProgressBarColor
} from '@/components/activities/utils/ActivityColors';

interface Ses7Act1Props {
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

interface Paso {
  id: number;
  titulo: string;
  preguntas: string[];
  contenido?: string;
}

// Pasos de reflexión
const PASOS: Paso[] = [
  {
    id: 1,
    titulo: "¿Qué ha pasado?",
    preguntas: [
      "¿Qué ha ocurrido?",
      "¿Qué hizo que me sintiera así?"
    ]
  },
  {
    id: 2,
    titulo: "¿Cómo me he sentido?",
    preguntas: [
      "¿Qué emociones sentí en ese momento?",
      "¿Qué notabas en mi cuerpo?"
    ]
  },
  {
    id: 3,
    titulo: "¿Cómo lo he resuelto?",
    preguntas: [
      "¿Qué hice para solucionarlo?",
      "¿Fue adecuado o no?",
      "¿Lo hice solo o con ayuda?",
      "¿Me sirvió?"
    ]
  },
  {
    id: 4,
    titulo: "¿Qué he aprendido?",
    preguntas: [
      "¿Qué puedo hacer la próxima vez?",
      "¿Qué he aprendido sobre mí?"
    ]
  },
  {
    id: 5,
    titulo: "¡Me abrazo y felicito!",
    preguntas: [],
    contenido: "Es importante reconocer el esfuerzo que has hecho para reflexionar sobre la situación y aprender de ella. ¡Felicítate por haber dado este paso!"
  }
];

// Ejemplo práctico
const EJEMPLO = {
  situacion: "Quiero ver la tele, pero no me dejan, porque es hora de cenar. Me enfado, grito, doy patadas en el suelo diciendo ¡no es justo, quiero ver la tele!",
  aplicacion: [
    {
      paso: 1,
      pregunta: "¿Qué ha pasado?",
      respuesta: "\"Quería ver la tele y tú dijiste que no.\""
    },
    {
      paso: 2,
      pregunta: "¿Cómo me he sentido?",
      respuesta: "\"Me dio rabia. Quería ver los dibujos. Me puse muy nervioso.\""
    },
    {
      paso: 3,
      pregunta: "¿Qué he hecho para resolverlo?",
      respuesta: "\"Grité y lloré.\"",
      preguntaSeguimiento: "¿Eso me ayudó a sentirte mejor?",
      respuestaSeguimiento: "\"No. Me puse más triste.\""
    },
    {
      paso: 4,
      pregunta: "¿Qué puedo aprender?",
      respuesta: "\"Puedo decir que me da rabia y pedir que me avises cuando pueda verla.\""
    },
    {
      paso: 5,
      pregunta: "¡Me felicito!",
      respuesta: "(abrazo)"
    }
  ]
};

/**
 * Actividad 1 - Sesión 7
 * Reflexión después de un conflicto: Guía paso a paso para reflexionar sobre situaciones difíciles
 */
const Ses7Act1: React.FC<Ses7Act1Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityType,
  activityData,
  onPuzzleComplete
}) => {
  // Estados del juego
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showExample, setShowExample] = useState(false);
  const [isActivityCompleted, setIsActivityCompleted] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  // Obtener paso actual
  const currentStep = PASOS[currentStepIndex];
  const totalSteps = PASOS.length;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const isFirstStep = currentStepIndex === 0;

  // Función para avanzar al siguiente paso
  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Mostrar ejemplo al finalizar todos los pasos
      setShowExample(true);
    }
  };

  // Función para retroceder al paso anterior
  const handlePreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      setShowExample(false);
    }
  };

  // Función para completar la actividad
  const handleCompleteActivity = () => {
    setIsActivityCompleted(true);
    setShowSuccessPopup(true);
  };

  // Función para reiniciar la actividad
  const resetActivity = () => {
    setCurrentStepIndex(0);
    setShowExample(false);
    setIsActivityCompleted(false);
    setShowSuccessPopup(false);
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

      {/* Área de la actividad */}
      {!isActivityCompleted && (
        <div className="space-y-6">
          {/* Introducción (siempre visible) */}
          <div className={`${getInstructionsContainerClasses(activityType)} p-6 rounded-xl`}>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              Después de un problema, conflicto o situación difícil (discusión, frustración, pelea…), piensa siguiendo estos pasos.
            </p>
          </div>

          {/* Indicador de progreso */}
          <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-md border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Progreso</span>
              <span className={`text-sm font-semibold ${getMainTitleTextClasses(activityType)}`}>
                Paso {currentStepIndex + 1} de {totalSteps}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="h-2.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((currentStepIndex + 1) / totalSteps) * 100}%`,
                  backgroundColor: getProgressBarColor(activityType)
                }}
              />
            </div>
          </div>

          {/* Contenido del paso actual o ejemplo */}
          {!showExample ? (
            <div className="space-y-6">

              {/* Card del paso actual */}
              <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
                <div className="mb-6">
                  <div className="text-center mb-6 border-b-2 border-gray-200 pb-3">
                    <h3 className={`text-3xl font-bold ${getMainTitleTextClasses(activityType)} mb-2`}>
                      Paso {currentStep.id}:
                    </h3>
                    <h4 className="text-2xl font-semibold text-gray-800">
                      {currentStep.titulo}
                    </h4>
                  </div>
                  
                  {/* Contenido del paso */}
                  <div className="min-h-[200px] mb-6 relative">
                    {/* Preguntas guía */}
                    {currentStep.preguntas.length > 0 && (
                      <div className={`${getInstructionsContainerClasses(activityType)} p-6 rounded-xl mb-6`}>
                        <h4 className="text-lg font-semibold text-gray-800 mb-4">Preguntas para reflexionar:</h4>
                        {currentStep.id === 3 ? (
                          // Paso 3: 2 columnas con 2 preguntas cada una
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {currentStep.preguntas.map((pregunta, index) => (
                              <div key={index} className="flex items-start gap-3">
                                <span className={`text-lg ${getMainTitleTextClasses(activityType)} mt-1`}>•</span>
                                <span className="text-gray-700 leading-relaxed text-base md:text-lg flex-1">
                                  {pregunta}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          // Otros pasos: lista vertical
                          <ul className="space-y-3">
                            {currentStep.preguntas.map((pregunta, index) => (
                              <li key={index} className="flex items-start gap-3">
                                <span className={`text-lg ${getMainTitleTextClasses(activityType)} mt-1`}>•</span>
                                <span className="text-gray-700 leading-relaxed text-base md:text-lg flex-1">
                                  {pregunta}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {/* Contenido adicional (para el paso 5) */}
                    {currentStep.contenido && (
                      <div className={`${getInstructionsContainerClasses(activityType)} p-6 rounded-xl`}>
                        <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                          {currentStep.contenido}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Navegación dentro de la tarjeta */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <Button
                      onClick={handlePreviousStep}
                      disabled={isFirstStep}
                      className={getPrimaryButtonClasses(activityType) + " flex items-center gap-2"}
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Anterior
                    </Button>

                    {!isLastStep ? (
                      <Button
                        onClick={handleNextStep}
                        className={getPrimaryButtonClasses(activityType) + " flex items-center gap-2"}
                      >
                        Siguiente
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        onClick={handleNextStep}
                        className={getPrimaryButtonClasses(activityType) + " flex items-center gap-2"}
                      >
                        Ver Ejemplo
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Ejemplo práctico */
            <div className="space-y-6">
              <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
                <div className="mb-6">
                  <div className="text-center mb-6 border-b-2 border-gray-200 pb-3">
                    <h3 className={`text-3xl font-bold ${getMainTitleTextClasses(activityType)} mb-2`}>
                      Ejemplo:
                    </h3>
                    <h4 className="text-2xl font-semibold text-gray-800">
                      Situación cotidiana
                    </h4>
                  </div>

                  {/* Situación inicial */}
                  <div className={`${getInstructionsContainerClasses(activityType)} p-6 rounded-xl mb-6`}>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Situación:</h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg font-medium">
                      {EJEMPLO.situacion}
                    </p>
                  </div>

                  {/* Aplicación de los pasos */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Aplicación de los pasos:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {EJEMPLO.aplicacion.map((item, index) => (
                        <div key={index} className={`${getInstructionsContainerClasses(activityType)} p-5 rounded-xl border-l-4`} style={{ borderLeftColor: getProgressBarColor(activityType) }}>
                          <div className="flex items-start gap-3 mb-2">
                            <span className={`text-xl font-bold ${getMainTitleTextClasses(activityType)}`}>
                              {item.paso}.
                            </span>
                            <div className="flex-1">
                              <p className="text-base font-semibold text-gray-800 mb-2">
                                {item.pregunta}
                              </p>
                              <p className="text-gray-700 leading-relaxed text-base italic">
                                {item.respuesta}
                              </p>
                              {item.preguntaSeguimiento && (
                                <>
                                  <p className="text-base font-semibold text-gray-800 mt-3 mb-2">
                                    {item.preguntaSeguimiento}
                                  </p>
                                  <p className="text-gray-700 leading-relaxed text-base italic">
                                    {item.respuestaSeguimiento}
                                  </p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Navegación dentro de la tarjeta del ejemplo */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <Button
                    onClick={handlePreviousStep}
                    className={getPrimaryButtonClasses(activityType) + " flex items-center gap-2"}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Anterior
                  </Button>

                  <Button
                    onClick={handleCompleteActivity}
                    className={getPrimaryButtonClasses(activityType) + " flex items-center gap-2"}
                  >
                    Completar Actividad
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pantalla de actividad completada */}
      {isActivityCompleted && (
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl border-0 text-center">
          <div className="mb-6">
            <Heart className="w-16 h-16 mx-auto text-pink-500 mb-4" />
            <h2 className={`text-3xl font-black ${getMainTitleTextClasses(activityType)} mb-4`}>
              ¡Reflexión Completada!
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">
              Has completado todos los pasos de reflexión. Recuerda usar esta guía cuando enfrentes situaciones difíciles.
            </p>
          </div>
          <Button
            onClick={resetActivity}
            className={getPrimaryButtonClasses(activityType)}
          >
            Repetir Actividad
          </Button>
        </div>
      )}

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => {
            setShowSuccessPopup(false);
            // No reiniciar automáticamente, la actividad se queda completada
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

export default Ses7Act1;

