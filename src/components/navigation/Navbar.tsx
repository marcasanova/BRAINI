import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home, BookOpen, User, Menu, X, Heart } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Panel de Juego', icon: Home, path: '/home' },
  { label: 'Así me siento hoy', icon: BookOpen, path: '/diario-emocional' },
  { label: 'Evaluar y Crecer', icon: Heart, path: '/inteligencia-emocional' },
  { label: 'Mi familia', icon: User, path: '/profile' },
];

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Función para obtener el color sólido según la ruta activa
  const getActiveColor = (path: string) => {
    switch (path) {
      case '/home':
        return 'bg-braini-blue'; // Azul #7ea4df
      case '/diario-emocional':
        return 'bg-braini-turquoise'; // Verde/Turquesa #35bdb1
      case '/inteligencia-emocional':
        return 'bg-braini-yellow'; // Amarillo #f8cd50
      case '/profile':
        return 'bg-braini-pink'; // Rojo/Coral #f5827b
      default:
        return 'bg-braini-blue';
    }
  };

  // Función para obtener las clases de color sólido según la ruta activa (para móvil)
  const getActiveSolidColorClasses = (path: string) => {
    switch (path) {
      case '/home':
        return {
          text: 'text-braini-blue',
          bg: 'bg-braini-blue/10',
          dot: 'bg-braini-blue'
        };
      case '/diario-emocional':
        return {
          text: 'text-braini-turquoise',
          bg: 'bg-braini-turquoise/10',
          dot: 'bg-braini-turquoise'
        };
      case '/inteligencia-emocional':
        return {
          text: 'text-braini-yellow',
          bg: 'bg-braini-yellow/10',
          dot: 'bg-braini-yellow'
        };
      case '/profile':
        return {
          text: 'text-braini-pink',
          bg: 'bg-braini-pink/10',
          dot: 'bg-braini-pink'
        };
      default:
        return {
          text: 'text-braini-blue',
          bg: 'bg-braini-blue/10',
          dot: 'bg-braini-blue'
        };
    }
  };

  // Renderiza la bottom bar para móvil
  if (isMobile) {
    return (
      <>
        {/* Botón de menú hamburguesa para móvil */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 md:hidden bg-white p-3 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-6 h-6 text-braini-blue" />
        </button>

        {/* Sidebar móvil */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Sidebar */}
            <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-2xl border-r border-gray-200 sidebar-slide-in">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <img 
                    src="/logo/LogoBraini_new.png" 
                    alt="BRAINI Logo" 
                    className="h-10 w-auto object-contain"
                  />
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <nav className="p-4 space-y-2 sidebar-scrollbar">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  const activeColor = getActiveColor(item.path);
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 ${
                        isActive 
                          ? `${activeColor} text-white shadow-lg` 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-braini-blue hover:shadow-md'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-all duration-200 ${
                        isActive ? 'bg-white/20' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <span className="font-semibold text-base">{item.label}</span>
                      {isActive && (
                        <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* Bottom bar para navegación rápida en móvil */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 flex justify-around items-center h-20 shadow-lg md:hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const colorClasses = getActiveSolidColorClasses(item.path);
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center text-xs focus:outline-none transition-all duration-200 ${
                  isActive ? `${colorClasses.text} transform scale-110` : 'text-gray-400'
                }`}
              >
                <div className={`p-2 rounded-lg mb-1 transition-all duration-200 ${
                  isActive ? colorClasses.bg : 'bg-transparent'
                }`}>
                  <Icon className={`w-6 h-6 ${isActive ? colorClasses.text : 'text-gray-400'}`} />
                </div>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <span className={`w-1 h-1 rounded-full ${colorClasses.dot} mt-1 animate-pulse`}></span>
                )}
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
            src="/logo/LogoBraini_new.png" 
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
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 ${
                  isActive 
                    ? `${activeColor} text-white shadow-lg` 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-braini-blue hover:shadow-md'
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <span className="font-semibold text-base flex-1">{item.label}</span>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};

export default Navbar; 