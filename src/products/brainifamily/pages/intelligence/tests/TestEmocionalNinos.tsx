import React from 'react';
import { useNavigate } from 'react-router-dom';
import Backgrounds from '@/shared/components/Backgrounds';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ArrowLeft, Award, Construction } from 'lucide-react';

const TestEmocionalNinos = () => {
  const navigate = useNavigate();

  return (
    <Backgrounds 
      wrapWithCard={true}
      enableInternalScroll={true}
      customColor="#f8cd50"
      showCircles={true}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 flex-1 flex flex-col min-h-0">
          <div className="max-w-4xl mx-auto w-full flex flex-col min-h-0">
            {/* Header Principal */}
            <div className="mb-4 md:mb-6 animate-fade-in shrink-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-2" style={{ fontWeight: 900 }}>
                Test Emocional para Niños
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 font-medium">
                Evaluación adaptada para el desarrollo emocional infantil
              </p>
            </div>

            {/* Área de contenido con scroll */}
            <div className="flex-1 overflow-y-auto min-h-0">
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

              {/* Mensaje de En Construcción */}
              <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="text-center pb-4">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Award className="w-5 h-5 text-braini-yellow" />
                    <CardTitle className="text-lg md:text-xl font-semibold text-gray-800">
                      En Construcción
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Construction className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 text-sm md:text-base mb-4">
                    Estamos trabajando para crear el mejor test emocional para niños.
                  </p>
                  <p className="text-gray-600 text-sm md:text-base">
                    Próximamente más noticias.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      </Backgrounds>
  );
};

export default TestEmocionalNinos;
