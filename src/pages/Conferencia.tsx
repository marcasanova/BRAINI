import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

// Rutas de assets públicos
const logoBraini = '/logo/logoBraini.png';

const Conferencia = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
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
    return validations.email() && validations.password() && validations.nombre();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('[Conferencia] handleSubmit start', { email, nombre });
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: "⚠️ Campos inválidos",
        description: "Por favor, completa todos los campos correctamente antes de continuar.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Registrar usuario en Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password: password
      });

      console.log('[Conferencia] signUp result', { authUserId: authData?.user?.id, signUpError });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      // 2. Auto-verificar email llamando a la función RPC
      const { error: verifyError } = await supabase.rpc('auto_verify_trial_user', {
        user_id: authData.user.id
      });

      if (verifyError) {
        console.error('Error auto-verificando:', verifyError);
      } else {
        console.log('[Conferencia] auto_verify_trial_user ejecutada correctamente para', authData.user.id);
      }

      // 3. Hacer login automático PRIMERO (necesario para que RLS funcione)
      const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      console.log('[Conferencia] signInWithPassword result', { signInUserId: signInData?.user?.id, signInError });

      if (signInError) throw signInError;
      if (!signInData.user) throw new Error('No se pudo iniciar sesión');

      // 4. Crear o actualizar registro en parents (upsert para evitar conflictos)
      const { error: parentError } = await supabase
        .from('parents')
        .upsert({
          id: signInData.user.id,
          email: email.trim(),
          nombre: nombre.trim(),
          profile_completed: true,
          is_trial_user: true,
          max_levels: 10
        }, {
          onConflict: 'id'
        });

      console.log('[Conferencia] upsert parents result', { parentUserId: signInData.user.id, parentError });

      if (parentError) throw parentError;

      // DEBUG extra: comprobar qué se ha guardado realmente en parents
      const { data: parentRow, error: parentFetchError } = await supabase
        .from('parents')
        .select('id, email, is_trial_user')
        .eq('id', signInData.user.id)
        .single();

      console.log('[Conferencia] parents row after upsert', { parentRow, parentFetchError });

      // DEBUG extra: comprobar qué niveles se han creado para este usuario
      const { data: levelsRows, error: levelsError } = await supabase
        .from('parents_levels')
        .select('level_id')
        .eq('user_id', signInData.user.id)
        .order('level_id', { ascending: true });

      console.log('[Conferencia] parents_levels rows for user', { levelsRows, levelsError });

      // 5. Éxito - redirigir a home
      toast({
        title: "🎉 ¡Bienvenido/a a Braini Emotions!",
        description: "Tu cuenta de prueba ha sido creada correctamente. ¡Disfruta de las sesiones!",
      });

      setTimeout(() => navigate('/brainifamily/home'), 1000);

    } catch (error: any) {
      toast({
        title: "❌ Error al registrarse",
        description: error.message || "No se pudo completar el registro. Por favor, verifica tu conexión e inténtalo de nuevo.",
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
      aria-label="Página de registro para prueba gratuita"
    >
      {/* Hero Section - Igual que LandingPage */}
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
            {/* Logo y Título en la misma línea */}
            <div className="flex items-center justify-center gap-4 sm:gap-6 mb-3 sm:mb-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 flex items-center justify-center flex-shrink-0">
                <img 
                  src={logoBraini}
                  alt="Braini Emotions Logo" 
                  className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-contain"
                />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white" style={{ fontWeight: 900 }}>
                Prueba Gratuita
              </h1>
            </div>
            {/* Subtítulos centrados */}
            <div className="text-center">
              <h2 className="text-white text-2xl sm:text-3xl lg:text-4xl mb-2 sm:mb-3 px-4" style={{ fontWeight: 700 }}>
                Accede a 10 sesiones completas
              </h2>
              <p className="text-white text-base sm:text-lg lg:text-xl mb-4 sm:mb-5 px-4" style={{ fontWeight: 400 }}>
                Comienza a desarrollar la inteligencia emocional de tu hijo
              </p>
            </div>
          </div>

          {/* Formulario Card - Mismo estilo que CTA Card de LandingPage */}
          <div 
            id="registration-form"
            className="bg-white rounded-xl p-6 sm:p-8 shadow-2xl relative z-10 max-w-xs sm:max-w-lg lg:max-w-2xl mx-auto"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                  Nombre *
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="border-2 border-gray-200 focus:border-braini-blue transition-colors text-base py-3"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500" style={{ fontWeight: 400 }}>
                  Este nombre aparecerá en tu perfil
                </p>
              </div>

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
              </div>

              {/* Campo Contraseña */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                  Contraseña *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="border-2 border-gray-200 focus:border-braini-blue transition-colors text-base py-3"
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-gray-500" style={{ fontWeight: 400 }}>
                  La contraseña debe tener al menos 6 caracteres
                </p>
              </div>

              {/* Botón Submit - Mismo estilo que LandingPage */}
              <div className="flex justify-center">
                <Button
                  type="submit"
                  disabled={!isFormValid() || isSubmitting}
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
                      <span>Creando cuenta...</span>
                    </div>
                  ) : (
                    <span>Comenzar mi prueba gratuita</span>
                  )}
                </Button>
              </div>

              {/* Línea separadora */}
              <div className="mt-6 border-t border-gray-200"></div>

              {/* Enlace a Login */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 text-sm sm:text-base">
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

export default Conferencia;
