import React, { useState, useEffect } from 'react';
import { Button } from '@/shared/ui/button';
import { ArrowRight, Users, GraduationCap, Heart } from 'lucide-react';
import { CONTACT_EMAIL, CTA_REUNION_MAILTO } from '@/shared/lib/constants/contact';

// Rutas de assets públicos
const logoBraini = '/logo/logoBraini.png';
const logoInstagram = '/LogoInstagram.svg';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // SEO: meta tags para landing B2B centros educativos
  useEffect(() => {
    document.title = 'Braini Emotions - Neurobienestar Emocional Educativo | Centros de Referencia';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convierta su centro como referente en neurobienestar emocional educativo. Sistema a 3 años con Universidad de Alicante y Cádiz. Solicite su reunión estratégica.');
    }
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) canonical.setAttribute('href', 'https://brainiemotions.com');

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: 'Braini Emotions',
      url: 'https://brainiemotions.com',
      description: 'Sistema estratégico de neurobienestar emocional para centros educativos. Colaboración Universidad de Alicante y Universidad de Cádiz.',
    };
    const existing = document.querySelector('script[type="application/ld+json"][data-landing-page]');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-landing-page', 'true');
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    return () => {
      const toRemove = document.querySelector('script[type="application/ld+json"][data-landing-page]');
      if (toRemove) toRemove.remove();
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <main
      className="min-h-screen bg-white font-montserrat relative overflow-x-hidden transition-colors duration-300"
      role="main"
      aria-label="Landing Braini Emotions - Neurobienestar emocional para centros educativos"
    >
      {/* ——— 1. HERO ——— */}
      <section
        className="relative overflow-hidden bg-white pt-0 pb-10 sm:pb-14 lg:min-h-[min(100dvh,56rem)] lg:pb-0 lg:flex lg:flex-col"
        aria-label="Hero - Convierta su centro en referente"
      >
        <div className="w-full flex-1 min-h-0 min-w-0 max-w-[1920px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(280px,520px)] gap-0 lg:gap-0 lg:min-h-[min(100dvh,56rem)] lg:items-stretch">
            <div
              className={`min-w-0 flex flex-col justify-start lg:justify-center transition-all duration-600 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0'} pt-8 sm:pt-10 px-4 sm:px-8 lg:pl-12 xl:pl-16 lg:pr-8 lg:py-10`}
            >
              <div className="flex items-center gap-3 mb-3 self-start">
                <img
                  src={logoBraini}
                  alt="Braini Emotions"
                  className="w-10 h-10 object-contain"
                />
                <div className="flex flex-col">
                  <span className="text-gray-900 font-black leading-none text-2xl" style={{ fontWeight: 800 }}>
                    Braini Emotions
                  </span>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <h1
                  className="text-2xl min-[380px]:text-3xl sm:text-4xl lg:text-[2.35rem] xl:text-5xl font-black text-gray-900 leading-tight"
                  style={{ fontWeight: 900 }}
                >
                  Convierta su centro como
                  <br />
                  referente en Neurobienestar Emocional Educativo.
                </h1>

                <p className="text-gray-800 text-base sm:text-lg leading-relaxed mt-5" style={{ fontWeight: 600 }}>
                  El modelo estructurado que los centros educativos están adoptando para afrontar los nuevos retos emocionales en el aula.
                </p>

                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mt-5" style={{ fontWeight: 500 }}>
                  Un sistema que integra <strong>alumnado, docentes</strong> y <strong>familias</strong> para convertir el bienestar emocional en una práctica educativa real de centro.
                </p>

                <a href={CTA_REUNION_MAILTO} className="block sm:inline-block w-full sm:w-auto mt-6" aria-label="Solicitar reunión estratégica">
                  <Button
                    className="w-full sm:w-auto text-white px-7 sm:px-10 py-4 sm:py-5 font-bold text-base sm:text-lg transition-all md:hover:opacity-90 md:hover:scale-105"
                    style={{ background: '#7ea4df', border: 'none' }}
                  >
                    <span className="flex items-center justify-center gap-2">
                      Solicitar reunión estratégica
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Button>
                </a>

                <p className="text-gray-600 text-sm sm:text-base mt-4" style={{ fontWeight: 400 }}>
                  Implantaciones limitadas cada curso · Centros fundadores
                </p>
              </div>
            </div>

            <div
              className={`relative min-h-0 w-full max-w-[520px] mx-auto lg:mx-0 lg:max-w-none lg:justify-self-end lg:h-full lg:self-stretch transition-all duration-600 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-0'}`}
            >
              {/* Móvil/tablet: caja con ratio acotada para que la imagen no desborde */}
              <div className="relative mt-6 sm:mt-8 lg:mt-0 w-full overflow-hidden rounded-none aspect-[5/6] max-h-[min(72dvh,520px)] sm:aspect-[4/3] sm:max-h-[min(65dvh,480px)] md:aspect-[16/10] md:max-h-[min(58dvh,440px)] lg:absolute lg:inset-0 lg:aspect-auto lg:max-h-none lg:h-full">
                <img
                  src="/landing/Seccion1.jpg"
                  alt="Familia y alumnado en actividad emocional"
                  className="absolute inset-0 w-full h-full object-cover object-top lg:object-center"
                  sizes="(max-width: 1023px) 100vw, 520px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— 2. NUEVO DESAFÍO EMOCIONAL ——— */}
      <section className="relative isolate overflow-hidden py-12 sm:py-16 md:py-20 px-3 sm:px-4" style={{ background: '#FFF9F1' }} aria-label="Nuevo desafío emocional">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black leading-tight mb-8 sm:mb-10" style={{ fontWeight: 900, color: '#111827' }}>
            Los centros educativos afrontan
            <br />
            un nuevo desafío emocional
          </h2>

          <div className="relative max-w-5xl mx-auto">
            {/* Decoración tipo flechas (suave) */}
            <svg
              className="pointer-events-none absolute inset-0 w-full h-full"
              viewBox="0 0 1200 220"
              preserveAspectRatio="none"
            >
              <defs>
                <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(255,255,255,0.7)" />
                </marker>
              </defs>
              <path
                d="M 260 120 C 390 50, 450 50, 570 120"
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="8"
                fill="none"
                markerEnd="url(#arrowHead)"
              />
              <path
                d="M 630 120 C 750 50, 810 50, 940 120"
                stroke="rgba(255,255,255,0.65)"
                strokeWidth="8"
                fill="none"
                markerEnd="url(#arrowHead)"
              />
            </svg>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-stretch relative">
              <div
                className="rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col"
                style={{ background: '#f5827b' }}
              >
                <div className="flex items-center justify-center text-[#111827] mb-3">
                  <Users size={40} strokeWidth={1.75} />
                </div>
                <h3 className="text-[#111827] font-black text-xl" style={{ fontWeight: 900 }}>
                  ALUMNOS
                </h3>
                <p className="text-[#111827] font-medium mt-2 text-base">
                  Aumento de conflictos emocionales
                </p>
              </div>

              <div
                className="rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col"
                style={{ background: '#35bdb1' }}
              >
                <div className="flex items-center justify-center text-[#111827] mb-3">
                  <GraduationCap size={40} strokeWidth={1.75} />
                </div>
                <h3 className="text-[#111827] font-black text-xl" style={{ fontWeight: 900 }}>
                  DOCENTES
                </h3>
                <p className="text-[#111827] font-medium mt-2 text-base">
                  Desgaste emocional creciente
                </p>
              </div>

              <div
                className="rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col"
                style={{ background: '#7ea4df' }}
              >
                <div className="flex items-center justify-center text-[#111827] mb-3">
                  <Heart size={40} strokeWidth={1.75} />
                </div>
                <h3 className="text-[#111827] font-black text-xl" style={{ fontWeight: 900 }}>
                  FAMILIAS
                </h3>
                <p className="text-[#111827] font-medium mt-2 text-base">
                  Preocupación por el bienestar de sus hijos
                </p>
              </div>
            </div>
          </div>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mt-8 max-w-4xl mx-auto">
            Cuando estas tres realidades se cruzan, el bienestar emocional deja de ser un complemento y se convierte en un desafío estructural del centro.
          </p>

          <p className="text-gray-900 font-bold text-base sm:text-lg leading-relaxed mt-6 max-w-4xl mx-auto">
            Los centros educativos necesitan un modelo estructurado que integre el bienestar emocional de forma real en su proyecto educativo.
          </p>
        </div>
      </section>

      {/* ——— 3. SISTEMA ESTRATÉGICO 360º ——— */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4" style={{ background: '#EEF4FF' }} aria-label="Sistema estratégico 360º de centro">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col">
            <div
              className="w-fit mb-4"
              style={{
                border: '2px solid #7ea4df',
                color: '#7ea4df',
                padding: '8px 14px',
                borderRadius: 10,
                fontWeight: 800,
                letterSpacing: '-0.01em',
                background: 'transparent',
              }}
            >
              SISTEMA ESTRATÉGICO 360º
            </div>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 leading-tight" style={{ fontWeight: 900 }}>
              Braini Emotions
            </h2>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-4" style={{ fontWeight: 900 }}>
              Sistema Estratégico 360º de Centro
            </h3>

            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-2" style={{ fontWeight: 500 }}>
              Braini no es un programa emocional común.
            </p>
            <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6" style={{ fontWeight: 500 }}>
              Es una arquitectura educativa de centro.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-8">
              <div
                className="rounded-xl p-6"
                style={{
                  background: '#f8cd50',
                }}
              >
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3" style={{ fontWeight: 900 }}>
                  Aula -
                  <br />
                  Braini Kids / Junior
                </h4>
                <p className="text-sm sm:text-base text-gray-900" style={{ fontWeight: 600 }}>
                  Sesiones estructuradas listas para aplicar en el aula.
                </p>
              </div>

              <div
                className="rounded-xl p-6"
                style={{
                  background: '#f5827b',
                }}
              >
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3" style={{ fontWeight: 900 }}>
                  Docentes -
                  <br />
                  Braini Teachers
                </h4>
                <p className="text-sm sm:text-base text-gray-900" style={{ fontWeight: 600 }}>
                  Formación progresiva para el equipo docente. Trainer Braini.
                </p>
              </div>

              <div
                className="rounded-xl p-6"
                style={{
                  background: '#35bdb1',
                }}
              >
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3" style={{ fontWeight: 900 }}>
                  Familias -
                  <br />
                  Braini Family
                </h4>
                <p className="text-sm sm:text-base text-gray-900" style={{ fontWeight: 600 }}>
                  App para acompañamiento emocional familiar.
                </p>
              </div>
            </div>

            <p
              className="text-gray-900 text-base sm:text-lg leading-relaxed text-center"
              style={{ fontWeight: 600 }}
            >
              Cuando aula, docentes y familias trabajan con el mismo marco, el bienestar deja de depender de iniciativas aisladas. Se convierte en cultura de centro.
            </p>
          </div>
        </div>
      </section>

      {/* ——— 4. RED E INVESTIGACIÓN ——— */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-white" aria-label="Red de neurobienestar educativo">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8" style={{ color: '#1f2937', fontWeight: 700 }}>
            1ª Red de Neurobienestar emocional Educativa
          </h2>
          <p className="text-gray-700 text-base sm:text-lg text-center mb-3" style={{ fontWeight: 600 }}>
            Con participación académica:
          </p>
          <div className="flex flex-wrap justify-center items-start gap-6 sm:gap-10 mb-4">
            <div className="flex flex-col items-center min-w-0 max-w-[46%] sm:max-w-none">
              <img
                src="/unis/logo_alicante.png"
                alt="Universitat d'Alacant"
                className="h-12 sm:h-16 md:h-20 w-auto max-w-full object-contain"
              />
              <p className="text-gray-700 text-xs sm:text-sm font-medium mt-2">Universitat d'Alacant</p>
            </div>
            <div className="flex flex-col items-center min-w-0 max-w-[46%] sm:max-w-none">
              <img
                src="/unis/logo_cadiz.png"
                alt="Universidad de Cádiz"
                className="h-12 sm:h-16 md:h-20 w-auto max-w-full object-contain"
              />
              <p className="text-gray-700 text-xs sm:text-sm font-medium mt-2">Universidad de Cádiz</p>
            </div>
          </div>
          <p className="text-gray-700 text-base sm:text-lg text-center mb-0" style={{ fontWeight: 500 }}>
            Investigación aplicada en Neurobienestar educativo
          </p>
        </div>
      </section>

      {/* ——— 5. IMPLANTACIÓN (3 años) ——— */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4" style={{ background: '#FFF6E9' }} aria-label="Hoja de ruta 3 años">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 text-left mb-6 sm:mb-8" style={{ fontWeight: 900 }}>
            Implantación progresiva diseñada sin sobrecargar al equipo docente.
          </h2>

          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-10">
            El modelo Braini Emotions se despliega de forma gradual y sostenida, garantizando una integración real y natural en el proyecto educativo del centro, respetando los tiempos y el ritmo de trabajo del equipo docente.
          </p>

          {/* Stepper horizontal (pantallas anchas; tablet en vertical para evitar overflow) */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-center gap-3 xl:gap-6">
              <div className="flex flex-col items-start shrink-0 min-w-0 xl:min-w-[200px]">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: '#7ea4df' }}
                >
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-[1.5rem] h-3 rounded-full" style={{ background: '#7ea4df' }} />

              <div className="flex flex-col items-center shrink-0 min-w-0 xl:min-w-[200px]">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: '#35bdb1' }}
                >
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="flex-1 min-w-[1.5rem] h-3 rounded-full" style={{ background: '#35bdb1' }} />

              <div className="flex flex-col items-end shrink-0 min-w-0 xl:min-w-[200px]">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ background: '#f5827b' }}
                >
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="text-left lg:text-left">
                <p className="text-lg font-bold text-gray-900" style={{ fontWeight: 800 }}>
                  Año 1 – Inicio en Educación Infantil
                </p>
                <p className="text-gray-700 mt-3">Inicio en Educación Infantil.</p>
              </div>
              <div className="text-left lg:text-center">
                <p className="text-lg font-bold text-gray-900" style={{ fontWeight: 800 }}>
                  Año 2 – Extensión a Primaria
                </p>
                <p className="text-gray-700 mt-3">Extensión progresiva a Primaria.</p>
              </div>
              <div className="text-left lg:text-right">
                <p className="text-lg font-bold text-gray-900" style={{ fontWeight: 800 }}>
                  Año 3 – Modelo plenamente integrado
                </p>
                <p className="text-gray-700 mt-3">Modelo plenamente integrado en el proyecto educativo.</p>
              </div>
            </div>
          </div>

          {/* Stepper vertical (hasta < lg) */}
          <div className="lg:hidden">
            <div className="flex flex-col gap-8">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#7ea4df' }}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900" style={{ fontWeight: 800 }}>
                    Año 1 – Inicio en Educación Infantil
                  </p>
                  <p className="text-gray-700 mt-2">Inicio en Educación Infantil.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#35bdb1' }}>
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900" style={{ fontWeight: 800 }}>
                    Año 2 – Extensión a Primaria
                  </p>
                  <p className="text-gray-700 mt-2">Extensión progresiva a Primaria.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#f5827b' }}>
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900" style={{ fontWeight: 800 }}>
                    Año 3 – Modelo plenamente integrado
                  </p>
                  <p className="text-gray-700 mt-2">Modelo plenamente integrado en el proyecto educativo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ——— 6. IMPACTO ESTRATÉGICO ——— */}
      <section
        className="relative isolate overflow-hidden py-12 sm:py-16 md:py-20 px-3 sm:px-4"
        aria-label="Impacto estratégico"
      >
        {/* Background image: contenida en la sección, sin interacción */}
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-no-repeat"
          style={{
            backgroundImage: 'url(/landing/Seccion6.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
          aria-hidden
        />
        {/* Overlay para legibilidad */}
        <div className="pointer-events-none absolute inset-0 z-0" style={{ background: 'rgba(255,255,255,0.78)' }} aria-hidden />

        <div className="relative z-10 max-w-5xl mx-auto min-w-0">
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10"
            style={{ color: '#1f2937', fontWeight: 700 }}
          >
            Impacto estratégico para el centro
          </h2>

          <p className="text-gray-800 text-base sm:text-lg text-center leading-relaxed mb-8 sm:mb-10 max-w-3xl mx-auto px-1" style={{ fontWeight: 500 }}>
            Braini Emotions supone una decisión de liderazgo para la identidad y el posicionamiento del centro educativo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white/85 backdrop-blur rounded-xl p-6 shadow-sm">
              <p className="font-bold text-gray-900 text-lg sm:text-xl mb-2" style={{ fontWeight: 800 }}>
                Diferenciación educativa
              </p>
              <p className="text-gray-700 text-base sm:text-lg">
                Posicione su centro como referente en neurobienestar.
              </p>
            </div>
            <div className="bg-white/85 backdrop-blur rounded-xl p-6 shadow-sm">
              <p className="font-bold text-gray-900 text-lg sm:text-xl mb-2" style={{ fontWeight: 800 }}>
                Estabilidad equipo docente
              </p>
              <p className="text-gray-700 text-base sm:text-lg">
                Equipo docente más preparado y cohesionado.
              </p>
            </div>
            <div className="bg-white/85 backdrop-blur rounded-xl p-6 shadow-sm">
              <p className="font-bold text-gray-900 text-lg sm:text-xl mb-2" style={{ fontWeight: 800 }}>
                Confianza de las familias
              </p>
              <p className="text-gray-700 text-base sm:text-lg">
                Mayor percepción de valor del proyecto educativo.
              </p>
            </div>
          </div>

          <div className="mt-6 sm:mt-8">
            <div className="bg-white/85 backdrop-blur rounded-xl p-6 shadow-sm max-w-4xl mx-auto text-center">
              <p className="font-bold text-gray-900 text-lg sm:text-xl mb-2" style={{ fontWeight: 800 }}>
                Reputación institucional
              </p>
              <p className="text-gray-700 text-base sm:text-lg">
                Centro alineado con los nuevos retos educativos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— 7. PARA QUIÉN ES ——— */}
      <section className="relative isolate overflow-hidden py-12 sm:py-16 md:py-20 px-3 sm:px-4" style={{ background: '#7ea4df' }} aria-label="Para quién es Braini">
        <div className="max-w-6xl mx-auto text-center min-w-0 px-1">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8" style={{ fontWeight: 700 }}>
            Centros para los que este modelo tiene sentido:
          </h2>
          <ul className="text-left w-full max-w-6xl mx-auto mb-8 text-white text-base sm:text-lg grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-6 justify-items-start">
            {[
              'Desean coherencia entre discurso y práctica.',
              'Buscan el liderazgo educativo.',
              'Valoran la estabilidad y el fortalecimiento del equipo docente.',
              'Forman parte de un modelo educativo innovador.',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0" aria-hidden="true">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-white font-bold text-lg mb-0" style={{ fontWeight: 700 }}>
            No es una actividad puntual. Es una decisión estratégica de centro.
          </p>
        </div>
      </section>

      {/* ——— 8. DESCUBRA SI… ——— */}
      <section
        className="relative isolate overflow-hidden"
        aria-label="Descubra si Braini puede transformar su centro"
        style={{
          backgroundColor: '#ffffff',
        }}
      >
        {/* Background photo: solo dentro de esta sección */}
        <div
          className="pointer-events-none absolute inset-0 z-0 bg-no-repeat"
          style={{
            backgroundImage: 'url(/landing/Seccion8.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center top',
          }}
          aria-hidden
        />

        {/* Soft overlay to make the blue panel pop */}
        <div className="pointer-events-none absolute inset-0 z-0" style={{ background: 'rgba(255,255,255,0.25)' }} aria-hidden />

        <div className="relative z-10 max-w-7xl mx-auto min-w-0 px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20">
          <div className="min-h-[min(22rem,52dvh)] sm:min-h-[min(24rem,48dvh)] md:min-h-[min(26rem,45dvh)] lg:min-h-[min(28rem,42dvh)] flex items-center py-4 md:py-6">
            <div
              className="bg-[#7ea4df] rounded-2xl p-6 sm:p-8 md:p-10 w-full max-w-xl min-w-0"
              style={{
                boxShadow: '0 16px 40px rgba(0,0,0,0.12)',
              }}
            >
              <h2
                className="text-white font-black text-3xl sm:text-4xl leading-tight"
                style={{ fontWeight: 900 }}
              >
                Descubra si Braini
                <br />
                puede transformar
                <br />
                su centro
              </h2>

              <p className="text-white/90 text-sm sm:text-base leading-relaxed mt-5">
                Cada centro es único. Por eso comenzamos con una reunión estratégica para analizar la realidad de su centro y
                valorar si el modelo Braini puede integrarse en su proyecto educativo.
              </p>

              <a href={CTA_REUNION_MAILTO} className="block sm:inline-block w-full sm:w-auto mt-6" aria-label="Solicitar reunión estratégica">
                <Button
                  className="w-full sm:w-auto font-bold text-base sm:text-lg transition-all md:hover:opacity-90 md:hover:scale-105"
                  style={{ background: '#ffffff', border: 'none', color: '#7ea4df' }}
                >
                  <span className="flex items-center justify-center gap-2">
                    Solicitar reunión estratégica
                    <ArrowRight className="w-5 h-5" style={{ color: '#7ea4df' }} />
                  </span>
                </Button>
              </a>

              <p className="text-white/80 text-sm mt-4 italic" style={{ fontWeight: 500 }}>
                Implantaciones limitadas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ——— 9. TESTIMONIOS ——— */}
      <section className="relative isolate overflow-x-hidden py-12 sm:py-16 md:py-20 px-3 sm:px-4" style={{ background: '#f0f6fc' }} aria-label="Testimonios">
        <div className="max-w-6xl xl:max-w-7xl mx-auto min-w-0">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8" style={{ color: '#1f2937', fontWeight: 700 }}>
            TESTIMONIOS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0">
            {[
              {
                quote:
                  'Braini nos ha permitido trabajar el bienestar emocional con un marco común en todo el centro, evitando iniciativas aisladas.',
                author: 'Director, Centro educativo',
              },
              {
                quote:
                  'Se nota una mejora real en la convivencia: el equipo docente comparte el mismo enfoque y los alumnos reciben acompañamiento coherente.',
                author: 'Jefatura de estudios, Centro educativo',
              },
              {
                quote:
                  'La formación progresiva ha sido clave. Nos ha aportado herramientas claras y aplicables, sin sobrecargar el día a día.',
                author: 'Coordinación pedagógica, Centro educativo',
              },
              {
                quote:
                  'La implicación de las familias ha reforzado el proceso. Cuando hogar y escuela hablan el mismo lenguaje, el impacto se multiplica.',
                author: 'Responsable de orientación, Centro educativo',
              },
              {
                quote:
                  'Con Braini hemos ganado estabilidad y cohesión interna. El modelo se integra en el proyecto educativo y se sostiene en el tiempo.',
                author: 'Equipo directivo, Centro educativo',
              },
              {
                quote:
                  'El resultado es un centro más preparado para gestionar retos emocionales. La diferencia no es puntual: es cultural.',
                author: 'Tutor/a, Centro educativo',
              },
            ].map((t, idx) => (
              <div
                key={idx}
                className="min-w-0 bg-white/90 rounded-xl p-6 shadow-sm border border-white/50 backdrop-blur-sm"
                style={{ boxShadow: '0 10px 25px -5px rgba(0,0,0,0.06)' }}
              >
                <div
                  className="text-braini-blue mb-4"
                  style={{ color: '#7ea4df', fontWeight: 900, letterSpacing: '-0.02em' }}
                >
                  “{idx === 0 ? 'Testimonio' : 'Opinión'}”
                </div>
                <blockquote className="text-gray-700 text-base sm:text-lg italic mb-4">
                  {t.quote}
                </blockquote>
                <p className="text-gray-600 text-sm sm:text-base" style={{ fontWeight: 500 }}>
                  {t.author}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— FOOTER ——— */}
      <footer
        className="relative isolate overflow-x-hidden py-12 sm:py-16"
        style={{ background: '#f5827b' }}
        aria-label="Footer Braini Emotions"
      >
        <div className="max-w-7xl mx-auto min-w-0 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start min-w-0">
            <div>
              <div className="flex items-center mb-3">
                <img src={logoBraini} alt="Braini Emotions" className="w-9 h-9 object-contain" />
                <h3 className="text-lg sm:text-xl font-bold text-white ml-3" style={{ fontWeight: 800 }}>
                  Braini Emotions
                </h3>
              </div>
              <p className="text-white/90 text-sm" style={{ fontWeight: 500 }}>
                Neurobienestar emocional educativo
              </p>
            </div>

            <div className="space-y-2 min-w-0">
              <p className="text-white font-bold text-sm sm:text-base" style={{ fontWeight: 800 }}>
                Contacto
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="flex items-center text-white text-sm hover:text-white/90 break-words"
                aria-label={`Enviar email a ${CONTACT_EMAIL}`}
              >
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                {CONTACT_EMAIL}
              </a>
              <a
                href="tel:+34646982440"
                className="flex items-center text-white text-sm hover:text-white/90"
                aria-label="Llamar +34 646 982 440"
              >
                <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                +34 646 982 440
              </a>
            </div>

            <div className="space-y-3">
              <p className="text-white font-bold text-sm sm:text-base" style={{ fontWeight: 800 }}>
                Síguenos
              </p>
              <a
                href="https://www.instagram.com/brainiemotions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-10 h-10 bg-white/20 rounded-lg items-center justify-center hover:bg-white/30 transition-colors"
                aria-label="Instagram Braini Emotions"
              >
                <img src={logoInstagram} alt="Instagram" className="w-6 h-6" />
              </a>
            </div>
          </div>

          <div className="border-t border-white/20 pt-6 mt-10">
            <p className="text-white/80 text-xs text-center">
              © 2025 Braini Emotions. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
