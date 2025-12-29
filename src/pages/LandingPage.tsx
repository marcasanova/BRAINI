import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Gift, Heart, Brain, Users, Clock, Shield, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Rutas de assets públicos (archivos en public/)
const logoBraini = '/logo/logoBraini.png';
const logoBrainiEnfadado = '/logo/LogoBrainiEnfadado.png';

// Avatares
const profile1 = '/avatars/profile1.jpeg';
const profile2 = '/avatars/profile2.jpg';
const profile3 = '/avatars/profile3.jpg';

// Emociones - Desde Supabase Storage
const SUPABASE_STORAGE_URL = 'https://igwoavsazbycqmdweger.supabase.co/storage/v1/object/public/emotions_images';
const alegria = `${SUPABASE_STORAGE_URL}/1.%20Alegria.jpg`;
const tranquilidad = `${SUPABASE_STORAGE_URL}/12.%20Tranquilidad.jpg`;
const ternura = `${SUPABASE_STORAGE_URL}/49.%20Ternura.jpg`;
const verguenza = `${SUPABASE_STORAGE_URL}/7.%20Vergueza.jpg`;
const sorpresa = `${SUPABASE_STORAGE_URL}/9.%20Sorpresa.jpg`;
const aburrimiento = `${SUPABASE_STORAGE_URL}/35.%20Aburrimiento.jpg`;

// Otros assets
const logoInstagram = '/LogoInstagram.svg';

const LandingPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const featuresTitleRef = useRef<HTMLHeadingElement>(null);
  const [benefitsVisible, setBenefitsVisible] = useState(false);
  const benefitsTitleRef = useRef<HTMLHeadingElement>(null);
  const navigate = useNavigate();

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer para el título de Features
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Cuando el título es visible en pantalla
          if (entry.isIntersecting) {
            setFeaturesVisible(true);
          }
        });
      },
      {
        threshold: 0.1, // Se activa cuando el 10% del título es visible
        rootMargin: '0px'
      }
    );

    if (featuresTitleRef.current) {
      observer.observe(featuresTitleRef.current);
    }

    return () => {
      if (featuresTitleRef.current) {
        observer.unobserve(featuresTitleRef.current);
      }
    };
  }, []);

  // Intersection Observer para el título de Benefits
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Cuando el título es visible en pantalla
          if (entry.isIntersecting) {
            setBenefitsVisible(true);
          }
        });
      },
      {
        threshold: 0.1, // Se activa cuando el 10% del título es visible
        rootMargin: '0px'
      }
    );

    if (benefitsTitleRef.current) {
      observer.observe(benefitsTitleRef.current);
    }

    return () => {
      if (benefitsTitleRef.current) {
        observer.unobserve(benefitsTitleRef.current);
      }
    };
  }, []);


  const handleTrialAccess = () => {
    navigate('/signup');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <div 
      className="min-h-screen bg-white font-montserrat relative overflow-hidden transition-colors duration-300"
      role="main"
      aria-label="Landing page de Braini Emotions"
    >
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center px-2 sm:px-4 py-4 sm:py-8"
        style={{
          background: '#7ea4df'
        }}
      >
        {/* Figuras Geométricas Circulares */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
          <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
        </div>

        <div className={`w-full max-w-7xl mx-auto transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Contenido Principal */}
          <div className="text-center mb-8 sm:mb-12 relative z-10">
            <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <img 
                src={logoBraini}
                alt="Braini Emotions Logo" 
                className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-contain"
              />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-3 sm:mb-4 px-2" style={{ fontWeight: 900 }}>
              Braini Emotions Family
            </h1>
            <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 px-4" style={{ fontWeight: 700 }}>
              Programa de Neurobienestar Emocional
            </h2>
            <p className="text-white text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 px-4" style={{ fontWeight: 400 }}>
              25 sesiones de 20' basadas en evidencias científicas
            </p>
            <p className="text-white text-base sm:text-lg lg:text-xl mb-4 sm:mb-5 px-4" style={{ fontWeight: 400 }}>
              Level Kids: Niños de 3 a 7 años
            </p>
          </div>

          {/* CTA Card */}
          <div 
            id="cta-section"
            className="bg-white rounded-xl p-6 sm:p-8 shadow-2xl relative z-10 max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            {/* Texto de introducción */}
            <p className="text-gray-700 text-base sm:text-lg mb-6 text-center" style={{ fontWeight: 400 }}>
              ¡Apúntate y aprovecha nuestra promoción!
            </p>

            {/* Lista de regalos */}
            <div className="mb-6 space-y-3">
              <p className="text-gray-700 text-sm sm:text-base" style={{ fontWeight: 400 }}>
                1- <span className="font-bold" style={{ fontWeight: 700, color: '#7ea4df' }}>Evaluar</span> la <span className="font-bold" style={{ fontWeight: 700, color: '#7ea4df' }}>Inteligencia Emocional</span> de tu hijo.
              </p>
              <p className="text-gray-700 text-sm sm:text-base" style={{ fontWeight: 400 }}>
                2- Disfrutar de <span className="font-bold" style={{ fontWeight: 700, color: '#7ea4df' }}>3</span> <span className="font-bold" style={{ fontWeight: 700, color: '#7ea4df' }}>sesiones</span> emocionales completamente <span className="font-bold" style={{ fontWeight: 700, color: '#7ea4df' }}>GRATIS</span>.
              </p>
            </div>

            {/* Botones de Acción */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4">
              <Button 
                onClick={handleTrialAccess}
                className="text-white px-6 sm:px-10 py-4 sm:py-5 font-bold transition-all text-base sm:text-lg md:hover:opacity-90 md:hover:scale-105 w-full sm:w-auto"
                style={{ 
                  background: '#7ea4df',
                  border: 'none',
                  minWidth: '200px'
                }}
              >
                Conseguirlo Gratis
              </Button>
              <Button 
                onClick={handleLogin}
                variant="outline"
                className="px-6 sm:px-10 py-4 sm:py-5 font-bold transition-all text-base sm:text-lg md:hover:opacity-90 md:hover:scale-105 w-full sm:w-auto border-2"
                style={{ 
                  borderColor: '#7ea4df',
                  color: '#7ea4df',
                  backgroundColor: 'transparent',
                  minWidth: '200px'
                }}
              >
                Ya estás registrado
              </Button>
            </div>
          </div>

          {/* Social Proof */}
          <div 
            className={`mt-6 sm:mt-8 transition-all duration-1000 ease-out delay-200 relative z-10 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            role="region"
            aria-label="Testimonios de familias que confían en Braini"
          >
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="flex -space-x-2" role="img" aria-label="Avatares de familias satisfechas">
                <img 
                  src={profile1} 
                  alt="María - Madre satisfecha con Braini" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white object-cover shadow-md"
                />
                <img 
                  src={profile2} 
                  alt="Carlos - Padre satisfecho con Braini" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white object-cover shadow-md"
                />
                <img 
                  src={profile3} 
                  alt="Ana - Madre satisfecha con Braini" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white object-cover shadow-md"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm sm:text-base font-bold text-white" style={{ fontWeight: 700 }}>
                  Con la confianza de <span className="font-black text-base sm:text-lg" style={{ fontWeight: 900 }}>+100</span> familias
                </p>
                <p className="text-xs sm:text-sm text-white/90" style={{ fontWeight: 400 }}>
                  "Más de 100 familias ya confían en nosotros"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section 
        className="py-16 sm:py-24 relative overflow-hidden"
        style={{
          background: '#35bdb1'
        }}
      >
        {/* Figuras Geométricas Circulares */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
          <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 
              ref={featuresTitleRef}
              className="text-white text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 px-4" 
              style={{ fontWeight: 800 }}
            >
              ¿Qué es Braini Emotions Family?
            </h2>
            <p className="text-white text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 px-4 max-w-3xl mx-auto" style={{ fontWeight: 700 }}>
              Un espacio creado para el desarrollo del neurobienestar emocional.
            </p>
            <p className="text-white text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 px-4 max-w-3xl mx-auto" style={{ fontWeight: 400 }}>
              Aprende a acompañar sus rabietas, miedos e inseguridades jugando.
            </p>
            
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Feature 1 */}
            <div 
              className={`bg-white rounded-xl p-4 shadow-lg transition-all duration-1000 ease-out ${
                featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`} 
              style={{
                transitionDelay: featuresVisible ? '0ms' : '0ms'
              }}
            >
              <div className="text-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden">
                  <img 
                    src={alegria} 
                    alt="Alegría - Basado en Evidencias" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontWeight: 700, color: '#f59e0b' }}>
                  Basado en Evidencias
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Metodología respaldada por investigaciones científicas en psicología infantil y neurociencia
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className={`bg-white rounded-xl p-4 shadow-lg transition-all duration-1000 ease-out ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{
              transitionDelay: featuresVisible ? '100ms' : '0ms'
            }}>
              <div className="text-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden">
                  <img 
                    src={tranquilidad} 
                    alt="Tranquilidad - Solo 20 Minutos" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontWeight: 700, color: '#10b981' }}>
                  Solo 20 Minutos
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Sesiones cortas y efectivas que se adaptan a la rutina familiar sin sobrecargar
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className={`bg-white rounded-xl p-4 shadow-lg transition-all duration-1000 ease-out ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{
              transitionDelay: featuresVisible ? '200ms' : '0ms'
            }}>
              <div className="text-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden">
                  <img 
                    src={ternura} 
                    alt="Ternura - Divertido y Atractivo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontWeight: 700, color: '#ec4899' }}>
                  Divertido y Atractivo
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Actividades lúdicas que mantienen a los niños motivados y comprometidos
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className={`bg-white rounded-xl p-4 shadow-lg transition-all duration-1000 ease-out ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{
              transitionDelay: featuresVisible ? '300ms' : '0ms'
            }}>
              <div className="text-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden">
                  <img 
                    src={verguenza} 
                    alt="Vergüenza - Para Toda la Familia" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontWeight: 700, color: '#f97316' }}>
                  Para Toda la Familia
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Involucra a padres y cuidadores en el proceso de desarrollo emocional
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className={`bg-white rounded-xl p-4 shadow-lg transition-all duration-1000 ease-out ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{
              transitionDelay: featuresVisible ? '400ms' : '0ms'
            }}>
              <div className="text-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden">
                  <img 
                    src={sorpresa} 
                    alt="Sorpresa - Seguro y Confiable" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontWeight: 700, color: '#8b5cf6' }}>
                  Seguro y Confiable
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Contenido apropiado para la edad y supervisado por profesionales
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div className={`bg-white rounded-xl p-4 shadow-lg transition-all duration-1000 ease-out ${
              featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{
              transitionDelay: featuresVisible ? '500ms' : '0ms'
            }}>
              <div className="text-center">
                <div className="w-28 h-28 sm:w-32 sm:h-32 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden">
                  <img 
                    src={aburrimiento} 
                    alt="Aburrimiento - Resultados Comprobados" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ fontWeight: 700, color: '#3b82f6' }}>
                  Resultados Comprobados
                </h3>
                <p className="text-gray-600 text-sm sm:text-base">
                  Más de 100 familias ya han transformado la vida emocional de sus hijos
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        className="py-16 sm:py-24 relative overflow-hidden"
        style={{
          background: '#f8cd50'
        }}
      >
        {/* Figuras Geométricas Circulares */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
          <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 
              ref={benefitsTitleRef}
              className="text-white text-3xl sm:text-4xl lg:text-5xl mb-2 sm:mb-3 px-4" 
              style={{ fontWeight: 800 }}
            >
              Beneficios y Riesgos de la Gestión Emocional
            </h2>
            <p className="text-white text-base sm:text-lg lg:text-xl mb-2 sm:mb-3 px-4 max-w-3xl mx-auto" style={{ fontWeight: 700 }}>
              Los primeros años son fundamentales para el desarrollo emocional
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            {/* Tarjeta Izquierda - Beneficios Inmediatos */}
            <div className={`bg-white rounded-xl p-6 sm:p-8 shadow-lg transition-all duration-1000 ease-out ${
              benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{
              transitionDelay: benefitsVisible ? '0ms' : '0ms'
            }}>
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-0 sm:mr-4 flex items-center justify-center">
                  <img 
                    src={logoBraini}
                    alt="Braini Emotions Logo" 
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1" style={{ fontWeight: 800 }}>
                    Beneficios Inmediatos
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Transformación visible desde las primeras semanas
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-3 rounded-lg border-2" style={{ borderColor: '#f8cd50' }}>
                  <h4 className="text-base font-bold mb-1" style={{ fontWeight: 700, color: '#f8cd50' }}>
                    Seguridad y Autoestima
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Desarrolla una confianza sólida en sus capacidades y valor personal
                  </p>
                </div>

                <div className="p-3 rounded-lg border-2" style={{ borderColor: '#f5827b' }}>
                  <h4 className="text-base font-bold mb-1" style={{ fontWeight: 700, color: '#f5827b' }}>
                    Mejor Relación con Familia y Amigos
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Fortalece vínculos afectivos y mejora la comunicación familiar
                  </p>
                </div>

                <div className="p-3 rounded-lg border-2" style={{ borderColor: '#7ea4df' }}>
                  <h4 className="text-base font-bold mb-1" style={{ fontWeight: 700, color: '#7ea4df' }}>
                    Transformar Rabietas en Aprendizaje
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Convierte momentos difíciles en oportunidades de crecimiento
                  </p>
                </div>

                <div className="p-3 rounded-lg border-2" style={{ borderColor: '#35bdb1' }}>
                  <h4 className="text-base font-bold mb-1" style={{ fontWeight: 700, color: '#35bdb1' }}>
                    Bases para un Futuro Feliz y Exitoso
                  </h4>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Cimientos emocionales sólidos que durarán toda la vida
                  </p>
                </div>
              </div>
            </div>

            {/* Tarjeta Derecha - Riesgos de No Actuar */}
            <div className={`bg-white rounded-xl p-6 sm:p-8 shadow-lg transition-all duration-1000 ease-out ${
              benefitsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{
              transitionDelay: benefitsVisible ? '200ms' : '0ms'
            }}>
              <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6 sm:mb-8">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-0 sm:mr-4 flex items-center justify-center">
                  <img 
                    src={logoBrainiEnfadado}
                    alt="Braini Emotions Logo" 
                    className="w-12 h-12 sm:w-16 sm:h-16 object-contain"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1" style={{ fontWeight: 800 }}>
                    Riesgos de No Actuar
                  </h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Datos científicos que no puedes ignorar
                  </p>
                </div>
              </div>

              <div className="flex flex-col justify-center space-y-4">
                <div className="bg-red-50 rounded-xl p-4 sm:p-6 border border-red-200">
                  <h4 className="text-base font-bold text-gray-900 mb-2" style={{ fontWeight: 700 }}>
                    Problemas Emocionales en la Infancia
                  </h4>
                  <p className="text-gray-600 text-xs">
                    El 75% de los problemas emocionales y de salud mental empiezan en la infancia
                  </p>
                </div>

                <div className="bg-orange-50 rounded-xl p-4 sm:p-6 border border-orange-200">
                  <h4 className="text-base font-bold text-gray-900 mb-2" style={{ fontWeight: 700 }}>
                    Dificultad de Cambio
                  </h4>
                  <p className="text-gray-600 text-xs">
                    Es 5 veces más difícil cambiar patrones emocionales después de los 7 años
                  </p>
                </div>

                <div className="bg-yellow-50 rounded-xl p-4 sm:p-6 border border-yellow-200">
                  <h4 className="text-base font-bold text-gray-900 mb-2" style={{ fontWeight: 700 }}>
                    Mayor Riesgo de Ansiedad
                  </h4>
                  <p className="text-gray-600 text-xs">
                    Los niños sin herramientas emocionales tienen mayor riesgo de ansiedad y depresión
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer 
        className="py-12 sm:py-16 relative overflow-hidden"
        style={{
          background: '#f5827b'
        }}
      >
        {/* Figuras Geométricas Circulares */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
          <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6">
            {/* Columna 1 - Branding y Contacto */}
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src={logoBraini}
                  alt="Braini Emotions Logo" 
                  className="w-8 h-8 object-contain mr-3"
                />
                <h3 className="text-lg font-bold text-white" style={{ fontWeight: 700 }}>
                  Braini Emotions Family
                </h3>
              </div>
              <p className="text-white text-sm mb-3 font-medium">
                Más de 100 familias ya confían en nosotros
              </p>
              <p className="text-white text-sm mb-4">
                Neurobienestar emocional fácil y divertido
              </p>
              
              {/* Información de Contacto */}
              <div className="space-y-2">
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                  </svg>
                  <a href="mailto:hola@brainiemotions.com" className="text-white text-sm hover:text-white/80 transition-colors">
                    hola@brainiemotions.com
                  </a>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 text-white mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                  </svg>
                  <a href="tel:+34646982440" className="text-white text-sm hover:text-white/80 transition-colors">
                    +34 646 982 440
                  </a>
                </div>
              </div>
            </div>

            {/* Columna 2 - Suscripción y Redes Sociales */}
            <div className="space-y-6">
              {/* Sección Suscripción */}
              <div>
                <h4 className="text-lg font-bold text-white mb-3" style={{ fontWeight: 700 }}>
                  Suscríbete
                </h4>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="tu@email.com"
                    className="flex-1 px-3 py-2 text-sm rounded-l-lg border-0 focus:outline-none focus:ring-2 focus:ring-white/20 text-gray-800"
                  />
                  <button className="bg-gray-800 text-white px-4 py-2 text-sm rounded-r-lg hover:bg-gray-700 transition-colors">
                    Unirme
                  </button>
                </div>
              </div>

              {/* Sección Redes Sociales */}
              <div>
                <h4 className="text-lg font-bold text-white mb-3" style={{ fontWeight: 700 }}>
                  Síguenos
                </h4>
                <div className="flex space-x-2">
                  {/* Instagram - AQUÍ PON TU ENLACE DE INSTAGRAM */}
                  <a 
                    href="https://www.instagram.com/brainiemotions?igsh=MXB1OXcza3NnZjh2Yw%3D%3D&utm_source=qr" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center transition-colors md:hover:bg-white/30"
                  >
                    <img 
                      src={logoInstagram} 
                      alt="Instagram" 
                      className="w-8 h-8"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Línea separadora y Copyright */}
          <div className="border-t border-white/20 pt-6">
            <p className="text-white/80 text-xs text-center">
              © 2025 Braini Emotions. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
