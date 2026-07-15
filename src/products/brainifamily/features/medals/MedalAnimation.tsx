import React, { useEffect, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Sparkles, Star } from 'lucide-react';
import { getMedalImageForNivelEducativo } from '@/shared/lib/constants/emotionsStorage';

interface Medal {
  id: number;
  mission_id: number;
  nombre: string;
  descripcion: string | null;
  icono: string;
  color: string;
}

interface MedalAnimationProps {
  medal: Medal;
  onClose: () => void;
  childNivelEducativo?: string | null;
}

// Componente de partícula de confeti mejorado
const ConfettiPiece: React.FC<{ 
  color: string; 
  left: number; 
  delay: number; 
  duration: number;
}> = ({ color, left, delay, duration }) => (
  <div
    className="absolute w-3 h-3 rounded-sm animate-confetti-fall"
    style={{
      left: `${left}%`,
      backgroundColor: color,
      animationDelay: `${delay}s`,
      animationDuration: `${duration}s`,
      animationIterationCount: 'infinite',
    }}
  />
);

// Componente de estrella brillante mejorado
const Sparkle: React.FC<{ 
  top: number; 
  left: number; 
  delay: number;
  size: number;
}> = ({ top, left, delay, size }) => (
  <div
    className="absolute animate-sparkle-twinkle"
    style={{
      top: `${top}%`,
      left: `${left}%`,
      animationDelay: `${delay}s`,
    }}
  >
    <Sparkles 
      className="text-braini-yellow" 
      style={{ width: size, height: size }}
    />
  </div>
);

const MedalAnimation: React.FC<MedalAnimationProps> = ({ 
  medal, 
  onClose,
  childNivelEducativo
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  // Colores para el confeti - Colores corporativos
  const confettiColors = [
    '#f8cd50', // Amarillo/Dorado corporativo
    '#f5827b', // Rosa/Corral corporativo
    '#7ea4df', // Azul corporativo
    '#35bdb1', // Turquesa corporativo
    '#f8cd50', // Amarillo (duplicado para más presencia)
    '#f5827b', // Rosa (duplicado para más presencia)
    '#7ea4df', // Azul (duplicado para más presencia)
    '#35bdb1', // Turquesa (duplicado para más presencia)
  ];

  const medalImage = getMedalImageForNivelEducativo(childNivelEducativo);

  useEffect(() => {
    // Secuencia de animación
    setIsVisible(true);
    
    setTimeout(() => {
      setShowContent(true);
    }, 300);
    
    setTimeout(() => {
      setShowButton(true);
    }, 1500);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay con blur */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Confeti mejorado */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <ConfettiPiece
            key={i}
            color={confettiColors[i % confettiColors.length]}
            left={Math.random() * 100}
            delay={Math.random() * 3}
            duration={3 + Math.random() * 2}
          />
        ))}
      </div>

      {/* Estrellas brillantes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 15 }).map((_, i) => (
          <Sparkle
            key={i}
            top={Math.random() * 100}
            left={Math.random() * 100}
            delay={Math.random() * 3}
            size={12 + Math.random() * 20}
          />
        ))}
      </div>

      {/* Modal principal */}
      <div 
        className={`relative bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border-2 border-gray-200 transition-all duration-700 transform ${
          isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
        }`}
      >
        {/* Efecto de brillo alrededor */}
        <div className="absolute inset-0 rounded-3xl bg-braini-blue/10 animate-pulse" />
        
        {/* Contenido */}
        <div className="relative z-10 text-center">
          {/* Icono de medalla animado */}
          <div className="mb-6">
            <div 
              className={`inline-block transition-all duration-1000 transform ${
                showContent ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
              }`}
            >
              <img 
                src={medalImage} 
                alt="Medalla Braini" 
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover mx-auto mb-4 animate-bounce shadow-lg border-2 border-gray-200"
              />
            </div>
          </div>

          {/* Título principal */}
          <h1 
            className={`text-3xl font-bold text-gray-800 mb-2 transition-all duration-700 delay-300 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            ¡Medalla Ganada!
          </h1>

          {/* Medalla específica */}
          <div 
            className={`mb-6 transition-all duration-700 delay-500 ${
              showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
            }`}
          >
            <div 
              className="text-6xl mb-3 animate-bounce"
              style={{ animationDelay: '0.5s' }}
            >
              {medal.icono}
            </div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              {medal.nombre}
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              {medal.descripcion}
            </p>
          </div>

          {/* Mensaje de felicitación */}
          <div 
            className={`mb-8 transition-all duration-700 delay-700 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-braini-blue fill-current animate-sparkle-twinkle" />
              <span className="text-lg font-medium text-gray-700">
                ¡Enhorabuena!
              </span>
              <Star className="w-5 h-5 text-braini-turquoise fill-current animate-sparkle-twinkle" style={{ animationDelay: '0.5s' }} />
            </div>
            <p className="text-gray-600">
              Has completado la misión {medal.mission_id} y obtenido esta medalla
            </p>
          </div>

          {/* Botón de acción */}
          <div 
            className={`transition-all duration-700 delay-1000 ${
              showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button
              onClick={onClose}
              className="bg-linear-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg min-w-[200px] animate-fade-in-up"
            >
              <img 
                src={medalImage} 
                alt="Medalla Braini" 
                className="w-6 h-6 rounded-full object-cover mr-2"
              />
              Guardar medalla
            </Button>
          </div>
        </div>

        {/* Efecto de brillo en los bordes */}
        <div className="absolute inset-0 rounded-3xl bg-linear-to-r from-transparent via-braini-blue/5 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default MedalAnimation; 