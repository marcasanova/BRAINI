import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Home, ArrowRight, ArrowLeft, Lightbulb, Sparkles, CheckCircle2 } from 'lucide-react';

// Rutas de assets públicos
const logoBraini = '/logo/logoBraini.png';

// Tipos
type Step = 'intro' | 'registration' | 'questionnaire' | 'results';
type AnswerValue = 'A' | 'B' | 'C' | 'D';

interface RegistrationData {
  evaluatorName: string;
  role: string;
  centerName: string;
  province: string;
  city: string;
  email: string;
  phone: string;
}

interface Answers {
  [key: number]: AnswerValue;
}

interface LevelContent {
  description: string;
  characteristics: string[];
  challenges: string[];
  geniusSupport: {
    title: string;
    points: string[];
  };
  talentzSupport: {
    title: string;
    points: string[];
  };
  conclusion: string;
}

interface TestResult {
  totalPoints: number;
  level: {
    id: 1 | 2 | 3;
    name: string;
    range: string;
    percentage: number;
  };
  content: LevelContent;
}

// Contenido de las preguntas
const questions = [
  {
    id: 1,
    title: 'NEUROARQUITECTURA',
    description: 'El centro ha transformado espacios (aulas, patios, pasillos) en entornos de aprendizaje vivencial y competencial, diseñados según criterios de neuroarquitectura.'
  },
  {
    id: 2,
    title: 'NEUROEDUCACIÓN',
    description: 'Aplicamos principios de neuroeducación en las decisiones sobre metodologías, tiempos, espacios, movimiento, juego y organización del aprendizaje.'
  },
  {
    id: 3,
    title: 'NEUROBIENESTAR EMOCIONAL',
    description: 'Existe un programa o proyecto con recursos para promover el neurobienestar emocional del alumnado, profesorado y familias (apoyo emocional, gestión de conflictos, prevención del estrés, espacios y tiempos de autorregulación emocional).'
  },
  {
    id: 4,
    title: 'METODOLOGÍAS ACTIVAS E INCLUSIVAS',
    description: 'Diseñamos y aplicamos de forma habitual situaciones de aprendizaje activas e inclusivas (aprendizaje competencial, proyectos globalizados, entornos de aprendizaje en Primaria, cajas de investigación, talleres, experiencias de aprendizaje-servicio).'
  },
  {
    id: 5,
    title: 'EVALUACIÓN COMPETENCIAL',
    description: 'Evaluamos procesos de aprendizaje competenciales mediante la observación y la documentación pedagógica, lo que nos permite elaborar informes cualitativos de alta calidad pedagógica.'
  },
  {
    id: 6,
    title: 'INCLUSIÓN Y DUA',
    description: 'Diseñamos las propuestas de aula desde el Diseño Universal para el Aprendizaje (DUA), con actividades multinivel que atienden a la diversidad del alumnado y garantizar el aprendizaje.'
  },
  {
    id: 7,
    title: 'PARTICIPACIÓN FAMILIA Y COMUNIDAD',
    description: 'Las familias, instituciones, organizaciones y el entorno participan activamente en la vida del centro y en proyectos significativos.'
  },
  {
    id: 8,
    title: 'INNOVACIÓN E INTELIGENCIA ARTIFICIAL',
    description: 'El centro empieza a integrar la inteligencia artificial de forma pedagógica para ayudar a los docentes a programar, evaluar y personalizar el aprendizaje.'
  },
  {
    id: 9,
    title: 'MARKETING EDUCATIVO',
    description: 'El centro comunica con claridad su proyecto pedagógico, su innovación y su identidad a través de la web, redes sociales, jornadas de puertas abiertas, dosieres y campañas que favorecen la captación y fidelización del alumnado y las familias.'
  },
  {
    id: 10,
    title: 'MARKETING EDUCATIVO E INTELIGENCIA ARTIFICIAL',
    description: 'El centro empieza a utilizar herramientas digitales e inteligencia artificial (analítica de datos, creación de contenidos, segmentación de mensajes, automatización de campañas...) para mejorar su comunicación, visibilidad y posicionamiento como escuela innovadora.'
  }
];

// Opciones de rol
const roles = [
  'Equipo directivo',
  'Docente de Infantil',
  'Docente de Primaria',
  'Especialista (Música, Inglés, Ed. Física)',
  'Orientación / EOE (PT, AL, Orientador/a)',
  'Marketing educativo',
  'Otro profesional del centro'
];

