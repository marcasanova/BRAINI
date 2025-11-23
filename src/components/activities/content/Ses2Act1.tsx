import React, { useState, useEffect } from 'react';
import { UserActivity } from '@/hooks/useUserActivities';
import { CheckCircle, X, BookOpen, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatearTexto } from '@/components/activities/utils/textFormatter';
import SuccessPopup from '@/components/activities/utils/SuccessPopup';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface Ses2Act1Props {
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
  levelId, 
  userId,
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
      id: 6,
      emocionCorrecta: "Celos",
      texto: "Quiero lo que otro tiene sin razón,\nme molesta no tener su atención.\nNo es justo, también lo quiero yo,\n¿qué emoción me visita hoy?",
      opcion1: "Enfado",
      opcion2: "Felicidad"
    },
    {
      id: 10,
      emocionCorrecta: "Ilusión",
      texto: "Salto muy alto, los ojos yo abro,\nalgo bonito está por llegar.\nQue ganas tengo de vivirlo ya,\n¿qué emoción siento ya?",
      opcion1: "Frustración",
      opcion2: "Celos"
    },
    {
      id: 11,
      emocionCorrecta: "Frustración",
      texto: "Lo intento y no me sale, ¡buaaa! quiero gritar.\nQuiero hacerlo y no lo consigo ¡aiii! que chillo.\n\nNo me gusta sentirla, pero tengo que vivirla.\n¿Qué siento ahora que me irrita?",
      opcion1: "Celos",
      opcion2: "Alegría"
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
      opcion1: "Tranquilidad",
      opcion2: "Relajado"
    },
    {
      id: 21,
      emocionCorrecta: "Paciencia",
      texto: "Espero mi turno sin protestar,\naunque me cueste, sé esperar.\nContar hasta diez me ayuda a calmar,\n¿qué emoción me hace aguantar?",
      opcion1: "Alegría",
      opcion2: "Celos"
    }
  ];

  // ====================================================
  // ESTADO DEL JUEGO
  // ====================================================
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showScientificBase, setShowScientificBase] = useState(false);
  const [showActivityDialog, setShowActivityDialog] = useState(false);

  // Estados para adivinanzas y opciones (se randomizan cada vez que se abre el Dialog)
  const [adivinanzas, setAdivinanzas] = useState<Adivinanza[]>([]);
  const [currentOptions, setCurrentOptions] = useState<string[][]>([]);

  // Randomizar adivinanzas y opciones cada vez que se abre el Dialog
  useEffect(() => {
    if (showActivityDialog) {
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
      setShowSuccessPopup(false);
    }
  }, [showActivityDialog]);

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
    
    if (isCorrectAnswer) {
      setCorrectAnswers(prev => prev + 1);
      setAnsweredQuestions(prev => [...prev, currentQuestion.id]);
      
      toast({
        title: "¡SÚPER! 🎉",
        description: `¡Correcto! La respuesta es ${currentQuestion.emocionCorrecta}`,
      });
    } else {
      setAnsweredQuestions(prev => [...prev, currentQuestion.id]);
      
      toast({
        title: "Incorrecto",
        description: `La respuesta correcta es: ${currentQuestion.emocionCorrecta}`,
        variant: "destructive",
      });
    }

    // Avanzar a la siguiente pregunta después de 1 segundo
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Quiz completado
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
      {activityData && (
        <div className="bg-braini-blue/10 p-6 rounded-xl border border-braini-blue/20">
          {/* Duración del backend */}
          {activityData.duracion_min && activityData.duracion_max && (
            <p className="text-gray-700 leading-relaxed mb-3">
              <strong className="text-braini-blue-dark">Duración:</strong> {activityData.duracion_min} - {activityData.duracion_max} minutos
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
              onClick={() => setShowActivityDialog(true)}
              className="bg-braini-blue hover:bg-braini-blue-dark text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Empezar Actividad
            </Button>
            {activityData.investigacion_beneficios && (
              <Button
                onClick={() => setShowScientificBase(true)}
                variant="outline"
                className="bg-white/80 hover:bg-white border-braini-blue/30 text-braini-blue hover:text-braini-blue-dark hover:border-braini-blue transition-all duration-300 px-6 py-3 text-lg"
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
            {/* Área del quiz - Mostrar siempre que haya adivinanzas y no esté completado */}
            {adivinanzas.length > 0 && !quizCompleted && (
              <div className="space-y-6">
                {/* Indicador de progreso */}
                <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-md border border-braini-blue/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">Progreso</span>
                    <span className="text-sm font-bold text-braini-blue">
                      Pregunta {currentQuestionIndex + 1} de {totalQuestions}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-braini-blue h-2.5 rounded-full transition-all duration-500"
                      style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Card de la adivinanza */}
                <div className="bg-white/95 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-xl border-0">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-black text-braini-blue-dark mb-6">
                      Adivina adivinanza
                    </h2>
                    <div className="bg-braini-blue/10 p-6 rounded-xl border border-braini-blue/20">
                      <p className="text-lg md:text-xl text-gray-800 leading-relaxed whitespace-pre-line font-medium">
                        {currentQuestion?.texto || 'Cargando pregunta...'}
                      </p>
                    </div>
                  </div>

                  {/* Opciones de respuesta */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    {currentQuestion && currentOptions.length > currentQuestionIndex && currentOptions[currentQuestionIndex]?.map((option, index) => {
                      const correct = isCorrect(option);
                      const selected = isSelected(option);
                      const answered = isAnswered();

                      let buttonClass = `
                        relative p-6 rounded-xl border-2 transition-all duration-200 text-lg font-semibold
                        ${answered
                          ? correct
                            ? 'bg-green-50 border-green-500 text-green-700 cursor-not-allowed'
                            : selected && !correct
                            ? 'bg-red-50 border-red-500 text-red-700 cursor-not-allowed'
                            : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                          : 'bg-white border-gray-300 hover:border-braini-blue hover:shadow-md cursor-pointer text-gray-700 hover:text-braini-blue'
                        }
                      `;

                      if (selected && !answered) {
                        buttonClass = correct
                          ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-lg transform scale-105'
                          : 'bg-blue-100 border-blue-500 text-blue-700 shadow-lg transform scale-105';
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(option)}
                          disabled={answered}
                          className={buttonClass}
                        >
                          {option}
                          
                          {/* Iconos de feedback */}
                          {answered && correct && (
                            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                          )}
                          
                          {answered && selected && !correct && (
                            <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1 animate-pulse">
                              <X className="w-5 h-5 text-white" />
                            </div>
                          )}

                          {answered && !selected && correct && (
                            <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1">
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
                <h2 className="text-3xl font-black text-braini-blue-dark mb-4">
                  ¡Quiz Completado!
                </h2>
                <div className="bg-braini-blue/10 p-6 rounded-xl border border-braini-blue/20 mb-6">
                  <p className="text-2xl font-bold text-braini-blue-dark mb-2">
                    {correctAnswers} de {totalQuestions} correctas
                  </p>
                  <p className="text-lg text-gray-700">
                    {correctAnswers === totalQuestions 
                      ? "¡Perfecto! Has acertado todas las adivinanzas"
                      : correctAnswers >= totalQuestions * 0.7
                      ? "¡Muy bien! Has demostrado un gran conocimiento emocional"
                      : "¡Bien hecho! Sigue practicando para mejorar"
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Popup de éxito - Fuera del Dialog para que se muestre encima */}
      {showSuccessPopup && (
        <SuccessPopup
          onClose={() => {
            setShowSuccessPopup(false);
            setShowActivityDialog(false);
            // Al cerrar el popup, cerramos también el dialog de la actividad
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
              className="bg-braini-blue hover:bg-braini-blue-dark text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Ses2Act1;

