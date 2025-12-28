import React, { useState } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import { Play, RotateCcw, BookOpen, Cloud, Sun, ArrowRight } from 'lucide-react';
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
  getBorderClasses,
  getScientificBaseTitleClasses,
  getScientificBaseIconClasses
} from '@/components/activities/utils/activityColors';

interface Ses3Act2Props {
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

interface EmotionStep {
  id: number;
  nombre: string;
  imagen: string;
  preguntaInicial: string;
  ejemplos: string[];
  pensamientosAlternativos: string[];
  preguntaFinal: string;
  ejemploFinal?: string;
}

const EMOTION_STEPS: EmotionStep[] = [
  {
    id: 1,
    nombre: 'Enfado',
    imagen: 'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/20.%20Enfado.jpg',
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
    ejemploFinal: 'Contento – feliz – alegre.'
  },
  {
    id: 2,
    nombre: 'Desilusión',
    imagen: 'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images/47.%20Desilusion.jpg',
    preguntaInicial: '¿Cuéntame que te ha desilusionado?',
    ejemplos: [
      'Cuando tenías que ir a casa de un amigo/a a jugar, pero finalmente no podremos.',
      'Cuando esperabas un regalo, pero no lo tuviste.'
    ],
    pensamientosAlternativos: [
      'Me encanta jugar con mi amigo/a, pero hoy no puede ser, iré otro día, así que hoy puedo jugar en mi casa con mis juguetes y mi familia.'
    ],
    preguntaFinal: '¿Cómo te sientes ahora?',
    ejemploFinal: 'Contento – feliz – alegre.'
  }
];

type Phase = 'preparation' | 'emotions';
type EmotionPhase = 0 | 1 | 2; // 0: Primera pregunta, 1: Segunda pregunta (si existe), 2: Sol (pensamientos alternativos)

/**
 * Actividad 2 - Sesión 3
 * La nube y el sol: Distinguir entre pensamientos limitantes y potenciadores
 */
const Ses3Act2: React.FC<Ses3Act2Props> = ({ 
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
  const [phase, setPhase] = useState<Phase>('preparation');
  const [currentEmotionIndex, setCurrentEmotionIndex] = useState(0);
  const [currentEmotionPhase, setCurrentEmotionPhase] = useState<EmotionPhase>(0);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  const currentEmotion = EMOTION_STEPS[currentEmotionIndex];
  const totalEmotions = EMOTION_STEPS.length;
  const isLastEmotion = currentEmotionIndex === totalEmotions - 1;
  
  // Todas las emociones tienen 3 fases
  const totalPhases = 3;
  const isLastPhase = currentEmotionPhase === 2; // Fase 2 es la última

  // Función para iniciar la actividad (desde la pantalla de preparación)
  const startActivity = () => {
    setPhase('emotions');
    setCurrentEmotionIndex(0);
    setCurrentEmotionPhase(0);
  };

  // Función para avanzar a la siguiente fase de la emoción actual
  const handleNextPhase = () => {
    if (currentEmotionPhase < totalPhases - 1) {
      setCurrentEmotionPhase(prev => (prev + 1) as EmotionPhase);
    } else {
      // Si es la última fase de la emoción, avanzar a la siguiente emoción
      if (currentEmotionIndex < totalEmotions - 1) {
        setCurrentEmotionIndex(prev => prev + 1);
        setCurrentEmotionPhase(0);
      }
    }
  };

  // Función para avanzar a la siguiente emoción (desde la última fase)
  const handleNextEmotion = () => {
    if (currentEmotionIndex < totalEmotions - 1) {
      setCurrentEmotionIndex(prev => prev + 1);
      setCurrentEmotionPhase(0);
    }
  };

  // Función para finalizar la actividad
  const handleFinishActivity = () => {
    setShowSuccessPopup(true);
  };

  // Función para reiniciar/repetir
  const resetActivity = () => {
    setPhase('preparation');
    setCurrentEmotionIndex(0);
    setCurrentEmotionPhase(0);
    setShowSuccessPopup(false);
  };

  // Función para renderizar el contenido según la fase actual
  const renderPhaseContent = () => {
    if (!currentEmotion) return null;

    // Fase 0: Primera pregunta con ejemplos (Nube)
    if (currentEmotionPhase === 0) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Nube - Izquierda */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="flex flex-col items-center">
              <Cloud className="w-20 h-20 text-gray-400" />
              <p className="mt-2 text-sm font-semibold text-gray-600 text-center">Nube</p>
              <p className="text-xs text-gray-500 text-center">Pensamientos limitantes</p>
            </div>
          </div>

          {/* Contenido central */}
          <div className="lg:col-span-8 space-y-4">
            {/* Pregunta inicial */}
            <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-6 rounded-xl border-2 border-gray-300">
              <h3 className="text-xl font-bold text-gray-500 mb-4">
                {currentEmotion.preguntaInicial}
              </h3>
              
              {/* Ejemplos */}
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-500 mb-3">Ejemplos</p>
                <div className="space-y-2">
                  {currentEmotion.ejemplos.map((ejemplo, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 border-l-4 border-gray-500 p-3 rounded-lg"
                    >
                      <p className="text-gray-500 leading-relaxed">
                        • {ejemplo}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sol - Derecha (vacío en esta fase) */}
          <div className="lg:col-span-2 flex flex-col items-center opacity-30">
            <div className="flex flex-col items-center">
              <Sun className="w-20 h-20 text-yellow-400 fill-yellow-400" />
              <p className="mt-2 text-sm font-semibold text-yellow-600 text-center">Sol</p>
              <p className="text-xs text-yellow-500 text-center">Pensamientos potenciadores</p>
            </div>
          </div>
        </div>
      );
    }

    // Fase 1: Pensamientos alternativos (transición hacia el sol)
    if (currentEmotionPhase === 1) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Nube - Izquierda */}
          <div className="lg:col-span-2 flex flex-col items-center opacity-50">
            <div className="flex flex-col items-center">
              <Cloud className="w-20 h-20 text-gray-400" />
              <p className="mt-2 text-sm font-semibold text-gray-600 text-center">Nube</p>
              <p className="text-xs text-gray-500 text-center">Pensamientos limitantes</p>
            </div>
          </div>

          {/* Contenido central - Pensamientos alternativos */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border-2 border-gray-300">
              <h3 className="text-xl font-bold text-gray-400 mb-4">
                ¿Qué podrías pensar para {currentEmotion.nombre === 'Enfado' ? 'pasar a sentirte mejor y así llegar hasta el sol?' : 'sentirte mejor?'}
              </h3>
              
              <div className="mt-4">
                <p className="text-sm font-semibold text-gray-400 mb-3">Por ejemplo</p>
                <div className="space-y-3">
                  {currentEmotion.pensamientosAlternativos.map((pensamiento, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border-l-4 border-gray-400 p-4 rounded-lg shadow-sm"
                    >
                      <p className="text-gray-400 leading-relaxed">
                        "{pensamiento}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sol - Derecha (vacío en esta fase) */}
          <div className="lg:col-span-2 flex flex-col items-center opacity-50">
            <div className="flex flex-col items-center">
              <Sun className="w-20 h-20 text-yellow-400 fill-yellow-400" />
              <p className="mt-2 text-sm font-semibold text-yellow-600 text-center">Sol</p>
              <p className="text-xs text-yellow-500 text-center">Pensamientos potenciadores</p>
            </div>
          </div>
        </div>
      );
    }

    // Fase 2: Pregunta final (Sol)
    if (currentEmotionPhase === 2) {
      return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Nube - Izquierda (vacía en esta fase) */}
          <div className="lg:col-span-2 flex flex-col items-center opacity-30">
            <div className="flex flex-col items-center">
              <Cloud className="w-20 h-20 text-gray-400" />
              <p className="mt-2 text-sm font-semibold text-gray-600 text-center">Nube</p>
              <p className="text-xs text-gray-500 text-center">Pensamientos limitantes</p>
            </div>
          </div>

          {/* Contenido central - Pregunta final */}
          <div className="lg:col-span-8">
            <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border-2 border-yellow-400">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">
                {currentEmotion.preguntaFinal}
              </h3>
              {currentEmotion.ejemploFinal && (
                <p className="text-yellow-500 italic mt-2">
                  Por ejemplo: {currentEmotion.ejemploFinal}
                </p>
              )}
            </div>
          </div>

          {/* Sol - Derecha */}
          <div className="lg:col-span-2 flex flex-col items-center">
            <div className="flex flex-col items-center">
              <Sun className="w-20 h-20 text-yellow-400 fill-yellow-400" />
              <p className="mt-2 text-sm font-semibold text-yellow-600 text-center">Sol</p>
              <p className="text-xs text-yellow-500 text-center">Pensamientos potenciadores</p>
            </div>
          </div>
        </div>
      );
    }

    return null;
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
                Vamos a trabajar con las emociones y aprender a transformar                 
                <br />
                pensamientos limitantes en pensamientos potenciadores.
                <br />
                <strong>¡Prepárate para este viaje emocional!</strong>
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

        {/* Contenido principal de la actividad - Emociones */}
        {phase === 'emotions' && currentEmotion && (
          <div className="space-y-6">
            {/* Header con nombre e imagen de la emoción */}
            <div className="flex flex-row items-center justify-center gap-4 mb-6">
              <div className="w-32 h-32 flex items-center justify-center bg-gray-50 rounded-xl overflow-hidden">
                <img
                  src={currentEmotion.imagen}
                  alt={currentEmotion.nombre}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj57ZW1vY2lvbi5ub21icmV9PC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-braini-green">
                {currentEmotion.nombre}
              </h2>
            </div>

            {/* Contenido de la fase actual */}
            {renderPhaseContent()}

            {/* Controles */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {!isLastPhase && (
                <>
                  <Button
                    onClick={handleNextPhase}
                    className={getPrimaryButtonClasses(activityType)}
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={resetActivity}
                    variant="outline"
                    className={getOutlineButtonClasses(activityType)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reiniciar
                  </Button>
                </>
              )}
              
              {isLastPhase && !isLastEmotion && (
                <>
                  <Button
                    onClick={handleNextEmotion}
                    className={getPrimaryButtonClasses(activityType)}
                  >
                    Siguiente Emoción
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    onClick={resetActivity}
                    variant="outline"
                    className={getOutlineButtonClasses(activityType)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reiniciar
                  </Button>
                </>
              )}
              
              {isLastPhase && isLastEmotion && (
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

export default Ses3Act2;
