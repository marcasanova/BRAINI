import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { Home, BookOpen, User, Award, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/shared/ui/button';
import { playSound } from '@/shared/lib/sound';

/**
 * Secciones de la app de familias. El nombre del menú es el mismo que el título de cada página;
 * cada sección tiene su color de marca (texto en tinta encima: contraste ≥ 5:1).
 */
const NAV_ITEMS = [
  { label: 'Panel de juego', mobileLabel: 'Juego', icon: Home, path: '/brainifamily/home', active: 'bg-braini-blue', hover: 'hover:bg-braini-blue-tint' },
  { label: 'Así me siento hoy', mobileLabel: 'Diario', icon: BookOpen, path: '/brainifamily/diario-emocional', active: 'bg-braini-turquoise', hover: 'hover:bg-braini-turquoise-tint' },
  { label: 'Evaluar y crecer', mobileLabel: 'Evaluar', icon: Award, path: '/brainifamily/inteligencia-emocional', active: 'bg-braini-yellow', hover: 'hover:bg-braini-yellow-tint' },
  { label: 'Mi familia', mobileLabel: 'Familia', icon: User, path: '/brainifamily/profile', active: 'bg-braini-pink', hover: 'hover:bg-braini-pink-tint' },
];

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/brainifamily/login');
  };

  const go = (path: string) => {
    playSound('tap');
    navigate(path);
  };

  if (isMobile) {
    return (
      <nav
        aria-label="Secciones"
        className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-ink/10 flex justify-around items-center h-20 md:hidden px-3 gap-1"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              type="button"
              aria-current={isActive ? 'page' : undefined}
              onClick={() => go(item.path)}
              className="flex flex-1 flex-col items-center gap-1 py-1 rounded-xl text-ink focus-visible:outline-2 focus-visible:outline-ink"
            >
              <span className={`px-4 py-1.5 rounded-full transition-colors ${isActive ? item.active : 'bg-transparent'}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'text-ink' : 'text-ink/60'}`} aria-hidden="true" />
              </span>
              <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium text-ink/70'}`}>{item.mobileLabel}</span>
            </button>
          );
        })}
      </nav>
    );
  }

  return (
    <aside className="hidden md:flex fixed left-0 top-0 h-screen w-72 bg-white border-r border-ink/10 z-50">
      <div className="flex flex-col w-full h-full">
        <div className="flex items-center justify-center p-6 border-b border-ink/10">
          <img src="/logo/logoBraini.png" alt="Braini" className="h-12 w-auto object-contain" />
        </div>

        <nav aria-label="Secciones" className="flex-1 p-4 space-y-1.5 sidebar-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => go(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left text-ink transition-colors focus-visible:outline-2 focus-visible:outline-ink ${
                  isActive ? `${item.active} font-semibold` : `${item.hover} font-medium`
                }`}
              >
                <span className={`p-2 rounded-xl ${isActive ? 'bg-white/50' : 'bg-ink/5'}`}>
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </span>
                <span className="text-base">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-ink/10">
          <Button
            type="button"
            variant="outline"
            className="w-full justify-center border-ink/15 text-ink hover:bg-ink/5"
            onClick={() => void handleLogout()}
          >
            <LogOut className="w-4 h-4 mr-2" aria-hidden="true" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Navbar;
