import React from 'react';
import { useNavigate } from 'react-router-dom';
import Backgrounds from '@/components/Backgrounds';
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
    <Backgrounds 
      wrapWithCard={true}
      enableInternalScroll={true}
      customGradient="linear-gradient(135deg, rgba(248, 205, 80, 1) 25%, rgba(245, 130, 123, 1) 75%)"
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 flex-1 flex flex-col min-h-0">
          <div className="max-w-6xl mx-auto w-full flex flex-col min-h-0">
            {/* Header Principal - Fijo en la parte superior */}
            <div className="mb-4 md:mb-6 animate-fade-in flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2" style={{ fontWeight: 900 }}>
              Inteligencia Emocional
            </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium">
                Evalúa tu inteligencia emocional y la de tu hijo o hija a través de nuestros tests especializados.
              </p>
            </div>

          {/* Área de contenido con scroll */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Opciones de Test */}
            <div className="grid lg:grid-cols-2 gap-8 pb-4">
              {/* Test para Padres */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-braini-blue to-braini-blue-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-black text-gray-800 mb-2" style={{ fontWeight: 900 }}>
                  Test TMMS-24 para Padres
                </CardTitle>
                <p className="text-gray-700 font-medium">
                  Evaluación completa de tu inteligencia emocional
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-braini-blue/10 p-4 rounded-lg border border-braini-blue/20">
                  <p className="text-sm text-braini-blue-dark">
                    <strong>Duración:</strong> 15-20 minutos<br/>
                    <strong>Preguntas:</strong> 24 preguntas con escala de 1-5<br/>
                    <strong>Resultados:</strong> Análisis detallado con recomendaciones
                  </p>
                </div>
                
                <Button
                  onClick={handleTestPadres}
                  className="w-full bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
                >
                  Comenzar Test para Padres
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Test para Niños */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="text-center pb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-braini-pink to-braini-pink-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Baby className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl font-black text-gray-800 mb-2" style={{ fontWeight: 900 }}>
                  Test Emocional para Niños
                </CardTitle>
                <p className="text-gray-700 font-medium">
                  Evaluación adaptada para el desarrollo emocional infantil
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-braini-pink/10 p-4 rounded-lg border border-braini-pink/20">
                  <p className="text-sm text-braini-pink-dark">
                    <strong>Edad recomendada:</strong> 4-12 años<br/>
                    <strong>Duración:</strong> 10-15 minutos<br/>
                    <strong>Formato:</strong> Adaptado y amigable para niños
                  </p>
                </div>
                
                <Button
                  onClick={handleTestNinos}
                  className="w-full bg-gradient-to-r from-braini-pink to-braini-pink-light hover:from-braini-pink-dark hover:to-braini-pink text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
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
      </div>
    </Backgrounds>
  );
};

export default InteligenciaEmocional;
