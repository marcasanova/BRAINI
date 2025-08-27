import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GeometricBackground from '@/components/GeometricBackground';
import Navbar from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, TrendingUp, CheckCircle, AlertCircle, Info, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();
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

  // Navegar al siguiente nivel
  const goToNextLevel = () => {
    // Aquí puedes implementar la lógica para desbloquear el siguiente nivel
    toast({
      title: "¡Test completado!",
      description: "Has desbloqueado el siguiente nivel de desarrollo emocional",
    });
    navigate('/home');
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
        <GeometricBackground />
        <Navbar />
        <div className="container mx-auto px-4 py-12 md:pl-80 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Header de resultados */}
            <div className="text-center mb-8 animate-fade-in">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                <span className="text-green-600">Resultados del Test TMMS-24</span>
              </h1>
              <p className="text-xl text-gray-600">
                Tu perfil de Inteligencia Emocional
              </p>
            </div>

            {/* Resultados principales */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                  <Brain className="w-6 h-6 text-braini-blue" />
                  Puntuaciones por Dimensión
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Atención Emocional */}
                  <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Atención Emocional</h3>
                    <p className="text-3xl font-bold text-blue-600 mb-2">{results.atencion}/40</p>
                    <div className="w-full bg-blue-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(results.atencion / 40) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Claridad Emocional */}
                  <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Claridad Emocional</h3>
                    <p className="text-3xl font-bold text-green-600 mb-2">{results.claridad}/40</p>
                    <div className="w-full bg-green-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(results.claridad / 40) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Reparación Emocional */}
                  <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Reparación Emocional</h3>
                    <p className="text-3xl font-bold text-purple-600 mb-2">{results.reparacion}/40</p>
                    <div className="w-full bg-purple-200 rounded-full h-2">
                      <div 
                        className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(results.reparacion / 40) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Puntuación total */}
                <div className="mt-8 text-center p-6 bg-gradient-to-r from-braini-blue/10 to-purple-600/10 rounded-xl border border-braini-blue/20">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Puntuación Total</h3>
                  <p className="text-5xl font-bold text-braini-blue mb-2">{results.total}/120</p>
                  <p className="text-gray-600">Tu nivel general de Inteligencia Emocional</p>
                </div>
              </CardContent>
            </Card>

            {/* Interpretación */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                  <Info className="w-5 h-5 text-blue-500" />
                  Interpretación de Resultados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">{results.interpretation}</p>
              </CardContent>
            </Card>

            {/* Recomendaciones */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Recomendaciones para Mejorar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {results.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <Button
                onClick={restartTest}
                variant="outline"
                className="border-2 border-gray-300 text-gray-700 hover:border-braini-blue hover:text-braini-blue hover:bg-white/50 font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                Repetir Test
              </Button>
              <Button
                onClick={goToNextLevel}
                className="bg-gradient-to-r from-braini-blue to-purple-600 hover:from-braini-blue-dark hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
              >
                Continuar al Siguiente Nivel
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      <Navbar />
      <div className="container mx-auto px-4 py-12 md:pl-80 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="w-20 h-20 bg-gradient-to-br from-braini-blue to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              <span className="text-braini-blue">Test TMMS-24</span>
            </h1>
            <p className="text-xl text-gray-600">
              Evaluación de Inteligencia Emocional para Padres
            </p>
          </div>

          {/* Botón de regreso */}
          <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Button
              onClick={() => navigate('/inteligencia-emocional')}
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:border-braini-blue hover:text-braini-blue hover:bg-white/50 font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Inteligencia Emocional
            </Button>
          </div>

          {/* Información del test */}
          <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                <Info className="w-5 h-5 text-blue-500" />
                Instrucciones del Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  Este test evalúa tu <strong>Inteligencia Emocional</strong> en tres dimensiones importantes:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <strong>Atención Emocional:</strong> Capacidad para identificar y expresar emociones
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <strong>Claridad Emocional:</strong> Comprensión de las propias emociones
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <strong>Reparación Emocional:</strong> Capacidad para regular y gestionar emociones
                  </li>
                </ul>
                <p className="text-gray-700">
                  <strong>Escala de respuestas:</strong> 1 = Totalmente en desacuerdo, 5 = Totalmente de acuerdo
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Progreso */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">
                Pregunta {currentQuestion + 1} de 24
              </span>
              <span className="text-sm font-medium text-gray-700">
                {answeredQuestions} respondidas
              </span>
            </div>
            <Progress value={progress} className="h-3" />
          </div>

          {/* Pregunta actual */}
          <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800 text-center">
                {TMMS_QUESTIONS[currentQuestion].question}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-center text-gray-600 mb-6">
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
                          ? 'border-braini-blue bg-braini-blue text-white shadow-lg'
                          : 'border-gray-300 text-gray-700 hover:border-braini-blue hover:text-braini-blue'
                        }
                      `}
                    >
                      {value}
                    </Button>
                  ))}
                </div>

                {/* Etiquetas de la escala */}
                <div className="flex justify-between text-sm text-gray-500 mt-4">
                  <span>Totalmente en desacuerdo</span>
                  <span>Totalmente de acuerdo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navegación */}
          <div className="flex justify-between items-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:border-braini-blue hover:text-braini-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </Button>
            
            <span className="text-gray-500">
              {currentQuestion + 1} / 24
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTMMSPadres;
