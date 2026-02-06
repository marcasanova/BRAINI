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
import { Eye, EyeOff } from 'lucide-react';

// Rutas de assets públicos
const logoBraini = '/logo/logoBraini.png';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
        title: "📧 Correo electrónico requerido",
        description: "Necesitamos tu correo electrónico para enviarte el enlace de recuperación de contraseña.",
        variant: "destructive",
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast({
        title: "❌ Formato de correo inválido",
        description: `El correo "${resetEmail}" no tiene un formato válido. Asegúrate de incluir un @ y un dominio (ejemplo: tu@email.com).`,
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/brainifamily/update-password`,
      });

      if (error) throw error;

      toast({
        title: "✉️ Enlace de recuperación enviado",
        description: `Si existe una cuenta con el correo ${resetEmail}, te hemos enviado un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y la carpeta de spam.`,
      });
      setIsResetDialogOpen(false);
      setResetEmail('');
    } catch (error) {
      const err = error as Error;
      let errorTitle = "❌ Error al enviar el enlace";
      let errorDescription = "No hemos podido enviar el enlace de recuperación. Por favor, inténtalo de nuevo más tarde.";
      
      if (err.message) {
        if (err.message.includes('email') || err.message.includes('Email')) {
          errorTitle = "❌ Error con el correo electrónico";
          errorDescription = `No se pudo enviar el enlace al correo ${resetEmail}. Verifica que sea correcto e inténtalo de nuevo.`;
        } else if (err.message.includes('network') || err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          errorTitle = "🌐 Error de conexión";
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
        title: "⚠️ Nos falta un poquito",
        description: "Hay algunos campos sin completar. Los revisamos con calma y continuamos.",
        variant: "destructive"
      });
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "❌ Formato de correo inválido",
        description: `El correo "${email}" no tiene un formato válido. Asegúrate de incluir un @ y un dominio (ejemplo: tu@email.com).`,
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
        let errorTitle = "❌ Error al iniciar sesión";
        let errorDescription = "No se pudo iniciar sesión. Por favor, verifica tus credenciales.";
        
        if (error.message?.includes('Invalid login credentials') || error.message?.includes('invalid_credentials')) {
          errorTitle = "🔒 Revisamos los datos";
          errorDescription = "El correo o la contraseña no coinciden. Lo intentamos de nuevo con calma.";
        } else if (error.message?.includes('Email not confirmed') || error.message?.includes('email_not_confirmed')) {
          errorTitle = "📧 Último paso";
          errorDescription = "Revisa tu correo y haz clic en el enlace de verificación para poder acceder.";
        } else if (error.message?.includes('email') || error.message?.includes('Email')) {
          errorTitle = "❌ Error con el correo electrónico";
          errorDescription = "El correo electrónico proporcionado no es válido o no está registrado en Braini.";
        } else if (error.message?.includes('password') || error.message?.includes('Password')) {
          errorTitle = "🔑 Error con la contraseña";
          errorDescription = "La contraseña no es correcta. Si la has olvidado, puedes recuperarla haciendo clic en '¿Has olvidado tu contraseña?'";
        } else if (error.message?.includes('network') || error.message?.includes('fetch') || error.message?.includes('Failed to fetch')) {
          errorTitle = "🌐 Error de conexión";
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
        title: "💛 Qué alegría verte de nuevo",
        description: "Has iniciado sesión correctamente. Continuamos cuidando nuestro bienestar emocional.",
      });

      // Reset form
      setEmail('');
      setPassword('');

      // Comprobar si el perfil está completo
      const userId = data.user?.id;
      if (!userId) {
        toast({
          title: "❌ Error al obtener información del usuario",
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
            title: "🌱 Nos queda un paso",
            description: "Necesitas completar el perfil para continuar. Te acompaño al formulario.",
            variant: "default"
          });
          navigate('/brainifamily/parents-profile');
          return;
        } else {
          toast({
            title: "❌ Error al cargar tu perfil",
            description: "No se pudo cargar la información de tu perfil. Por favor, intenta iniciar sesión de nuevo.",
            variant: "destructive"
          });
          return;
        }
      }
      
      if (!parentData) {
        toast({
          title: "❌ Perfil no encontrado",
          description: "No se encontró tu perfil de usuario. Por favor, contacta con soporte o intenta registrarte de nuevo.",
          variant: "destructive"
        });
        return;
      }
      
      // Verificar si el perfil del padre está completo
      if (parentData.profile_completed === false) {
        navigate('/brainifamily/parents-profile');
        return;
      }
      
      // Verificar si es usuario de prueba (saltar todo el onboarding)
      if (parentData.is_trial_user === true) {
        navigate('/brainifamily/home');
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
          title: "❌ Error al cargar el perfil del menor",
          description: "No se pudo cargar la información del perfil del menor. Por favor, intenta iniciar sesión de nuevo.",
          variant: "destructive"
        });
        return;
      }
      
      // Si no existe el registro o si existe pero profile_completed = false, ir a completar perfil
      if (!childData || childData.profile_completed === false) {
        navigate('/brainifamily/child-profile');
        return;
      }
      
      // Perfil completo, ir directamente a Home
      navigate('/brainifamily/home');
    } catch (error) {
      // Manejar errores inesperados
      const err = error as Error;
      let errorTitle = "🌱 Algo inesperado ha pasado";
      let errorDescription = "No pasa nada. Lo intentamos de nuevo en unos momentos.";
      
      if (err.message) {
        if (err.message.includes('email') || err.message.includes('Email')) {
          errorTitle = "❌ Error con el correo electrónico";
          errorDescription = "Hubo un problema con el correo electrónico. Por favor, verifica que sea correcto e inténtalo de nuevo.";
        } else if (err.message.includes('password') || err.message.includes('Password')) {
          errorTitle = "🔑 Error con la contraseña";
          errorDescription = "Hubo un problema con la contraseña. Si la has olvidado, puedes recuperarla haciendo clic en '¿Has olvidado tu contraseña?'";
        } else if (err.message.includes('network') || err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
          errorTitle = "🌐 Error de conexión";
          errorDescription = "No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.";
        } else if (err.message.includes('Invalid login credentials') || err.message.includes('invalid_credentials')) {
          errorTitle = "🔒 Revisamos los datos";
          errorDescription = "El correo o la contraseña no coinciden. Lo intentamos de nuevo con calma.";
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
        className="relative min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8"
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
          <div className="mb-6 sm:mb-8 md:mb-12 relative z-10">
            {/* Logo y Título - Logo encima */}
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 mx-auto mb-3 sm:mb-4 md:mb-6 flex items-center justify-center">
                <img 
                  src={logoBraini}
                  alt="Braini Emotions Logo" 
                  className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain"
                />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white px-2" style={{ fontWeight: 900 }}>
                Iniciar Sesión
              </h1>
            </div>
            {/* Texto descriptivo */}
            <div className="text-center mb-4 sm:mb-6">
              <p className="text-white text-sm sm:text-base md:text-lg px-4 max-w-2xl mx-auto" style={{ fontWeight: 400 }}>
                Accede a tu cuenta y continúa desarrollando la inteligencia emocional de tu hijo
              </p>
            </div>
          </div>

          {/* Formulario Card - Mismo estilo que Conferencia */}
          <div 
            id="login-form"
            className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl relative z-10 w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Campo Email */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="email" className="text-sm sm:text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                  Correo electrónico *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="border-2 border-gray-200 focus:border-braini-blue transition-colors text-base sm:text-sm py-2.5 sm:py-3"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-[11px] sm:text-xs text-gray-500 leading-tight" style={{ fontWeight: 400 }}>
                  El correo que usaste para registrarte
                </p>
              </div>
              
              {/* Campo Contraseña */}
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
                  <Label htmlFor="password" className="text-sm sm:text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                    Contraseña *
                  </Label>
                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button type="button" variant="link" className="text-xs sm:text-sm px-0 font-medium h-auto py-1 text-braini-blue hover:text-braini-blue-dark hover:underline transition-colors whitespace-nowrap">
                        ¿Has olvidado tu contraseña?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[90%] max-w-[90%] sm:max-w-md md:max-w-[425px] p-4 sm:p-6 max-h-[90vh] overflow-y-auto rounded-xl">
                      <DialogHeader className="text-left">
                        <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                          Recuperar contraseña
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base text-gray-600 mt-2">
                          Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-3 sm:gap-4 py-3 sm:py-4">
                        <div className="space-y-2">
                          <Label htmlFor="reset-email" className="text-sm sm:text-base font-semibold text-gray-700">
                            Correo electrónico
                          </Label>
                          <Input
                            id="reset-email"
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="tu@email.com"
                            className="text-base sm:text-sm py-2.5 sm:py-3"
                          />
                        </div>
                      </div>
                      <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                        <Button 
                          onClick={handlePasswordReset} 
                          disabled={isResetting}
                          className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base"
                        >
                          {isResetting ? (
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Enviando...</span>
                            </div>
                          ) : (
                            'Enviar enlace'
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduce contraseña"
                    className="border-2 border-gray-200 focus:border-braini-blue transition-colors text-base sm:text-sm py-2.5 sm:py-3 pr-10"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-braini-blue/20 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 leading-tight" style={{ fontWeight: 400 }}>
                  No te preocupes si no la recuerdas, puedes recuperarla arriba
                </p>
              </div>
              
              {/* Botón Submit - Mismo estilo que Conferencia */}
              <div className="flex justify-center pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto text-white px-6 sm:px-8 md:px-12 py-3 sm:py-4 md:py-5 font-bold transition-all text-sm sm:text-base md:text-lg md:hover:opacity-90 md:hover:scale-105"
                  style={{ 
                    background: '#7ea4df',
                    border: 'none',
                    minWidth: 'auto'
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
              <div className="mt-4 sm:mt-6 border-t border-gray-200"></div>

              {/* Enlace a Registro */}
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                  ¿No tienes una cuenta?{' '}
                  <Link 
                    to="/brainifamily/signup" 
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