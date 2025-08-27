import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Home, BookOpen, User, Menu, X, Brain, Sparkles, Heart } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Panel de Juego', icon: Home, path: '/home', description: 'Mapa con todos los niveles' },
  { label: 'Diario Emocional', icon: BookOpen, path: '/diario-emocional', description: 'Registra tus emociones' },
  { label: 'Inteligencia Emocional', icon: Heart, path: '/inteligencia-emocional', description: 'Tests de inteligencia emocional' },
  { label: 'Perfil', icon: User, path: '/profile', description: 'Tu perfil personal' },
];

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Renderiza la bottom bar para móvil
  if (isMobile) {
    return (
      <>
        {/* Botón de menú hamburguesa para móvil */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 left-4 z-50 md:hidden bg-white/95 backdrop-blur-md p-3 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
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
            <div className="fixed left-0 top-0 h-full w-72 bg-white/98 backdrop-blur-md shadow-2xl border-r border-gray-200 sidebar-slide-in">
              <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-braini-blue/5 to-braini-blue-light/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-braini-blue to-braini-blue-light rounded-xl flex items-center justify-center shadow-lg">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-braini-blue">BRAINI</h2>
                    <p className="text-xs text-gray-500">Tu compañero emocional</p>
                  </div>
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
                  
                  return (
                    <button
                      key={item.path}
                      onClick={() => {
                        navigate(item.path);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-braini-blue to-braini-blue-light text-white shadow-lg transform scale-105' 
                          : 'text-gray-700 hover:bg-gray-50 hover:text-braini-blue hover:shadow-md'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-white/20' : 'bg-gray-100'}`}>
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold block">{item.label}</span>
                        <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                          {item.description}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>
              
              {/* Footer de la sidebar móvil */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="text-center text-xs text-gray-500">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Sparkles className="w-3 h-3 text-braini-blue" />
                    <span className="font-medium text-braini-blue">BRAINI</span>
                  </div>
                  <p>Tu bienestar emocional</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom bar para navegación rápida en móvil */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-gray-200 flex justify-around items-center h-20 shadow-lg md:hidden">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center text-xs focus:outline-none transition-all duration-200 ${
                  isActive ? 'text-braini-blue transform scale-110' : 'text-gray-400'
                }`}
              >
                <div className={`p-2 rounded-lg mb-1 transition-all duration-200 ${
                  isActive ? 'bg-braini-blue/10' : 'bg-transparent'
                }`}>
                  <Icon className={`w-6 h-6 ${isActive ? 'text-braini-blue' : 'text-gray-400'}`} />
                </div>
                <span className="font-medium">{item.label}</span>
                {isActive && (
                  <span className="w-1 h-1 rounded-full bg-braini-blue mt-1 animate-pulse"></span>
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
    <aside className="hidden md:flex fixed left-0 top-0 h-full w-72 bg-white/98 backdrop-blur-md shadow-2xl border-r border-gray-200 z-40">
      <div className="flex flex-col w-full">
        {/* Header de la sidebar */}
        <div className="flex items-center justify-center p-6 border-b border-gray-200 bg-gradient-to-r from-braini-blue/5 to-braini-blue-light/5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-braini-blue to-braini-blue-light rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-braini-blue">BRAINI</h1>
              <p className="text-xs text-gray-500">Tu compañero emocional</p>
            </div>
          </div>
        </div>
        
        {/* Navegación */}
        <nav className="flex-1 p-4 space-y-2 sidebar-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-200 ${
                  isActive 
                    ? 'bg-gradient-to-r from-braini-blue to-braini-blue-light text-white shadow-lg transform scale-105' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-braini-blue hover:shadow-md'
                }`}
              >
                <div className={`p-2 rounded-lg transition-all duration-200 ${
                  isActive ? 'bg-white/20' : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                </div>
                <div className="flex-1">
                  <span className="font-semibold block">{item.label}</span>
                  <span className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                    {item.description}
                  </span>
                </div>
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>
        
        {/* Footer de la sidebar */}
        <div className="p-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="text-center text-xs text-gray-500">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-braini-blue" />
              <span className="font-medium text-braini-blue">BRAINI</span>
            </div>
            <p>Tu compañero para el</p>
            <p className="font-medium text-braini-blue">bienestar emocional</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Navbar; 