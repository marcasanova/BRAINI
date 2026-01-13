import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

// Rutas de assets públicos
const logoBraini = '/logo/logoBraini.png';

type LandingPage = 'hub' | 'kids' | 'juniors' | 'family';

interface NavbarLandingsProps {
  currentPage: LandingPage;
}

const NAV_ITEMS = [
  { label: 'Inicio', path: '/' },
  { label: 'Braini Kids', path: '/brainikids' },
  { label: 'Braini Juniors', path: '/brainijuniors' },
  { label: 'Braini Family', path: '/brainifamily' },
];

const NavbarLandings: React.FC<NavbarLandingsProps> = ({ currentPage }) => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getPageTitleParts = () => {
    switch (currentPage) {
      case 'kids':
        return { base: 'Braini', module: 'Kids' };
      case 'juniors':
        return { base: 'Braini', module: 'Juniors' };
      case 'family':
        return { base: 'Braini', module: 'Family' };
      default:
        return { base: 'Braini', module: 'Emotions' };
    }
  };

  const getPageSubtitle = () => {
    switch (currentPage) {
      case 'kids':
        return 'Centros educativos';
      case 'juniors':
        return 'Centros educativos';
      case 'family':
        return 'Familias';
      default:
        return null;
    }
  };

  const getNavbarBackground = () => {
    switch (currentPage) {
      case 'kids':
        return 'rgba(245, 130, 123, 0.8)'; // #f5827b con 80% opacidad
      case 'juniors':
        return 'rgba(53, 189, 177, 0.8)'; // #35bdb1 con 80% opacidad
      case 'family':
        return 'rgba(126, 164, 223, 0.8)'; // #7ea4df con 80% opacidad
      default:
        return 'rgba(255, 255, 255, 0.1)'; // Blanco translúcido para hub
    }
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const titleParts = getPageTitleParts();
  const pageSubtitle = getPageSubtitle();
  const navbarBackground = getNavbarBackground();

  // Menú para desktop (horizontal)
  const DesktopMenu = () => (
    <nav className="hidden md:flex items-center gap-4 lg:gap-6">
      {NAV_ITEMS.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`text-sm sm:text-base font-medium text-white transition-colors ${
              active
                ? 'font-bold'
                : 'text-white/90 hover:text-white'
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <header 
      className="relative z-50 px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 pb-4 sm:pb-6 backdrop-blur-sm shadow-md"
      style={{ background: navbarBackground }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo + Título de la página */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <Link 
              to="/" 
              className="flex items-center flex-shrink-0"
              aria-label="Ir a la página principal de Braini Emotions"
            >
              <img 
                src={logoBraini}
                alt="Braini Emotions Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain"
              />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl md:text-2xl text-white leading-tight">
                <span style={{ fontWeight: 400 }}>{titleParts.base}</span>{' '}
                <span style={{ fontWeight: 700 }}>{titleParts.module}</span>
              </h1>
              {pageSubtitle && (
                <p 
                  className="text-xs sm:text-sm md:text-base text-white/90 leading-tight"
                  style={{ fontWeight: 400, marginTop: '-2px' }}
                >
                  {pageSubtitle}
                </p>
              )}
            </div>
          </div>

          {/* Menú de navegación desktop */}
          {!isMobile && <DesktopMenu />}

          {/* Menú hamburguesa para móvil */}
          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
                  aria-label="Abrir menú de navegación"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white">
                <div className="flex flex-col h-full pt-8">
                  {/* Lista de navegación */}
                  <nav className="flex flex-col space-y-2">
                    {NAV_ITEMS.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <SheetClose asChild key={item.path}>
                          <Link
                            to={item.path}
                            onClick={handleLinkClick}
                            className={`px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                              active
                                ? 'bg-gray-100 text-gray-900 font-bold'
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavbarLandings;
