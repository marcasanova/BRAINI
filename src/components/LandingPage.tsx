import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { CheckCircle, Mail, ArrowRight, Gift, Heart, Brain, Users, Clock, Shield, Star, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useHref } from 'react-router-dom';

const LandingPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const { toast } = useToast();
  // Datos de testimonios
  const testimonials = [
    { 
      id: 1,
      name: "María González",
      rating: 5,
      text: "Braini Emotions ha transformado completamente la forma en que mi hija maneja sus emociones. Las actividades son tan divertidas que ni siquiera se da cuenta de que está aprendiendo. ¡Recomendado al 100%!",
      avatar: "/avatars/profile1.jpeg"
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      rating: 4,
      text: "Como padre, siempre me preocupé por el bienestar emocional de mi hijo. Con Braini Emotions, he visto una mejora increíble en su capacidad para expresar lo que siente. Las sesiones de 20 minutos son perfectas para nuestra rutina.",
      avatar: "/avatars/profile2.jpg"
    },
    {
      id: 3,
      name: "Ana Martínez",
      rating: 5,
      text: "Mi hijo de 6 años ahora puede identificar y manejar sus emociones mucho mejor. Las actividades están diseñadas de manera tan inteligente que se divierte mientras aprende. Es increíble ver su progreso.",
      avatar: "/avatars/profile3.jpg"
    },
    {
      id: 4,
      name: "David López",
      rating: 4,
      text: "Braini Emotions nos ha ayudado mucho con las rabietas de nuestro hijo. Las técnicas que aprendemos en las sesiones las aplicamos en casa y funcionan de maravilla. ¡Gracias por esta herramienta!",
      avatar: "/avatars/profile1.jpeg"
    },
    {
      id: 5,
      name: "Laura Sánchez",
      rating: 5,
      text: "Soy psicóloga infantil y recomiendo Braini Emotions a todas las familias. La metodología está basada en evidencia científica y los resultados son visibles desde las primeras semanas. Excelente trabajo.",
      avatar: "/avatars/profile2.jpg"
    },
    {
      id: 6,
      name: "Miguel Torres",
      rating: 4,
      text: "Las actividades de Braini Emotions han fortalecido el vínculo entre mi hija y yo. Ahora tenemos herramientas para hablar sobre emociones de manera natural y divertida. ¡Es como tener un psicólogo en casa!",
      avatar: "/avatars/profile3.jpg"
    }
  ];

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Carrusel automático de testimonios
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email requerido",
        description: "Por favor, introduce tu dirección de email.",
        variant: "destructive"
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email inválido",
        description: "Por favor, introduce una dirección de email válida.",
        variant: "destructive"
      });
      return;
    }

    if (!acceptTerms) {
      toast({
        title: "Términos requeridos",
        description: "Por favor, acepta la Política de Privacidad.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('waitlist')
        .insert([{ email: email.trim() }]);

      if (error) {
        if (error.code === '23505') {
          toast({
            title: "¡Ya estás en la lista! 🎉",
            description: "Este email ya está registrado en nuestra waitlist.",
          });
        } else {
          throw error;
        }
      } else {
        setIsSubmitted(true);
        toast({
          title: "¡Bienvenido a Braini Emotions! 🎉",
          description: `Te hemos enviado un email de confirmación a ${email}.`,
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Algo salió mal",
        description: "Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setEmail('');
    setIsSubmitted(false);
    setAcceptTerms(false);
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
          background: 'linear-gradient(135deg,rgb(56, 144, 191) 0%, #7ED3BE 100%)'
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
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
              <img 
                src="/logo/logoBraini.png"
                alt="Braini Emotions Logo" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
              />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-3 sm:mb-4" style={{ fontWeight: 900 }}>
              Braini Emotions
            </h1>
            <p className="text-white font-bold text-xl sm:text-2xl lg:text-4xl mb-2 sm:mb-3 px-2" style={{ fontWeight: 700 }}>
              Bienestar emocional infantil, fácil y divertido
            </p>
            <p className="text-white text-sm sm:text-base lg:text-xl font-normal px-4 max-w-4xl mx-auto" style={{ fontWeight: 400 }}>
              25 sesiones de 20' basadas en evidencias científicas para niños/as de 4 - 10 años
            </p>
          </div>

          {/* Waitlist Card */}
          <div 
            id="waitlist-form"
            className="bg-white rounded-xl p-4 sm:p-6 shadow-2xl relative z-10 max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            {isSubmitted ? (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-3">
                  ¡Bienvenido a Braini Emotions! 🎉
                </h3>
                <p className="text-gray-600 mb-6">
                  Te hemos enviado un email de confirmación.
                </p>
                <Button 
                  onClick={handleReset}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
                >
                  Unirse con otro email
                </Button>
              </div>
            ) : (
              <>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 text-center" style={{ fontWeight: 700 }}>
                  Acceso Exclusivo: ¡Únete a la lista!
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <div className="flex-1 relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="tu@email.com"
                        className={`border-cyan-200 focus:border-cyan-400 focus:ring-cyan-400 text-base sm:text-lg py-3 ${
                          isFocused ? 'ring-2 ring-cyan-100' : ''
                        }`}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="text-white px-6 py-3 sm:py-2 font-bold hover:opacity-90 transition-opacity text-base w-full sm:w-auto"
                      style={{ 
                        background: 'linear-gradient(135deg, #6AC0E0 0%, #7ED3BE 100%)',
                        border: 'none'
                      }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      ) : (
                        '¡Quiero entrar!'
                      )}
                    </Button>
                  </div>

                  <p className="text-gray-600 text-sm text-center" style={{ fontWeight: 400 }}>
                    Acceso anticipado y descuentos especiales para los primeros en unirse.
                  </p>

                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-1 h-5 w-5 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="text-sm text-gray-700 leading-6" style={{ fontWeight: 400 }}>
                      Acepto la <span className="font-bold" style={{ fontWeight: 700 }}>Política de Privacidad</span> y recibir comunicaciones de Braini.
                    </label>
                  </div>
                </form>
              </>
            )}
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
                  src="/avatars/profile1.jpeg" 
                  alt="María - Madre satisfecha con Braini" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white object-cover shadow-md"
                />
                <img 
                  src="/avatars/profile2.jpg" 
                  alt="Carlos - Padre satisfecho con Braini" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white object-cover shadow-md"
                />
                <img 
                  src="/avatars/profile3.jpg" 
                  alt="Ana - Madre satisfecha con Braini" 
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white object-cover shadow-md"
                />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm sm:text-base font-bold text-white" style={{ fontWeight: 700 }}>
                  Con la confianza de <span className="font-black text-base sm:text-lg" style={{ fontWeight: 900 }}>+50</span> familias
                </p>
                <p className="text-xs sm:text-sm text-white/90" style={{ fontWeight: 400 }}>
                  "Transformando vidas, una emoción a la vez"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontWeight: 800 }}>
              ¿Por qué elegir Braini Emotions?
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Una solución integral para el desarrollo emocional de tus hijos, respaldada por la ciencia
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12">
            {/* Feature 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
                <img 
                  src="/emotions/1. Alegria.jpg" 
                  alt="Alegría - Basado en Evidencias" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" style={{ fontWeight: 700 }}>
                Basado en Evidencias
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Metodología respaldada por investigaciones científicas en psicología infantil y neurociencia
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
                <img 
                  src="/emotions/12. Tranquilidad.jpg" 
                  alt="Tranquilidad - Solo 20 Minutos" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" style={{ fontWeight: 700 }}>
                Solo 20 Minutos
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Sesiones cortas y efectivas que se adaptan a la rutina familiar sin sobrecargar
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
                <img 
                  src="/emotions/49. Ternura.jpg" 
                  alt="Ternura - Divertido y Atractivo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" style={{ fontWeight: 700 }}>
                Divertido y Atractivo
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Actividades lúdicas que mantienen a los niños motivados y comprometidos
              </p>
            </div>

            {/* Feature 4 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
                <img 
                  src="/emotions/7. Vergueza.jpg" 
                  alt="Vergüenza - Para Toda la Familia" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" style={{ fontWeight: 700 }}>
                Para Toda la Familia
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Involucra a padres y cuidadores en el proceso de desarrollo emocional
              </p>
            </div>

            {/* Feature 5 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
                <img 
                  src="/emotions/9. SOrpresa.jpg" 
                  alt="Sorpresa - Seguro y Confiable" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" style={{ fontWeight: 700 }}>
                Seguro y Confiable
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Contenido apropiado para la edad y supervisado por profesionales
              </p>
            </div>

            {/* Feature 6 */}
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-300">
                <img 
                  src="/emotions/35. Aburrimiento.jpg" 
                  alt="Aburrimiento - Resultados Comprobados" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" style={{ fontWeight: 700 }}>
                Resultados Comprobados
              </h3>
              <p className="text-gray-600 text-sm sm:text-base">
                Más de 50 familias ya han transformado la vida emocional de sus hijos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        className="py-16 sm:py-24 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgb(126, 211, 190) 0%, rgb(255, 235, 153) 100%)'
        }}
      >
        {/* Figuras Geométricas Circulares */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Círculo grande superior izquierdo */}
          <div 
            className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full"
          />
          {/* Círculo grande inferior derecho */}
          <div 
            className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ fontWeight: 800 }}>
              Beneficios para tu hijo
            </h2>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto">
              Desarrolla habilidades emocionales que durarán toda la vida
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 sm:gap-16 items-center">
            <div>
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4" style={{ color: '#7ea4df' }} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2" style={{ fontWeight: 700 }}>
                      Mejor Regulación Emocional
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base">
                      Aprende a identificar, expresar y manejar sus emociones de manera saludable
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4" style={{ color: '#7ea4df' }} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2" style={{ fontWeight: 700 }}>
                      Mayor Autoconfianza
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base">
                      Desarrolla una autoestima sólida y confianza en sus capacidades
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4" style={{ color: '#7ea4df' }} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2" style={{ fontWeight: 700 }}>
                      Habilidades Sociales Mejoradas
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base">
                      Mejora la comunicación y las relaciones con otros niños y adultos
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center mt-1">
                    <Check className="w-4 h-4" style={{ color: '#7ea4df' }} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-2" style={{ fontWeight: 700 }}>
                      Reducción del Estrés y Ansiedad
                    </h3>
                    <p className="text-white/90 text-sm sm:text-base">
                      Técnicas de relajación y mindfulness adaptadas para niños
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div 
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 sm:p-12 text-center shadow-2xl"
                style={{
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div 
                  className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #7ea4df 0%, #35bdb1 100%)'
                  }}
                >
                  <Heart className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4" style={{ fontWeight: 800 }}>
                  25 Sesiones Estructuradas
                </h3>
                <p className="text-gray-600 text-sm sm:text-base mb-6">
                  Un programa completo diseñado por expertos en psicología infantil
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold" style={{ fontWeight: 800, color: '#7ea4df' }}>4-10</div>
                    <div className="text-sm text-gray-600">años</div>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold" style={{ fontWeight: 800, color: '#35bdb1' }}>20'</div>
                    <div className="text-sm text-gray-600">por sesión</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4" style={{ fontWeight: 800 }}>
              Lo que dicen las familias
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Historias reales de transformación emocional
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Testimonial Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-12 border border-gray-100">
              <div className="text-center">
                {/* Avatar */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6">
                  <img 
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].name}
                    className="w-full h-full rounded-full object-cover border-4 border-blue-100"
                  />
                </div>

                {/* Rating */}
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${
                        i < testimonials[currentTestimonial].rating 
                          ? 'fill-current' 
                          : 'text-gray-300'
                      }`} 
                      style={{
                        color: i < testimonials[currentTestimonial].rating ? '#f8cd50' : undefined
                      }}
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <blockquote className="text-lg sm:text-xl text-gray-700 mb-6 italic leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>

                {/* Name */}
                <div className="text-lg font-bold text-gray-900" style={{ fontWeight: 700 }}>
                  {testimonials[currentTestimonial].name}
                </div>
              </div>
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial 
                      ? 'w-8' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  style={{
                    backgroundColor: index === currentTestimonial ? '#7ea4df' : undefined
                  }}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={() => setCurrentTestimonial((prev) => 
                prev === 0 ? testimonials.length - 1 : prev - 1
              )}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <ChevronLeft className="w-6 h-6 text-gray-600" />
            </button>

            <button
              onClick={() => setCurrentTestimonial((prev) => 
                (prev + 1) % testimonials.length
              )}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <ChevronRight className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontWeight: 800, color: '#7ea4df' }}>
                50+
              </div>
              <div className="text-gray-600">Familias satisfechas</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontWeight: 800, color: '#35bdb1' }}>
                4.8/5
              </div>
              <div className="text-gray-600">Calificación promedio</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontWeight: 800, color: '#f5827b' }}>
                95%
              </div>
              <div className="text-gray-600">Recomiendan Braini</div>
            </div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer 
        className="relative overflow-hidden py-12 sm:py-16"
        style={{
          background: 'linear-gradient(135deg,rgb(56, 144, 191) 0%, #7ED3BE 100%)'
        }}
      >
        {/* Figuras Geométricas Circulares */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Círculo grande superior izquierdo */}
          <div 
            className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full"
          />
          {/* Círculo grande inferior derecho */}
          <div 
            className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-4">
              <img 
                src="/logo/logoBraini.png"
                alt="Braini Emotions Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
            <h3 className="text-xl font-bold text-white mb-2" style={{ fontWeight: 700 }}>
              Braini Emotions
            </h3>
            <p className="text-white/90 text-sm mb-6">
              Transformando vidas, una emoción a la vez
            </p>
            <div className="border-t border-white/20 pt-6">
              <p className="text-white/80 text-xs">
                © 2025 Braini Emotions. Todos los derechos reservados.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
