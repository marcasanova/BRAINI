import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GeometricBackground from '@/components/GeometricBackground';
import { Brain, Heart, Sparkles, ArrowRight, CheckCircle, Star, Users, BookOpen, Shield, Clock, Award, Play } from 'lucide-react';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Inteligencia Emocional",
      description: "Desarrolla habilidades emocionales con base científica",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: Heart,
      title: "Bienestar Familiar",
      description: "Fortalece la conexión emocional con tus hijos",
      color: "text-pink-600",
      bgColor: "bg-pink-50"
    },
    {
      icon: BookOpen,
      title: "Aprendizaje Lúdico",
      description: "25 niveles de actividades divertidas y educativas",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Únete a miles de familias en este viaje",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    }
  ];

  const testimonials = [
    {
      name: "María G.",
      role: "Madre de dos niños",
      content: "BRAINI ha transformado la forma en que manejamos las emociones en casa. Los ejercicios son divertidos y realmente funcionan.",
      rating: 5,
      avatar: "👩‍👧‍👦"
    },
    {
      name: "Carlos M.",
      role: "Padre soltero",
      content: "Gracias a BRAINI, mi hija ha aprendido a identificar y expresar sus emociones de manera saludable.",
      rating: 5,
      avatar: "👨‍👧"
    },
    {
      name: "Ana L.",
      role: "Psicóloga infantil",
      content: "Recomiendo BRAINI a todas las familias. Es una herramienta excepcional para el desarrollo emocional.",
      rating: 5,
      avatar: "👩‍⚕️"
    },
    {
      name: "Roberto S.",
      role: "Educador",
      content: "La metodología científica de BRAINI es impresionante. Los niños aprenden sin darse cuenta.",
      rating: 5,
      avatar: "👨‍🏫"
    },
    {
      name: "Laura M.",
      role: "Madre de familia numerosa",
      content: "Con 4 hijos, BRAINI me ha ayudado a crear un ambiente más armonioso en casa.",
      rating: 5,
      avatar: "👩‍👧‍👦👶"
    },
    {
      name: "Dr. Patricia R.",
      role: "Psicóloga clínica",
      content: "BRAINI es la herramienta que siempre quise recomendar a mis pacientes. Basada en evidencia científica.",
      rating: 5,
      avatar: "👩‍⚕️"
    }
  ];

  const trustSignals = [
    { icon: Shield, text: "100% Seguro y Privado", color: "text-green-600" },
    { icon: Clock, text: "Acceso Inmediato", color: "text-blue-600" },
    { icon: Award, text: "Basado en Ciencia", color: "text-purple-600" },
    { icon: Users, text: "10,000+ Familias", color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      
      {/* Navigation Bar */}
      <header>
        <nav className="absolute top-0 left-0 right-0 z-50 p-4 md:p-6" role="navigation" aria-label="Navegación principal">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-braini-blue to-braini-blue-light rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-6 h-6 text-white" aria-hidden="true" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-braini-blue">BRAINI</span>
            </div>
            
            <div className="flex gap-2 md:gap-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-braini-blue hover:bg-white/20 text-sm md:text-base">
                  Iniciar sesión
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white text-sm md:text-base">
                  Crear cuenta
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main>
        <section className="relative z-10 pt-24 md:pt-32 pb-16 md:pb-20" aria-labelledby="hero-heading">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-6 md:mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <Sparkles className="w-4 h-4 text-yellow-500" aria-hidden="true" />
                <span className="text-sm font-medium text-gray-700">
                  Plataforma líder en inteligencia emocional infantil
                </span>
              </div>

              {/* Main Heading */}
              <h1 id="hero-heading" className={`text-4xl md:text-6xl lg:text-7xl font-bold text-gray-800 mb-4 md:mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.1s' }}>
                Tu compañero para el
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-braini-blue via-purple-600 to-pink-500">
                  bienestar emocional
                </span>
              </h1>

              {/* Subtitle */}
              <p className={`text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.2s' }}>
                Acompaña el desarrollo emocional de tu hijo/a a través de actividades científicas, 
                divertidas y cotidianas. Construye una familia más feliz y equilibrada.
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.3s' }}>
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-braini-blue to-purple-600 hover:from-braini-blue-dark hover:to-purple-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base md:text-lg min-w-[200px] md:min-w-[220px] group">
                    Comenzar gratis
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/login">
                  <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:border-braini-blue hover:text-braini-blue hover:bg-white/50 font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base md:text-lg min-w-[200px] md:min-w-[220px]">
                    Ya tengo cuenta
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className={`flex flex-wrap justify-center items-center gap-4 md:gap-8 text-xs md:text-sm text-gray-500 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '0.4s' }}>
                {trustSignals.map((signal, index) => {
                  const Icon = signal.icon;
                  return (
                    <div key={index} className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-green-500" aria-hidden="true" />
                      <span>{signal.text}</span>
                    </div>
                  );
                })}
              </div>
          </div>
        </div>
      </section>

        {/* Features Section */}
        <section className="relative z-10 py-16 md:py-20" aria-labelledby="features-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 id="features-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                ¿Por qué elegir BRAINI?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Una plataforma diseñada por expertos para el desarrollo emocional de toda la familia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index}
                    className={`bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                    style={{ transitionDelay: `${0.5 + index * 0.1}s` }}
                  >
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-3 md:mb-4 mx-auto`}>
                      <Icon className={`w-5 h-5 md:w-6 md:h-6 ${feature.color}`} aria-hidden="true" />
                    </div>
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2 text-center">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 text-center text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="relative z-10 py-16 md:py-20" aria-labelledby="testimonials-heading">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 id="testimonials-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                Familias que confían en BRAINI
              </h2>
              <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
                Descubre cómo BRAINI está transformando la vida emocional de miles de familias
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className={`bg-white/90 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ transitionDelay: `${0.8 + index * 0.1}s` }}
                >
                  <div className="flex items-center gap-1 mb-3 md:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" aria-hidden="true" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-3 md:mb-4 leading-relaxed text-sm md:text-base">
                    "{testimonial.content}"
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" role="img" aria-label={`Avatar de ${testimonial.name}`}>
                      {testimonial.avatar}
                    </span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm md:text-base">{testimonial.name}</p>
                      <p className="text-xs md:text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="relative z-10 py-16 md:py-20" aria-labelledby="final-cta-heading">
          <div className="container mx-auto px-4">
            <div className={`max-w-4xl mx-auto bg-gradient-to-r from-braini-blue/10 to-purple-600/10 backdrop-blur-sm p-8 md:p-12 rounded-3xl shadow-2xl text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '1s' }}>
              <h2 id="final-cta-heading" className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 md:mb-6">
                ¿Listo para transformar tu familia?
              </h2>
              <p className="text-lg md:text-xl text-gray-600 mb-6 md:mb-8 max-w-2xl mx-auto">
                Únete a miles de familias que ya están construyendo un futuro emocional más saludable y feliz.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-4 md:mb-6">
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-braini-blue to-purple-600 hover:from-braini-blue-dark hover:to-purple-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-base md:text-lg min-w-[200px] md:min-w-[220px] group">
                    Comenzar ahora
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link to="/login">
                  <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:border-braini-blue hover:text-braini-blue hover:bg-white/50 font-semibold py-3 md:py-4 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-base md:text-lg min-w-[200px] md:min-w-[220px]">
                    Iniciar sesión
                  </Button>
                </Link>
              </div>

              <p className="text-xs md:text-sm text-gray-500">
                ¿Ya tienes una cuenta? <Link to="/login" className="text-braini-blue hover:underline font-medium">Inicia sesión aquí</Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 md:py-12 border-t border-gray-200/50" role="contentinfo">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-3 md:mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-braini-blue to-braini-blue-light rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg md:text-xl font-bold text-braini-blue">BRAINI</span>
          </div>
          <p className="text-gray-500 text-xs md:text-sm">
            Tu compañero para el bienestar emocional • © 2025 BRAINI
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs text-gray-400">
            <Link to="/privacy" className="hover:text-gray-600 transition-colors">Política de Privacidad</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-gray-600 transition-colors">Términos de Servicio</Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-gray-600 transition-colors">Contacto</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 