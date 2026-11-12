import React from 'react';
import { useNavigate } from 'react-router';
import Backgrounds from '@/shared/components/Backgrounds';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { ArrowLeft, Award, Construction } from 'lucide-react';

const TestEmocionalNinos = () => {
  const navigate = useNavigate();

  return (
    <Backgrounds
      wrapWithCard
      tone="yellow"
      title="Test emocional para niños"
      subtitle="Estamos preparando una versión adaptada para tu hijo o hija."
    >

            {/* Área de contenido con scroll */}
            <div>
              {/* Botón de regreso */}
              <div className="mb-6">
                <Button
                  onClick={() => navigate('/brainifamily/inteligencia-emocional')}
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:border-braini-yellow hover:text-braini-yellow hover:bg-white/50 font-semibold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Volver a Evaluar y crecer
                </Button>
              </div>

              {/* Mensaje de En Construcción */}
              <Card className="bg-white border-0 rounded-2xl shadow-surface">
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
      </Backgrounds>
  );
};

export default TestEmocionalNinos;
