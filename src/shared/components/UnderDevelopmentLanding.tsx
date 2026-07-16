import { Link } from 'react-router';
import { Button } from '@/shared/ui/button';
import NavbarLandings from '@/shared/components/navigation/NavbarLandings';

type UnderDevelopmentLandingProps = {
  productName: string;
  logoSrc: string;
  logoAlt: string;
  brandColor: string;
  subtitle: string;
};

const UnderDevelopmentLanding = ({
  productName,
  logoSrc,
  logoAlt,
  brandColor,
  subtitle,
}: UnderDevelopmentLandingProps) => {
  return (
    <main
      className="min-h-screen font-montserrat relative overflow-x-hidden flex flex-col"
      role="main"
      aria-label={`${productName} — en desarrollo`}
      style={{ background: brandColor }}
    >
      <NavbarLandings />

      <section
        className="relative flex-1 flex items-center justify-center px-4 sm:px-6 pt-16 sm:pt-[4.5rem] pb-12 sm:pb-16"
        aria-label={`${productName} próximamente`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
          <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-lg mx-auto text-center">
          <div className="mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <img
              src={logoSrc}
              alt={logoAlt}
              className="w-[min(100%,16rem)] sm:w-[20rem] h-auto object-contain"
            />
          </div>

          <div
            className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl"
            style={{
              boxShadow:
                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            }}
          >
            <span
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold text-white mb-4"
              style={{ background: brandColor }}
            >
              En desarrollo
            </span>

            <h1
              className="text-2xl sm:text-3xl font-black text-gray-900 mb-2"
              style={{ fontWeight: 900 }}
            >
              Próximamente
            </h1>

            <p className="text-base sm:text-lg text-gray-700 mb-3" style={{ fontWeight: 600 }}>
              {subtitle}
            </p>

            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8">
              Estamos preparando esta experiencia. Vuelve pronto para descubrir todo lo que
              {productName} tiene para ofrecer.
            </p>

            <Button
              asChild
              className="w-full sm:w-auto px-8 py-4 font-bold text-base sm:text-lg rounded-xl text-white hover:opacity-90 transition-opacity"
              style={{ background: brandColor }}
            >
              <Link to="/">Ir a Braini Emotions</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-4 py-6 border-t border-white/20">
        <p className="text-center text-sm text-white/80">
          © {new Date().getFullYear()} Braini Emotions. Todos los derechos reservados.
        </p>
      </footer>
    </main>
  );
};

export default UnderDevelopmentLanding;
