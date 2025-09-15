import React from 'react';
import { useNavigate } from 'react-router-dom';
import GeometricBackground from '@/components/GeometricBackground';
import Navbar from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Baby, ArrowRight } from 'lucide-react';

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
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-braini-blue via-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-braini-blue to-purple-600">
                Inteligencia Emocional
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Evalúa tu inteligencia emocional y la de tu hijo o hija a través de nuestros tests especializados.
            </p>
          </div>

          {/* Opciones de Test */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Test para Padres */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.1s' }}>
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
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Duración:</strong> 15-20 minutos<br/>
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
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
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
        </div>
      </div>
    </div>
  );
};

export default InteligenciaEmocional;
