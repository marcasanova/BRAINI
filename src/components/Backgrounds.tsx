import React from 'react';
import Navbar from './navigation/Navbar';

interface BackgroundsProps {
  className?: string;
  children?: React.ReactNode;
  wrapWithCard?: boolean; // Si true, envuelve en card con Navbar
  enableInternalScroll?: boolean; // Si true, habilita scroll interno en el área de contenido
  customColor?: string; // Color sólido personalizado para la card (opcional)
  showCircles?: boolean; // Si true, muestra los círculos decorativos (opcional, default: false)
}

const Backgrounds: React.FC<BackgroundsProps> = ({ 
  className = '',
  children,
  wrapWithCard = false,
  enableInternalScroll = false,
  customColor,
  showCircles = false
}) => {
  
  // Renderizar el fondo único (igual que la primera sección de LandingPage)
  const renderBackground = () => {
    return (
      <>
        {/* Gradiente principal - igual que LandingPage */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #7ea4df 0%, #35bdb1 100%)'
          }}
        />
        {/* Círculos decorativos - igual que LandingPage */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
          <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
        </div>
      </>
    );
  };

  // Si wrapWithCard es true, envuelve todo en la estructura de card con Navbar
  if (wrapWithCard) {
    return (
      // Estructura completa: fondo gris + card con fondo blanco
      <div className={`${enableInternalScroll ? 'h-screen overflow-hidden' : 'min-h-screen'} font-montserrat relative bg-gray-50 ${className}`}>
        {/* Fondo gris aplicado a toda la pantalla */}
        <div className="fixed inset-0 bg-gray-200 overflow-hidden pointer-events-none" />
        
        {/* Card principal que envuelve toda la aplicación - con fondo blanco */}
        <div 
          className={`max-w-[1920px] mx-auto rounded-xl md:rounded-2xl lg:rounded-3xl overflow-hidden relative m-4 md:m-6 lg:m-8 bg-white ${
            enableInternalScroll 
              ? 'h-[calc(100vh-2rem)] md:h-[calc(100vh-3rem)] lg:h-[calc(100vh-4rem)]' 
              : 'min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)] lg:min-h-[calc(100vh-4rem)]'
          }`}
          style={{ 
            boxShadow: '0 35px 60px -12px rgba(0, 0, 0, 0.35), 0 10px 20px -5px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.08)',
            border: 'none'
          }}
        >
          {/* Navbar dentro del card - con fondo blanco sólido */}
          <div className="relative z-50">
            <Navbar />
          </div>
          
          {/* Área de contenido principal - CON COLOR SÓLIDO aquí */}
          <div 
            className={`${
              enableInternalScroll
                ? 'absolute top-0 right-0 bottom-0 left-0 md:left-72 overflow-y-auto'
                : 'relative md:ml-72 min-h-[calc(100vh-200px)] md:min-h-[calc(100vh-100px)]'
            }`}
            style={{
              background: customColor || '#7ea4df'
            }}
          >
            {/* Círculos decorativos dentro del área de contenido - solo si showCircles es true */}
            {showCircles && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-60 h-60 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px] bg-white/15 rounded-full" />
                <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
              </div>
            )}
            
            {/* Contenido de la página */}
            <div className="relative z-10 min-h-full pb-20 md:pb-0">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si solo es un background (uso normal)
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {renderBackground()}
    </div>
  );
};

export default Backgrounds;
