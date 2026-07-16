import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router';
import { Menu, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/shared/ui/sheet';
import { CTA_REUNION_MAILTO } from '@/shared/lib/constants/contact';

const MAIN_LOGO = '/logo/LogoNuevo.png';

const NAV_ITEMS = [
  { label: 'Braini Kids', path: '/brainikids' },
  { label: 'Braini Juniors', path: '/brainijuniors' },
  { label: 'Braini Family', path: '/brainifamily' },
];

const NavbarLandings: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLinkClick = () => setIsMenuOpen(false);

  const headerClass = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 backdrop-blur-md ${
    isScrolled
      ? 'bg-white/70 shadow-sm border-b border-white/40'
      : 'bg-white/50 border-b border-white/30'
  }`;

  const getLinkClass = (active: boolean) =>
    `text-sm lg:text-base font-medium transition-colors duration-200 whitespace-nowrap px-2 ${
      active
        ? 'text-white font-semibold drop-shadow-sm'
        : 'text-gray-800 hover:text-gray-900'
    }`;

  const BrandLogo = ({ mobile = false }: { mobile?: boolean }) => (
    <Link
      to="/"
      className="flex-shrink-0 transition-opacity duration-200 hover:opacity-80"
      aria-label="Ir a Braini Emotions"
    >
      <img
        src={MAIN_LOGO}
        alt="Braini Emotions"
        className={`block object-contain m-0 p-0 ${
          mobile ? 'h-11 w-auto' : 'h-11 w-auto sm:h-12 md:h-14 lg:h-16'
        }`}
      />
    </Link>
  );

  const HablemosButton = ({ className = '' }: { className?: string }) => (
    <a
      href={CTA_REUNION_MAILTO}
      className={`inline-flex items-center justify-center px-5 sm:px-6 py-2 sm:py-2.5 bg-braini-yellow hover:bg-braini-yellow-dark text-white font-bold text-sm sm:text-base transition-all duration-200 hover:shadow-md active:scale-[0.98] ${className}`}
      aria-label="Hablemos — solicitar reunión por correo"
    >
      Hablemos
    </a>
  );

  return (
    <header className={headerClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 sm:h-[4.5rem]">
          <div className="relative z-10 flex-shrink-0">
            <BrandLogo />
          </div>

          <nav
            className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-3"
            aria-label="Navegación principal"
          >
            {NAV_ITEMS.map((item, index) => (
              <React.Fragment key={item.path}>
                {index > 0 && (
                  <span
                    className="w-px h-4 bg-black shrink-0"
                    aria-hidden="true"
                  />
                )}
                <Link
                  to={item.path}
                  className={getLinkClass(isActive(item.path))}
                >
                  {item.label}
                </Link>
              </React.Fragment>
            ))}
          </nav>

          <div className="relative z-10 flex items-center gap-3 ml-auto">
            <HablemosButton className="hidden lg:inline-flex" />

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="lg:hidden p-2 rounded-lg text-gray-800 hover:bg-white/40 transition-colors duration-200"
                  aria-label="Abrir menú de navegación"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[min(100vw-2rem,320px)] bg-white p-0">
                <div className="flex flex-col h-full">
                  <div className="px-5 pt-6 pb-4 border-b border-gray-100">
                    <BrandLogo mobile />
                  </div>

                  <nav className="flex-1 px-3 py-4 space-y-1">
                    {NAV_ITEMS.map((item) => {
                      const active = isActive(item.path);
                      return (
                        <SheetClose asChild key={item.path}>
                          <Link
                            to={item.path}
                            onClick={handleLinkClick}
                            className={`flex items-center px-4 py-3.5 rounded-xl text-lg font-medium transition-colors duration-200 ${
                              active
                                ? 'font-semibold bg-gray-800 text-white'
                                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      );
                    })}
                  </nav>

                  <div className="px-4 pb-4">
                    <SheetClose asChild>
                      <a
                        href={CTA_REUNION_MAILTO}
                        onClick={handleLinkClick}
                        className="inline-flex w-full items-center justify-center px-6 py-3 bg-braini-yellow hover:bg-braini-yellow-dark text-white font-bold text-lg transition-all duration-200 hover:shadow-md"
                        aria-label="Hablemos — solicitar reunión por correo"
                      >
                        Hablemos
                      </a>
                    </SheetClose>
                  </div>

                  <div className="px-3 pb-6 pt-2 border-t border-gray-100">
                    <SheetClose asChild>
                      <button
                        onClick={handleLinkClick}
                        className="w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cerrar
                      </button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarLandings;
