import React from 'react';
import { useNavigate } from 'react-router-dom';
import Backgrounds from '@/components/Backgrounds';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Award } from 'lucide-react';

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
      customColor="#f8cd50"
      showCircles={true}
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
            <div className="grid lg:grid-cols-2 gap-8 pb-20 md:pb-4">
              {/* Test para Padres */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-braini-yellow" />
                  <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">
                    Test TMMS-24 para Padres
                  </CardTitle>
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  Evaluación completa de tu inteligencia emocional
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm md:text-base text-gray-600">
                    <strong>Duración:</strong> 15-20 minutos<br/>
                    <strong>Preguntas:</strong> 24 preguntas con escala de 1-5<br/>
                    <strong>Resultados:</strong> Análisis detallado con recomendaciones
                  </p>
                </div>
                
                <Button
                  onClick={handleTestPadres}
                  className="w-full bg-braini-yellow hover:bg-braini-yellow-dark text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                >
                  Comenzar Test para Padres
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Test para Niños */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Award className="w-5 h-5 text-braini-yellow" />
                  <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">
                    Test Emocional para Niños
                  </CardTitle>
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  Evaluación adaptada para el desarrollo emocional infantil
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-100 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm md:text-base text-gray-600">
                    <strong>Edad recomendada:</strong> 4-12 años<br/>
                    <strong>Duración:</strong> 10-15 minutos<br/>
                    <strong>Formato:</strong> Adaptado y amigable para niños
                  </p>
                </div>
                
                <Button
                  onClick={handleTestNinos}
                  className="w-full bg-braini-yellow hover:bg-braini-yellow-dark text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
                >
                  Comenzar Test para Niños
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
            </div>

            {/* Sección de Credibilidad */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 animate-fade-in mt-8" style={{ animationDelay: '0.3s' }}>
              <CardContent className="p-5 md:p-6">
                <div className="text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
                    <Award className="w-5 h-5 text-braini-yellow" />
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                      Tests Validados Científicamente
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm md:text-base mb-4">
                    Nuestros tests han sido <strong>creados y evaluados</strong> por investigadores de la <strong>Universidad de Cádiz</strong> y la <strong>Universidad de Alicante</strong>, garantizando resultados <strong>100% fiables</strong> y basados en evidencia científica.
                  </p>

                  {/* Logos de las universidades */}
                  <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 mt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-white rounded-lg p-2 shadow-sm flex items-center justify-center">
                        <img 
                          src="/unis/logo_cadiz.png" 
                          alt="Universidad de Cádiz" 
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            // Fallback si la imagen no existe aún
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">Universidad de Cádiz</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-white rounded-lg p-2 shadow-sm flex items-center justify-center">
                        <img 
                          src="/unis/logo_alicante.png" 
                          alt="Universidad de Alicante" 
                          className="max-w-full max-h-full object-contain"
                          onError={(e) => {
                            // Fallback si la imagen no existe aún
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">Universidad de Alicante</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      </div>
    </Backgrounds>
  );
};

export default InteligenciaEmocional;
