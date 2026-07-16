import React from 'react';
import { Button } from '@/shared/ui/button';
import NavbarLandings from '@/shared/components/navigation/NavbarLandings';

// Rutas de assets públicos
const logoBrainiJunior = '/logo/LogoBrainiJunior.png';

const BrainiJuniorsLanding = () => {
  const handleAccessMoodle = () => {
    // TODO: Añadir URL de Moodle para Braini Juniors
    window.location.href = 'https://moodle.brainiemotions.com/brainijuniors';
  };

  return (
    <div 
      className="min-h-screen bg-white font-montserrat relative overflow-x-hidden"
      role="main"
      aria-label="Landing page de Braini Juniors"
    >
      {/* Header con Navegación */}
      <NavbarLandings />
      
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 pt-16 sm:pt-[4.5rem] py-6 sm:py-8"
        style={{
          background: '#35bdb1'
        }}
      >
        {/* Figuras Geométricas Circulares */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
          <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
        </div>

        <div className="w-full max-w-7xl mx-auto relative z-10">
          {/* Contenido Principal */}
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <div className="mx-auto mb-1 sm:mb-1.5 flex items-center justify-center px-2">
              <img
                src={logoBrainiJunior}
                alt="Braini Juniors"
                className="w-[min(100%,18rem)] sm:w-[22rem] md:w-[26rem] lg:w-[30rem] h-auto object-contain"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-2 sm:mb-3 px-2" style={{ fontWeight: 900 }}>
              Braini Juniors
            </h1>
            <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3 px-3 sm:px-4" style={{ fontWeight: 700 }}>
              Material Educativo en Moodle
            </h2>
            <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-5 px-3 sm:px-4" style={{ fontWeight: 400 }}>
              Accede a contenido educativo estructurado para jóvenes
            </p>
          </div>

          {/* CTA Card */}
          <div 
            className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl relative z-10 w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Botón de Acción */}
            <div className="flex justify-center">
              <Button 
                onClick={handleAccessMoodle}
                className="text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 font-bold transition-all text-sm sm:text-base md:text-lg md:hover:opacity-90 md:hover:scale-105 w-full sm:w-auto"
                style={{ 
                  background: '#35bdb1',
                  border: 'none',
                  minWidth: 'auto'
                }}
              >
                Acceder a Moodle
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrainiJuniorsLanding;
