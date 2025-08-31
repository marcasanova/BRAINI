import React from 'react';

const EmotionsBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Solo 2 imágenes estáticas posicionadas encima del formulario */}
      
      {/* Esquina superior izquierda del formulario - Encima del rectángulo */}
      <div className="hidden sm:block absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-full w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-15">
        <img 
          src="/emotions/1. Alegria.jpg" 
          alt="Alegría" 
          className="w-full h-full object-cover rounded-2xl shadow-lg"
        />
      </div>
      
      {/* Esquina superior derecha del formulario - Encima del rectángulo */}
      <div className="absolute top-1/2 right-1/4 transform translate-x-1/2 -translate-y-full w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 opacity-15">
        <img 
          src="/emotions/13. Felicidad.jpg" 
          alt="Felicidad" 
          className="w-full h-full object-cover rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
};

export default EmotionsBackground;
