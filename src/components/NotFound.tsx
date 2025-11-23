import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Clock } from 'lucide-react';

// Rutas de assets públicos
const logoBraini = '/logo/LogoBraini_new.png';
const logoBrainiEnfadado = '/logo/LogoBrainiEnfadado.png';

const NotFound = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Redirección automática después de 5 segundos con countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div 
      className="min-h-screen bg-white font-montserrat relative overflow-hidden transition-colors duration-300"
      role="main"
      aria-label="Página no encontrada"
    >
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center px-2 sm:px-4 py-4 sm:py-8"
        style={{
          background: '#f5827b'
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
          
          {/* Contenido Principal */}
          <div className="text-center mb-8 sm:mb-12 relative z-10">
            <div className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <img 
                src={logoBrainiEnfadado}
                alt="Braini Emotions Logo" 
                className="w-20 h-20 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain"
              />
            </div>
            
            {/* Número 404 */}
            <div className="mb-4 sm:mb-6">
              <span className="text-8xl sm:text-9xl lg:text-[12rem] font-black text-white" style={{ fontWeight: 900 }}>
                404
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-3 sm:mb-4 px-2" style={{ fontWeight: 900 }}>
              ¡Ups! Página no encontrada
            </h1>
            <p className="text-white text-lg sm:text-xl lg:text-2xl mb-2 sm:mb-3 px-4" style={{ fontWeight: 400 }}>
              La página que buscas no existe o ha sido movida.
            </p>
          </div>

          {/* Card Principal */}
          <div 
            className="bg-white rounded-xl p-4 sm:p-6 shadow-2xl relative z-10 max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center" style={{ background: '#f5827b' }}>
                  <Clock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3" style={{ fontWeight: 700 }}>
                ¿Qué tal si exploras Braini?
              </h2>
              
              <p className="text-gray-600 text-sm sm:text-base mb-6 leading-relaxed" style={{ fontWeight: 400 }}>
                Mientras tanto, únete a nuestra waitlist y sé el primero en descubrir cómo Braini puede transformar el bienestar emocional de tu familia.
              </p>

              <div className="space-y-4">
                <Button 
                  onClick={handleGoHome}
                  className="w-full text-white px-6 py-3 font-bold transition-opacity text-sm sm:text-base md:hover:opacity-90"
                  style={{ 
                    background: '#7ea4df',
                    border: 'none'
                  }}
                >
                  <Home size={20} className="mr-2" />
                  Ir a la Waitlist
                </Button>
                
                <p className="text-sm text-gray-500" style={{ fontWeight: 400 }}>
                  Redirección automática en{' '}
                  <span className="font-bold" style={{ fontWeight: 700, color: '#7ea4df' }}>
                    {countdown} {countdown === 1 ? 'segundo' : 'segundos'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Botones de Acción Rápida */}
          <div 
            className={`mt-6 sm:mt-8 transition-all duration-1000 ease-out delay-200 relative z-10 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto">
              <Button 
                onClick={() => window.history.back()}
                variant="outline"
                className="w-full sm:w-auto text-gray-700 border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm sm:text-base"
                style={{ fontWeight: 400 }}
              >
                <ArrowLeft size={18} className="mr-2" />
                Volver Atrás
              </Button>
              
              <Button 
                onClick={handleGoHome}
                variant="outline"
                className="w-full sm:w-auto text-white border-0 transition-all duration-200 text-sm sm:text-base md:hover:opacity-90"
                style={{ 
                  background: '#35bdb1',
                  fontWeight: 400
                }}
              >
                Ir al Inicio
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
