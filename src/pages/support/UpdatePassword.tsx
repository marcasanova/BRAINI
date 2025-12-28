import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

// Rutas de assets públicos
const logoBraini = '/logo/LogoBraini_new.png';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  // Animación de entrada
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast({
          title: "Acceso no autorizado",
          description: "Necesitas estar autenticado para cambiar tu contraseña.",
          variant: "destructive",
        });
        navigate('/login');
      } else {
        setSession(session);
      }
    });
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: "Contraseña demasiado corta",
        description: "La contraseña debe tener al menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden",
        description: "Por favor, asegúrate de que ambas contraseñas sean iguales.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;

      toast({
        title: "¡Contraseña actualizada! 🎉",
        description: "Tu contraseña ha sido cambiada correctamente. Ya puedes iniciar sesión.",
      });

      // Cerramos sesión para forzar un nuevo login con la nueva contraseña
      await supabase.auth.signOut();
      navigate('/login');

    } catch (error) {
      toast({
        title: "Error al actualizar",
        description: "No se pudo actualizar la contraseña. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!session) {
    return null; // O un spinner de carga
  }

  return (
    <div 
      className="min-h-screen bg-white font-montserrat relative overflow-hidden transition-colors duration-300"
      role="main"
      aria-label="Página de actualización de contraseña"
    >
      {/* Hero Section - Mismo estilo que Conferencia y Login */}
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
          <div className="mb-8 sm:mb-12 relative z-10">
            {/* Logo y Título - Logo encima */}
            <div className="text-center mb-3 sm:mb-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <img 
                  src={logoBraini}
                  alt="Braini Emotions Logo" 
                  className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-contain"
                />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-2 sm:mb-3" style={{ fontWeight: 900 }}>
                Actualizar Contraseña
              </h1>
              <p className="text-white text-base sm:text-lg lg:text-xl px-4" style={{ fontWeight: 400 }}>
                Establece tu nueva contraseña para acceder a tu cuenta
              </p>
            </div>
          </div>

          {/* Formulario Card - Mismo estilo que Conferencia y Login */}
          <div 
            id="update-password-form"
            className="bg-white rounded-xl p-6 sm:p-8 shadow-2xl relative z-10 max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nueva Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                  Nueva contraseña *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce tu nueva contraseña"
                  className="border-2 border-gray-200 focus:border-braini-blue transition-colors text-base py-3"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500" style={{ fontWeight: 400 }}>
                  La contraseña debe tener al menos 6 caracteres
                </p>
              </div>
              
              {/* Campo Confirmar Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                  Confirmar contraseña *
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirma tu nueva contraseña"
                  className="border-2 border-gray-200 focus:border-braini-blue transition-colors text-base py-3"
                  required
                  disabled={isSubmitting}
                />
              </div>
              
              {/* Botón Submit - Mismo estilo que Conferencia y Login */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="text-white px-8 sm:px-12 py-4 sm:py-5 font-bold transition-all text-base sm:text-lg md:hover:opacity-90 md:hover:scale-105"
                  style={{ 
                    background: '#7ea4df',
                    border: 'none',
                    minWidth: '280px'
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Actualizando...</span>
                    </div>
                  ) : (
                    <span>Actualizar contraseña</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UpdatePassword; 