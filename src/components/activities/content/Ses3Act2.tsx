import React, { useState, useEffect, useCallback } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import { Play, Pause, RotateCcw, BookOpen, Cloud, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface Ses3Act2Props {
  userProgress?: UserActivity;
  activityId: number;
  levelId: string;
  userId: string;
  activityData?: {
    duracion_min?: number;
    duracion_max?: number;
    como_se_juega?: string;
    investigacion_beneficios?: string;
  };
  onPuzzleComplete?: () => void;
}

interface EmotionStep {
  id: number;
  nombre: string;
  preguntaInicial: string;
  ejemplos: string[];
  pensamientosAlternativos: string[];
  preguntaFinal: string;
  emoji: string;
}

const INTRO_STEP = {
  id: 0,
  nombre: 'Introducción',
  titulo: 'La nube y el sol',
  explicacion: 'Imagina que a la derecha el sol brilla y nos ilumina. En la izquierda, hay una nube gris. Puedes dibujarte el sol y la nube en tus manos, así te acordarás mejor. Deberás pasar de la nube al sol.',
  emoji: '🌈'
};

const EMOTION_STEPS: EmotionStep[] = [
  {
    id: 1,
    nombre: 'Enfado',
    preguntaInicial: '¿Qué te hace enfadar?',
    ejemplos: [
      'Cuando no te quiero dejar el móvil.',
      'Cuando no te dejo comer más chuches.',
      'Cuando me enfado y te regaño por algo que has hecho.'
    ],
    pensamientosAlternativos: [
      'Aunque ahora no pueda usarlo, puedo hacer otra cosa divertida. ¡Dibujar o jugar con mis juguetes, leer cuentos?',
      'Si como muchas chuches me dolerá la barriga, ya comeré otro día, ahora puedo comer otras cosas que me encantan más saludables.',
      'Todos nos equivocamos y podemos rectificar.'
    ],
    preguntaFinal: '¿Cómo te sientes ahora?',
    emoji: '😠'
  },
  {
    id: 2,
    nombre: 'Desilusión',
    preguntaInicial: '¿Cuéntame que te ha desilusionado?',
    ejemplos: [
      'Cuando tenías que ir a casa de un amigo/a a jugar, pero finalmente no podremos.',
      'Cuando esperabas un regalo, pero no lo tuviste.'
    ],
    pensamientosAlternativos: [
      'Me encanta jugar con mi amigo/a, pero hoy no puede ser, iré otro día, así que hoy puedo jugar en mi casa con mis juguetes y mi familia.'
    ],
    preguntaFinal: '¿Cómo te sientes ahora?',
    emoji: '😔'
  }
];


/**
 * Actividad 2 - Sesión 3
 * La nube y el sol: Distinguir entre pensamientos limitantes y potenciadores
 */
const Ses3Act2: React.FC<Ses3Act2Props> = ({ 
  userProgress, 
  activityId, 
  levelId, 
  userId,
  activityData,
  onPuzzleComplete
}) => {
  // Estados principales
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);
  const [showSun, setShowSun] = useState(false);
  const [showCloud, setShowCloud] = useState(true);

  const totalSteps = EMOTION_STEPS.length + 1; // +1 por el paso de introducción
  const isIntroStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;
  const currentEmotionStep = currentStepIndex > 0 ? EMOTION_STEPS[currentStepIndex - 1] : null;

  // Función para avanzar al siguiente paso
  const handleNextStep = useCallback(() => {
    if (currentStepIndex < totalSteps - 1) {
      const nextStepIndex = currentStepIndex + 1;
      
      // Animación: nube desaparece, sol aparece (solo en pasos de emociones)
      if (currentStepIndex > 0) {
        setShowCloud(false);
        // Pequeño delay para la animación visual
        setTimeout(() => {
          setShowSun(true);
        }, 300);
      }
      
      // Avanzar directamente al siguiente paso
      setCurrentStepIndex(nextStepIndex);
      setIsRunning(true);
      
      // Resetear animación para el siguiente paso (si es un paso de emoción)
      if (nextStepIndex > 0 && nextStepIndex < totalSteps) {
        // Pequeño delay antes de resetear para que se vea la animación
        setTimeout(() => {
          setShowCloud(true);
          setShowSun(false);
        }, 1000);
      }
    } else {
      // Actividad completada
      setIsRunning(false);
      setShowActivityDialog(false);
      setShowSuccessPopup(true);
    }
  }, [currentStepIndex, totalSteps]);

  // Función para iniciar la actividad
  const startActivity = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  // Función para pausar/reanudar
  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };

  // Función para reiniciar
  const resetActivity = () => {
    setCurrentStepIndex(0);
    setIsRunning(false);
    setIsPaused(false);
    setShowCloud(true);
    setShowSun(false);
  };

  // Función para abrir el dialog
  const openActivityDialog = () => {
    resetActivity();
    // Inicializar animación: nube visible, sol oculto (solo para pasos de emociones)
    setShowCloud(true);
    setShowSun(false);
    setShowActivityDialog(true);
  };


  // Componente de animación nube/sol
  const CloudSunAnimation: React.FC = () => {
    return (
      <div className="relative w-full h-48 flex items-center justify-center mb-6 overflow-hidden">
        {/* Nube (izquierda) */}
        <div className={`absolute left-0 transition-all duration-1000 ease-in-out ${
          showCloud 
            ? 'opacity-100 translate-x-0 scale-100' 
            : 'opacity-0 -translate-x-20 scale-75'
        }`}>
          <div className="flex flex-col items-center">
            <div className="relative">
              <Cloud className="w-24 h-24 text-gray-400 transition-all duration-500" />
              {showCloud && (
                <div className="absolute inset-0 bg-gray-400/20 rounded-full blur-xl animate-pulse" />
              )}
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-600">Pensamientos limitantes</p>
          </div>
        </div>

        {/* Flecha de transición animada (solo cuando el sol aparece) */}
        {showSun && !showCloud && (
          <div className="absolute z-10 flex items-center gap-2 animate-pulse">
            <div className="text-4xl text-braini-turquoise">→</div>
            <div className="text-3xl text-braini-turquoise animate-bounce">✨</div>
          </div>
        )}

        {/* Sol (derecha) */}
        <div className={`absolute right-0 transition-all duration-1000 ease-in-out ${
          showSun 
            ? 'opacity-100 translate-x-0 scale-110' 
            : 'opacity-0 translate-x-20 scale-75'
        }`}>
          <div className="flex flex-col items-center">
            <div className="relative">
              <Sun className="w-24 h-24 text-yellow-400 fill-yellow-400 transition-all duration-500" />
              {showSun && (
                <>
                  <div className="absolute inset-0 bg-yellow-400/30 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute inset-0 bg-yellow-300/20 rounded-full blur-xl animate-ping" style={{ animationDuration: '2s' }} />
                </>
              )}
            </div>
            <p className="mt-2 text-sm font-semibold text-yellow-600">Pensamientos potenciadores</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Instrucciones con datos del backend */}
      {activityData && (
        <div className="bg-gradient-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border border-braini-turquoise/20">
          {/* Duración del backend */}
          {activityData.duracion_min && activityData.duracion_max && (
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong className="text-braini-turquoise-dark">Duración:</strong> {activityData.duracion_min} - {activityData.duracion_max} minutos
            </p>
          )}
          {/* ¿Cómo se juega? del backend - Con formateo */}
          {activityData.como_se_juega && (
            <div className="text-gray-700 leading-relaxed mb-4">
              {formatearTexto(activityData.como_se_juega)}
            </div>
          )}
          {/* Botones de acción */}
          <div className="mt-6 flex flex-wrap gap-4">
            <Button
              onClick={openActivityDialog}
              className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Empezar Actividad
            </Button>
            {activityData.investigacion_beneficios && (
              <Button
                onClick={() => setShowScientificBase(true)}
                variant="outline"
                className="bg-white/80 hover:bg-white border-braini-turquoise/30 text-braini-turquoise hover:text-braini-turquoise-dark hover:border-braini-turquoise transition-all duration-300 px-6 py-3 text-lg"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Ver Base Científica
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Dialog de la actividad interactiva */}
      <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-lg p-0">
          <div className="p-6 md:p-8">
            {/* Contenido principal de la actividad */}
            <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
                {/* Header */}
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-4xl">{isIntroStep ? INTRO_STEP.emoji : currentEmotionStep?.emoji}</div>
                    <div>
                      <h2 className="text-2xl md:text-3xl font-black text-braini-turquoise-dark">
                        {isIntroStep ? INTRO_STEP.titulo : currentEmotionStep?.nombre}
                      </h2>
                      <p className="text-sm text-gray-600">
                        Paso {currentStepIndex + 1} de {totalSteps}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Animación nube/sol (solo en pasos de emociones) */}
                {!isIntroStep && currentEmotionStep && (
                  <CloudSunAnimation />
                )}

                {/* Contenido del paso de introducción */}
                {isIntroStep && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border-2 border-braini-turquoise/30">
                      <p className="text-lg text-gray-700 leading-relaxed">
                        {INTRO_STEP.explicacion}
                      </p>
                    </div>
                    
                    {/* Visualización nube y sol estática */}
                    <div className="flex items-center justify-between px-8 py-6 bg-gray-50 rounded-xl">
                      <div className="flex flex-col items-center">
                        <Cloud className="w-20 h-20 text-gray-400" />
                        <p className="mt-2 text-sm font-semibold text-gray-600">Nube gris</p>
                        <p className="text-xs text-gray-500 mt-1">Izquierda</p>
                      </div>
                      <div className="text-4xl text-gray-300">→</div>
                      <div className="flex flex-col items-center">
                        <Sun className="w-20 h-20 text-yellow-400 fill-yellow-400" />
                        <p className="mt-2 text-sm font-semibold text-yellow-600">Sol brillante</p>
                        <p className="text-xs text-gray-500 mt-1">Derecha</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Contenido de pasos de emociones */}
                {!isIntroStep && currentEmotionStep && (
                  <div className="space-y-6">
                    {/* Pregunta inicial */}
                    <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-6 rounded-xl border-2 border-gray-300">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {currentEmotionStep.preguntaInicial}
                      </h3>
                      <p className="text-sm text-gray-600 italic">
                        Reflexiona sobre situaciones que te hacen sentir {currentEmotionStep.nombre.toLowerCase()}
                      </p>
                    </div>

                    {/* Ejemplos (nube - pensamientos limitantes) */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Cloud className="w-5 h-5 text-gray-400" />
                        Ejemplos de situaciones:
                      </h4>
                      <div className="space-y-3">
                        {currentEmotionStep.ejemplos.map((ejemplo, index) => (
                          <div
                            key={index}
                            className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded-lg"
                          >
                            <p className="text-gray-700 leading-relaxed">
                              • {ejemplo}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pensamientos alternativos (sol - pensamientos potenciadores) */}
                    <div>
                      <h4 className="text-lg font-semibold text-yellow-700 mb-3 flex items-center gap-2">
                        <Sun className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        ¿Qué podrías pensar para sentirte mejor?
                      </h4>
                      <div className="space-y-3">
                        {currentEmotionStep.pensamientosAlternativos.map((pensamiento, index) => (
                          <div
                            key={index}
                            className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm"
                          >
                            <p className="text-gray-700 leading-relaxed">
                              {pensamiento}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pregunta final */}
                    <div className="bg-gradient-to-r from-braini-turquoise/10 to-braini-turquoise/5 p-6 rounded-xl border-2 border-braini-turquoise/30">
                      <h3 className="text-xl font-bold text-braini-turquoise-dark mb-2">
                        {currentEmotionStep.preguntaFinal}
                      </h3>
                      <p className="text-gray-600 italic">
                        Por ejemplo: Contento – feliz – alegre
                      </p>
                    </div>
                  </div>
                )}

                {/* Indicador de progreso de pasos */}
                <div className="flex justify-center gap-2 mt-8 mb-6">
                  {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                      key={index}
                      className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                        index < currentStepIndex
                          ? 'bg-green-500'
                          : index === currentStepIndex
                          ? 'bg-braini-turquoise'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                {/* Controles */}
                <div className="flex flex-wrap justify-center gap-3">
                  {!isRunning ? (
                    <Button
                      onClick={startActivity}
                      className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-6 py-2 rounded-lg shadow-lg"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {currentStepIndex === 0 ? 'Empezar' : 'Continuar'}
                    </Button>
                  ) : (
                    <Button
                      onClick={togglePause}
                      variant="outline"
                      className="border-braini-turquoise text-braini-turquoise hover:bg-braini-turquoise/10"
                    >
                      {isPaused ? (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Reanudar
                        </>
                      ) : (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pausar
                        </>
                      )}
                    </Button>
                  )}
                  
                  {!isLastStep && (
                    <Button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-6 py-2 rounded-lg shadow-lg"
                      disabled={!isRunning && currentStepIndex === 0}
                    >
                      Siguiente Paso
                    </Button>
                  )}
                  
                  {isLastStep && (
                    <Button
                      onClick={handleNextStep}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg"
                      disabled={!isRunning && currentStepIndex === 0}
                    >
                      Completar Actividad
                    </Button>
                  )}
                  
                  <Button
                    onClick={resetActivity}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reiniciar
                  </Button>
                </div>
              </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => {
            setShowSuccessPopup(false);
            if (onPuzzleComplete) {
              onPuzzleComplete();
            }
          }}
        />
      )}

      {/* Dialog de Base Científica */}
      <Dialog open={showScientificBase} onOpenChange={setShowScientificBase}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto bg-white/95 backdrop-blur-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-indigo-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              className="bg-gradient-to-r from-braini-turquoise to-braini-turquoise-light hover:from-braini-turquoise-dark hover:to-braini-turquoise text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ses3Act2;

