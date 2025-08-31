
import React from 'react';

const GeometricBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top left - Reemplazado por imagen */}
      <div className="absolute top-0 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-20">
        <img 
          src="/emotions/2. Tristeza.jpg" 
          alt="Tristeza" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      {/* Top center - Reemplazado por imagen */}
      <div className="absolute top-0 left-1/3 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-30">
        <img 
          src="/emotions/3. Miedo.jpg" 
          alt="Miedo" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      {/* Top right - Reemplazado por imagen */}
      <div className="absolute top-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-40">
        <img 
          src="/emotions/4. Pena.jpg" 
          alt="Pena" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      {/* Middle right - Reemplazado por imagen */}
      <div className="absolute top-1/3 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-30">
        <img 
          src="/emotions/5. Rabia.jpg" 
          alt="Rabia" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      {/* Bottom left - Reemplazado por imagen */}
      <div className="absolute bottom-1/3 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-20">
        <img 
          src="/emotions/6. Celos.jpg" 
          alt="Celos" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      {/* Bottom center - Reemplazado por imagen */}
      <div className="absolute bottom-0 left-1/3 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-40">
        <img 
          src="/emotions/7. Vergueza.jpg" 
          alt="Vergüenza" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      {/* Bottom left - Reemplazado por imagen */}
      <div className="absolute bottom-0 left-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-30">
        <img 
          src="/emotions/8. Culpa.jpg" 
          alt="Culpa" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      {/* Bottom center right - Reemplazado por imagen */}
      <div className="absolute bottom-0 left-2/3 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-30">
        <img 
          src="/emotions/11. Frustracion.jpg" 
          alt="Frustración" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      {/* Bottom right - Reemplazado por imagen */}
      <div className="absolute bottom-0 right-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 opacity-40">
        <img 
          src="/emotions/15. Asustado.jpg" 
          alt="Asustado" 
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      
      {/* Floating geometric shapes - MANTENIDOS INTACTOS */}
      <div className="absolute top-1/4 left-1/4 w-6 h-6 sm:w-8 sm:h-8 bg-braini-yellow rounded-full opacity-30 animate-float" />
      <div className="absolute top-3/4 right-1/4 w-4 h-4 sm:w-6 sm:h-6 bg-braini-pink rotate-45 opacity-25 animate-bounce-slow" />
      <div className="absolute top-1/2 left-3/4 w-8 h-8 sm:w-10 sm:h-10 bg-braini-green rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default GeometricBackground;
