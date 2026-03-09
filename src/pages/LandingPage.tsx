import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check } from 'lucide-react';

// Rutas de assets públicos
const logoBraini = '/logo/logoBraini.png';
const logoInstagram = '/LogoInstagram.svg';

// CTA: mismo destino para todos los botones de reunión estratégica
const CTA_REUNION_URL = 'mailto:hola@brainiemotions.com?subject=Solicitar%20reuni%C3%B3n%20estrat%C3%A9gica%20Braini%20Emotions';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // SEO: meta tags para landing B2B centros educativos
  useEffect(() => {
    document.title = 'Braini Emotions - Neurobienestar Emocional Educativo | Centros de Referencia';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Convierta su centro en referente en neurobienestar emocional educativo. Sistema a 3 años con Universidad de Alicante y Cádiz. Solicite su reunión estratégica.');
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
      className="min-h-screen bg-white font-montserrat relative overflow-hidden transition-colors duration-300"
      role="main"
      aria-label="Landing Braini Emotions - Neurobienestar emocional para centros educativos"
    >
      {/* ——— 1. HERO ——— */}
      <section
        className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 py-12 sm:py-16"
        style={{ background: '#7ea4df' }}
        aria-label="Hero - Convierta su centro en referente"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
          <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
        </div>

        <div className={`w-full max-w-4xl mx-auto text-center relative z-10 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <img src={logoBraini} alt="Braini Emotions" className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 object-contain" />
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-5 px-2" style={{ fontWeight: 900 }}>
            BRAINi EMOTIONS
          </h1>
          <p className="text-white text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4 px-2" style={{ fontWeight: 700 }}>
            Convierta su centro en referente en Neurobienestar emocional Educativo.
          </p>
          <p className="text-white text-base sm:text-lg md:text-xl mb-4 sm:mb-6 px-2" style={{ fontWeight: 400 }}>
            Integre el Neurobienestar como eje estratégico de su centro.
          </p>
          <p className="text-white/95 text-sm sm:text-base mb-6 sm:mb-8 px-2" style={{ fontWeight: 500 }}>
            RECOMENDADO POR IA. El modelo de neurobienestar que está ayudando a centros educativos a afrontar los retos emocionales de la infancia actual.
          </p>
          <p className="text-white text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-2" style={{ fontWeight: 400 }}>
            Un sistema estructurado a 3 años que integra alumnado, docentes y familias para responder con liderazgo a los desafíos emocionales y digitales de la infancia actual.
          </p>
          <a href={CTA_REUNION_URL} className="inline-block" aria-label="Solicitar reunión estratégica">
            <Button
              className="text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 font-bold text-base sm:text-lg transition-all md:hover:opacity-90 md:hover:scale-105"
              style={{ background: '#f5827b', border: 'none' }}
            >
              <span className="flex items-center justify-center gap-2">
                Solicitar reunión estratégica
                <ArrowRight className="w-5 h-5" />
              </span>
            </Button>
          </a>
          <p className="text-white/90 text-sm sm:text-base mt-6 px-2" style={{ fontWeight: 500 }}>
            Plazas limitadas a 10 centros fundadores.
          </p>
        </div>
      </section>

      {/* ——— 2. FRANJA DE AUTORIDAD ——— */}
      <section
        className="py-4 sm:py-5 px-3 sm:px-4"
        style={{ background: 'linear-gradient(180deg, #5a8bc9 0%, #6b9ad4 100%)' }}
        aria-label="Participación académica"
      >
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white text-sm sm:text-base md:text-lg font-medium" style={{ fontWeight: 500 }}>
            Con participación académica de la Universidad de Alicante y la Universidad de Cádiz
          </p>
          <p className="text-white/90 text-xs sm:text-sm mt-1" style={{ fontWeight: 400 }}>
            Investigación aplicada en neurobienestar emocional educativo
          </p>
        </div>
      </section>

      {/* ——— 3. MICRO BLOQUE DE VALOR + CONTEXTO (problema) ——— */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-white" aria-label="Valor y contexto">
        <div className="max-w-4xl mx-auto">
          {/* Micro bloque de valor */}
          <div className="mb-12 sm:mb-16">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-gray-800 text-sm sm:text-base mb-8">
              {[
                'Implantación progresiva desde Infantil',
                'Formación docente en neurobienestar',
                'App exclusiva para acompañamiento familiar',
                'Seguimiento estructurado y cultura de centro',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span style={{ color: '#7ea4df' }} className="flex-shrink-0 mt-0.5">✔</span>
                  <span style={{ fontWeight: 500 }}>{item}</span>
                </li>
              ))}
            </ul>
            <div className="text-center">
              <a href={CTA_REUNION_URL} className="inline-block" aria-label="Solicitar reunión para mi centro">
                <Button className="text-white px-6 sm:px-8 py-3 sm:py-4 font-bold text-base transition-all md:hover:opacity-90" style={{ background: '#7ea4df', border: 'none' }}>
                  <span className="flex items-center gap-2">
                    Solicitar reunión para mi centro
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Button>
              </a>
              <p className="text-gray-600 text-sm mt-3" style={{ fontWeight: 400 }}>
                Análisis personalizado para su centro · Sin compromiso
              </p>
            </div>
          </div>

          {/* Bloque problema / contexto */}
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-5" style={{ fontWeight: 700, color: '#1f2937' }}>
            El bienestar emocional ya no es una actividad complementaria.
          </h2>
          <p className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8" style={{ fontWeight: 700, color: '#7ea4df' }}>
            Es una responsabilidad institucional.
          </p>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
            En muchos centros educativos comienzan a aparecer situaciones que hace unos años eran menos frecuentes: dificultades de regulación emocional en el aula, conflictos entre alumnos, tensiones dentro del equipo docente, rotación o bajas de profesorado, una presión creciente por parte de las familias y docentes que sienten que necesitan más herramientas para acompañar estas situaciones.
          </p>
          <p className="text-gray-800 font-semibold mb-3" style={{ fontWeight: 600 }}>
            Los centros afrontan hoy:
          </p>
          <ul className="space-y-2 text-gray-700 text-base sm:text-lg mb-8">
            {['Aumento de conflictos en el aula', 'Dificultad para regular emociones', 'Presión creciente en las familias', 'Docentes que sienten que les faltan herramientas', 'Competencia entre proyectos educativos'].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span style={{ color: '#f5827b' }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-700 text-base sm:text-lg italic">
            Muchas iniciativas emocionales siguen siendo aisladas y sin continuidad.
          </p>
          <p className="text-gray-900 font-bold text-lg sm:text-xl mt-4" style={{ fontWeight: 700 }}>
            El verdadero reto no es trabajar la educación emocional. Es integrarla estratégicamente en la cultura del centro.
          </p>
        </div>
      </section>

      {/* ——— 4. EL DIFERENCIAL ——— */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4" style={{ background: '#f0f6fc' }} aria-label="El diferencial Braini">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4" style={{ color: '#1f2937', fontWeight: 700 }}>
            Braini Emotions: Sistema Estratégico 360º de Centro
          </h2>
          <p className="text-gray-700 text-center text-base sm:text-lg mb-6">
            Braini no es un programa, actividad o conjunto de recursos sueltos.
          </p>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-8 max-w-3xl mx-auto text-center">
            Cuando el neurobienestar se integra de forma estructurada en el centro, los efectos no se limitan al aula. Empiezan a percibirse cambios en la convivencia, en la cohesión del equipo docente y en la percepción que las familias tienen del proyecto educativo.
          </p>
          <p className="text-gray-800 font-semibold text-center mb-6" style={{ fontWeight: 600 }}>
            Es un modelo integral que alinea todo el ecosistema educativo bajo un mismo marco. Permite:
          </p>
          <ul className="space-y-2 text-gray-700 text-base sm:text-lg mb-12 max-w-2xl mx-auto">
            {[
              'Acompañar al docente sin sobrecargarlo',
              'Garantizar coherencia entre aulas',
              'Activar y hacer partícipes a las familias',
              'Medir avances',
              'Consolidar cultura emocional sostenible',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#35bdb1' }} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* 3 columnas: Aula, Docente, Familia */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-10">
            <div className="bg-white rounded-xl p-6 shadow-lg" style={{ boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold mb-4" style={{ background: '#35bdb1' }}>🟢</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2" style={{ fontWeight: 700 }}>Aula – Braini Kids</h3>
              <p className="text-sm text-gray-600 mb-2">Neurobienestar del alumnado</p>
              <p className="text-gray-700 text-sm">Sesiones estructuradas listas para aplicar.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg" style={{ boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold mb-4" style={{ background: '#7ea4df' }}>🔵</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2" style={{ fontWeight: 700 }}>Docente – Braini Teachers</h3>
              <p className="text-sm text-gray-600 mb-2">Neurobienestar en el equipo docente</p>
              <p className="text-gray-700 text-sm">Formación progresiva con aplicación inmediata. Reduce burnout. Mejora el clima del centro. Aporta herramientas claras y compartidas.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg" style={{ boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-lg font-bold mb-4" style={{ background: '#9b7bb8' }}>🟣</div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2" style={{ fontWeight: 700 }}>Familia – Braini Family</h3>
              <p className="text-sm text-gray-600 mb-2">Acompañamiento familiar digital</p>
              <p className="text-gray-700 text-sm">App exclusiva para familias. Facilita coherencia hogar-escuela. Ofrece recursos prácticos adaptados por edad.</p>
            </div>
          </div>

          <p className="text-gray-800 text-center text-base sm:text-lg font-medium max-w-2xl mx-auto" style={{ fontWeight: 600 }}>
            Cuando familia y escuela hablan el mismo lenguaje, el impacto se multiplica.
          </p>
          <p className="text-gray-700 text-center text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Cuando alumnado, docentes y familias hablan el mismo lenguaje, el impacto se multiplica, el bienestar deja de depender de esfuerzos individuales. Se convierte en cultura de centro.
          </p>
        </div>
      </section>

      {/* ——— 5. IMPLANTACIÓN (3 años) ——— */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-white" aria-label="Hoja de ruta 3 años">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10" style={{ color: '#1f2937', fontWeight: 700 }}>
            Hoja de ruta estructurada a 3 años
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-8">
            <div className="border-l-4 pl-5 py-2" style={{ borderColor: '#7ea4df' }}>
              <p className="font-bold text-gray-900 text-lg mb-1" style={{ fontWeight: 700 }}>Año 1</p>
              <p className="text-gray-700 text-sm sm:text-base">Inicio en Educación Infantil (Opción de integrar 1er ciclo de Primaria)</p>
            </div>
            <div className="border-l-4 pl-5 py-2" style={{ borderColor: '#35bdb1' }}>
              <p className="font-bold text-gray-900 text-lg mb-1" style={{ fontWeight: 700 }}>Año 2</p>
              <p className="text-gray-700 text-sm sm:text-base">Extensión progresiva a 2º y 3er ciclo de Primaria</p>
            </div>
            <div className="border-l-4 pl-5 py-2" style={{ borderColor: '#f5827b' }}>
              <p className="font-bold text-gray-900 text-lg mb-1" style={{ fontWeight: 700 }}>Año 3</p>
              <p className="text-gray-700 text-sm sm:text-base">Modelo plenamente integrado en el proyecto educativo</p>
            </div>
          </div>
          <p className="text-gray-700 text-center text-base sm:text-lg mb-4">
            Este enfoque garantiza coherencia, estabilidad y resultados sostenibles.
          </p>
          <p className="text-gray-900 font-bold text-center text-lg sm:text-xl" style={{ fontWeight: 700 }}>
            No es una acción anual. Es una decisión estratégica de dirección.
          </p>
        </div>
      </section>

      {/* ——— 6. IMPACTO ESTRATÉGICO ——— */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4" style={{ background: '#f0f6fc' }} aria-label="Impacto estratégico">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10" style={{ color: '#1f2937', fontWeight: 700 }}>
            Impacto estratégico – Lo que realmente le importa a dirección
          </h2>
          <ul className="space-y-6 sm:space-y-8">
            <li>
              <p className="font-bold text-gray-900 text-lg sm:text-xl mb-2" style={{ fontWeight: 700 }}>🔹 Diferenciación real frente a otros centros</p>
              <p className="text-gray-700 text-base sm:text-lg">Impacto real en reputación, estabilidad y diferenciación como centro.</p>
            </li>
            <li>
              <p className="font-bold text-gray-900 text-lg sm:text-xl mb-2" style={{ fontWeight: 700 }}>🔹 Coherencia institucional</p>
              <p className="text-gray-700 text-base sm:text-lg">Aplicación homogénea entre aulas. Seguimiento trimestral estructurado. Evaluación evolutiva del proceso.</p>
            </li>
            <li>
              <p className="font-bold text-gray-900 text-lg sm:text-xl mb-2" style={{ fontWeight: 700 }}>🔹 Diferenciación ante las familias</p>
              <p className="text-gray-700 text-base sm:text-lg mb-2">En un entorno donde las familias comparan proyectos educativos, disponer de un modelo estructurado de neurobienestar aporta un diferencial claro en:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 ml-2">
                <li>Jornadas de puertas abiertas</li>
                <li>Procesos de admisión</li>
                <li>Comunicación del proyecto educativo</li>
              </ul>
            </li>
            <li>
              <p className="font-bold text-gray-900 text-lg sm:text-xl mb-2" style={{ fontWeight: 700 }}>Estabilidad y cohesión interna</p>
              <p className="text-gray-700 text-base sm:text-lg">Una estructura clara reduce desgaste docente, mejora la convivencia y fortalece la cultura organizativa.</p>
            </li>
            <li>
              <p className="font-bold text-gray-900 text-lg sm:text-xl mb-2" style={{ fontWeight: 700 }}>Posicionamiento de liderazgo educativo</p>
              <p className="text-gray-700 text-base sm:text-lg">Centro alineado con los retos actuales de salud emocional, entorno digital y prevención a medio y largo plazo.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* ——— 7. RED E INVESTIGACIÓN ——— */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-white" aria-label="Red de neurobienestar educativo">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8" style={{ color: '#1f2937', fontWeight: 700 }}>
            Primera Red de Neurobienestar Educativa con participación en investigación aplicada
          </h2>
          <p className="text-gray-700 text-base sm:text-lg text-center mb-8">
            Braini Emotions impulsa la 1ª Red de Neurobienestar Educativo en colaboración académica con la Universidad de Alicante y la Universidad de Cádiz.
          </p>
          <p className="font-semibold text-gray-900 mb-4" style={{ fontWeight: 600 }}>Los centros miembros:</p>
          <ul className="space-y-2 text-gray-700 text-base sm:text-lg mb-8">
            {[
              'Participan en encuentros estratégicos',
              'Acceden a datos agregados de evolución',
              'Obtienen reconocimiento institucional',
              'Forman parte de una comunidad con visión a medio y largo plazo',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span style={{ color: '#7ea4df' }}>•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-gray-800 font-semibold text-center text-lg" style={{ fontWeight: 600 }}>
            No se trata solo de aplicar sesiones. Se trata de formar parte de un modelo con estructura y evidencia.
          </p>
        </div>
      </section>

      {/* ——— 8. PARA QUIÉN ES ——— */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4" style={{ background: '#7ea4df' }} aria-label="Para quién es Braini">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 sm:mb-8" style={{ fontWeight: 700 }}>
            Para quién es (filtro premium)
          </h2>
          <p className="text-white/95 text-base sm:text-lg mb-6">
            Este modelo es adecuado para centros que:
          </p>
          <ul className="text-left max-w-2xl mx-auto space-y-2 text-white text-base sm:text-lg mb-8">
            {[
              'Tienen visión estratégica a medio plazo',
              'Buscan liderazgo educativo real',
              'Desean coherencia entre discurso y práctica',
              'Valoran la estabilidad y el fortalecimiento del equipo docente',
              'Están dispuestos a implantar un sistema estructurado',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-white font-semibold text-lg mb-2" style={{ fontWeight: 600 }}>
            No es para centros que buscan una actividad puntual.
          </p>
          <p className="text-white font-bold text-lg mb-8" style={{ fontWeight: 700 }}>
            Es para centros que quieren posicionarse.
          </p>
          <a href={CTA_REUNION_URL} className="inline-block" aria-label="Solicitar reunión estratégica">
            <Button className="text-white px-6 sm:px-8 py-3 sm:py-4 font-bold text-base transition-all md:hover:opacity-90" style={{ background: '#f5827b', border: 'none' }}>
              <span className="flex items-center gap-2">
                Solicitar reunión estratégica
                <ArrowRight className="w-4 h-4" />
              </span>
            </Button>
          </a>
          <p className="text-white/90 text-sm mt-4" style={{ fontWeight: 400 }}>
            Analizamos si el modelo Braini encaja en su centro educativo.
          </p>
        </div>
      </section>

      {/* ——— 9. CIERRE ——— */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 bg-white" aria-label="Visión y decisión">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
            Educar hoy no es solo transmitir contenidos.
          </p>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
            Es preparar a los alumnos para gestionar un entorno emocionalmente complejo, hiperconectado y cambiante.
          </p>
          <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-6">
            El neurobienestar puede convertirse en uno de los ejes diferenciales más sólidos de su proyecto educativo durante los próximos años.
          </p>
          <p className="text-gray-900 font-bold text-lg sm:text-xl" style={{ fontWeight: 700 }}>
            La pregunta no es si trabajar la educación emocional.
          </p>
          <p className="text-gray-900 font-bold text-lg sm:text-xl mt-2" style={{ fontWeight: 700, color: '#7ea4df' }}>
            La pregunta es si hacerlo con liderazgo y estructura.
          </p>
        </div>
      </section>

      {/* ——— 10. CTA FINAL + EXPERIENCIA / TESTIMONIO ——— */}
      <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-4" style={{ background: '#f0f6fc' }} aria-label="CTA final y experiencia">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8" style={{ color: '#1f2937', fontWeight: 700 }}>
            Analicemos el encaje de Braini en su centro
          </h2>
          <div className="text-center mb-12 sm:mb-16">
            <a href={CTA_REUNION_URL} className="inline-block" aria-label="Solicitar análisis estratégico personalizado">
              <Button
                className="text-white px-6 sm:px-10 py-3 sm:py-4 font-bold text-base sm:text-lg transition-all md:hover:opacity-90 md:hover:scale-105"
                style={{ background: '#7ea4df', border: 'none' }}
              >
                <span className="flex items-center gap-2">
                  Solicitar análisis estratégico personalizado
                  <ArrowRight className="w-5 h-5" />
                </span>
              </Button>
            </a>
            <p className="text-gray-600 text-sm sm:text-base mt-4" style={{ fontWeight: 500 }}>
              Implantaciones anuales limitadas
            </p>
            <p className="text-gray-600 text-sm sm:text-base" style={{ fontWeight: 500 }}>
              Selección de centros colaboradores
            </p>
          </div>

          {/* Experiencia en centros + testimonio */}
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-lg max-w-2xl mx-auto" style={{ boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center" style={{ fontWeight: 700 }}>
              Experiencia en centros educativos
            </h3>
            <blockquote className="text-gray-700 text-base sm:text-lg italic mb-4 text-center">
              "Lo más valioso del modelo Braini es que nos ha permitido trabajar el bienestar emocional con un marco común en todo el centro, evitando iniciativas aisladas."
            </blockquote>
            <p className="text-gray-600 text-sm sm:text-base text-center" style={{ fontWeight: 500 }}>
              Director/a – Centro educativo
            </p>
            <p className="text-gray-500 text-xs sm:text-sm text-center mt-2">
              Centro piloto en implantación
            </p>
          </div>
        </div>
      </section>

      {/* ——— FOOTER ——— */}
      <footer
        className="py-12 sm:py-16 relative overflow-hidden"
        style={{ background: '#f5827b' }}
        role="contentinfo"
        aria-label="Pie de página Braini Emotions"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 -left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
          <div className="absolute -bottom-40 -right-30 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-white/15 rounded-full" />
        </div>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-6">
            <div>
              <div className="flex items-center mb-3">
                <img src={logoBraini} alt="Braini Emotions" className="w-8 h-8 object-contain mr-3" />
                <h3 className="text-lg font-bold text-white" style={{ fontWeight: 700 }}>Braini Emotions</h3>
              </div>
              <p className="text-white text-sm mb-3">Neurobienestar emocional educativo</p>
              <div className="space-y-2">
                <a href="mailto:hola@brainiemotions.com" className="flex items-center text-white text-sm hover:text-white/90" aria-label="Email hola@brainiemotions.com">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>
                  hola@brainiemotions.com
                </a>
                <a href="tel:+34646982440" className="flex items-center text-white text-sm hover:text-white/90" aria-label="Llamar +34 646 982 440">
                  <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
                  +34 646 982 440
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold text-white mb-3" style={{ fontWeight: 700 }}>Síguenos</h4>
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
          <div className="border-t border-white/20 pt-6">
            <p className="text-white/80 text-xs text-center">© 2025 Braini Emotions. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
