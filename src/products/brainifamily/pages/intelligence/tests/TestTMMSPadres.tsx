import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Backgrounds from '@/shared/components/Backgrounds';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Progress } from '@/shared/ui/progress';
import { Brain, Heart, TrendingUp, CheckCircle, AlertCircle, Info, ArrowLeft, Award } from 'lucide-react';

interface TMMSQuestion {
  id: number;
  question: string;
  dimension: 'atencion' | 'claridad' | 'reparacion';
  reverse: boolean; // Si la pregunta está invertida
}

interface TMMSResults {
  atencion: number;
  claridad: number;
  reparacion: number;
  total: number;
  interpretation: string;
  recommendations: string[];
}

const TMMS_QUESTIONS: TMMSQuestion[] = [
  // ATENCIÓN EMOCIONAL (8 preguntas)
  { id: 1, question: "Presto mucha atención a los sentimientos", dimension: "atencion", reverse: false },
  { id: 2, question: "Normalmente me preocupo por tener una vida emocional plena", dimension: "atencion", reverse: false },
  { id: 3, question: "Pienso que merece la pena prestar atención a mis emociones y estado de ánimo", dimension: "atencion", reverse: false },
  { id: 4, question: "Tengo sentimientos que no comprendo", dimension: "atencion", reverse: true },
  { id: 5, question: "Presto atención a mis sentimientos", dimension: "atencion", reverse: false },
  { id: 6, question: "Pienso en mi estado de ánimo constantemente", dimension: "atencion", reverse: false },
  { id: 7, question: "A menudo pienso en mis sentimientos", dimension: "atencion", reverse: false },
  { id: 8, question: "Presto mucha atención a cómo me siento", dimension: "atencion", reverse: false },

  // CLARIDAD EMOCIONAL (8 preguntas)
  { id: 9, question: "Tengo claros mis sentimientos", dimension: "claridad", reverse: false },
  { id: 10, question: "Con frecuencia puedo definir mis sentimientos", dimension: "claridad", reverse: false },
  { id: 11, question: "Casi siempre sé cómo me siento", dimension: "claridad", reverse: false },
  { id: 12, question: "Normalmente sé si estoy contento o no", dimension: "claridad", reverse: false },
  { id: 13, question: "A veces puedo decir cuáles son mis emociones", dimension: "claridad", reverse: true },
  { id: 14, question: "Puedo llegar a confundir un sentimiento con otro", dimension: "claridad", reverse: true },
  { id: 15, question: "A veces no sé qué estoy sintiendo", dimension: "claridad", reverse: true },
  { id: 16, question: "Tengo dificultad para hacer entender a los demás mis sentimientos", dimension: "claridad", reverse: true },

  // REPARACIÓN EMOCIONAL (8 preguntas)
  { id: 17, question: "Aunque me sienta mal, procuro pensar en cosas agradables", dimension: "reparacion", reverse: false },
  { id: 18, question: "Aunque me sienta mal, trato de pensar en las cosas más agradables que me están pasando", dimension: "reparacion", reverse: false },
  { id: 19, question: "Cuando estoy triste, pienso en todos los placeres de la vida", dimension: "reparacion", reverse: false },
  { id: 20, question: "Intento tener pensamientos positivos aunque me sienta mal", dimension: "reparacion", reverse: false },
  { id: 21, question: "Si doy demasiadas vueltas a las cosas, complicándolas, trato de calmarme", dimension: "reparacion", reverse: false },
  { id: 22, question: "Me doy tiempo a mí mismo para recuperarme de las emociones negativas", dimension: "reparacion", reverse: false },
  { id: 23, question: "Me esfuerzo por mantener un buen estado de ánimo", dimension: "reparacion", reverse: false },
  { id: 24, question: "Tengo mucha energía cuando me siento feliz", dimension: "reparacion", reverse: false }
];

