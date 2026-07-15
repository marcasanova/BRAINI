import React from 'react';
import { useNavigate } from 'react-router-dom';
import Backgrounds from '@/shared/components/Backgrounds';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ArrowRight, Award } from 'lucide-react';

const InteligenciaEmocional = () => {
  const navigate = useNavigate();

  const handleTestPadres = () => {
    navigate('/brainifamily/test-tmms-padres');
  };

  const handleTestNinos = () => {
    navigate('/brainifamily/test-emocional-ninos');
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
            <div className="mb-4 sm:mb-5 md:mb-6 animate-fade-in shrink-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 sm:mb-2" style={{ fontWeight: 900 }}>
                Inteligencia Emocional
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium">
                Evalúa tu inteligencia emocional y la de tu hijo o hija a través de nuestros tests especializados.
              </p>
            </div>

          {/* Área de contenido con scroll */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {/* Sección de Credibilidad - Primero */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 animate-fade-in mb-6 sm:mb-8" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-4 sm:p-5 md:p-6">
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-left">
                    Tests Validados Científicamente
                  </h3>
                  
                  <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-4 sm:mb-5 leading-relaxed text-left">
                    Nuestros tests han sido <strong>creados y evaluados</strong> por investigadores de la <strong>Universidad de Cádiz</strong> y la <strong>Universidad de Alicante</strong>, garantizando resultados <strong>100% fiables</strong> y basados en evidencia científica.
                  </p>

                  {/* Logos de las universidades */}
                  <div className="flex flex-row items-center justify-center md:justify-start gap-4 sm:gap-5 md:gap-6 lg:gap-8">
                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white rounded-lg p-1 sm:p-1.5 md:p-2 shadow-xs flex items-center justify-center shrink-0">
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
                      <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 whitespace-nowrap">Universidad de Cádiz</span>
                    </div>

                    <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-white rounded-lg p-1 sm:p-1.5 md:p-2 shadow-xs flex items-center justify-center shrink-0">
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
                      <span className="text-[9px] sm:text-[10px] md:text-xs text-gray-600 whitespace-nowrap">Universidad de Alicante</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Opciones de Test */}
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 pb-20 md:pb-4">
              {/* Test para Padres */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <CardHeader className="text-center pb-3 sm:pb-4">
                <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-braini-yellow" />
                  <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                    Test TMMS-24 para Padres
                  </CardTitle>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                  Evaluación completa de tu inteligencia emocional
                </p>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="bg-gray-100 p-3 sm:p-4 rounded-lg border border-gray-200">
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    <strong>Duración:</strong> 15-20 minutos<br/>
                    <strong>Preguntas:</strong> 24 preguntas con escala de 1-5<br/>
                    <strong>Resultados:</strong> Análisis detallado con recomendaciones
                  </p>
                </div>
                
                <Button
                  onClick={handleTestPadres}
                  className="w-full bg-braini-yellow hover:bg-braini-yellow-dark text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base md:text-lg"
                >
                  Comenzar Test para Padres
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Test para Niños */}
            <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <CardHeader className="text-center pb-3 sm:pb-4">
                <div className="flex items-center justify-center gap-2 mb-2 sm:mb-3">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-braini-yellow" />
                  <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-gray-800">
                    Test Emocional para Niños
                  </CardTitle>
                </div>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                  Evaluación adaptada para el desarrollo emocional infantil
                </p>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-5 md:space-y-6">
                <div className="bg-gray-100 p-3 sm:p-4 rounded-lg border border-gray-200">
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    <strong>Edad recomendada:</strong> 4-12 años<br/>
                    <strong>Duración:</strong> 10-15 minutos<br/>
                    <strong>Formato:</strong> Adaptado y amigable para niños
                  </p>
                </div>
                
                <Button
                  onClick={handleTestNinos}
                  className="w-full bg-braini-yellow hover:bg-braini-yellow-dark text-white font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm sm:text-base md:text-lg"
                >
                  Comenzar Test para Niños
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1.5 sm:ml-2" />
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
