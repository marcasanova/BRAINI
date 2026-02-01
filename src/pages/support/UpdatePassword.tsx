import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

// Rutas de assets públicos
const logoBraini = '/logo/logoBraini.png';

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
    let mounted = true;
    let sessionProcessed = false;
    
    // Verificar si hay tokens de recuperación en la URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    // Función para procesar la sesión
    const processSession = async (session: any) => {
      if (!mounted || sessionProcessed) return;
      
      if (session) {
        sessionProcessed = true;
        setSession(session);
        // Limpiar el hash de la URL
        if (window.location.hash) {
          window.history.replaceState(null, '', window.location.pathname);
        }
      }
    };
    
    // Listener para cambios de autenticación (procesa tokens automáticamente)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state change:', event, session ? 'Session exists' : 'No session');
      
      // PASSWORD_RECOVERY es el evento específico para recuperación de contraseña
      if (event === 'PASSWORD_RECOVERY') {
        if (session) {
          await processSession(session);
        }
      } 
      // Si el evento es SIGNED_IN y hay tokens de recuperación en la URL
      else if (event === 'SIGNED_IN' && (type === 'recovery' || accessToken)) {
        if (session) {
          await processSession(session);
        }
      }
      // Si hay una sesión válida (puede ser de recuperación o normal)
      else if (session) {
        await processSession(session);
      }
    });
    
    // Verificar sesión inicial y procesar tokens de la URL si existen
    const initializeSession = async () => {
      // Si hay tokens en el hash, Supabase los procesará automáticamente
      // pero podemos forzar el procesamiento esperando un momento
      if (accessToken && type === 'recovery') {
        // Esperar a que Supabase procese los tokens del hash
        // getSession() debería procesarlos automáticamente
        setTimeout(async () => {
          if (!mounted || sessionProcessed) return;
          
          const { data: { session: recoverySession }, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error('Error getting session:', error);
          }
          
          if (recoverySession) {
            await processSession(recoverySession);
          } else {
            // Si después de esperar no hay sesión, los tokens pueden haber expirado
            toast({
              title: "Primero iniciamos sesión",
              description: "El enlace de recuperación ha expirado o no es válido. Por favor, solicita un nuevo enlace desde la página de login.",
              variant: "destructive",
            });
            navigate('/brainifamily/login');
          }
        }, 2000);
      } else {
        // No hay tokens en la URL, verificar sesión existente
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          await processSession(existingSession);
        } else {
          // No hay sesión ni tokens, redirigir al login
          toast({
            title: "Primero iniciamos sesión",
            description: "Para cuidar la seguridad de tu cuenta, necesitamos iniciar sesión antes de cambiar la contraseña. Vamos paso a paso 😊",
            variant: "destructive",
          });
          navigate('/brainifamily/login');
        }
      }
    };

    initializeSession();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast({
        title: "🔑 Un poquito más de seguridad",
        description: "Tu contraseña necesita al menos 6 caracteres para proteger bien tu cuenta. Añadimos algunos más y seguimos.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "⚠️ Revisamos un momento",
        description: "Las dos contraseñas no coinciden todavía. Las escribimos igual y continuamos con calma.",
        variant: "destructive",
      });
      return;
    }

    // Verificar que tenemos una sesión válida antes de intentar cambiar la contraseña
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    if (!currentSession) {
      toast({
        title: "Primero iniciamos sesión",
        description: "La sesión de recuperación ha expirado. Por favor, solicita un nuevo enlace de recuperación.",
        variant: "destructive",
      });
      navigate('/brainifamily/login');
      return;
    }

    setIsSubmitting(true);
    try {
      // Actualizar la contraseña
      const { data, error } = await supabase.auth.updateUser({ 
        password: password 
      });
      
      if (error) {
        // Mostrar el mensaje de error específico de Supabase
        let errorMessage = "No hemos podido cambiar la contraseña en este momento. Revisamos la conexión y lo intentamos de nuevo con calma.";
        
        if (error.message) {
          if (error.message.includes('expired') || error.message.includes('invalid')) {
            errorMessage = "El enlace de recuperación ha expirado o no es válido. Por favor, solicita un nuevo enlace desde la página de login.";
          } else if (error.message.includes('session')) {
            errorMessage = "La sesión no es válida. Por favor, solicita un nuevo enlace de recuperación.";
          } else {
            errorMessage = error.message;
          }
        }
        
        throw new Error(errorMessage);
      }

      toast({
        title: "✅ ¡Listo!",
        description: "Tu contraseña se ha actualizado correctamente. Ahora puedes iniciar sesión con ella.",
      });

      // Cerramos sesión para forzar un nuevo login con la nueva contraseña
      await supabase.auth.signOut();
      
      // Pequeño delay para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        navigate('/brainifamily/login');
      }, 1500);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "No hemos podido cambiar la contraseña en este momento. Revisamos la conexión y lo intentamos de nuevo con calma.";
      
      toast({
        title: "🌱 Algo no ha salido aún",
        description: errorMessage,
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