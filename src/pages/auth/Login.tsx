import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Rutas de assets públicos
const logoBraini = '/logo/LogoBraini_new.png';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Animación de entrada
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // State for password reset
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      toast({
        title: "Correo electrónico requerido",
        description: "Por favor, introduce tu correo electrónico.",
        variant: "destructive",
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast({
        title: "Email no válido",
        description: "Por favor, introduce una dirección de correo electrónico válida.",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      toast({
        title: "Enlace enviado",
        description: "Si existe una cuenta con este correo, te hemos enviado un enlace para restablecer tu contraseña.",
      });
      setIsResetDialogOpen(false);
      setResetEmail('');
    } catch (error) {
      toast({
        title: "Error al enviar el enlace",
        description: "No se pudo enviar el enlace de recuperación. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Información faltante",
        description: "Por favor, rellena todos los campos.",
        variant: "destructive"
      });
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email no válido",
        description: "Por favor, introduce una dirección de correo electrónico válida.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message || "Email o contraseña no válidos");
      }

      toast({
        title: "¡Bienvenido/a de vuelta! 🎉",
        description: "Has iniciado sesión correctamente en Braini.",
      });

      // Reset form
      setEmail('');
      setPassword('');

      // Comprobar si el perfil está completo
      const userId = data.user?.id;
      if (!userId) throw new Error('No se pudo obtener el usuario autenticado.');
      
      // Obtener datos del padre
      const { data: parentData, error: parentError } = await supabase
        .from('parents')
        .select('profile_completed, is_trial_user')
        .eq('id', userId)
        .single();
      if (parentError) throw parentError;
      if (!parentData) throw new Error('No se encontró el perfil del usuario.');
      
      // Verificar si el perfil del padre está completo
      if (parentData.profile_completed === false) {
        navigate('/parents-profile');
        return;
      }
      
      // Verificar si es usuario de prueba (saltar todo el onboarding)
      if (parentData.is_trial_user === true) {
        navigate('/home');
        return;
      }
      
      // Verificar si el perfil del hijo está completo
      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('id')
        .eq('parent_id', userId)
        .single();
      
      if (childError && childError.code !== 'PGRST116') {
        // Error real, no solo "no encontrado"
        throw childError;
      }
      
      if (!childData) {
        // No hay hijo registrado, ir a ChildProfile
        navigate('/child-profile');
        return;
      }
      
      // Perfil completo, ir directamente a Home
      navigate('/home');
    } catch (error) {
      toast({
        title: "Inicio de sesión fallido",
        description: error instanceof Error ? error.message : "Email o contraseña no válidos. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-white font-montserrat relative overflow-hidden transition-colors duration-300"
      role="main"
      aria-label="Página de inicio de sesión"
    >
      {/* Hero Section - Mismo estilo que Conferencia */}
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
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white" style={{ fontWeight: 900 }}>
                Iniciar Sesión
              </h1>
            </div>
          </div>

          {/* Formulario Card - Mismo estilo que Conferencia */}
          <div 
            id="login-form"
            className="bg-white rounded-xl p-6 sm:p-8 shadow-2xl relative z-10 max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                  Correo electrónico *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="border-2 border-gray-200 focus:border-braini-blue transition-colors text-base py-3"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500" style={{ fontWeight: 400 }}>
                  El correo que usaste para registrarte en la prueba gratuita
                </p>
              </div>
              
              {/* Campo Contraseña */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                    Contraseña *
                  </Label>
                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="link" className="text-sm px-0 font-normal h-auto py-1 text-gray-600 hover:text-braini-blue">
                        ¿Has olvidado tu contraseña?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Recuperar contraseña</DialogTitle>
                        <DialogDescription>
                          Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email">
                            Email
                          </Label>
                          <Input
                            id="reset-email"
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="tu@email.com"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handlePasswordReset} disabled={isResetting}>
                          {isResetting ? 'Enviando...' : 'Enviar enlace'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Introduce contraseña"
                  className="border-2 border-gray-200 focus:border-braini-blue transition-colors text-base py-3"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500" style={{ fontWeight: 400 }}>
                  No te peoupes si no la recuerdas, puedes recuperarla en "¿Has olvidado tu contraseña?" 
                </p>
              </div>
              
              {/* Botón Submit - Mismo estilo que Conferencia */}
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
                      <span>Iniciando sesión...</span>
                    </div>
                  ) : (
                    <span>Iniciar sesión</span>
                  )}
                </Button>
              </div>

              {/* Línea separadora */}
              <div className="mt-6 border-t border-gray-200"></div>

              {/* Enlace a Registro */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm sm:text-base">
                  ¿No tienes una cuenta?{' '}
                  <Link 
                    to="/conferencia" 
                    className="text-braini-blue hover:text-braini-blue-dark font-medium hover:underline transition-colors"
                  >
                    Regístrate
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;