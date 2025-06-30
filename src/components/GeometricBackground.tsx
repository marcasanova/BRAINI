
import React from 'react';

const GeometricBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Top left turquoise dotted square */}
      <div 
        className="absolute top-0 left-0 w-24 h-24 bg-braini-turquoise opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.3) 2px, transparent 2px)',
          backgroundSize: '8px 8px'
        }}
      />
      
      {/* Top center blue square with water drop */}
      <div className="absolute top-0 left-1/3 w-24 h-24 bg-braini-blue-dark opacity-30 flex items-center justify-center">
        <div className="w-6 h-8 bg-braini-blue rounded-full" style={{
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
        }} />
      </div>
      
      {/* Top right blue square */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-braini-blue opacity-40" />
      
      {/* Middle right pink square with X */}
      <div className="absolute top-1/3 right-0 w-24 h-24 bg-braini-pink opacity-30 flex items-center justify-center">
        <div className="text-white text-2xl font-bold">×</div>
      </div>
      
      {/* Bottom left pink dotted square */}
      <div 
        className="absolute bottom-1/3 left-0 w-24 h-24 bg-braini-pink opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.4) 1px, transparent 1px)',
          backgroundSize: '6px 6px'
        }}
      />
      
      {/* Bottom center yellow square */}
      <div className="absolute bottom-0 left-1/3 w-24 h-24 bg-braini-yellow opacity-40" />
      
      {/* Bottom left blue square */}
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-braini-blue-light opacity-30" />
      
      {/* Bottom center blue square with water drop */}
      <div className="absolute bottom-0 left-2/3 w-24 h-24 bg-braini-blue-dark opacity-30 flex items-center justify-center">
        <div className="w-4 h-6 bg-braini-blue rounded-full" style={{
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
        }} />
      </div>
      
      {/* Bottom right turquoise square */}
      <div className="absolute bottom-0 right-0 w-24 h-24 bg-braini-turquoise opacity-40" />
      
      {/* Floating geometric shapes */}
      <div className="absolute top-1/4 left-1/4 w-8 h-8 bg-braini-yellow rounded-full opacity-30 animate-float" />
      <div className="absolute top-3/4 right-1/4 w-6 h-6 bg-braini-pink rotate-45 opacity-25 animate-bounce-slow" />
      <div className="absolute top-1/2 left-3/4 w-10 h-10 bg-braini-green rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
};

export default GeometricBackground;
