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
const logoBraini = '/logo/logoBraini.png';


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
        description: "Por favor, introduce tu correo electrónico para poder enviarte el enlace de recuperación.",
        variant: "destructive",
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast({
        title: "Correo electrónico no válido",
        description: `El correo "${resetEmail}" no tiene un formato válido. Por favor, verifica que incluya un @ y un dominio (ejemplo: tu@email.com).`,
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
        title: "Enlace de recuperación enviado",
        description: `Si existe una cuenta con el correo ${resetEmail}, te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y spam.`,
      });
      setIsResetDialogOpen(false);
      setResetEmail('');
    } catch (error) {
      const err = error as Error;
      let errorTitle = "Error al enviar el enlace";
      let errorDescription = "No se pudo enviar el enlace de recuperación. Por favor, inténtalo de nuevo más tarde.";
      
      if (err.message) {
        if (err.message.includes('email') || err.message.includes('Email')) {
          errorTitle = "Error con el correo electrónico";
          errorDescription = `No se pudo enviar el enlace al correo ${resetEmail}. Verifica que sea correcto e inténtalo de nuevo.`;
        } else if (err.message.includes('network') || err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          errorTitle = "Error de conexión";
          errorDescription = "No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.";
        } else {
          errorDescription = err.message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      // Determinar qué campo específico está vacío
      let errorMessage = "Por favor, completa los siguientes campos:";
      const missingFields: string[] = [];
      
      if (!email.trim()) {
        missingFields.push("Correo electrónico");
      }
      if (!password.trim()) {
        missingFields.push("Contraseña");
      }
      
      toast({
        title: "Campos incompletos",
        description: `${errorMessage} ${missingFields.join(' y ')}.`,
        variant: "destructive"
      });
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Correo electrónico no válido",
        description: `El correo "${email}" no tiene un formato válido. Por favor, verifica que incluya un @ y un dominio (ejemplo: tu@email.com).`,
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
        // Manejar errores específicos de login
        let errorTitle = "Error al iniciar sesión";
        let errorDescription = "No se pudo iniciar sesión. Por favor, verifica tus credenciales.";
        
        if (error.message?.includes('Invalid login credentials') || error.message?.includes('invalid_credentials')) {
          errorTitle = "Credenciales incorrectas";
          errorDescription = "El correo electrónico o la contraseña no son correctos. Por favor, verifica tus datos e inténtalo de nuevo.";
        } else if (error.message?.includes('Email not confirmed') || error.message?.includes('email_not_confirmed')) {
          errorTitle = "Correo electrónico no verificado";
          errorDescription = "Tu correo electrónico aún no ha sido verificado. Por favor, revisa tu bandeja de entrada y haz clic en el enlace de verificación.";
        } else if (error.message?.includes('email') || error.message?.includes('Email')) {
          errorTitle = "Error con el correo electrónico";
          errorDescription = "El correo electrónico proporcionado no es válido o no está registrado en Braini.";
        } else if (error.message?.includes('password') || error.message?.includes('Password')) {
          errorTitle = "Error con la contraseña";
          errorDescription = "La contraseña no es correcta. Si la has olvidado, puedes recuperarla haciendo clic en '¿Has olvidado tu contraseña?'";
        } else if (error.message?.includes('network') || error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
          errorTitle = "Error de conexión";
          errorDescription = "No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.";
        } else if (error.message) {
          errorDescription = error.message;
        }
        
        toast({
          title: errorTitle,
          description: errorDescription,
          variant: "destructive"
        });
        return;
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
      if (!userId) {
        toast({
          title: "Error al obtener información del usuario",
          description: "No se pudo obtener la información de tu cuenta. Por favor, intenta iniciar sesión de nuevo.",
          variant: "destructive"
        });
        return;
      }
      
      // Obtener datos del padre
      const { data: parentData, error: parentError } = await supabase
        .from('parents')
        .select('profile_completed, is_trial_user')
        .eq('id', userId)
        .single();
      
      if (parentError) {
        // Si el error es que no existe el registro, crearlo automáticamente
        if (parentError.code === 'PGRST116') {
          // El trigger debería haber creado el registro, pero si no existe, redirigir a onboarding
          toast({
            title: "Perfil incompleto",
            description: "Necesitas completar tu perfil para continuar. Redirigiendo...",
            variant: "default"
          });
          navigate('/parents-profile');
          return;
        } else {
          toast({
            title: "Error al cargar tu perfil",
            description: "No se pudo cargar la información de tu perfil. Por favor, intenta iniciar sesión de nuevo.",
            variant: "destructive"
          });
          return;
        }
      }
      
      if (!parentData) {
        toast({
          title: "Perfil no encontrado",
          description: "No se encontró tu perfil de usuario. Por favor, contacta con soporte o intenta registrarte de nuevo.",
          variant: "destructive"
        });
        return;
      }
      
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
        .select('profile_completed')
        .eq('parent_id', userId)
        .single();
      
      if (childError && childError.code !== 'PGRST116') {
        // Error real, no solo "no encontrado"
        toast({
          title: "Error al cargar el perfil del menor",
          description: "No se pudo cargar la información del perfil del menor. Por favor, intenta iniciar sesión de nuevo.",
          variant: "destructive"
        });
        return;
      }
      
      // Si no existe el registro o si existe pero profile_completed = false, ir a completar perfil
      if (!childData || childData.profile_completed === false) {
        navigate('/child-profile');
        return;
      }
      
      // Perfil completo, ir directamente a Home
      navigate('/home');
    } catch (error) {
      // Manejar errores inesperados
      const err = error as Error;
      let errorTitle = "Error inesperado";
      let errorDescription = "Ha ocurrido un error inesperado durante el inicio de sesión.";
      
      if (err.message) {
        if (err.message.includes('email') || err.message.includes('Email')) {
          errorTitle = "Error con el correo electrónico";
          errorDescription = "Hubo un problema con el correo electrónico. Por favor, verifica que sea correcto e inténtalo de nuevo.";
        } else if (err.message.includes('password') || err.message.includes('Password')) {
          errorTitle = "Error con la contraseña";
          errorDescription = "Hubo un problema con la contraseña. Si la has olvidado, puedes recuperarla haciendo clic en '¿Has olvidado tu contraseña?'";
        } else if (err.message.includes('network') || err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          errorTitle = "Error de conexión";
          errorDescription = "No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.";
        } else if (err.message.includes('Invalid login credentials') || err.message.includes('invalid_credentials')) {
          errorTitle = "Credenciales incorrectas";
          errorDescription = "El correo electrónico o la contraseña no son correctos. Por favor, verifica tus datos e inténtalo de nuevo.";
        } else {
          errorDescription = err.message;
        }
      }
      
      toast({
        title: errorTitle,
        description: errorDescription,
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
                  No te peocupes si no la recuerdas, puedes recuperarla en "¿Has olvidado tu contraseña?" 
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
                    to="/signup" 
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