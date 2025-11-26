import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

const Conferencia = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
    e.preventDefault();
    
    if (!isFormValid()) {
      toast({
        title: "Campos inválidos",
        description: "Por favor, completa todos los campos correctamente.",
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

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('No se pudo crear el usuario');

      // 2. Auto-verificar email llamando a la función RPC
      const { error: verifyError } = await supabase.rpc('auto_verify_trial_user', {
        user_id: authData.user.id
      });

      if (verifyError) {
        console.error('Error auto-verificando:', verifyError);
        // Continuar con el proceso aunque falle la verificación
        // El usuario podrá verificar manualmente después
      }

      // 3. Hacer login automático PRIMERO (necesario para que RLS funcione)
      const { error: signInError, data: signInData } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password
      });

      if (signInError) throw signInError;
      if (!signInData.user) throw new Error('No se pudo iniciar sesión');

      // 4. Crear o actualizar registro en parents (upsert para evitar conflictos)
      // Si el registro ya existe (por intentos anteriores), lo actualizamos
      const { error: parentError } = await supabase
        .from('parents')
        .upsert({
          id: signInData.user.id,
          email: email.trim(),
          nombre: nombre.trim(),
          profile_completed: true,
          is_trial_user: true
        }, {
          onConflict: 'id' // Si ya existe un registro con ese id, lo actualiza
        });

      if (parentError) throw parentError;

      // 5. Éxito - redirigir a home
      toast({
        title: "¡Bienvenido/a! 🎉",
        description: "Tu cuenta de prueba ha sido creada correctamente.",
      });

      setTimeout(() => navigate('/home'), 1000);

    } catch (error: any) {
      toast({
        title: "Error al registrarse",
        description: error.message || "No se pudo completar el registro. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen font-montserrat relative overflow-hidden">
      {/* Fondo con gradiente */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #7ea4df 0%, #35bdb1 100%)'
        }}
      />
      {/* Círculos decorativos */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 sm:-top-40 -left-5 sm:-left-10 w-40 h-40 sm:w-80 sm:h-80 bg-white/15 rounded-full" />
        <div className="absolute -bottom-40 sm:-bottom-80 -right-30 sm:-right-60 w-[300px] h-[300px] sm:w-[700px] sm:h-[700px] bg-white/15 rounded-full" />
      </div>
      
      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex items-center">
        <div className="max-w-2xl mx-auto w-full">
          {/* Hero Section */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 bg-gradient-to-r from-braini-blue to-braini-turquoise rounded-full flex items-center justify-center shadow-lg">
                <img 
                  src="/logo/LogoBraini_new.png" 
                  alt="BRAINI Logo" 
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-800 mb-4" style={{ fontWeight: 900 }}>
              Prueba Gratuita de <span className="text-braini-blue">BRAINI</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-2">
              Accede a 3 sesiones completas sin compromiso
            </p>
            <div className="flex items-center justify-center gap-2 text-braini-turquoise">
              <Sparkles className="w-5 h-5" />
              <span className="text-sm font-medium">Sin tarjeta de crédito</span>
            </div>
          </div>

          {/* Formulario */}
          <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 md:p-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Nombre */}
              <div>
                <Label htmlFor="nombre" className="text-base font-semibold text-gray-700 mb-2 block">
                  Nombre *
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  className="border-2 border-gray-200 focus:border-braini-blue transition-colors"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Este nombre aparecerá en tu perfil
                </p>
              </div>

              {/* Campo Email */}
              <div>
                <Label htmlFor="email" className="text-base font-semibold text-gray-700 mb-2 block">
                  Correo electrónico *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="border-2 border-gray-200 focus:border-braini-blue transition-colors"
                  required
                />
              </div>

              {/* Campo Contraseña */}
              <div>
                <Label htmlFor="password" className="text-base font-semibold text-gray-700 mb-2 block">
                  Contraseña *
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="border-2 border-gray-200 focus:border-braini-blue transition-colors"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  La contraseña debe tener al menos 6 caracteres
                </p>
              </div>

              {/* Botón Submit */}
              <Button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className="w-full bg-gradient-to-r from-braini-blue to-braini-turquoise hover:from-braini-blue-dark hover:to-braini-turquoise-dark text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creando cuenta...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Comenzar mi prueba gratuita
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Información adicional */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <CheckCircle className="w-5 h-5 text-braini-turquoise flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-800 mb-1">¿Qué incluye la prueba?</p>
                  <ul className="space-y-1 text-gray-600">
                    <li>• Acceso completo a 3 sesiones</li>
                    <li>• Todas las actividades incluidas</li>
                    <li>• Sin compromiso de permanencia</li>
                    <li>• Email verificado automáticamente</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conferencia;

