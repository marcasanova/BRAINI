import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Star } from 'lucide-react';

interface SuccessPopupProps {
  onClose: () => void;
}

// Lista de frases de éxito
const FEEDBACK_MESSAGES = [
  '¡FANTÁSTICO!',
  '¡GENIAL!',
  '¡SUPER!',
  '¡EXCELENTE!',
  '¡INCREÍBLE!',
  '¡PERFECTO!',
  '¡MARAVILLOSO!',
  '¡ESTUPENDO!',
  '¡BIEN HECHO!',
  '¡LO LOGASTE!',
];

const SuccessPopup: React.FC<SuccessPopupProps> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [randomMessage, setRandomMessage] = useState<string>('');

  // Seleccionar una frase aleatoria al montar el componente
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * FEEDBACK_MESSAGES.length);
    setRandomMessage(FEEDBACK_MESSAGES[randomIndex]);
  }, []);

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

  // Componente de partícula de confeti
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

  // Componente de estrella brillante
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay con blur */}
      <div 
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Confeti */}
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
          {/* Icono de éxito animado */}
          <div className="mb-6">
            <div 
              className={`inline-block transition-all duration-1000 transform ${
                showContent ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
              }`}
            >
              <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-braini-blue flex items-center justify-center mx-auto mb-4 animate-bounce shadow-lg border-2 border-gray-200">
                <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-white" />
              </div>
            </div>
          </div>

          {/* Mensaje principal */}
          <h1 
            className={`text-3xl font-bold text-gray-800 mb-6 transition-all duration-700 delay-300 ${
              showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {randomMessage}
          </h1>

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
          </div>

          {/* Botón de cerrar */}
          <div 
            className={`transition-all duration-700 delay-1000 ${
              showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg min-w-[200px] animate-fade-in-up"
            >
              Cerrar
            </Button>
          </div>
        </div>

        {/* Efecto de brillo en los bordes */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-braini-blue/5 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default SuccessPopup;