// Contenido por nivel
const levelContents: Record<1 | 2 | 3, LevelContent> = {
  1: {
    description: 'Vuestro centro se encuentra en un punto **muy inicial** de transformación hacia una escuela competencial, neuroeducativa y visible a nivel de marketing educativo.',
    characteristics: [
      'Predomina todavía una organización **tradicional** de aulas, tiempos y metodologías.',
      'Los espacios (aulas, pasillos, patios) aún no se usan plenamente como **espacios de aprendizaje vivenciales y competenciales**.',
      'La **neuroeducación**, el **neurobienestar emocional** y el DUA no son todavía criterios sistemáticos a la hora de diseñar propuestas.',
      'La evaluación sigue centrada más en notas que en **procesos competenciales**.',
      'La comunicación del centro (web, redes, campañas...) no refleja todo el potencial que podría tener vuestro proyecto.'
    ],
    challenges: [
      'Iniciar un plan de formación en **innovación educativa** que os ayude a transformar espacios, metodologías y evaluación.',
      'Incorporar la **neuroeducación** y el **neurobienestar emocional** como eje de centro.',
      'Dar los primeros pasos para diseñar una **estrategia básica de marketing educativo**, que haga visible vuestra esencia y os ayude a captar y fidelizar familias.'
    ],
    geniusSupport: {
      title: '**Genius Mind School** puede ayudaros a diseñar un plan de **innovación pedagógica** adaptado a vuestro punto de partida, trabajando:',
      points: [
        'Neuroarquitectura, espacios y microespacios de aprendizaje.',
        'Metodologías activas e inclusivas.',
        'Evaluación competencial, DUA y neurobienestar emocional.'
      ]
    },
    talentzSupport: {
      title: '**Talentz** puede acompañaros en construir una **base sólida de marketing educativo**:',
      points: [
        'Clarificar vuestro **relato de centro** (proyecto, valores, propuesta diferencial).',
        'Mejorar vuestra presencia en web, redes y campañas, alineándola con la transformación pedagógica.'
      ]
    },
    conclusion: 'La combinación de **innovación educativa (Genius)** + **marketing educativo (Talentz)** os permite avanzar hacia una escuela del siglo XXI que no solo innova por dentro, sino que también se hace visible por fuera.'
  },
  2: {
    description: 'Vuestro centro se encuentra en un punto **interesante**: habéis iniciado cambios importantes y tenéis experiencias innovadoras, pero aún no habéis consolidado un modelo de centro plenamente innovador.',
    characteristics: [
      'Coexisten proyectos, entornos y áreas innovadoras y competenciales con prácticas más tradicionales.',
      'Se habla de **neuroeducación, neurobienestar, inclusión y DUA**, pero estos conceptos no guían de forma consistente todas las decisiones.',
      'Se intenta la **evaluación competencial**, pero hay margen para una mejor sistematización y documentación.',
      'El **marketing educativo** se traduce en acciones puntuales (redes, eventos, carteles), pero falta una estrategia clara y continua.',
      'La **inteligencia artificial (IA)** está en el radar, pero aún no se integra de forma planificada.'
    ],
    challenges: [
      'Pasar de "hacer cosas innovadoras" a tener un **modelo de escuela innovadora** compartido por todo el claustro.',
      '**Sistematizar la evaluación competencial y el DUA** como estructura básica de la enseñanza.',
      'Diseñar una **estrategia de comunicación y marketing educativo** alineada con la identidad y el proyecto pedagógico del centro.',
      'Empezar a usar la **IA como aliada** para programar, evaluar, personalizar y mejorar la comunicación.'
    ],
    geniusSupport: {
      title: '**Genius Mind School** puede:',
      points: [
        'Diseñar y acompañar un **plan de innovación de centro** (no solo acciones aisladas).',
        'Profundizar en **metodologías activas, neuroeducación, neurobienestar y evaluación competencial**.',
        'Integrar la **IA en la práctica docente** (programación, rúbricas, seguimiento competencial).'
      ]
    },
    talentzSupport: {
      title: '**Talentz** puede:',
      points: [
        'Construir una **estrategia de marketing educativo** coherente con vuestro proyecto.',
        'Diseñar **campañas de comunicación, captación y fidelización** basadas en datos y apoyadas en IA.',
        'Potenciar la **marca de centro innovador** hacia familias y entorno.'
      ]
    },
    conclusion: 'Este es un momento ideal para que Genius + Talentz os acompañen en el salto de un centro que "innova en algunas cosas" a un **centro referente en innovación pedagógica y marketing educativo**.'
  },
  3: {
    description: 'Vuestro centro ya muestra un alto nivel de innovación y una clara orientación hacia la escuela del siglo XXI.',
    characteristics: [
      'La **neuroarquitectura** y los **espacios vivenciales** son parte de vuestra realidad cotidiana.',
      'La **neuroeducación**, el **neurobienestar**, la **inclusión** y el **DUA** están muy presentes en vuestra forma de entender la escuela.',
      'Trabajáis con **metodologías activas e inclusivas** de manera habitual.',
      'Tenéis un avance significativo en **evaluación competencial** y **documentación pedagógica**.',
      'Ya cuidáis vuestra **comunicación y marketing educativo**, y empezáis a explorar la **IA** como herramienta de apoyo.'
    ],
    challenges: [
      'Consolidar vuestro modelo mediante un **plan estratégico de innovación** a medio plazo.',
      'Afinar aún más la **evaluación competencial**, la documentación y la comunicación de los logros del alumnado.',
      'Convertir vuestra experiencia en un **relato de centro potente**, reconocible y atractivo para las familias y el entorno.',
      'Profundizar en el uso de **IA aplicada a la escuela**, tanto a nivel pedagógico como de marketing educativo.'
    ],
    geniusSupport: {
      title: '**Genius Mind School** puede:',
      points: [
        'Acompañaros en la fase de **refinamiento y liderazgo pedagógico**: observación entre iguales, proyectos avanzados, redes de centros, etc.',
        'Colaborar en el diseño de **microespacios, ámbitos y experiencias de alto impacto**, así como en modelos de **evaluación competencial** ejemplares.',
        'Trabajar con vuestro equipo en el **uso avanzado de IA aplicada a la innovación educativa**.'
      ]
    },
    talentzSupport: {
      title: '**Talentz** puede:',
      points: [
        'Ayudaros a posicionaros como **centro referente**, con una estrategia de **marketing educativo** alineada con vuestro nivel innovador.',
        'Diseñar campañas de **branding, captación y fidelización** que comuniquen vuestra propuesta de valor de forma clara, atractiva y diferencial.',
        'Aprovechar la **IA y la analítica de datos** para optimizar vuestra comunicación y presencia en el entorno.'
      ]
    },
    conclusion: 'Si ya sois un centro innovador, la alianza con Genius + Talentz puede ayudaros a consolidar vuestra identidad pedagógica y a proyectarla hacia fuera, convirtiéndoos en referente de innovación educativa y marketing educativo en vuestra zona.'
  }
};

