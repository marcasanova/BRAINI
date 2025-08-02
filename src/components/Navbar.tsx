import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

// Puedes reemplazar los emojis por iconos Lucide si lo prefieres
const NAV_ITEMS = [
  { label: 'Niveles', icon: '🏠', path: '/home' },
  { label: 'Estadísticas', icon: '📊', path: '/stats' },
  { label: 'Mi espacio', icon: '👤', path: '/profile' },
];

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  // Renderiza la bottom bar para móvil
  if (isMobile) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t flex justify-around items-center h-16 shadow-lg md:hidden">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center text-xs focus:outline-none transition-colors ${location.pathname === item.path ? 'text-braini-blue' : 'text-gray-400'}`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span>{item.label}</span>
            {location.pathname === item.path && (
              <span className="w-1 h-1 rounded-full bg-braini-blue mt-1"></span>
            )}
          </button>
        ))}
      </nav>
    );
  }

  // Renderiza la top bar para desktop/tablet
  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b h-16 items-center px-8 shadow-lg">
      <nav className="flex-1 flex justify-center gap-8">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`py-2 px-4 font-medium transition-colors ${location.pathname === item.path ? 'text-braini-blue border-b-2 border-braini-blue' : 'text-gray-500'}`}
          >
            <span className="mr-2 text-xl align-middle">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Navbar; 