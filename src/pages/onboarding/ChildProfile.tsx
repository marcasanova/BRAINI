import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

// Rutas de assets públicos
const logoBraini = '/logo/logoBraini.png';

const GENEROS = [
  { value: 'niño', label: 'Niño' },
  { value: 'niña', label: 'Niña' },
  { value: 'prefiero_no_decirlo', label: 'Prefiero no decirlo' },
];

const NIVELES_EDUCATIVOS = [
  { value: 'infantil_3', label: 'Infantil 3 años' },
  { value: 'infantil_4', label: 'Infantil 4 años' },
  { value: 'infantil_5', label: 'Infantil 5 años' },
  { value: 'primaria_1', label: '1º Ed. Primaria' },
  { value: 'primaria_2', label: '2º Ed. Primaria' },
  { value: 'otro', label: 'Otro' },
];

// Configuración de pasos
const STEPS = [
  {
    id: 1,
    title: 'Información básica',
    subtitle: 'Datos personales del niño/niña',
    fields: ['nombre', 'apellidos', 'genero', 'nivel_educativo']
  }
];

const ChildProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    genero: '',
    nivel_educativo: '',
  });

  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const checkChildExists = async () => {
      setLoading(true);
      setError('');
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('No se pudo obtener el usuario autenticado.');
        
        // Verificar si es usuario de prueba (saltar onboarding)
        const { data: parentData, error: parentError } = await supabase
          .from('parents')
          .select('is_trial_user')
          .eq('id', user.id)
          .single();
        
        if (parentError && parentError.code !== 'PGRST116') {
          // Error real, no solo "no encontrado"
          throw parentError;
        }
        
        if (parentData?.is_trial_user === true) {
          navigate('/home');
          return;
        }
        
        const { data, error: fetchError } = await supabase
          .from('children')
          .select('profile_completed')
          .eq('parent_id', user.id)
          .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
        
        // Si existe y profile_completed = true, redirigir a home
        if (data?.profile_completed === true) {
          navigate('/home');
          return;
        }
        
        // Si existe pero profile_completed = false, cargar los datos existentes
        if (data && data.profile_completed === false) {
          const { data: childData, error: childFetchError } = await supabase
            .from('children')
            .select('nombre, apellidos, genero, nivel_educativo')
            .eq('parent_id', user.id)
            .single();
          
          if (!childFetchError && childData) {
            setForm({
              nombre: childData.nombre || '',
              apellidos: childData.apellidos || '',
              genero: childData.genero || '',
              nivel_educativo: childData.nivel_educativo || '',
            });
          }
        }
      } catch (err: any) {
        setError(err.message || 'Error al comprobar los datos.');
      } finally {
        setLoading(false);
      }
    };
    checkChildExists();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validations = {
    nombre: () => form.nombre.trim().length >= 2,
    apellidos: () => form.apellidos.trim().length >= 2,
    genero: () => form.genero !== '',
    nivel_educativo: () => form.nivel_educativo !== '',
  };

  const getFieldError = (fieldName: string): string => {
    if (!touched[fieldName]) return '';
    
    switch (fieldName) {
      case 'nombre':
        return !validations.nombre() ? 'El nombre debe tener al menos 2 caracteres' : '';
      case 'apellidos':
        return !validations.apellidos() ? 'Los apellidos deben tener al menos 2 caracteres' : '';
      case 'genero':
        return !validations.genero() ? 'Selecciona el género del niño/niña' : '';
      case 'nivel_educativo':
        return !validations.nivel_educativo() ? 'Selecciona el nivel educativo del niño/niña' : '';
      default:
        return '';
    }
  };

  const isCurrentStepValid = () => {
    const currentStepConfig = STEPS.find(s => s.id === currentStep);
    if (!currentStepConfig) return false;

    return currentStepConfig.fields.every(field => {
      return validations[field as keyof typeof validations]();
    });
  };

  const handleNext = () => {
    // Ya no hay múltiples pasos, esta función ya no se usa
    // Pero la mantenemos por si acaso hay lógica que la llame
    if (isCurrentStepValid()) {
      // Si el paso es válido, se puede enviar el formulario
    } else {
      const currentStepConfig = STEPS.find(s => s.id === currentStep);
      if (currentStepConfig) {
        const newTouched: { [k: string]: boolean } = {};
        currentStepConfig.fields.forEach(field => {
          newTouched[field] = true;
        });
        setTouched(prev => ({ ...prev, ...newTouched }));
      }
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('No se pudo obtener el usuario autenticado.');

      const datosHijo = {
        ...form,
        parent_id: user.id,
        profile_completed: true,
      };

      // Verificar si ya existe un registro (perfil incompleto)
      const { data: existingChild, error: checkError } = await supabase
        .from('children')
        .select('id')
        .eq('parent_id', user.id)
        .single();

      let error;
      
      if (checkError && checkError.code === 'PGRST116') {
        // No existe, crear nuevo registro
        const { error: insertError } = await supabase
          .from('children')
          .insert(datosHijo);
        error = insertError;
      } else if (!checkError && existingChild) {
        // Existe, actualizar registro existente
        const { error: updateError } = await supabase
          .from('children')
          .update(datosHijo)
          .eq('id', existingChild.id);
        error = updateError;
      } else {
        // Error al verificar
        error = checkError;
      }

      if (error) {
        let errorTitle = 'Error al guardar el perfil del niño/niña';
        let errorDescription = '';

        if (error.message.includes('dni_formato_valido_opcional')) {
          errorDescription = 'El DNI/NIE no tiene un formato válido. Debe ser 8 números y una letra (ej: 12345678A).';
        } else if (error.message.includes('dni_unico')) {
          errorTitle = 'DNI/NIE duplicado';
          errorDescription = 'Ya existe un niño/niña registrado con ese DNI/NIE. Por favor, verifica los datos.';
        } else if (error.message.includes('parent_unico')) {
          errorTitle = 'Ya tienes un niño/niña registrado';
          errorDescription = 'Solo puedes registrar un niño/niña por cuenta. Si necesitas registrar otro, contacta con soporte.';
        } else if (error.message.includes('nombre') || error.message.includes('apellidos')) {
          errorDescription = 'Por favor, verifica que el nombre y los apellidos estén correctamente completados.';
        } else if (error.message.includes('nivel_educativo')) {
          errorDescription = 'Por favor, selecciona el nivel educativo del niño/niña.';
        } else if (error.message.includes('genero')) {
          errorDescription = 'Por favor, selecciona el género del niño/niña.';
        } else {
          errorDescription = error.message || 'No se pudieron guardar los datos. Por favor, inténtalo de nuevo.';
        }

        setError(errorDescription);
        toast({ 
          title: `❌ ${errorTitle}`, 
          description: errorDescription, 
          variant: 'destructive' 
        });
        throw error;
      }

      // Personalizar mensaje con el nombre del niño/niña
      const nombreNino = form.nombre.trim() || 'del niño/niña';
      const mensajeTitulo = form.nombre.trim() 
        ? `✅ Perfil de ${form.nombre} completado`
        : '✅ Perfil del niño/niña completado';
      const mensajeDescripcion = form.nombre.trim()
        ? `El perfil de ${form.nombre} ${form.apellidos.trim() ? form.apellidos.trim() : ''} ha sido guardado correctamente. ¡Ya puedes comenzar a usar Braini Emotions!`
        : 'El perfil del niño/niña ha sido guardado correctamente. ¡Ya puedes comenzar a usar Braini Emotions!';

      toast({ 
        title: mensajeTitulo, 
        description: mensajeDescripcion, 
        variant: 'default' 
      });
      
      setTimeout(() => navigate('/home'), 1200);
    } catch (err: any) {
      // Error ya manejado arriba
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isLoaded, setIsLoaded] = useState(false);

  // Animación de entrada
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className="min-h-screen bg-white font-montserrat relative overflow-hidden transition-colors duration-300"
      role="main"
      aria-label="Página de perfil del niño"
    >
      {/* Hero Section - Mismo estilo que SignUp/Login */}
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
            {/* Logo y Título */}
            <div className="text-center mb-3 sm:mb-4">
              <div className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <img 
                  src={logoBraini}
                  alt="Braini Emotions Logo" 
                  className="w-16 h-16 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-contain"
                />
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-2 sm:mb-3" style={{ fontWeight: 900 }}>
                Información básica
              </h1>
              <p className="text-white text-lg sm:text-xl lg:text-2xl" style={{ fontWeight: 400 }}>
                Datos personales del niño/niña
              </p>
            </div>
          </div>

          {/* Formulario Card - Mismo estilo que SignUp/Login */}
          <div 
            id="child-profile-form"
            className="bg-white rounded-xl p-4 sm:p-6 md:p-8 shadow-2xl relative z-10 w-full max-w-[90%] sm:max-w-lg lg:max-w-2xl mx-auto"
            style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(0, 0, 0, 0.05)'
            }}
          >

            {loading ? (
              <div className="text-center text-gray-500 py-12">Cargando datos...</div>
            ) : (
              <>
                {error && (
                  <div className="text-red-600 text-center mb-4 p-3 bg-red-50 rounded-lg animate-fade-in" aria-live="polite">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Campo Nombre */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="nombre" className="text-sm sm:text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                      Nombre *
                    </Label>
                    <Input 
                      id="nombre" 
                      name="nombre" 
                      value={form.nombre} 
                      onChange={handleChange} 
                      placeholder="Nombre del niño/niña"
                      className={`border-2 transition-colors text-base sm:text-sm py-2.5 sm:py-3 ${
                        getFieldError('nombre') 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-200 focus:border-braini-blue'
                      }`}
                      disabled={isSubmitting}
                    />
                    {getFieldError('nombre') && (
                      <span className="text-red-500 text-xs mt-1 block">{getFieldError('nombre')}</span>
                    )}
                  </div>
                  
                  {/* Campo Apellidos */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="apellidos" className="text-sm sm:text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                      Apellidos *
                    </Label>
                    <Input 
                      id="apellidos" 
                      name="apellidos" 
                      value={form.apellidos} 
                      onChange={handleChange} 
                      placeholder="Apellidos del niño/niña"
                      className={`border-2 transition-colors text-base sm:text-sm py-2.5 sm:py-3 ${
                        getFieldError('apellidos') 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-200 focus:border-braini-blue'
                      }`}
                      disabled={isSubmitting}
                    />
                    {getFieldError('apellidos') && (
                      <span className="text-red-500 text-xs mt-1 block">{getFieldError('apellidos')}</span>
                    )}
                  </div>
                  
                  {/* Campo Género */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="genero" className="text-sm sm:text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                      Género *
                    </Label>
                    <select
                      id="genero"
                      name="genero"
                      value={form.genero}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full border-2 rounded-md p-2.5 sm:p-3 text-base sm:text-sm transition-colors ${
                        getFieldError('genero') 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-200 focus:border-braini-blue'
                      }`}
                    >
                      <option value="">Selecciona una opción</option>
                      {GENEROS.map((genero) => (
                        <option key={genero.value} value={genero.value}>
                          {genero.label}
                        </option>
                      ))}
                    </select>
                    {getFieldError('genero') && (
                      <span className="text-red-500 text-xs mt-1 block">{getFieldError('genero')}</span>
                    )}
                  </div>
                  
                  {/* Campo Nivel educativo */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="nivel_educativo" className="text-sm sm:text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                      Nivel educativo *
                    </Label>
                    <select
                      id="nivel_educativo"
                      name="nivel_educativo"
                      value={form.nivel_educativo}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full border-2 rounded-md p-2.5 sm:p-3 text-base sm:text-sm transition-colors ${
                        getFieldError('nivel_educativo') 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-200 focus:border-braini-blue'
                      }`}
                    >
                      <option value="">Selecciona una opción</option>
                      {NIVELES_EDUCATIVOS.map((nivel) => (
                        <option key={nivel.value} value={nivel.value}>
                          {nivel.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] sm:text-xs text-gray-500 leading-tight" style={{ fontWeight: 400 }}>
                      Selecciona el nivel educativo actual del niño/niña
                    </p>
                    {getFieldError('nivel_educativo') && (
                      <span className="text-red-500 text-xs mt-1 block">{getFieldError('nivel_educativo')}</span>
                    )}
                  </div>

                  {/* Botón Submit */}
                  <div className="flex justify-center pt-2 sm:pt-4">
                    <Button
                      type="submit"
                      disabled={!isCurrentStepValid() || isSubmitting}
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
                          <span>Guardando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle className="w-5 h-5" />
                          <span>Completar perfil</span>
                        </div>
                      )}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ChildProfile;
