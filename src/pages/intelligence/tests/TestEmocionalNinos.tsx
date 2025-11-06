import React from 'react';
import { useNavigate } from 'react-router-dom';
import Backgrounds from '@/components/Backgrounds';
import Navbar from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Baby, Heart, Brain, ArrowLeft, Construction, Star, Sparkles } from 'lucide-react';

const TestEmocionalNinos = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-montserrat relative overflow-hidden">
      <Backgrounds />
      <Navbar />
      <div className="container mx-auto px-4 py-12 md:pl-80 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-400 via-orange-400 to-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Baby className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-black text-gray-800 mb-4" style={{ fontWeight: 900 }}>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
                Test Emocional para Niños
              </span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-700 max-w-2xl mx-auto font-medium">
              Evaluación adaptada para el desarrollo emocional infantil
            </p>
          </div>

          {/* Botón de regreso */}
          <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <Button
              onClick={() => navigate('/inteligencia-emocional')}
              variant="outline"
              className="border-2 border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-400 hover:bg-white/50 font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Inteligencia Emocional
            </Button>
          </div>

          {/* Mensaje de Próximamente */}
          <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Construction className="w-10 h-10 text-white" />
              </div>
              <CardTitle className="text-3xl text-gray-800 mb-2">
                🚧 En Construcción 🚧
              </CardTitle>
              <p className="text-lg text-gray-600">
                Estamos trabajando para crear el mejor test emocional para niños
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 text-lg mb-6">
                Nuestro equipo de expertos en psicología infantil está desarrollando un test 
                emocional especialmente diseñado para niños y niñas de 4 a 12 años.
              </p>
            </CardContent>
          </Card>

          {/* Características del Test Futuro */}
          <Card className="bg-gradient-to-r from-pink-50 to-orange-50 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-3 text-2xl text-gray-800">
                <Star className="w-6 h-6 text-pink-500" />
                ¿Qué incluirá el Test para Niños?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Reconocimiento Emocional</h3>
                  <p className="text-sm text-gray-600">
                    Identificación de emociones básicas y complejas a través de imágenes y situaciones
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Expresión Emocional</h3>
                  <p className="text-sm text-gray-600">
                    Capacidad para comunicar sentimientos de manera apropiada y saludable
                  </p>
                </div>
                <div className="text-center p-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">Regulación Infantil</h3>
                  <p className="text-sm text-gray-600">
                    Habilidades básicas de autocontrol y gestión emocional adaptadas a su edad
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Detallada */}
          <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Características del Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
                      Edad Recomendada
                    </h4>
                    <p className="text-gray-600">
                      <strong>4-6 años:</strong> Test visual con imágenes y colores<br/>
                      <strong>7-9 años:</strong> Combinación de imágenes y preguntas simples<br/>
                      <strong>10-12 años:</strong> Preguntas más complejas con opciones múltiples
                    </p>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      Duración Estimada
                    </h4>
                    <p className="text-gray-600">
                      <strong>4-6 años:</strong> 8-10 minutos<br/>
                      <strong>7-9 años:</strong> 10-12 minutos<br/>
                      <strong>10-12 años:</strong> 12-15 minutos
                    </p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    Formato del Test
                  </h4>
                  <p className="text-gray-600">
                    El test será completamente interactivo, con elementos visuales atractivos, 
                    colores vibrantes, y una interfaz amigable para niños. Incluirá animaciones 
                    suaves y recompensas visuales para mantener su atención y motivación.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Beneficios */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-lg shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <CardHeader>
              <CardTitle className="text-xl text-gray-800">
                Beneficios del Test Emocional para Niños
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Para los Niños</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Desarrollo de autoconciencia emocional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Mejora en la comunicación de sentimientos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Habilidades de regulación emocional</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800">Para los Padres</h4>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Comprensión del desarrollo emocional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Identificación de áreas de mejora</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>Herramientas para el apoyo emocional</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-pink-100 to-orange-100 backdrop-blur-lg shadow-xl border-0 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                ¡Mantente Atento!
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                El test emocional para niños estará disponible muy pronto. Mientras tanto, 
                te recomendamos completar tu propio test de inteligencia emocional para 
                ser un mejor modelo para tu hijo o hija.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => navigate('/test-tmms-padres')}
                  className="bg-gradient-to-r from-braini-blue to-blue-600 hover:from-braini-blue-dark hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Hacer mi Test de Inteligencia Emocional
                </Button>
                <Button
                  onClick={() => navigate('/home')}
                  variant="outline"
                  className="border-2 border-gray-300 text-gray-700 hover:border-pink-400 hover:text-pink-400 font-semibold py-3 px-6 rounded-xl"
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

export default TestEmocionalNinos;
