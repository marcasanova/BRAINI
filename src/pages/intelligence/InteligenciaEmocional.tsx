import React from 'react';
import { useNavigate } from 'react-router-dom';
import GeometricBackground from '@/components/GeometricBackground';
import Navbar from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Baby, Heart, TrendingUp, ArrowRight, Info } from 'lucide-react';

const InteligenciaEmocional = () => {
  const navigate = useNavigate();

  const handleTestPadres = () => {
    navigate('/test-tmms-padres');
  };

  const handleTestNinos = () => {
    navigate('/test-emocional-ninos');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      <Navbar />
      <div className="container mx-auto px-4 py-12 md:pl-80 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Principal */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-braini-blue via-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-braini-blue to-purple-600">
                Inteligencia Emocional
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre y evalúa tu inteligencia emocional, así como la de tu hijo o hija, 
              a través de nuestros tests especializados y científicamente validados.
            </p>
          </div>

          {/* Información General */}
          <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 mb-12 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-3 text-2xl text-gray-800">
                <Info className="w-6 h-6 text-braini-blue" />
                ¿Por qué evaluar la Inteligencia Emocional?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Autoconocimiento</h3>
                  <p className="text-sm text-gray-600">Comprende mejor tus emociones y reacciones</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Regulación</h3>
                  <p className="text-sm text-gray-600">Aprende a gestionar tus emociones de forma saludable</p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Crecimiento</h3>
                  <p className="text-sm text-gray-600">Desarrolla habilidades para la vida diaria</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opciones de Test */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {/* Test para Padres */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-braini-blue to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-800 mb-2">
                  Test TMMS-24 para Padres
                </CardTitle>
                <p className="text-gray-600">
                  Evaluación completa de tu inteligencia emocional
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Atención Emocional
                  </h4>
                  <p className="text-sm text-gray-600">
                    Capacidad para identificar y expresar emociones de manera efectiva
                  </p>
                  
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Claridad Emocional
                  </h4>
                  <p className="text-sm text-gray-600">
                    Comprensión profunda de tus propias emociones y estados de ánimo
                  </p>
                  
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Reparación Emocional
                  </h4>
                  <p className="text-sm text-gray-600">
                    Habilidad para regular y gestionar emociones negativas
                  </p>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Duración:</strong> Aproximadamente 15-20 minutos<br/>
                    <strong>Preguntas:</strong> 24 preguntas con escala de 1-5<br/>
                    <strong>Resultados:</strong> Análisis detallado con recomendaciones
                  </p>
                </div>
                
                <Button
                  onClick={handleTestPadres}
                  className="w-full bg-gradient-to-r from-braini-blue to-blue-600 hover:from-braini-blue-dark hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
                >
                  Comenzar Test para Padres
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Test para Niños */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Baby className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-800 mb-2">
                  Test Emocional para Niños
                </CardTitle>
                <p className="text-gray-600">
                  Evaluación adaptada para el desarrollo emocional infantil
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    Reconocimiento Emocional
                  </h4>
                  <p className="text-sm text-gray-600">
                    Identificación de emociones básicas y complejas
                  </p>
                  
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Expresión Emocional
                  </h4>
                  <p className="text-sm text-gray-600">
                    Capacidad para comunicar sentimientos de manera apropiada
                  </p>
                  
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    Regulación Infantil
                  </h4>
                  <p className="text-sm text-gray-600">
                    Habilidades básicas de autocontrol y gestión emocional
                  </p>
                </div>
                
                <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
                  <p className="text-sm text-pink-800">
                    <strong>Edad recomendada:</strong> 4-12 años<br/>
                    <strong>Duración:</strong> 10-15 minutos<br/>
                    <strong>Formato:</strong> Adaptado y amigable para niños
                  </p>
                </div>
                
                <Button
                  onClick={handleTestNinos}
                  className="w-full bg-gradient-to-r from-pink-400 to-pink-600 hover:from-pink-500 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
                >
                  Comenzar Test para Niños
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Información Adicional */}
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 backdrop-blur-lg shadow-xl border-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                ¿Necesitas ayuda para decidir?
              </h3>
              <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
                Si eres padre o madre, te recomendamos comenzar con tu propio test para 
                entender mejor tu inteligencia emocional. Esto te ayudará a ser un mejor 
                modelo para tu hijo o hija. El test para niños está diseñado para ser 
                divertido y educativo, adaptado a diferentes edades.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleTestPadres}
                  variant="outline"
                  className="border-2 border-braini-blue text-braini-blue hover:bg-braini-blue hover:text-white font-semibold py-3 px-6 rounded-xl"
                >
                  Empezar con mi Test
                </Button>
                <Button
                  onClick={() => navigate('/home')}
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:border-braini-blue hover:text-braini-blue font-semibold py-3 px-6 rounded-xl"
                >
                  Volver al Panel Principal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InteligenciaEmocional;
