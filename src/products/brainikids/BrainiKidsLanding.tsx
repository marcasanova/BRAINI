import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/ui/select';
import { Check } from 'lucide-react';
import NavbarLandings from '@/shared/components/navigation/NavbarLandings';

// Color rojo corporativo
const BRAINI_RED = '#f5827b';

const BrainiKidsLanding = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const featuresRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    center: '',
    course: '',
    email: ''
  });

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Intersection Observer para las características
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setFeaturesVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    );

    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }

    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);

  const handleAccessMoodle = () => {
    // TODO: Añadir URL de Moodle para BrainiKids
    window.location.href = 'https://moodle.brainiemotions.com/brainikids';
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de envío del formulario
    console.log('Form data:', formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      course: value
    });
  };

  return (
    <div 
      className="min-h-screen font-montserrat relative"
      role="main"
      aria-label="Landing page de BrainiKids"
      style={{ background: BRAINI_RED }}
    >
      {/* Header con Navegación */}
      <NavbarLandings currentPage="kids" />

      {/* Hero Section */}
      <section 
        className="relative px-4 sm:px-6 md:px-8 pt-20 sm:pt-24 md:pt-28 pb-12 sm:pb-16 md:pb-20 border-b border-white/20 overflow-hidden"
        aria-label="Información principal de BrainiKids"
      >
        {/* Figuras Geométricas Circulares */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
          <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Título principal en dos líneas */}
            <h2 className="text-center mb-4 sm:mb-6 px-2">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1" style={{ fontWeight: 700 }}>
                Primeros pasos en
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white" style={{ fontWeight: 900 }}>
                neurobienestar emocional.
              </div>
            </h2>
            
          </div>

          {/* Card con descripción y botón */}
          <div className={`max-w-2xl mx-auto transition-all duration-1000 ease-out delay-200 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div 
              className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl relative z-10 w-full"
              style={{
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Título */}
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-4 sm:mb-5 md:mb-6 text-center" style={{ fontWeight: 600 }}>
                Implantación en centros educativos de <span style={{ color: BRAINI_RED }}>Educación Infantil</span>
              </h3>
              
              {/* Lista numerada */}
              <div className="space-y-2 sm:space-y-3 mb-5 sm:mb-6 md:mb-8">
                {/* Item 1 */}
                <div className="text-sm sm:text-base md:text-lg text-gray-900 leading-relaxed">
                  <span className="font-bold" style={{ fontWeight: 700 }}>1-</span> De <span style={{ color: BRAINI_RED, fontWeight: 600 }}>3 a 5 años</span>
                </div>
                
                {/* Item 2 */}
                <div className="text-sm sm:text-base md:text-lg text-gray-900 leading-relaxed">
                  <span className="font-bold" style={{ fontWeight: 700 }}>2-</span> Acceso al programa
                </div>
              </div>
              
              {/* Botón CTA Principal */}
              <div className="text-center">
                <Button 
                  onClick={handleAccessMoodle}
                  className="px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 font-bold transition-all text-sm sm:text-base md:text-lg md:hover:opacity-90 md:hover:scale-105 w-full sm:w-auto rounded-xl"
                  style={{ 
                    background: BRAINI_RED,
                    color: '#ffffff',
                    border: 'none',
                    minWidth: 'auto'
                  }}
                >
                  <span className="hidden sm:inline">Acceder a Braini Kids</span>
                  <span className="sm:hidden">Acceso Braini Kids</span>
                </Button>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Sección de Descripción y Características */}
      <section 
        ref={featuresRef}
        className="relative px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 border-b border-white/20"
        aria-label="Características de BrainiKids"
      >
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Texto introductorio */}
          <p className="text-base sm:text-lg md:text-xl text-white mb-6 sm:mb-8 px-3 sm:px-4 text-center leading-relaxed" style={{ fontWeight: 700 }}>
            Descubre cómo acompañamos el neurobienestar emocional en Educación Infantil, través de un programa educativo estructurado:
          </p>
          
          {/* Lista de características */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 transition-all duration-1000 ease-out ${
            featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {/* Característica 1 */}
            <div className="flex items-start p-4 sm:p-6 bg-white rounded-xl shadow-md">
              <div className="flex-shrink-0 mr-3 sm:mr-4">
                <Check className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: BRAINI_RED }} />
              </div>
              <p className="text-base sm:text-lg text-gray-700 font-medium" style={{ fontWeight: 500 }}>
                Identificación y reconocimiento de emociones
              </p>
            </div>

            {/* Característica 2 */}
            <div className="flex items-start p-4 sm:p-6 bg-white rounded-xl shadow-md">
              <div className="flex-shrink-0 mr-3 sm:mr-4">
                <Check className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: BRAINI_RED }} />
              </div>
              <p className="text-base sm:text-lg text-gray-700 font-medium" style={{ fontWeight: 500 }}>
                Seguridad y vínculo emocional
              </p>
            </div>

            {/* Característica 3 */}
            <div className="flex items-start p-4 sm:p-6 bg-white rounded-xl shadow-md">
              <div className="flex-shrink-0 mr-3 sm:mr-4">
                <Check className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: BRAINI_RED }} />
              </div>
              <p className="text-base sm:text-lg text-gray-700 font-medium" style={{ fontWeight: 500 }}>
                Primeras estrategias de autorregulación emocional
              </p>
            </div>

            {/* Característica 4 */}
            <div className="flex items-start p-4 sm:p-6 bg-white rounded-xl shadow-md">
              <div className="flex-shrink-0 mr-3 sm:mr-4">
                <Check className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: BRAINI_RED }} />
              </div>
              <p className="text-base sm:text-lg text-gray-700 font-medium" style={{ fontWeight: 500 }}>
                Expresión emocional a través del juego
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sección de Acceso al Programa y Formulario */}
      <section 
        className="relative px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 overflow-hidden"
        aria-label="Acceso al programa y formulario de registro"
      >
        {/* Figuras Geométricas Circulares */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
          <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
        </div>
        
        <div className="max-w-2xl mx-auto relative z-10">
          <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xl">
            {/* Título y descripción */}
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4" style={{ fontWeight: 700 }}>
                Ver programa para Educación Infantil
              </h3>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-6 sm:mb-8" style={{ fontWeight: 400 }}>
                Accede al dossier Braini Kids + 3 sesiones gratuitas
              </p>
            </div>
            
            <form onSubmit={handleFormSubmit} className="space-y-4 sm:space-y-6">
              {/* Campo Nombre */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-semibold text-base sm:text-lg" style={{ fontWeight: 600 }}>
                  Nombre:
                </Label>
                <Input
                  id="name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Tu nombre"
                  className="w-full px-4 py-3 sm:py-4 text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                  required
                />
              </div>
              
              {/* Campo Centro educativo */}
              <div className="space-y-2">
                <Label htmlFor="center" className="text-gray-700 font-semibold text-base sm:text-lg" style={{ fontWeight: 600 }}>
                  Centro educativo:
                </Label>
                <Input
                  id="center"
                  type="text"
                  name="center"
                  value={formData.center}
                  onChange={handleInputChange}
                  placeholder="Nombre del centro educativo"
                  className="w-full px-4 py-3 sm:py-4 text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                  required
                />
              </div>
              
              {/* Campo Curso (desplegable) */}
              <div className="space-y-2">
                <Label htmlFor="course" className="text-gray-700 font-semibold text-base sm:text-lg" style={{ fontWeight: 600 }}>
                  Curso: (desplegable 3, 4 5 años)
                </Label>
                <Select value={formData.course} onValueChange={handleSelectChange} required>
                  <SelectTrigger className="w-full px-4 py-3 sm:py-4 text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors">
                    <SelectValue placeholder="Selecciona un curso" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 años</SelectItem>
                    <SelectItem value="4">4 años</SelectItem>
                    <SelectItem value="5">5 años</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold text-base sm:text-lg" style={{ fontWeight: 600 }}>
                  Email:
                </Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 sm:py-4 text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 transition-colors"
                  required
                />
              </div>
              
              {/* Botón de envío */}
              <Button
                type="submit"
                className="w-full px-6 sm:px-8 py-4 sm:py-5 font-bold transition-all text-base sm:text-lg md:text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 mt-6"
                style={{ 
                  background: BRAINI_RED,
                  color: '#ffffff',
                  border: 'none'
                }}
              >
                Enviar
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-4 sm:px-6 md:px-8 py-6 sm:py-8 border-t border-white/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm sm:text-base text-white/80">
            © 2025 Braini Emotions. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BrainiKidsLanding;
