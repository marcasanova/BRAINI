import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { CheckCircle, Mail, ArrowRight, Gift, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WaitlistApp = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      className="min-h-screen bg-white font-montserrat relative overflow-hidden transition-colors duration-300 flex flex-col"
      role="main"
      aria-label="Página de waitlist de Braini Emotions"
    >

      {/* Navigation Button */}
      <div className="absolute top-4 left-4 z-20">
        <Button 
          onClick={() => navigate('/')}
          variant="outline"
          className="bg-white/90 hover:bg-white text-gray-700 border-gray-300"
        >
          <Home className="w-4 h-4 mr-2" />
          Ver landing page
        </Button>
      </div>

      {/* Main Content - Centrado */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-2 sm:px-4 py-4 sm:py-8">
        <div className={`w-full max-w-7xl mx-auto transition-all duration-1000 ease-out ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Tarjeta Principal con Degradado */}
          <div 
            className="relative rounded-xl sm:rounded-2xl p-4 sm:p-8 lg:p-12 shadow-4xl min-h-[95vh] sm:min-h-[90vh] flex flex-col overflow-hidden"
            style={{
              background: 'linear-gradient(135deg,rgb(56, 144, 191) 0%, #7ED3BE 100%)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
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

            {/* Logo BRAINI */}
            <div className="text-center mb-6 sm:mb-8 relative z-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <img 
                  src="/logo/logoBraini.png"
                  alt="Braini Emotions Logo" 
                  className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                />
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-3 sm:mb-4" style={{ fontWeight: 900 }}>
                Braini Emotions
              </h1>
              <p className="text-white font-bold text-xl sm:text-2xl lg:text-4xl mb-2 sm:mb-3 px-2" style={{ fontWeight: 700 }}>
                Bienestar emocional infantil, fácil y divertido
              </p>
              <p className="text-white text-sm sm:text-base lg:text-xl font-normal px-4" style={{ fontWeight: 400 }}>
                25 sesiones de 20' basadas en evidencias científicas para niños/as de 4 - 10 años
              </p>
            </div>

            {/* Tarjeta Blanca Interna con Formulario */}
            <div 
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

            {/* Social Proof - Dentro de la tarjeta */}
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
        </div>
      </main>
    </div>
  );
};

export default WaitlistApp;
