import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import GeometricBackground from './GeometricBackground';
import EmotionsBackground from './EmotionsBackground';
import { Mail, CheckCircle, Users, Gift, Send } from 'lucide-react';

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
  const bgColor = 'bg-gradient-to-br from-slate-50 via-white to-blue-50';
  const textColor = 'text-slate-800';
  const textSecondaryColor = 'text-slate-600';
  const cardBg = 'bg-white/90';
  const cardBorder = 'border-white/20';
  const inputBg = 'bg-white';
  const inputBorder = 'border-slate-200';

  return (
    <div className={`min-h-screen ${bgColor} font-inter relative overflow-hidden transition-colors duration-300 flex flex-col`}>
      <GeometricBackground />
      <EmotionsBackground />



      {/* Main Content - Layout Vertical */}
      <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 pb-8 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto text-center space-y-8">
          


          {/* Logo BRAINI */}
          <div className="hidden sm:block space-y-4">
            <img 
              src="/logo/BRAINI_black.png"
              alt="Braini Emotions Logo" 
              className="w-20 h-20 sm:w-24 sm:h-24 mx-auto object-contain"
            />
          </div>

          {/* Header transparente para móvil (compensa el logo oculto) */}
          <div className="block sm:hidden h-2"></div>

          {/* Título Principal */}
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-black leading-tight ${textColor}`}>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Braini Emotions</span>
          </h1>

          {/* Descripción */}
          <p className={`text-lg sm:text-xl leading-relaxed max-w-xl mx-auto ${textSecondaryColor}`}>
            Acompañamiento emocional infantil con IA. Aprende a gestionar las emociones de tus hijos de forma consciente.
          </p>



          {/* 5. Formulario de Waitlist Horizontal */}
          <div>
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
              <div className="space-y-6">
                {/* Formulario Principal - Destacado */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 shadow-2xl border-0">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2">¡Únete a la Waitlist!</h3>
                    <p className="text-white/90">Sé el primero en descubrir Braini Emotions</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                    <div className="flex-1">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="tu@email.com"
                        className={`border-0 transition-all duration-300 text-lg py-5 px-6 rounded-xl shadow-lg ${
                          isFocused 
                            ? 'ring-4 ring-white/30 shadow-2xl' 
                            : 'hover:shadow-xl'
                        }`}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-5 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 whitespace-nowrap min-w-[140px]"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Suscribirse</span>
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Mensaje de Acceso Anticipado - Secundario */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-200">
                  <div className="flex items-center justify-center space-x-2 text-blue-700 font-medium">
                    <Gift className="w-4 h-4" />
                    <span className="text-sm">Acceso anticipado garantizado</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. Social Proof Visual */}
          <div className="flex items-center justify-center space-x-2">
            <div className="flex -space-x-2">
              <img 
                src="/avatars/profile1.jpeg" 
                alt="María" 
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
              />
              <img 
                src="/avatars/profile2.jpg" 
                alt="Carlos" 
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
              />
              <img 
                src="/avatars/profile3.jpg" 
                alt="Ana" 
                className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-sm"
              />
            </div>
            <span className={`text-sm ${textSecondaryColor}`}>
              Con la confianza de <strong>+50</strong> familias.
            </span>
          </div>


        </div>
      </main>

      {/* Footer Compacto */}
      <footer className="relative z-10 py-6 px-4 text-center border-t border-slate-200/50 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm mt-auto">
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
