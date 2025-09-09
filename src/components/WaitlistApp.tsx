import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import GeometricBackground from './GeometricBackground';
import { CheckCircle, Mail, ArrowRight, Gift } from 'lucide-react';

const WaitlistApp = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  // Animación de entrada
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);



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
  };

  // Colores fijos para modo claro
  const bgColor = 'bg-white';
  const textColor = 'text-slate-800';
  const textSecondaryColor = 'text-slate-600';
  const cardBg = 'bg-white/90';
  const cardBorder = 'border-white/20';
  const inputBg = 'bg-white';
  const inputBorder = 'border-slate-200';

  return (
    <div 
      className={`min-h-screen ${bgColor} font-inter relative overflow-hidden transition-colors duration-300 flex flex-col`}
      role="main"
      aria-label="Página de waitlist de Braini Emotions"
    >
      <div className={`transition-opacity duration-2000 ease-out ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <GeometricBackground />
      </div>



      {/* Main Content - Layout Vertical */}
      <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 pb-8 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto text-center space-y-8">
          


          {/* Logo BRAINI */}
          <div className={`space-y-4 transition-all duration-1000 ease-out ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex flex-col items-center space-y-2">
              <img 
                src="/logo/BRAINI_black.png"
                alt="Braini Emotions Logo" 
                className="w-20 h-20 sm:w-25 sm:h-25∫ object-contain"
              />
            </div>
          </div>

          {/* Título Principal */}
          <h1 
            className={`text-4xl sm:text-5xl md:text-6xl leading-tight ${textColor} transition-all duration-1000 ease-out delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} 
            style={{ fontWeight: 1000, letterSpacing: '-0.02em' }}
            aria-label="Braini Emotions - Acompañamiento emocional infantil"
          >
            <span className="text-blue-500">Braini Emotions</span>
          </h1>

          {/* Tres cajas informativas */}
          <div className={`space-y-4 max-w-lg mx-auto transition-all duration-1000 ease-out delay-400 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`} role="region" aria-label="Características del programa">
            {/* Caja 1 - Amarilla */}
            <div 
              className="bg-yellow-200 rounded-xl p-5 text-center shadow-sm"
              role="article"
              aria-label="Duración del programa"
            >
              <p className="text-slate-900 font-semibold text-base">
                <span className="block">25 Sesiones de 20 Minutos</span>
                <span className="block">Para transformar la vida de tu hijo</span>
              </p>
            </div>

            {/* Caja 2 - Verde */}
            <div 
              className="bg-green-200 rounded-xl p-5 text-center shadow-sm"
              role="article"
              aria-label="Base científica del programa"
            >
              <p className="text-slate-900 font-semibold text-base">
                Basado en evidencias científicas
              </p>
            </div>

            {/* Caja 3 - Roja */}
            <div 
              className="bg-red-200 rounded-xl p-5 text-center shadow-sm"
              role="article"
              aria-label="Inversión en bienestar emocional"
            >
              <p className="text-slate-900 font-semibold text-base">
                <span className="block">Invierte en bienestar emocional</span>
                <span className="block">¡Tu mejor elección!</span>
              </p>
            </div>
          </div>



          {/* 5. Formulario de Waitlist Horizontal */}
          <div className={`transition-all duration-1000 ease-out delay-600 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {isSubmitted ? (
              <Card className={`${cardBg} backdrop-blur-md shadow-xl border ${cardBorder}`}>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className={`text-2xl font-bold mb-3 ${textColor}`}>
                    ¡Bienvenido a Braini Emotions! 🎉
                  </h3>
                  <p className={`mb-6 ${textSecondaryColor}`}>
                    Te hemos enviado un email de confirmación.
                  </p>
                  <Button 
                    onClick={handleReset}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3"
                  >
                    Unirse con otro email
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="bg-blue-500 rounded-xl p-8 shadow-xl">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">Acceso Exclusivo: ¡Únete a la Waitlist!</h3>
                  <p className="text-white/90 font-medium">Sé el primero en descubrir Braini</p>
                </div>
                
                <form 
                  onSubmit={handleSubmit} 
                  className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                  role="form"
                  aria-label="Formulario de suscripción a la waitlist"
                >
                  <div className="flex-1 relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      placeholder="tu@email.com"
                      className={`bg-white border-0 text-lg py-3 pl-12 pr-4 rounded-lg shadow-lg ${
                        isFocused 
                          ? 'ring-4 ring-white/30 shadow-2xl' 
                          : ''
                      }`}
                      required
                      disabled={isSubmitting}
                      aria-label="Dirección de email"
                      aria-describedby="email-help"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-3 px-6 rounded-lg shadow-lg flex items-center space-x-2 whitespace-nowrap"
                    disabled={isSubmitting}
                    aria-label="Suscribirse a la waitlist"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <span>Suscríbete</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Incentivo más prominente */}
                <div className="bg-white/10 rounded-lg p-4 mt-6 border border-white/20">
                  <div className="flex items-center justify-center space-x-2 text-white">
                    <Gift className="w-5 h-5" />
                    <span className="font-semibold text-base">
                      Acceso anticipado y descuentos especiales para los primeros en unirse
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Social Proof Visual - Mejorado */}
          <div 
            className={`flex flex-col items-center space-y-3 transition-all duration-1000 ease-out delay-800 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            role="region"
            aria-label="Testimonios de familias que confían en Braini"
          >
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2" role="img" aria-label="Avatares de familias satisfechas">
                <img 
                  src="/avatars/profile1.jpeg" 
                  alt="María - Madre satisfecha con Braini" 
                  className="w-12 h-12 rounded-full border-3 border-white object-cover shadow-md"
                />
                <img 
                  src="/avatars/profile2.jpg" 
                  alt="Carlos - Padre satisfecho con Braini" 
                  className="w-12 h-12 rounded-full border-3 border-white object-cover shadow-md"
                />
                <img 
                  src="/avatars/profile3.jpg" 
                  alt="Ana - Madre satisfecha con Braini" 
                  className="w-12 h-12 rounded-full border-3 border-white object-cover shadow-md"
                />
              </div>
              <div className="text-left">
                <p className={`text-base font-semibold ${textColor}`}>
                  Con la confianza de <span className="text-blue-500 font-bold text-lg">+50</span> familias
                </p>
                <p className={`text-sm ${textSecondaryColor} italic`}>
                  "Transformando vidas, una emoción a la vez"
                </p>
              </div>
            </div>
          </div>


        </div>
      </main>

      {/* Footer Compacto */}
      <footer 
        className={`relative z-10 py-6 px-4 text-center border-t border-slate-200/30 bg-white/80 backdrop-blur-sm mt-auto transition-all duration-1000 ease-out delay-1000 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        role="contentinfo"
        aria-label="Información de copyright de Braini Emotions"
      >
        <div className="container mx-auto">
          <p className={`font-medium text-sm ${textSecondaryColor}`}>
            © 2025 Braini Emotions. Acompañamiento emocional infantil en armonía.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WaitlistApp;
