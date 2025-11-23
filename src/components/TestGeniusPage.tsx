import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

// Rutas de assets públicos
const logoBraini = '/logo/LogoBraini_new.png';

const TestGeniusPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div 
      className="min-h-screen bg-white font-montserrat relative overflow-hidden transition-colors duration-300"
      role="main"
      aria-label="Página de Test Genius"
    >
      {/* Hero Section */}
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
          
          {/* Contenido Principal */}
          <div className="text-center mb-8 sm:mb-12 relative z-10">
            <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <img 
                src={logoBraini}
                alt="Braini Emotions Logo" 
                className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-contain"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-3 sm:mb-4 px-2" style={{ fontWeight: 900 }}>
              Braini Emotions Family
            </h1>
            <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 px-4" style={{ fontWeight: 700 }}>
              Programa de Neurobienestar Emocional
            </h2>
          </div>

          {/* Card de En Construcción */}
          <div 
            className="bg-white rounded-xl p-4 sm:p-6 shadow-2xl relative z-10 max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4" style={{ fontWeight: 700 }}>
                Test Genius
              </h2>
              
              <p className="text-gray-600 text-base sm:text-lg mb-6 leading-relaxed px-2" style={{ fontWeight: 400 }}>
                Estamos creando el test para evaluar tu colegio.
                <br className="hidden sm:block" />
                Pronto estará disponible.
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
                  Volver al Inicio
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestGeniusPage;