// Sistema de puntuación
const SCORING: Record<AnswerValue, number> = {
  'A': 0,
  'B': 1,
  'C': 2,
  'D': 3
};

const TestGenius = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estados
  const [step, setStep] = useState<Step>('intro');
  const [isLoaded, setIsLoaded] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    evaluatorName: '',
    role: '',
    centerName: '',
    province: '',
    city: '',
    email: '',
    phone: ''
  });
  const [answers, setAnswers] = useState<Answers>({});
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Calcular puntuación y nivel
  const calculateResult = (answers: Answers): TestResult => {
    const totalPoints = Object.values(answers).reduce(
      (sum, answer) => sum + SCORING[answer],
      0
    );

    let level: { id: 1 | 2 | 3; name: string; range: string; percentage: number };
    
    if (totalPoints >= 21) {
      level = {
        id: 3,
        name: 'Innovación avanzada',
        range: '21-30 puntos',
        percentage: Math.round((totalPoints / 30) * 100)
      };
    } else if (totalPoints >= 11) {
      level = {
        id: 2,
        name: 'Innovación en desarrollo',
        range: '11-20 puntos',
        percentage: Math.round((totalPoints / 30) * 100)
      };
    } else {
      level = {
        id: 1,
        name: 'Innovación incipiente',
        range: '0-10 puntos',
        percentage: Math.round((totalPoints / 30) * 100)
      };
    }

    return {
      totalPoints,
      level,
      content: levelContents[level.id]
    };
  };

  // Validar formulario de registro
  const validateRegistration = (): boolean => {
    if (!registrationData.evaluatorName.trim()) {
      toast({
        title: '⚠️ Campo requerido',
        description: 'Por favor, introduce el nombre y apellidos del evaluador/a.',
        variant: 'destructive'
      });
      return false;
    }
    if (!registrationData.role) {
      toast({
        title: '⚠️ Campo requerido',
        description: 'Por favor, selecciona un rol.',
        variant: 'destructive'
      });
      return false;
    }
    if (!registrationData.centerName.trim()) {
      toast({
        title: '⚠️ Campo requerido',
        description: 'Por favor, introduce el nombre del centro.',
        variant: 'destructive'
      });
      return false;
    }
    if (!registrationData.province.trim()) {
      toast({
        title: '⚠️ Campo requerido',
        description: 'Por favor, introduce la provincia.',
        variant: 'destructive'
      });
      return false;
    }
    if (!registrationData.city.trim()) {
      toast({
        title: '⚠️ Campo requerido',
        description: 'Por favor, introduce la población.',
        variant: 'destructive'
      });
      return false;
    }
    if (!registrationData.email.trim()) {
      toast({
        title: '⚠️ Campo requerido',
        description: 'Por favor, introduce el email.',
        variant: 'destructive'
      });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registrationData.email)) {
      toast({
        title: '❌ Email inválido',
        description: 'Por favor, introduce una dirección de email válida.',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };

  // Validar que todas las preguntas estén respondidas
  const validateQuestionnaire = (): boolean => {
    if (Object.keys(answers).length !== 10) {
      toast({
        title: '⚠️ Preguntas incompletas',
        description: 'Por favor, responde todas las preguntas antes de finalizar el cuestionario.',
        variant: 'destructive'
      });
      return false;
    }
    return true;
  };

  // Guardar en Supabase
  const saveToSupabase = async (result: TestResult) => {
    try {
      const { data, error } = await supabase
        .from('test_genius_evaluations')
        .insert([
          {
            evaluator_name: registrationData.evaluatorName,
            evaluator_role: registrationData.role,
            center_name: registrationData.centerName,
            province: registrationData.province,
            city: registrationData.city,
            email: registrationData.email,
            phone: registrationData.phone || null,
            answers: answers,
            total_points: result.totalPoints,
            level: result.level.id
          }
        ]);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error guardando en Supabase:', error);
      throw error;
    }
  };

  // Handlers
  const handleStart = () => {
    setStep('registration');
  };

  const handleRegistrationNext = () => {
    if (validateRegistration()) {
      setStep('questionnaire');
    }
  };

  const handleAnswerChange = (questionId: number, value: AnswerValue) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleQuestionnaireComplete = async () => {
    if (!validateQuestionnaire()) return;

    setIsSubmitting(true);
    try {
      const result = calculateResult(answers);
      setTestResult(result);
      await saveToSupabase(result);
      setStep('results');
    } catch (error) {
      toast({
        title: '❌ Error al guardar los resultados',
        description: 'No hemos podido guardar los resultados del cuestionario. Por favor, verifica tu conexión e inténtalo de nuevo.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoHome = () => {
    navigate('/');
  };

  // Renderizado de pasos
  const renderIntro = () => (
    <div className="w-full max-w-4xl mx-auto">
      {/* Título principal fuera de la card */}
      <div className="text-center mb-6 sm:mb-8">
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-3 sm:mb-4 px-2" style={{ fontWeight: 900 }}>
          ¿Sois un centro TOP?
        </h1>
        <h2 className="text-white text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3 px-4" style={{ fontWeight: 400 }}>
          Mide el nivel de <span style={{ fontWeight: 700 }}>innovación</span> y <span style={{ fontWeight: 700 }}>marketing educativo</span> de tu escuela
        </h2>
      </div>

      {/* Card principal */}
      <div 
        className="bg-white rounded-xl p-6 sm:p-8 lg:p-10 shadow-2xl relative z-10"
        style={{
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="text-center">

          {/* Descripción principal */}
          <p className="text-gray-700 text-lg sm:text-xl lg:text-2xl mb-2 px-4" style={{ fontWeight: 400 }}>
            ¡Con solo <span className="font-bold" style={{ fontWeight: 700, color: '#7ea4df' }}>10 preguntas</span> recibe un informe para mejorar tu posición!
          </p>
          
          <p className="text-gray-600 text-base sm:text-lg mb-8 px-4" style={{ fontWeight: 400 }}>
            Descubre el <span style={{ fontWeight: 700 }}>nivel de innovación</span> de tu centro educativo y recibe <span style={{ fontWeight: 700 }}>recomendaciones personalizadas</span>
          </p>

          {/* Botón mejorado */}
          <Button
            onClick={handleStart}
            className="w-full sm:w-auto text-white px-10 sm:px-12 py-6 sm:py-7 text-lg sm:text-xl font-bold transition-all duration-200 transform md:hover:scale-105 md:hover:opacity-90 shadow-lg"
            style={{
              background: '#7ea4df',
              border: 'none',
              boxShadow: '0 10px 20px -5px rgba(126, 164, 223, 0.4)'
            }}
          >
            <span className="flex items-center justify-center">
              Comenzar Test
              <ArrowRight className="ml-3 h-6 w-6" />
            </span>
          </Button>

          {/* Texto adicional */}
          <p className="text-gray-500 text-xs sm:text-sm mt-6" style={{ fontWeight: 400 }}>
            Sin compromiso • Resultados inmediatos • Informe personalizado
          </p>
        </div>
      </div>
    </div>
  );

  const renderRegistration = () => (
    <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl relative z-10 max-w-2xl mx-auto w-full">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6" style={{ fontWeight: 700 }}>
        Información para registrarse
      </h2>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="evaluatorName" className="text-gray-700 font-semibold">
            Nombre y apellidos del evaluador/a:
          </Label>
          <Input
            id="evaluatorName"
            value={registrationData.evaluatorName}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, evaluatorName: e.target.value }))}
            className="mt-1"
            placeholder="Nombre completo"
          />
        </div>

        <div>
          <Label htmlFor="role" className="text-gray-700 font-semibold">
            Rol (desplegable):
          </Label>
          <Select value={registrationData.role} onValueChange={(value) => setRegistrationData(prev => ({ ...prev, role: value }))}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="centerName" className="text-gray-700 font-semibold">
            Nombre del centro:
          </Label>
          <Input
            id="centerName"
            value={registrationData.centerName}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, centerName: e.target.value }))}
            className="mt-1"
            placeholder="Nombre del centro educativo"
          />
        </div>

        <div>
          <Label htmlFor="province" className="text-gray-700 font-semibold">
            Provincia:
          </Label>
          <Input
            id="province"
            value={registrationData.province}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, province: e.target.value }))}
            className="mt-1"
            placeholder="Provincia"
          />
        </div>

        <div>
          <Label htmlFor="city" className="text-gray-700 font-semibold">
            Población:
          </Label>
          <Input
            id="city"
            value={registrationData.city}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, city: e.target.value }))}
            className="mt-1"
            placeholder="Ciudad o población"
          />
        </div>

        <div>
          <Label htmlFor="email" className="text-gray-700 font-semibold">
            Mail:
          </Label>
          <Input
            id="email"
            type="email"
            value={registrationData.email}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, email: e.target.value }))}
            className="mt-1"
            placeholder="tu@email.com"
          />
        </div>

        <div>
          <Label htmlFor="phone" className="text-gray-700 font-semibold">
            Tf:
          </Label>
          <Input
            id="phone"
            type="tel"
            value={registrationData.phone}
            onChange={(e) => setRegistrationData(prev => ({ ...prev, phone: e.target.value }))}
            className="mt-1"
            placeholder="Teléfono (opcional)"
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button
          onClick={() => setStep('intro')}
          variant="outline"
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Atrás
        </Button>
        <Button
          onClick={handleRegistrationNext}
          className="flex-1 text-white"
          style={{
            background: '#7ea4df',
            border: 'none'
          }}
        >
          Continuar
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderQuestionnaire = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const answeredCount = Object.keys(answers).length;

    return (
      <div className="w-full max-w-4xl mx-auto">
        {/* Título fuera de la card */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 px-2" style={{ fontWeight: 900 }}>
            ¿Sois un centro TOP?
          </h1>
        </div>

        {/* Card del cuestionario */}
        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl relative z-10 w-full">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800" style={{ fontWeight: 700 }}>
                CUESTIONARIO
              </h2>
              <span className="text-sm text-gray-600">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            {answeredCount} de {questions.length} preguntas respondidas
          </p>
        </div>

        {currentQuestionIndex === 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-gray-700 mb-2" style={{ fontWeight: 400 }}>
              <strong>Instrucciones:</strong>
            </p>
            <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
              <li>Reflexiona y responde.</li>
              <li>Marcar una sola opción.</li>
              <li>Ser lo más sinceros posible: el cuestionario no es para 'quedar bien', sino para detectar oportunidades de mejora.</li>
            </ul>
            <div className="mt-4 p-3 bg-white rounded border">
              <p className="text-xs font-semibold text-gray-700 mb-2">Escala de respuesta:</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <div><strong>A</strong> = No se hace (0 puntos)</div>
                <div><strong>B</strong> = Empezando (1 punto)</div>
                <div><strong>C</strong> = Integrado (2 puntos)</div>
                <div><strong>D</strong> = Lo hacemos (3 puntos)</div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3" style={{ fontWeight: 700 }}>
            {currentQuestion.id}. {currentQuestion.title}
          </h3>
          <p className="text-gray-600 mb-4" style={{ fontWeight: 400 }}>
            {currentQuestion.description}
          </p>

          <RadioGroup
            value={answers[currentQuestion.id] || ''}
            onValueChange={(value) => handleAnswerChange(currentQuestion.id, value as AnswerValue)}
            className="space-y-3"
          >
            <div className="flex items-start space-x-3 p-3 rounded-lg border-2 hover:bg-gray-50 transition-colors"
                 style={{ borderColor: answers[currentQuestion.id] === 'A' ? '#7ea4df' : '#e5e7eb' }}>
              <RadioGroupItem value="A" id={`q${currentQuestion.id}-A`} className="mt-1" />
              <label htmlFor={`q${currentQuestion.id}-A`} className="flex-1 cursor-pointer">
                <div className="font-semibold text-gray-800">A = No se hace</div>
                <div className="text-sm text-gray-600">(prácticamente no se hace / es algo puntual y aislado)</div>
              </label>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg border-2 hover:bg-gray-50 transition-colors"
                 style={{ borderColor: answers[currentQuestion.id] === 'B' ? '#7ea4df' : '#e5e7eb' }}>
              <RadioGroupItem value="B" id={`q${currentQuestion.id}-B`} className="mt-1" />
              <label htmlFor={`q${currentQuestion.id}-B`} className="flex-1 cursor-pointer">
                <div className="font-semibold text-gray-800">B = Empezando</div>
                <div className="text-sm text-gray-600">(hay algunas experiencias, pero no es estable ni central)</div>
              </label>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg border-2 hover:bg-gray-50 transition-colors"
                 style={{ borderColor: answers[currentQuestion.id] === 'C' ? '#7ea4df' : '#e5e7eb' }}>
              <RadioGroupItem value="C" id={`q${currentQuestion.id}-C`} className="mt-1" />
              <label htmlFor={`q${currentQuestion.id}-C`} className="flex-1 cursor-pointer">
                <div className="font-semibold text-gray-800">C = Integrado</div>
                <div className="text-sm text-gray-600">(es una práctica relativamente habitual, aunque con margen de mejora)</div>
              </label>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg border-2 hover:bg-gray-50 transition-colors"
                 style={{ borderColor: answers[currentQuestion.id] === 'D' ? '#7ea4df' : '#e5e7eb' }}>
              <RadioGroupItem value="D" id={`q${currentQuestion.id}-D`} className="mt-1" />
              <label htmlFor={`q${currentQuestion.id}-D`} className="flex-1 cursor-pointer">
                <div className="font-semibold text-gray-800">D = Lo hacemos</div>
                <div className="text-sm text-gray-600">(está consolidado, sistematizado y compartido por todo el claustro)</div>
              </label>
            </div>
          </RadioGroup>
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => {
              if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(prev => prev - 1);
              } else {
                setStep('registration');
              }
            }}
            variant="outline"
            className="flex-1"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {currentQuestionIndex > 0 ? 'Anterior' : 'Atrás'}
          </Button>
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              disabled={!answers[currentQuestion.id]}
              className="flex-1 text-white"
              style={{
                background: '#7ea4df',
                border: 'none'
              }}
            >
              Siguiente
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleQuestionnaireComplete}
              disabled={isSubmitting || !answers[currentQuestion.id]}
              className="flex-1 text-white"
              style={{
                background: '#7ea4df',
                border: 'none'
              }}
            >
              {isSubmitting ? 'Finalizando...' : 'Finalizar Test'}
              <CheckCircle2 className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!testResult) return null;

    const { totalPoints, level, content } = testResult;

    return (
      <div className="w-full max-w-4xl mx-auto">
        {/* Resultado fuera de la card */}
        <div className="text-center mb-6">
          <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-3 px-2" style={{ fontWeight: 900 }}>
            Resultado: {totalPoints} / 30
          </p>
        </div>

        {/* Card de resultados */}
        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-2xl relative z-10 w-full">
          <div className="mb-6">
            <p className="text-xl sm:text-2xl font-bold text-gray-800" style={{ fontWeight: 700 }}>
              Nivel de innovación competencial y neuroeducativa: <span style={{ color: '#7ea4df' }}>{level.name}</span>
            </p>
          </div>

        <div className="space-y-6">
          <div>
            <p className="text-gray-700 leading-relaxed" style={{ fontWeight: 400 }}>
              {content.description.split('**').map((part, i) => 
                i % 2 === 1 ? <strong key={i}>{part}</strong> : part
              )}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-3" style={{ fontWeight: 700 }}>
              Esto suele significar que:
            </h3>
            <ul className="space-y-2">
              {content.characteristics.map((char, index) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <span className="mr-2">•</span>
                  <span>{char.split('**').map((part, i) => 
                    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                  )}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-start">
              <Lightbulb className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontWeight: 700 }}>
                  {level.id === 1 ? 'Oportunidades clave de mejora:' : level.id === 2 ? 'Retos clave para el siguiente nivel:' : 'Retos para convertirse en centro referente:'}
                </h3>
                <ul className="space-y-2">
                  {content.challenges.map((challenge, index) => (
                    <li key={index} className="text-gray-700">
                      {challenge.split('**').map((part, i) => 
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <Sparkles className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2" style={{ fontWeight: 700 }}>
                  {level.id === 1 ? 'Cómo pueden acompañaros Genius Mind School y Talentz:' : level.id === 2 ? 'Cómo pueden acompañaros Genius Mind School y Talentz:' : 'Cómo pueden impulsar aún más vuestro proyecto Genius Mind School y Talentz:'}
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700 mb-2" style={{ fontWeight: 400 }}>
                      {content.geniusSupport.title.split('**').map((part, i) => 
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </p>
                    <ul className="ml-4 space-y-1">
                      {content.geniusSupport.points.map((point, index) => (
                        <li key={index} className="text-gray-700">
                          • {point.split('**').map((part, i) => 
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-gray-700 mb-2" style={{ fontWeight: 400 }}>
                      {content.talentzSupport.title.split('**').map((part, i) => 
                        i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                      )}
                    </p>
                    <ul className="ml-4 space-y-1">
                      {content.talentzSupport.points.map((point, index) => (
                        <li key={index} className="text-gray-700">
                          • {point.split('**').map((part, i) => 
                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button
            onClick={() => {
              setStep('intro');
              setAnswers({});
              setCurrentQuestionIndex(0);
              setTestResult(null);
            }}
            className="w-full text-white py-6 text-lg font-bold transition-opacity md:hover:opacity-90"
            style={{
              background: '#7ea4df',
              border: 'none'
            }}
          >
            <Home className="mr-2 h-5 w-5" />
            Volver al Inicio
          </Button>
        </div>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-white font-montserrat relative overflow-hidden transition-colors duration-300"
      role="main"
      aria-label="Página de Test Genius"
    >
      <section 
        className="relative min-h-screen flex items-center justify-center px-2 sm:px-4 py-4 sm:py-8"
        style={{
          background: '#7ea4df'
        }}
      >
        {/* Figuras Geométricas Circulares */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
          <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
        </div>

        <div className={`w-full max-w-7xl mx-auto transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center mb-8 sm:mb-12 relative z-10">
            <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <img 
                src={logoBraini}
                alt="Braini Emotions Logo" 
                className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-contain"
              />
            </div>
          </div>

          {step === 'intro' && renderIntro()}
          {step === 'registration' && renderRegistration()}
          {step === 'questionnaire' && renderQuestionnaire()}
          {step === 'results' && renderResults()}
        </div>
      </section>
    </div>
  );
};

export default TestGenius;
