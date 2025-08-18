import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GeometricBackground from '@/components/GeometricBackground';
import { Brain, Heart, Sparkles, ArrowRight, CheckCircle, Star, Users, BookOpen } from 'lucide-react';

const Landing = () => {
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
      rating: 5
    },
    {
      name: "Carlos M.",
      role: "Padre soltero",
      content: "Gracias a BRAINI, mi hija ha aprendido a identificar y expresar sus emociones de manera saludable.",
      rating: 5
    },
    {
      name: "Ana L.",
      role: "Psicóloga infantil",
      content: "Recomiendo BRAINI a todas las familias. Es una herramienta excepcional para el desarrollo emocional.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-braini-blue to-braini-blue-light rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-braini-blue">BRAINI</span>
          </div>
          
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-braini-blue hover:bg-white/20">
                Iniciar sesión
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white">
                Crear cuenta
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg mb-8 animate-fade-in">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">
                Plataforma líder en inteligencia emocional infantil
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 mb-6 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Tu compañero para el
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-braini-blue via-purple-600 to-pink-500">
                bienestar emocional
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Acompaña el desarrollo emocional de tu hijo/a a través de actividades científicas, 
              divertidas y cotidianas. Construye una familia más feliz y equilibrada.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-braini-blue to-purple-600 hover:from-braini-blue-dark hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg min-w-[220px] group">
                  Comenzar gratis
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:border-braini-blue hover:text-braini-blue hover:bg-white/50 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg min-w-[220px]">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-500 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Sin tarjeta de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Acceso inmediato</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>100% gratuito</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              ¿Por qué elegir BRAINI?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Una plataforma diseñada por expertos para el desarrollo emocional de toda la familia
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 text-center">
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
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Familias que confían en BRAINI
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre cómo BRAINI está transformando la vida emocional de miles de familias
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${0.8 + index * 0.1}s` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-800">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-braini-blue/10 to-purple-600/10 backdrop-blur-sm p-12 rounded-3xl shadow-2xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              ¿Listo para transformar tu familia?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Únete a miles de familias que ya están construyendo un futuro emocional más saludable y feliz.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-braini-blue to-purple-600 hover:from-braini-blue-dark hover:to-purple-700 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg min-w-[220px] group">
                  Comenzar ahora
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="outline" className="border-2 border-gray-300 text-gray-700 hover:border-braini-blue hover:text-braini-blue hover:bg-white/50 font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg min-w-[220px]">
                  Iniciar sesión
                </Button>
              </Link>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              ¿Ya tienes una cuenta? <Link to="/login" className="text-braini-blue hover:underline font-medium">Inicia sesión aquí</Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-gray-200/50">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-braini-blue to-braini-blue-light rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-braini-blue">BRAINI</span>
          </div>
          <p className="text-gray-500 text-sm">
            Tu compañero para el bienestar emocional • © 2024 BRAINI
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 