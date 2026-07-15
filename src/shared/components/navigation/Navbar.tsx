import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { Home, BookOpen, User, Award } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Panel de Juego', mobileLabel: 'Sesiones', icon: Home, path: '/brainifamily/home' },
  { label: 'Así me siento hoy', mobileLabel: 'Diario', icon: BookOpen, path: '/brainifamily/diario-emocional' },
  { label: 'Evaluar y Crecer', mobileLabel: 'Test', icon: Award, path: '/brainifamily/inteligencia-emocional' },
  { label: 'Mi familia', mobileLabel: 'Perfil', icon: User, path: '/brainifamily/profile' },
];

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  // Función para obtener el color sólido según la ruta activa
  const getActiveColor = (path: string) => {
    switch (path) {
      case '/brainifamily/home':
        return 'bg-braini-blue'; // Azul #7ea4df
      case '/brainifamily/diario-emocional':
        return 'bg-braini-turquoise'; // Verde/Turquesa #35bdb1
      case '/brainifamily/inteligencia-emocional':
        return 'bg-braini-yellow'; // Amarillo #f8cd50
      case '/brainifamily/profile':
        return 'bg-braini-pink'; // Rojo/Coral #f5827b
      default:
        return 'bg-braini-blue';
    }
  };

  // Función para obtener las clases de color sólido según la ruta activa (para móvil)
  const getActiveSolidColorClasses = (path: string) => {
    switch (path) {
      case '/brainifamily/home':
        return {
          text: 'text-braini-blue',
          textActive: 'text-braini-blue font-bold',
          bg: 'bg-braini-blue/20',
          bgActive: 'bg-braini-blue'
        };
      case '/brainifamily/diario-emocional':
        return {
          text: 'text-braini-turquoise',
          textActive: 'text-braini-turquoise font-bold',
          bg: 'bg-braini-turquoise/20',
          bgActive: 'bg-braini-turquoise'
        };
      case '/brainifamily/inteligencia-emocional':
        return {
          text: 'text-braini-yellow',
          textActive: 'text-braini-yellow font-bold',
          bg: 'bg-braini-yellow/20',
          bgActive: 'bg-braini-yellow'
        };
      case '/brainifamily/profile':
        return {
          text: 'text-braini-pink',
          textActive: 'text-braini-pink font-bold',
          bg: 'bg-braini-pink/20',
          bgActive: 'bg-braini-pink'
        };
      default:
        return {
          text: 'text-braini-blue',
          textActive: 'text-braini-blue font-bold',
          bg: 'bg-braini-blue/20',
          bgActive: 'bg-braini-blue'
        };
    }
  };

  // Función para obtener las clases de hover según la ruta (para desktop)
  const getHoverColorClasses = (path: string) => {
    switch (path) {
      case '/brainifamily/home':
        return {
          button: 'hover:bg-gray-50 hover:text-braini-blue hover:shadow-md',
          iconContainer: 'group-hover:bg-braini-blue/20 group-hover:border-braini-blue',
          icon: 'group-hover:text-braini-blue'
        };
      case '/brainifamily/diario-emocional':
        return {
          button: 'hover:bg-gray-50 hover:text-braini-turquoise hover:shadow-md',
          iconContainer: 'group-hover:bg-braini-turquoise/20 group-hover:border-braini-turquoise',
          icon: 'group-hover:text-braini-turquoise'
        };
      case '/brainifamily/inteligencia-emocional':
        return {
          button: 'hover:bg-gray-50 hover:text-braini-yellow hover:shadow-md',
          iconContainer: 'group-hover:bg-braini-yellow/20 group-hover:border-braini-yellow',
          icon: 'group-hover:text-braini-yellow'
        };
      case '/brainifamily/profile':
        return {
          button: 'hover:bg-gray-50 hover:text-braini-pink hover:shadow-md',
          iconContainer: 'group-hover:bg-braini-pink/20 group-hover:border-braini-pink',
          icon: 'group-hover:text-braini-pink'
        };
      default:
        return {
          button: 'hover:bg-gray-50 hover:text-braini-blue hover:shadow-md',
          iconContainer: 'group-hover:bg-braini-blue/20 group-hover:border-braini-blue',
          icon: 'group-hover:text-braini-blue'
        };
    }
  };

  // Renderiza la bottom bar para móvil
  if (isMobile) {
    return (
      <>
        {/* Bottom bar para navegación rápida en móvil */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-gray-200 flex justify-around items-center h-20 shadow-lg md:hidden px-5 gap-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const colorClasses = getActiveSolidColorClasses(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center text-xs focus:outline-none transition-all duration-200 py-1 px-2 ${
                  isActive ? colorClasses.textActive : 'text-gray-400'
                }`}
              >
                <div className={`p-1.5 rounded-lg mb-0.5 transition-all duration-200 ${
                  isActive ? colorClasses.bgActive : 'bg-transparent'
                }`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                </div>
                <span className={`font-medium text-[10px] ${isActive ? 'font-bold' : ''}`}>
                  {item.mobileLabel || item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </>
    );
  }

  // Renderiza la sidebar izquierda para desktop/tablet
  return (
    <aside className="hidden md:flex absolute left-0 top-0 bottom-0 w-72 bg-white border-r border-gray-200 z-50" style={{ backgroundColor: 'white' }}>
      <div className="flex flex-col w-full h-full bg-white">
        {/* Header de la sidebar */}
        <div className="flex items-center justify-center p-6 border-b border-gray-200">
          <img 
            src="/logo/logoBraini.png" 
            alt="BRAINI Logo" 
            className="h-12 w-auto object-contain"
          />
        </div>
        
        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-2 sidebar-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const activeColor = getActiveColor(item.path);
            const hoverClasses = getHoverColorClasses(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`group w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 ${
                  isActive 
                    ? `${activeColor} text-white shadow-lg` 
                    : `text-gray-700 ${hoverClasses.button}`
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-200 border ${
                  isActive 
                    ? 'bg-white/20 border-transparent' 
                    : `bg-gray-100 border-gray-200 ${hoverClasses.iconContainer}`
                }`}>
                  <Icon className={`w-5 h-5 transition-all duration-200 ${
                    isActive 
                      ? 'text-white' 
                      : `text-gray-600 ${hoverClasses.icon}`
                  }`} />
                </div>
                <span className="font-semibold text-base flex-1">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Navbar; 