const TestTMMSPadres = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(24).fill(0));
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<TMMSResults | null>(null);

  // Calcular progreso del test
  const progress = ((currentQuestion + 1) / 24) * 100;
  const answeredQuestions = answers.filter(answer => answer > 0).length;

  // Manejar respuesta del usuario
  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);

    // Avanzar a la siguiente pregunta o mostrar resultados
    if (currentQuestion < 23) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
      setShowResults(true);
    }
  };

  // Calcular resultados del test
  const calculateResults = (finalAnswers: number[]) => {
    let atencion = 0;
    let claridad = 0;
    let reparacion = 0;

    TMMS_QUESTIONS.forEach((question, index) => {
      let score = finalAnswers[index];
      
      // Aplicar puntuación invertida si es necesario
      if (question.reverse) {
        score = 6 - score;
      }

      switch (question.dimension) {
        case 'atencion':
          atencion += score;
          break;
        case 'claridad':
          claridad += score;
          break;
        case 'reparacion':
          reparacion += score;
          break;
      }
    });

    const total = atencion + claridad + reparacion;

    // Interpretación de resultados
    const interpretation = getInterpretation(atencion, claridad, reparacion);
    const recommendations = getRecommendations(atencion, claridad, reparacion);

    setResults({
      atencion,
      claridad,
      reparacion,
      total,
      interpretation,
      recommendations
    });
  };

  // Interpretar los resultados
  const getInterpretation = (atencion: number, claridad: number, reparacion: number): string => {
    let interpretation = "";

    // Interpretación por dimensiones
    if (atencion >= 30) interpretation += "Excelente atención a las emociones. ";
    else if (atencion >= 24) interpretation += "Buena atención a las emociones. ";
    else interpretation += "Puedes mejorar tu atención a las emociones. ";

    if (claridad >= 30) interpretation += "Excelente claridad emocional. ";
    else if (claridad >= 24) interpretation += "Buena claridad emocional. ";
    else interpretation += "Puedes mejorar tu claridad emocional. ";

    if (reparacion >= 30) interpretation += "Excelente capacidad de reparación emocional. ";
    else if (reparacion >= 24) interpretation += "Buena capacidad de reparación emocional. ";
    else interpretation += "Puedes mejorar tu capacidad de reparación emocional. ";

    return interpretation;
  };

  // Obtener recomendaciones
  const getRecommendations = (atencion: number, claridad: number, reparacion: number): string[] => {
    const recommendations: string[] = [];

    if (atencion < 24) {
      recommendations.push("Practica la atención plena (mindfulness) para ser más consciente de tus emociones");
      recommendations.push("Lleva un diario emocional para registrar cómo te sientes cada día");
    }

    if (claridad < 24) {
      recommendations.push("Toma tiempo para identificar y nombrar tus emociones específicas");
      recommendations.push("Practica la autoobservación sin juzgar tus sentimientos");
    }

    if (reparacion < 24) {
      recommendations.push("Desarrolla estrategias de regulación emocional como la respiración profunda");
      recommendations.push("Busca actividades que te ayuden a cambiar tu estado de ánimo");
    }

    if (recommendations.length === 0) {
      recommendations.push("¡Excelente! Mantén estas habilidades emocionales");
      recommendations.push("Comparte tus estrategias con otros para ayudarles a crecer");
    }

    return recommendations;
  };

  // Reiniciar test
  const restartTest = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(24).fill(0));
    setShowResults(false);
    setResults(null);
  };

  // Volver a la pantalla de tests
  const goBackToTests = () => {
    navigate('/brainifamily/inteligencia-emocional');
  };

  if (showResults && results) {
    return (
      <Backgrounds 
        wrapWithCard={true}
        enableInternalScroll={true}
        customColor="#f8cd50"
        showCircles={true}
      >
        <div className="h-full flex flex-col relative z-10">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 flex-1 flex flex-col min-h-0">
            <div className="max-w-4xl mx-auto w-full">
            {/* Header de resultados */}
            <div className="mb-4 md:mb-6 animate-fade-in shrink-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2" style={{ fontWeight: 900 }}>
                Resultados del Test TMMS-24
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium">
                Tu perfil de Inteligencia Emocional
              </p>
            </div>

            {/* Resultados principales */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-braini-yellow" />
                  <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">
                    Puntuaciones por Dimensión
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Atención Emocional */}
                  <div className="text-center p-6 bg-gray-100 rounded-xl border border-gray-200">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Atención Emocional</h3>
                    <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{results.atencion}/40</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-braini-yellow h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(results.atencion / 40) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Claridad Emocional */}
                  <div className="text-center p-6 bg-gray-100 rounded-xl border border-gray-200">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Claridad Emocional</h3>
                    <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{results.claridad}/40</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-braini-yellow h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(results.claridad / 40) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Reparación Emocional */}
                  <div className="text-center p-6 bg-gray-100 rounded-xl border border-gray-200">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">Reparación Emocional</h3>
                    <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{results.reparacion}/40</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-braini-yellow h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(results.reparacion / 40) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Puntuación total */}
                <div className="mt-8 text-center p-6 bg-gray-100 rounded-xl border border-gray-200">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Puntuación Total</h3>
                  <p className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{results.total}/120</p>
                  <p className="text-sm md:text-base text-gray-600">Tu nivel general de Inteligencia Emocional</p>
                </div>
              </CardContent>
            </Card>

            {/* Interpretación */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-braini-yellow" />
                  <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">
                    Interpretación de Resultados
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">{results.interpretation}</p>
              </CardContent>
            </Card>

            {/* Recomendaciones */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-braini-yellow" />
                  <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">
                    Recomendaciones para Mejorar
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                  <ul className="space-y-3">
                    {results.recommendations.map((recommendation, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 shrink-0"></div>
                        <span className="text-gray-600 text-sm md:text-base">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in pb-20 md:pb-4" style={{ animationDelay: '0.4s' }}>
              <Button
                onClick={restartTest}
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:border-braini-yellow hover:text-braini-yellow hover:bg-white/50 font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
              >
                Repetir Test
              </Button>
              <Button
                onClick={goBackToTests}
                className="bg-braini-yellow hover:bg-braini-yellow-dark text-white font-bold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
              >
                Volver a Tests
              </Button>
            </div>
          </div>
        </div>
      </div>
      </Backgrounds>
    );
  }

  return (
    <Backgrounds 
      wrapWithCard={true}
      enableInternalScroll={true}
      customColor="#f8cd50"
      showCircles={true}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 flex-1 flex flex-col min-h-0">
          <div className="max-w-4xl mx-auto w-full">
          {/* Header */}
          <div className="mb-4 md:mb-6 animate-fade-in shrink-0">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2" style={{ fontWeight: 900 }}>
              Test TMMS-24 para Padres
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium">
              Evaluación completa de tu inteligencia emocional
            </p>
          </div>

          {/* Botón de regreso */}
          <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Button
              onClick={() => navigate('/brainifamily/inteligencia-emocional')}
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:border-braini-yellow hover:text-braini-yellow hover:bg-white/50 font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Inteligencia Emocional
            </Button>
          </div>

          {/* Información del test */}
          <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Award className="w-5 h-5 text-braini-yellow" />
                <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">
                  Instrucciones del Test
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-600 text-sm md:text-base">
                  Este test evalúa tu <strong>Inteligencia Emocional</strong> en tres dimensiones importantes:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                  <ul className="space-y-2 text-sm md:text-base text-gray-600">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <strong>Atención Emocional:</strong> Capacidad para identificar y expresar emociones
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <strong>Claridad Emocional:</strong> Comprensión de las propias emociones
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <strong>Reparación Emocional:</strong> Capacidad para regular y gestionar emociones
                    </li>
                  </ul>
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  <strong>Escala de respuestas:</strong> 1 = Totalmente en desacuerdo, 5 = Totalmente de acuerdo
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Progreso */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">
                Pregunta {currentQuestion + 1} de 24
              </span>
              <span className="text-sm font-medium text-gray-600">
                {answeredQuestions} respondidas
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Pregunta actual */}
          <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">
                {TMMS_QUESTIONS[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-gray-600 text-sm md:text-base mb-6">
                  ¿Qué tan de acuerdo estás con esta afirmación?
                </p>
                
                {/* Opciones de respuesta */}
                <div className="grid grid-cols-5 gap-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Button
                      key={value}
                      onClick={() => handleAnswer(value)}
                      variant="outline"
                      className={`
                        h-16 border-2 font-semibold text-lg transition-all duration-200
                        ${answers[currentQuestion] === value
                          ? 'border-braini-yellow bg-braini-yellow text-white shadow-lg'
                          : 'border-gray-300 text-gray-700 hover:border-braini-yellow hover:text-braini-yellow'
                        }
                      `}
                    >
                      {value}
                    </Button>
                  ))}
                </div>

                {/* Etiquetas de la escala */}
                <div className="flex justify-between text-sm text-gray-600 mt-4">
                  <span>Totalmente en desacuerdo</span>
                  <span>Totalmente de acuerdo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navegación */}
          <div className="flex justify-between items-center animate-fade-in pb-20 md:pb-4" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:border-braini-yellow hover:text-braini-yellow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Anterior
            </Button>
            
            <span className="text-gray-600 text-sm md:text-base">
              {currentQuestion + 1} / 24
            </span>
          </div>
          </div>
        </div>
      </div>
      </Backgrounds>
  );
};

export default TestTMMSPadres;
