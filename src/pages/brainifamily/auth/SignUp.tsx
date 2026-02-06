import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { POLITICA_PRIVACIDAD_URL } from '@/constants/documentosStorage';

// Rutas de assets públicos
const logoBraini = '/logo/logoBraini.png';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [nombre, setNombre] = useState('');
  const [acceptPolitica, setAcceptPolitica] = useState(false);
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

  const validations = {
    email: () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    password: () => password.length >= 6,
    nombre: () => nombre.trim().length >= 2,
  };

  const isFormValid = () => {
    return validations.email() && validations.password() && validations.nombre() && acceptPolitica;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      // Determinar qué campo específico está mal
      let errorMessage = "Por favor, corrige los siguientes errores:";
      const errors: string[] = [];
      
      if (!validations.nombre()) {
        errors.push("El nombre debe tener al menos 2 caracteres");
      }
      if (!validations.email()) {
        errors.push("El correo electrónico no tiene un formato válido");
      }
      if (!validations.password()) {
        errors.push("La contraseña debe tener al menos 6 caracteres");
      }
      
      toast({
        title: "⚠️ Nos falta un poquito",
        description: "Hay algunos campos sin completar. Los revisamos con calma y continuamos.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. PRIMERO, verificamos si el email ya existe llamando a la Edge Function.
      const { data: checkData, error: checkError } = await supabase.functions.invoke('check-email-exists', {
        body: { email },
      });

      if (checkError) {
        // Si la función de verificación falla, mostramos error específico
        toast({
          title: "❌ Error al verificar el correo electrónico",
          description: "No se pudo verificar si el correo ya está registrado. Por favor, inténtalo de nuevo.",
          variant: "destructive"
        });
        return;
      }

      // 2. SI EL EMAIL EXISTE, mostramos error y detenemos el proceso.
      if (checkData.exists) {
        toast({
          title: "📧 Este correo ya está en Braini",
          description: "Puedes iniciar sesión o usar otro correo electrónico para continuar.",
          variant: "destructive"
        });
        return;
      }
        // 3. SI EL EMAIL NO EXISTE, procedemos con el registro.
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) {
          // Manejar errores específicos de registro
          let errorTitle = "❌ Error al crear la cuenta";
          let errorDescription = signUpError.message || "No se pudo completar el registro. Inténtalo de nuevo.";
          
          if (signUpError.message?.includes('email')) {
            errorTitle = "❌ Error con el correo electrónico";
            errorDescription = "El correo electrónico proporcionado no es válido o ya está en uso.";
          } else if (signUpError.message?.includes('password')) {
            errorTitle = "🔑 Error con la contraseña";
            errorDescription = "La contraseña no cumple con los requisitos de seguridad.";
          } else if (signUpError.message?.includes('network') || signUpError.message?.includes('fetch')) {
            errorTitle = "🌐 Error de conexión";
            errorDescription = "No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.";
          }
          
          toast({
            title: errorTitle,
            description: errorDescription,
            variant: "destructive"
          });
          return;
        }

        // 4. Login automático después del registro
        // El trigger creacion_parent creará automáticamente el registro en parents
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          let errorTitle = "❌ Error al iniciar sesión";
          let errorDescription = signInError.message || "No se pudo iniciar sesión automáticamente después del registro.";
          
          if (signInError.message?.includes('email') || signInError.message?.includes('Email')) {
            errorTitle = "❌ Error con el correo electrónico";
            errorDescription = "No se pudo iniciar sesión con el correo proporcionado. Por favor, intenta iniciar sesión manualmente.";
          } else if (signInError.message?.includes('password') || signInError.message?.includes('Password')) {
            errorTitle = "🔑 Error con la contraseña";
            errorDescription = "La contraseña no es correcta. Por favor, intenta iniciar sesión manualmente.";
          } else if (signInError.message?.includes('network') || signInError.message?.includes('fetch')) {
            errorTitle = "🌐 Error de conexión";
            errorDescription = "No se pudo conectar con el servidor. Verifica tu conexión a internet e inténtalo de nuevo.";
          }
          
          toast({
            title: errorTitle,
            description: errorDescription,
            variant: "destructive"
          });
          return;
        }
        
        if (!signInData.user) {
          toast({
            title: "❌ Error al iniciar sesión",
            description: "No se pudo obtener la información del usuario. Por favor, intenta iniciar sesión manualmente.",
            variant: "destructive"
          });
          return;
        }

        // 5. Guardar el nombre en la BD para pre-llenarlo en el onboarding
        // El trigger creacion_parent ya creó el registro en parents, ahora actualizamos el nombre
        const { error: updateError } = await supabase
          .from('parents')
          .update({ nombre: nombre.trim() })
          .eq('id', signInData.user.id);

        if (updateError) {
          console.error('Error guardando nombre:', updateError);
          // No bloqueamos el flujo si falla, el usuario puede ingresarlo manualmente
        }

        // 6. Éxito - redirigir a onboarding
        toast({
          title: "🎉 ¡Bienvenidos a Braini Emotions!",
          description: "La cuenta está lista. Ahora seguimos completando el perfil y empezamos este camino emocional juntos.",
        });

        setEmail('');
        setPassword('');
        setNombre('');
        navigate('/brainifamily/parents-profile');
    } catch (error) {
      // Manejar errores inesperados
      const err = error as Error;
      let errorTitle = "🌱 Algo inesperado ha pasado";
      let errorDescription = "No pasa nada. Lo intentamos de nuevo en unos momentos.";
      
      if (err.message) {
        if (err.message.includes('email') || err.message.includes('Email')) {
          errorTitle = "❌ Error con el correo electrónico";
          errorDescription = "Hubo un problema con el correo electrónico proporcionado. Por favor, verifica que sea correcto e inténtalo de nuevo.";
        } else if (err.message.includes('password') || err.message.includes('Password')) {
          errorTitle = "🔑 Error con la contraseña";
          errorDescription = "Hubo un problema con la contraseña. Asegúrate de que tenga al menos 6 caracteres e inténtalo de nuevo.";
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
      aria-label="Página de registro"
    >
      {/* Hero Section - Igual que Conferencia */}
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
            {/* Logo y Título - Responsive: vertical en móvil, horizontal en desktop */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
              <div className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex items-center justify-center flex-shrink-0">
                <img 
                  src={logoBraini}
                  alt="Braini Emotions Logo" 
                  className="w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 object-contain"
                />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black text-white text-center px-2" style={{ fontWeight: 900 }}>
                Prueba Gratuita
              </h1>
            </div>
            {/* Subtítulos centrados */}
            <div className="text-center">
              <h2 className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-2 sm:mb-3 px-3 sm:px-4" style={{ fontWeight: 700 }}>
                Accede a 10 sesiones completas
              </h2>
              <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-5 px-3 sm:px-4" style={{ fontWeight: 400 }}>
                Comienza a desarrollar la inteligencia emocional de tu hijo
              </p>
            </div>
          </div>

          {/* Formulario Card - Mismo estilo que Conferencia */}
          <div 
            id="registration-form"
            className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl relative z-10 w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
              {/* Campo Nombre */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="nombre" className="text-sm sm:text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                  Nombre *
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="border-2 border-gray-200 focus:border-braini-blue transition-colors text-base sm:text-sm py-2.5 sm:py-3"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-[11px] sm:text-xs text-gray-500 leading-tight" style={{ fontWeight: 400 }}>
                  Este nombre aparecerá en tu perfil
                </p>
              </div>

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
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-1.5 sm:space-y-2">
                <Label htmlFor="password" className="text-sm sm:text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                  Contraseña *
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
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
                  La contraseña debe tener al menos 6 caracteres
                </p>
              </div>

              {/* Aceptación Política de Privacidad - Responsive */}
              <div className="flex items-start gap-2 sm:gap-3 pt-1 sm:pt-2">
                <Checkbox
                  id="accept-politica"
                  checked={acceptPolitica}
                  onCheckedChange={(checked) => setAcceptPolitica(checked === true)}
                  disabled={isSubmitting}
                  className="mt-0.5 sm:mt-1 flex-shrink-0 h-4 w-4 sm:h-[18px] sm:w-[18px] border-2 border-gray-300 data-[state=checked]:bg-braini-blue data-[state=checked]:border-braini-blue"
                />
                <Label
                  htmlFor="accept-politica"
                  className="text-xs sm:text-sm text-gray-700 cursor-pointer leading-snug sm:leading-normal select-none font-normal break-words"
                >
                  He leído y acepto la{' '}
                  <a
                    href={POLITICA_PRIVACIDAD_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-braini-blue hover:text-braini-blue-dark font-medium underline underline-offset-2 break-all sm:break-normal"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Política de Privacidad y Protección de Datos
                  </a>
                  .
                </Label>
              </div>

              {/* Botón Submit - Mismo estilo que Conferencia */}
              <div className="flex justify-center pt-2">
                <Button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
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
                      <span>Creando cuenta...</span>
                    </div>
                  ) : (
                    <span>Comenzar mi prueba gratuita</span>
                  )}
                </Button>
              </div>

              {/* Línea separadora */}
              <div className="mt-4 sm:mt-6 border-t border-gray-200"></div>

              {/* Enlace a Login */}
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                  ¿Ya tienes una cuenta?{' '}
                  <Link 
                    to="/brainifamily/login" 
                    className="text-braini-blue hover:text-braini-blue-dark font-medium hover:underline transition-colors"
                  >
                    Inicia sesión
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

export default SignUp; 