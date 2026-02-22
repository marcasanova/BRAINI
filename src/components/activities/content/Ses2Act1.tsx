import React, { useState, useEffect } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { CheckCircle, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import ActivityInstructions from '@/components/activities/utils/ActivityInstructions';
import SciBasePopup from '@/components/activities/utils/SciBasePopup';
import { EMOTIONS_INFANTIL_URL } from '@/constants/emotionsStorage';
import { 
  getInstructionsContainerClasses, 
  getMainTitleTextClasses,
  getProgressBarColor,
  getSimpleButtonClasses
} from '@/components/activities/utils/ActivityColors';

// Mapa nombre de emoción (como en las opciones) -> archivo en bucket emociones_infantil
// Los nombres de archivo deben coincidir exactamente con el bucket (ej. Nerviosismo, no Nervioso)
const EMOCION_A_IMAGEN: Record<string, string> = {
  'Pena': '4.%20Pena.png',
  'Alegría': '1.%20Alegria.png',
  'Miedo': '3.%20Miedo.png',
  'Ilusión': '10.%20Ilusion.png',
  'Frustración': '11.%20Frustracion.png',
  'Vergüenza': '7.%20Verguenza.png',
  'Tranquilidad': '12.%20Tranquilidad.png',
  'Nervioso': '16.%20Nerviosismo.png',
  'Enfadado': '20.%20Enfado.png',
  'Relajado': '22.%20Relajacion.png',
};

interface Ses2Act1Props {
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

interface Adivinanza {
  id: number;
  emocionCorrecta: string;
  texto: string;
  opcion1: string; // Incorrecta
  opcion2: string; // Incorrecta
}

/**
 * Actividad 1 - Sesión 2
 * Adivina adivinanza: Quiz de emociones con adivinanzas
 */
const Ses2Act1: React.FC<Ses2Act1Props> = ({ 
  userProgress, 
  activityId, 
  missionId, 
  userId,
  activityType,
  activityData,
  onPuzzleComplete
}) => {
  const { toast } = useToast();
  
  // ====================================================
  // DATOS HARDCODEADOS - Adivinanzas
  // ====================================================
  const ADIVINANZAS_ORIGINALES: Adivinanza[] = [
    {
      id: 4,
      emocionCorrecta: "Pena",
      texto: "Lloro bajito y me siento mal,\nalgo ha pasado, algo anda mal.\nUn abrazo me puede ayudar,\n¿qué emoción duele en mi corazón?",
      opcion1: "Alegría",
      opcion2: "Miedo"
    },
    {
      id: 10,
      emocionCorrecta: "Ilusión",
      texto: "Salto muy alto, los ojos yo abro,\nalgo bonito está por llegar.\nQue ganas tengo de vivirlo ya,\n¿qué emoción siento ya?",
      opcion1: "Frustración",
      opcion2: "Vergüenza"
    },
    {
      id: 12,
      emocionCorrecta: "Tranquilidad",
      texto: "Respiro despacio, todo va bien,\nMi cuerpo esta en equilibrio,\nno hay por qué correr.\n\nMi corazón late lento,\nen calma está, se siente genial.\n¿qué emoción me cuida más?",
      opcion1: "Ilusión",
      opcion2: "Nervioso"
    },
    {
      id: 16,
      emocionCorrecta: "Nervioso",
      texto: "Mucho me muevo, no paro de hablar,\nalgo va a pasar y no puedo esperar.\nEl corazón late rápido sin parar,\n¿Qué es lo que siento que no puedo frenar?",
      opcion1: "Enfadado",
      opcion2: "Relajado"
    }
  ];

  // ====================================================
  // BATERÍA DE TEXTOS DE RESULTADOS
  // ====================================================
  const getResultMessage = (correct: number, total: number): string => {
    const percentage = (correct / total) * 100;
    
    // 100% - Perfecto
    if (percentage === 100) {
      const messages = [
        "¡Perfecto! Has acertado todas las adivinanzas",
        "¡Increíble! Conoces muy bien las emociones",
        "¡Excelente! Eres un experto en emociones",
        "¡Fantástico! Has demostrado un gran conocimiento emocional",
        "¡Genial! Todas correctas, ¡eres un campeón!"
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // 80-99% - Muy bien
    if (percentage >= 80) {
      const messages = [
        "¡Muy bien! Has demostrado un gran conocimiento emocional",
        "¡Excelente trabajo! Casi todas correctas, ¡sigue así!",
        "¡Genial! Tienes muy buen entendimiento de las emociones",
        "¡Bien hecho! Has acertado la mayoría, ¡estás aprendiendo mucho!",
        "¡Fantástico! Tu conocimiento emocional es muy bueno"
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // 60-79% - Bien
    if (percentage >= 60) {
      const messages = [
        "¡Bien hecho! Sigue practicando para mejorar aún más",
        "¡Buen trabajo! Estás aprendiendo sobre las emociones",
        "¡Sigue así! Cada vez entiendes mejor las emociones",
        "¡Bien! Has acertado más de la mitad, ¡vas por buen camino!",
        "¡Muy bien! Estás mejorando tu conocimiento emocional"
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // 40-59% - Regular
    if (percentage >= 40) {
      const messages = [
        "¡Sigue intentándolo! Cada práctica te ayuda a aprender más",
        "¡No te rindas! Las emociones se aprenden poco a poco",
        "¡Bien intentado! Sigue practicando y mejorarás",
        "¡Ánimo! Cada vez que juegas aprendes algo nuevo",
        "¡Sigue adelante! El conocimiento emocional se construye día a día"
      ];
      return messages[Math.floor(Math.random() * messages.length)];
    }
    
    // < 40% - Necesita mejorar
    const messages = [
      "¡Ánimo! Las emociones son complejas, sigue practicando",
      "¡No te preocupes! Cada intento es una oportunidad de aprender",
      "¡Sigue intentándolo! Con la práctica mejorarás mucho",
      "¡Ánimo! Aprender sobre emociones lleva tiempo, ¡tú puedes!",
      "¡Sigue adelante! Cada juego te acerca más a entender las emociones"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  // ====================================================
  // ESTADO DEL JUEGO
  // ====================================================
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [resultMessage, setResultMessage] = useState<string>('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);

  // Estados para adivinanzas y opciones (se randomizan al montar el componente)
  const [adivinanzas, setAdivinanzas] = useState<Adivinanza[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[][]>([]);

  // Función para reiniciar el juego
  const resetGame = () => {
    // Randomizar el orden de las adivinanzas
    const shuffled = [...ADIVINANZAS_ORIGINALES].sort(() => Math.random() - 0.5);
    setAdivinanzas(shuffled);
    
    // Generar opciones aleatorias para cada adivinanza
    const options = shuffled.map(q => {
      const opts = [q.emocionCorrecta, q.opcion1, q.opcion2];
      return [...opts].sort(() => Math.random() - 0.5);
    });
    setCurrentOptions(options);
    
    // Resetear el estado del juego
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setCorrectAnswers(0);
    setAnsweredQuestions([]);
    setQuizCompleted(false);
    setResultMessage('');
    setShowSuccessPopup(false);
  };

  // Randomizar adivinanzas y opciones al montar el componente
  useEffect(() => {
    resetGame();
  }, []);

  // Precargar imágenes de las opciones de la pregunta actual para evitar parpadeos y fallos de carga
  useEffect(() => {
    if (!currentOptions.length || currentQuestionIndex >= currentOptions.length) return;
    const options = currentOptions[currentQuestionIndex];
    options?.forEach((option) => {
      const filename = EMOCION_A_IMAGEN[option];
      if (filename) {
        const img = new Image();
        img.src = `${EMOTIONS_INFANTIL_URL}/${filename}`;
      }
    });
  }, [currentQuestionIndex, currentOptions]);

  // Obtener pregunta actual
  const currentQuestion = adivinanzas.length > 0 && currentQuestionIndex < adivinanzas.length 
    ? adivinanzas[currentQuestionIndex] 
    : null;
  const totalQuestions = adivinanzas.length;

  // ====================================================
  // FUNCIONES DE LÓGICA
  // ====================================================
  const handleAnswerSelect = (answer: string) => {
    if (!currentQuestion || showFeedback || answeredQuestions.includes(currentQuestion.id)) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);

    const isCorrectAnswer = answer === currentQuestion.emocionCorrecta;
    
    // Calcular el número final de respuestas correctas
    const finalCorrectAnswers = isCorrectAnswer ? correctAnswers + 1 : correctAnswers;
    
    if (isCorrectAnswer) {
      setCorrectAnswers(prev => prev + 1);
      setAnsweredQuestions(prev => [...prev, currentQuestion.id]);
    } else {
      setAnsweredQuestions(prev => [...prev, currentQuestion.id]);
    }

    // Avanzar a la siguiente pregunta después de 1 segundo
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Quiz completado - Generar mensaje de resultado y guardarlo
        const message = getResultMessage(finalCorrectAnswers, totalQuestions);
        setResultMessage(message);
        setQuizCompleted(true);
        setShowSuccessPopup(true);
      }
    }, 1000);
  };

  const isCorrect = (option: string) => {
    return currentQuestion ? option === currentQuestion.emocionCorrecta : false;
  };

  const isSelected = (option: string) => {
    return selectedAnswer === option;
  };

  const isAnswered = () => {
    return currentQuestion ? answeredQuestions.includes(currentQuestion.id) : false;
  };

  // ====================================================
  // RENDERIZADO
  // ====================================================
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

      {/* Área del quiz - Mostrar siempre que haya adivinanzas y no esté completado */}
      {adivinanzas.length > 0 && !quizCompleted && (
              <div className="space-y-6">
                {/* Indicador de progreso */}
                <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-md border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Progreso</span>
                    <span className={`text-sm font-semibold ${getMainTitleTextClasses(activityType)}`}>
                      Pregunta {currentQuestionIndex + 1} de {totalQuestions}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                        backgroundColor: getProgressBarColor(activityType)
                      }}
                    />
                  </div>
                </div>

                {/* Card de la adivinanza */}
                <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
                  <div className="text-center mb-8">
                    {/* Título interno más discreto para mantener consistencia con Ses1Act1 y Ses3Act1 */}
                    <h3 className="text-lg font-bold text-gray-700 mb-4">
                      Adivinanza
                    </h3>
                    <div className={`${getInstructionsContainerClasses(activityType)} p-8`}>
                      <p className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium text-center space-y-2">
                        {currentQuestion?.texto.split('\n').map((line, index) => (
                          <span key={index} className="block">
                            {line}
                          </span>
                        )) || 'Cargando pregunta...'}
                      </p>
                    </div>
                  </div>

                  {/* Opciones de respuesta */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-8">
                    {currentQuestion && currentOptions.length > currentQuestionIndex && currentOptions[currentQuestionIndex]?.map((option, index) => {
                      const correct = isCorrect(option);
                      const selected = isSelected(option);
                      const answered = isAnswered();

                      // Usar los mismos colores que Ses1Act1 para consistencia
                      let buttonClass = `
                        relative p-4 rounded-xl border-2 transition-all duration-200 text-lg font-semibold
                        ${answered
                          ? correct
                            ? 'bg-braini-green/10 border-braini-green opacity-75 cursor-not-allowed'
                            : selected && !correct
                            ? 'bg-braini-pink/10 border-braini-pink shadow-lg cursor-not-allowed'
                            : 'bg-gray-50 border-gray-300 opacity-60 cursor-not-allowed'
                          : selected
                          ? 'bg-blue-100 border-blue-500 shadow-lg transform scale-105 cursor-pointer'
                          : 'bg-white border-gray-300 hover:border-blue-400 hover:shadow-md cursor-pointer'
                        }
                      `;

                      const imageSrc = EMOCION_A_IMAGEN[option]
                        ? `${EMOTIONS_INFANTIL_URL}/${EMOCION_A_IMAGEN[option]}`
                        : null;

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={answered}
                          className={buttonClass}
                        >
                          {imageSrc ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white rounded-lg overflow-hidden flex-shrink-0 relative">
                                <img
                                  src={imageSrc}
                                  alt={option}
                                  className="w-full h-full object-contain"
                                  loading="eager"
                                  onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    const fallback = target.nextElementSibling as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                  }}
                                />
                                <div
                                  className="absolute inset-0 hidden items-center justify-center bg-gray-100 text-gray-500 text-2xl font-bold"
                                  style={{ display: 'none' }}
                                  aria-hidden
                                >
                                  {option.charAt(0)}
                                </div>
                              </div>
                              <span>{option}</span>
                            </div>
                          ) : (
                            option
                          )}
                          
                          {/* Iconos de feedback */}
                          {answered && correct && (
                            <div className="absolute top-2 right-2 bg-braini-green rounded-full p-1">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          )}
                          
                          {answered && selected && !correct && (
                            <div className="absolute top-2 right-2 bg-braini-pink rounded-full p-1 animate-pulse">
                              <X className="w-5 h-5 text-white" />
                            </div>
                          )}

                          {answered && !selected && correct && (
                            <div className="absolute top-2 right-2 bg-braini-green rounded-full p-1">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                </div>

              </div>
            </div>
          )}

      {/* Pantalla de resultados */}
      {quizCompleted && (
        <div className="bg-white/95 backdrop-blur-lg p-8 rounded-2xl shadow-xl border-0 text-center">
          <h2 className={`text-3xl font-black ${getMainTitleTextClasses(activityType)} mb-6`}>
            ¡Quiz Completado!
          </h2>
          <div className="mb-6">
            <p className={`text-5xl md:text-6xl font-black ${getMainTitleTextClasses(activityType)} mb-4`}>
              {correctAnswers} de {totalQuestions} correctas
            </p>
          </div>
          <div className={getInstructionsContainerClasses(activityType)}>
            <p className="text-gray-700 leading-relaxed mb-6">
              {resultMessage}
            </p>
            <Button
              onClick={resetGame}
              className={getSimpleButtonClasses(activityType) + " hover:shadow-xl transform hover:scale-105"}
            >
              Volver a Jugar
            </Button>
          </div>
        </div>
      )}

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => {
            setShowSuccessPopup(false);
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

export default Ses2Act1;

