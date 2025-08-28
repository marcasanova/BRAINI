import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import GeometricBackground from './GeometricBackground';
import { Mail, CheckCircle, Users, ArrowRight, Shield, Clock, Brain, Heart, Sparkles } from 'lucide-react';

const WaitlistApp = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const { toast } = useToast();

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

    // Validación de email
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
        // Si el email ya existe
        if (error.code === '23505') {
          toast({
            title: "¡Ya estás en la lista! 🎉",
            description: "Este email ya está registrado en nuestra waitlist.",
          });
        } else {
          throw error;
        }
      } else {
        // Éxito
        setIsSubmitted(true);
        toast({
          title: "¡Bienvenido a la waitlist! 🎉",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 font-inter relative overflow-hidden">
      <GeometricBackground />

      {/* Header */}
      <header className="relative z-10 pt-8 pb-6 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative group animate-fade-in-up">
              <img 
                src="/logo/BRAINI_black.png" 
                alt="Braini Logo" 
                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-contain transition-all duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-slate-800 mb-4 tracking-tight animate-fade-in-up [animation-delay:200ms]">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Braini</span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-slate-600 mb-6 font-medium tracking-wide animate-fade-in-up [animation-delay:400ms]">
            mind & emotions
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 pb-16">
        <div className="w-full max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 lg:mb-20 animate-fade-in-up [animation-delay:600ms]">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-700 mb-6 sm:mb-8 leading-tight max-w-4xl mx-auto">
              Transforma tu bienestar mental con{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                inteligencia emocional
              </span>
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed px-4 font-medium">
              Únete a nuestra waitlist y sé el primero en descubrir cómo Braini puede elevar tu bienestar emocional y transformar tu viaje de salud mental.
            </p>
          </div>

          {/* Waitlist Form */}
          <div className="mb-20 lg:mb-24 animate-scale-in [animation-delay:800ms]">
            {isSubmitted ? (
              <Card className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 relative z-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-blue-400/10"></div>
                <CardContent className="p-10 text-center relative z-10">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg animate-glow">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    ¡Bienvenido a Braini! 🎉
                  </h3>
                  <p className="text-slate-600 mb-8 text-lg leading-relaxed">
                    Te hemos enviado un email de confirmación. Estaremos en contacto pronto con más novedades sobre Braini.
                  </p>
                  <Button 
                    onClick={handleReset}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    Unirse con otro email
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="w-full max-w-lg mx-auto bg-white/90 backdrop-blur-md shadow-2xl border border-white/20 relative z-10 overflow-hidden hover:shadow-3xl transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5"></div>
                <CardContent className="p-8 sm:p-10 relative z-10">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <Mail className="text-white" size={28} />
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
                      Únete a la waitlist
                    </h3>
                    <p className="text-slate-600 text-lg">
                      Sé el primero en saber cuando Braini esté disponible
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-slate-700 font-semibold text-base">
                        Email
                      </Label>
                      <div className="relative">
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          placeholder="tu@email.com"
                          className={`border-2 transition-all duration-300 text-lg py-4 px-4 rounded-xl ${
                            isFocused 
                              ? 'border-blue-500 shadow-lg shadow-blue-500/25' 
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                          required
                          disabled={isSubmitting}
                        />
                        {isFocused && (
                          <div className="absolute inset-0 border-2 border-blue-500 rounded-xl opacity-20 animate-pulse"></div>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:transform-none disabled:scale-100 disabled:opacity-70"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Uniéndose...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center space-x-2">
                          <span>Unirse a la waitlist</span>
                          <ArrowRight className="w-5 h-5" />
                        </div>
                      )}
                    </Button>
                  </form>
                  
                  <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center space-x-2 text-sm text-slate-600">
                      <Shield className="w-4 h-4 text-slate-500" />
                      <span>Al unirte, aceptas recibir actualizaciones sobre Braini. Respetamos tu privacidad.</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Waitlist Statistics */}
          <div className="mb-20 lg:mb-24 animate-fade-in-up [animation-delay:1000ms]">
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 backdrop-blur-sm shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-slate-800 mb-4">
                  ¡Ya se han registrado{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    39 personas
                  </span>{' '}
                  en la waitlist!
                </h3>
                <p className="text-slate-600 text-xl mb-6">
                  Únete a nuestra comunidad y sé parte de la revolución del bienestar mental
                </p>
                <div className="flex items-center justify-center space-x-2 text-slate-500">
                  <Clock className="w-5 h-5" />
                  <span className="text-sm">Acceso prioritario para los primeros registros</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
            <div className="group text-center p-8 bg-white/80 rounded-2xl backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-white/30 hover:border-blue-200/50 animate-fade-in-up [animation-delay:1200ms]">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-3 text-lg">Enfoque Consciente</h3>
              <p className="text-slate-600 text-base leading-relaxed">Técnicas respaldadas por la ciencia para mayor claridad mental y conciencia emocional</p>
            </div>
            
            <div className="group text-center p-8 bg-white/80 rounded-2xl backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-white/30 hover:border-purple-200/50 animate-fade-in-up [animation-delay:1400ms]">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-3 text-lg">Equilibrio Emocional</h3>
              <p className="text-slate-600 text-base leading-relaxed">Herramientas avanzadas para entender, gestionar y equilibrar tus emociones</p>
            </div>
            
            <div className="group text-center p-8 bg-white/80 rounded-2xl backdrop-blur-sm hover:shadow-2xl transition-all duration-500 transform hover:scale-105 border border-white/30 hover:border-yellow-200/50 sm:col-span-2 lg:col-span-1 animate-fade-in-up [animation-delay:1600ms]">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-slate-800 mb-3 text-lg">Crecimiento Personal</h3>
              <p className="text-slate-600 text-base leading-relaxed">Insights personalizados y guía para tu viaje emocional único</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-4 text-center border-t border-slate-200/50 bg-white/30 backdrop-blur-sm">
        <div className="container mx-auto">
          <p className="text-slate-500 font-medium">
            © 2024 Braini. Mind and emotions in harmony.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default WaitlistApp;
