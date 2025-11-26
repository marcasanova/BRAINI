import React, { useState, useEffect, useCallback } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import { Play, RotateCcw, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
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

interface Ses2Act2Props {
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

interface PizzaStep {
  id: number;
  nombre: string;
  instrucciones: string;
  areas: string[];
  emoji: string;
}

const PIZZA_STEPS: PizzaStep[] = [
  {
    id: 1,
    nombre: 'Amasar',
    instrucciones: 'Masajear con las yemas de los dedos: espalda, hombros y brazos, palma de manos y dedos. Glúteos, piernas, tobillos y pies. Bajamos y luego subimos, varias veces.',
    areas: ['Espalda', 'Hombros', 'Brazos', 'Palmas de manos', 'Dedos', 'Glúteos', 'Piernas', 'Tobillos', 'Pies'],
    emoji: '👋',
  },
  {
    id: 2,
    nombre: 'Estirar la masa',
    instrucciones: 'Deslizar con las palmas y yemas de los dedos: espalda, hombros, brazos, palmas de las manos. Piernas, tobillos y pies. Bajamos y subimos, varias veces.',
    areas: ['Espalda', 'Hombros', 'Brazos', 'Palmas de manos', 'Piernas', 'Tobillos', 'Pies'],
    emoji: '🤲',
  },
  {
    id: 3,
    nombre: 'Ingredientes',
    instrucciones: 'Ponemos los ingredientes, presionando suavemente con los dedos, como pellizquitos. ¡Qué buena pinta!',
    areas: ['Todo el cuerpo'],
    emoji: '🍕',
  },
  {
    id: 4,
    nombre: 'Hornear y Disfrutar',
    instrucciones: 'Y para terminar solo nos queda hornear... ¡Casi está lista nuestra pizza! ¡Ñam ñam! Bocado tras bocado, este masaje titulado "Pizza para cenar" se ha acabado. ¡Qué rico!',
    areas: ['Masaje suave general'],
    emoji: '🔥',
  },
];

/**
 * Actividad 2 - Sesión 2
 * Pizza para cenar: Actividad de masaje y relajación corporal
 */
const Ses2Act2: React.FC<Ses2Act2Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityType,
  activityData,
  onPuzzleComplete
}) => {
  // Función helper para obtener el color de fondo de la barra de progreso
  const getProgressBarColor = (type?: string): string => {
    switch (type) {
      case 'inteligencia_emocional':
        return 'bg-braini-blue';
      case 'regulacion_emocional':
        return 'bg-braini-turquoise';
      case 'vinculo_afectivo':
        return 'bg-braini-pink';
      case 'acompañamiento_emocional':
        return 'bg-braini-yellow';
      default:
        return 'bg-braini-blue';
    }
  };

  // Estados principales
  const [phase, setPhase] = useState<'preparation' | 'steps'>('preparation');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  const currentStep = PIZZA_STEPS[currentStepIndex];
  const totalSteps = PIZZA_STEPS.length;
  const isLastStep = currentStepIndex === totalSteps - 1;

  // Función para iniciar la actividad (desde la pantalla de preparación)
  const startActivity = () => {
    setPhase('steps');
    setCurrentStepIndex(0);
  };

  // Función para avanzar al siguiente paso
  const handleNextStep = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  // Función para finalizar la actividad
  const handleFinishActivity = () => {
    setShowSuccessPopup(true);
  };

  // Función para reiniciar/repetir
  const resetActivity = () => {
    setPhase('preparation');
    setCurrentStepIndex(0);
    setShowSuccessPopup(false);
  };

  return (
    <div className="space-y-6">
      {/* Instrucciones con datos del backend */}
      {activityData && (
        <div className={getInstructionsContainerClasses(activityType)}>
          {/* Duración del backend */}
          {activityData.duracion_min && activityData.duracion_max && (
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong className={getDurationTextClasses(activityType)}>Duración:</strong> {activityData.duracion_min} - {activityData.duracion_max} minutos
            </p>
          )}
          {/* ¿Cómo se juega? del backend - Con formateo */}
          {activityData.como_se_juega && (
            <div className="text-gray-700 leading-relaxed mb-4">
              {formatearTexto(activityData.como_se_juega)}
            </div>
          )}
          {/* Botón para ver base científica */}
          {activityData.investigacion_beneficios && (
            <div className={`mt-4 pt-4 border-t ${getBorderClasses(activityType)}`}>
              <Button
                onClick={() => setShowScientificBase(true)}
                variant="outline"
                className={`w-full sm:w-auto ${getSecondaryButtonClasses(activityType)}`}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Ver Base Científica
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Card contenedora única con tamaño fijo */}
      <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
        {/* Pantalla de preparación */}
        {phase === 'preparation' && (
          <div className="text-center min-h-[350px] flex flex-col items-center justify-center">
            <div>
              <h2 className={`text-3xl font-black ${getMainTitleTextClasses(activityType)} mb-4`}>
                ¡Prepárate!
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Vamos a preparar una pizza especial con masajes.
                <br />
                <strong>¡Prepárate para disfrutar de este momento juntos!</strong>
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

        {/* Contenido principal de la actividad - Pasos */}
        {phase === 'steps' && (
          <div>
                {/* Header */}
                <div className="mb-6">
                  <h2 className={`text-2xl md:text-3xl font-black ${getMainTitleTextClasses(activityType)} mb-2`}>
                    Pizza para cenar
                  </h2>
                  <p className="text-sm text-gray-600">
                    Paso {currentStepIndex + 1} de {totalSteps}
                  </p>
                </div>

                {/* Paso actual */}
                <div className={`${getInstructionsContainerClasses(activityType)} p-6 rounded-xl border-2 ${getBorderClasses(activityType)} mb-6`}>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Emoji grande */}
                    <div className="flex-1 flex flex-col items-center">
                      <div className="text-8xl mb-4">{currentStep.emoji}</div>
                      <h3 className={`text-3xl font-black ${getMainTitleTextClasses(activityType)} mb-4`}>
                        {currentStep.nombre}
                      </h3>
                    </div>

                    {/* Instrucciones */}
                    <div className="flex-1">
                      <div className="mb-4">
                        <h4 className="text-xl font-bold text-gray-800 mb-3">Instrucciones:</h4>
                        <p className="text-lg text-gray-700 leading-relaxed italic">
                          "{currentStep.instrucciones}"
                        </p>
                      </div>
                      
                      {/* Áreas del cuerpo */}
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800 mb-2">Áreas a trabajar:</h4>
                        <div className="flex flex-wrap gap-2">
                          {currentStep.areas.map((area, index) => (
                            <span
                              key={index}
                              className={`px-3 py-1 bg-white rounded-full text-sm font-medium ${getMainTitleTextClasses(activityType)} border ${getBorderClasses(activityType)}`}
                            >
                              {area}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Indicador de progreso de pasos */}
                <div className="flex justify-center gap-2 mb-6">
                  {PIZZA_STEPS.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                        index < currentStepIndex
                          ? 'bg-green-500'
                          : index === currentStepIndex
                          ? getProgressBarColor(activityType)
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Controles */}
                <div className="flex flex-wrap justify-center gap-3">
                  {!isLastStep && (
                    <Button
                      onClick={handleNextStep}
                      className={getPrimaryButtonClasses(activityType)}
                    >
                      Siguiente Paso
                    </Button>
                  )}
                  
                  {!isLastStep && (
                    <Button
                      onClick={resetActivity}
                      variant="outline"
                      className={getOutlineButtonClasses(activityType)}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reiniciar
                    </Button>
                  )}
                  
                  {isLastStep && (
                    <Button
                      onClick={handleFinishActivity}
                      className={getPrimaryButtonClasses(activityType)}
                    >
                      Terminar Juego
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
      <Dialog open={showScientificBase} onOpenChange={setShowScientificBase}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className={`text-2xl font-bold ${getScientificBaseTitleClasses(activityType)} flex items-center gap-2`}>
              <svg className={`w-6 h-6 ${getScientificBaseIconClasses(activityType)}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

export default Ses2Act2;

