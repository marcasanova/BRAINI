import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIsMobile } from '@/shared/hooks/use-mobile';
import { Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/shared/ui/sheet';

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
  const [isScrolled, setIsScrolled] = useState(false);

  // Detectar scroll para cambiar opacidad del fondo
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    // Aumentar opacidad cuando hay scroll
    const baseOpacity = isScrolled ? 0.95 : 0.8;
    switch (currentPage) {
      case 'kids':
        return `rgba(245, 130, 123, ${baseOpacity})`; // #f5827b
      case 'juniors':
        return `rgba(53, 189, 177, ${baseOpacity})`; // #35bdb1
      case 'family':
        return `rgba(126, 164, 223, ${baseOpacity})`; // #7ea4df
      default:
        return `rgba(255, 255, 255, ${isScrolled ? 0.2 : 0.1})`; // Blanco translúcido para hub
    }
  };

  const getActiveIndicatorColor = () => {
    switch (currentPage) {
      case 'kids':
        return '#f5827b';
      case 'juniors':
        return '#35bdb1';
      case 'family':
        return '#7ea4df';
      default:
        return '#ffffff';
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
  const DesktopMenu = () => {
    const activeColor = getActiveIndicatorColor();
    return (
      <nav className="hidden lg:flex items-center gap-1">
        {NAV_ITEMS.map((item, index) => {
          const active = isActive(item.path);
          return (
            <div key={item.path} className="relative">
              {index > 0 && (
                <span className="text-white/30 mx-2">|</span>
              )}
              <Link
                to={item.path}
                className={`relative text-sm xl:text-base font-medium text-white transition-all duration-300 px-3 py-2 rounded-lg ${
                  active
                    ? 'font-bold bg-white/20 shadow-lg'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
                style={{
                  ...(active && {
                    boxShadow: `0 2px 8px rgba(0, 0, 0, 0.15), 0 0 0 1px ${activeColor}40`
                  })
                }}
              >
                {item.label}
                {active && (
                  <span 
                    className="absolute bottom-0 left-0 right-0 h-1 rounded-full transition-all duration-300 shadow-sm"
                    style={{ 
                      backgroundColor: activeColor,
                      boxShadow: `0 2px 4px ${activeColor}60`
                    }}
                  />
                )}
              </Link>
            </div>
          );
        })}
      </nav>
    );
  };

  const activeColor = getActiveIndicatorColor();

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 md:px-8 pt-1 sm:pt-2 pb-1 sm:pb-2 backdrop-blur-sm shadow-md transition-all duration-300"
      style={{ background: navbarBackground }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo + Título de la página */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            <Link 
              to="/" 
              className="flex items-center flex-shrink-0 transition-transform duration-300 hover:scale-110 active:scale-95"
              aria-label="Ir a la página principal de Braini Emotions"
            >
              <img 
                src={logoBraini}
                alt="Braini Emotions Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 object-contain transition-opacity duration-300 hover:opacity-90"
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

          {/* Menú de navegación desktop y tablet */}
          {!isMobile && (
            <>
              {/* Menú para tablets (md a lg) */}
              <nav className="hidden md:flex lg:hidden items-center gap-2">
                {NAV_ITEMS.map((item, index) => {
                  const active = isActive(item.path);
                  return (
                    <div key={item.path} className="relative">
                      {index > 0 && (
                        <span className="text-white/30 mx-1 text-xs">|</span>
                      )}
                      <Link
                        to={item.path}
                        className={`relative text-xs font-medium text-white transition-all duration-300 px-2 py-1.5 rounded ${
                          active
                            ? 'font-bold bg-white/20 shadow-md'
                            : 'text-white/90 hover:text-white hover:bg-white/10'
                        }`}
                        style={{
                          ...(active && {
                            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.15), 0 0 0 1px ${activeColor}40`
                          })
                        }}
                      >
                        {item.label}
                        {active && (
                          <span 
                            className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all duration-300"
                            style={{ 
                              backgroundColor: activeColor,
                              boxShadow: `0 1px 3px ${activeColor}60`
                            }}
                          />
                        )}
                      </Link>
                    </div>
                  );
                })}
              </nav>
              {/* Menú para desktop (lg+) */}
              <DesktopMenu />
            </>
          )}

          {/* Menú hamburguesa para móvil */}
          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2 rounded-lg text-white hover:bg-white/20 transition-all duration-300 active:scale-95"
                  aria-label="Abrir menú de navegación"
                >
                  <Menu className="w-6 h-6 transition-transform duration-300" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[320px] bg-white">
                <div className="flex flex-col h-full pt-6">
                  {/* Header del menú móvil con logo y título */}
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                    <img 
                      src={logoBraini}
                      alt="Braini Emotions Logo" 
                      className="w-10 h-10 object-contain"
                    />
                    <div className="flex flex-col">
                      <h2 className="text-base font-semibold text-gray-900">
                        <span style={{ fontWeight: 400 }}>{titleParts.base}</span>{' '}
                        <span style={{ fontWeight: 700 }}>{titleParts.module}</span>
                      </h2>
                      {pageSubtitle && (
                        <p className="text-xs text-gray-600" style={{ fontWeight: 400 }}>
                          {pageSubtitle}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Lista de navegación */}
                  <nav className="flex flex-col space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <SheetClose asChild key={item.path}>
                          <Link
                            to={item.path}
                            onClick={handleLinkClick}
                            className={`relative px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 ${
                              active
                                ? 'bg-gray-100 text-gray-900 font-bold shadow-sm'
                                : 'text-gray-700 hover:bg-gray-50 hover:translate-x-1'
                            }`}
                            style={{
                              ...(active && {
                                borderLeft: `4px solid ${activeColor}`,
                                backgroundColor: `${activeColor}15`,
                                boxShadow: `-2px 0 8px ${activeColor}30`
                              })
                            }}
                          >
                            <span className="flex items-center gap-2">
                              {item.label}
                              {active && (
                                <span 
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: activeColor }}
                                />
                              )}
                            </span>
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>
                  
                  {/* Botón de cierre más visible */}
                  <div className="mt-auto pt-4 border-t border-gray-200">
                    <SheetClose asChild>
                      <button
                        onClick={handleLinkClick}
                        className="w-full px-4 py-3 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-300 flex items-center justify-center gap-2"
                      >
                        <X className="w-5 h-5" />
                        Cerrar
                      </button>
                    </SheetClose>
                  </div>
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
