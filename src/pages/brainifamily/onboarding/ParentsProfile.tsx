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

const RELACIONES = [
  'madre',
  'padre',
  'abuelo/a',
  'tutor/a',
  'otros',
];


const NUMERO_HIJOS_OPCIONES = [1, 2, 3, 4, 5] as const;

// Configuración de pasos
const STEPS = [
  {
    id: 1,
    title: '¡Hola! Conozcámonos',
    subtitle: 'Empecemos con lo básico',
    fields: ['nombre', 'relacion_con_menor', 'children_count']
  }
];

const ParentsProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    nombre: '',
    relacion_con_menor: '',
    children_count: 1 as number,
  });
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('No se pudo obtener el usuario autenticado.');
        
        const { data, error: fetchError } = await supabase
          .from('parents')
          .select('profile_completed, nombre, relacion_con_menor, children_count')
          .eq('id', user.id)
          .single();
        
        if (fetchError) throw fetchError;
        
        if (data) {
          if (data.profile_completed) {
            navigate('/brainifamily/home');
            return;
          }
          
          const count = data.children_count != null ? Math.min(5, Math.max(1, Number(data.children_count))) : 1;
          setForm({
            nombre: data.nombre || '',
            relacion_con_menor: data.relacion_con_menor || '',
            children_count: count,
          });
        } else {
          throw new Error('No se encontró el perfil del usuario.');
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar los datos.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const validations = {
    nombre: () => form.nombre.trim().length >= 2,
    relacion_con_menor: () => form.relacion_con_menor !== '',
    children_count: () => form.children_count >= 1 && form.children_count <= 5,
  };

  const getFieldError = (fieldName: string): string => {
    if (!touched[fieldName]) return '';
    
    switch (fieldName) {
      case 'nombre':
        return !validations.nombre() ? 'El nombre debe tener al menos 2 caracteres' : '';
      case 'relacion_con_menor':
        return !validations.relacion_con_menor() ? 'Selecciona tu relación con el menor' : '';
      case 'children_count':
        return !validations.children_count() ? 'Selecciona el número de hijos (1 a 5)' : '';
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

  const handleNext = async () => {
    if (isCurrentStepValid()) {
      // Si el paso es válido, guardar y navegar
      await handleSaveAndNavigate();
    } else {
      // Marcar todos los campos del paso actual como tocados
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

  const handleSaveAndNavigate = async () => {
    setError('');
    setIsSubmitting(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('No se pudo obtener el usuario autenticado.');

      const datosPerfil = {
        nombre: form.nombre,
        relacion_con_menor: form.relacion_con_menor,
        profile_completed: true,
        children_count: form.children_count,
      };

      const { error: updateError } = await supabase
        .from('parents')
        .update(datosPerfil)
        .eq('id', user.id);

      if (updateError) {
        setError(updateError.message || 'Error al guardar los datos. Inténtalo de nuevo.');
        toast({ 
          title: '🌱 Perfil no guardado', 
          description: 'Tu perfil no se ha podido guardar. Revisamos los datos o lo intentamos de nuevo en unos segundos.', 
          variant: 'destructive' 
        });
        throw updateError;
      }

      // Personalizar mensaje según la relación con el menor
      const relacionTexto = form.relacion_con_menor === 'madre' 
        ? 'madre' 
        : form.relacion_con_menor === 'padre'
        ? 'padre'
        : form.relacion_con_menor === 'abuelo/a'
        ? 'abuelo/a'
        : form.relacion_con_menor === 'tutor/a'
        ? 'tutor/a'
        : 'padre/madre';

      const numHijos = form.children_count;
      toast({ 
        title: '💛 Perfil guardado', 
        description: numHijos === 1 
          ? 'Tu perfil está listo. Ahora vamos a crear el perfil del niño o la niña.'
          : `Tu perfil está listo. Ahora vamos a crear los perfiles de los ${numHijos} niños/niñas, uno por uno.`, 
        variant: 'default' 
      });
      
      setTimeout(() => navigate('/brainifamily/child-profile'), 1200);
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
      aria-label="Página de perfil del padre"
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
                ¡Hola! Conozcámonos
              </h1>
              <p className="text-white text-lg sm:text-xl lg:text-2xl" style={{ fontWeight: 400 }}>
                Empecemos con lo básico
              </p>
            </div>
          </div>

          {/* Formulario Card - Mismo estilo que SignUp/Login */}
          <div 
            id="parent-profile-form"
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
                
                <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-4 sm:space-y-5 md:space-y-6">
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
                      placeholder="Tu nombre"
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
                    <p className="text-[11px] sm:text-xs text-gray-500 leading-tight" style={{ fontWeight: 400 }}>
                      Este nombre aparecerá en tu perfil
                    </p>
                  </div>
                  
                  {/* Campo Relación con el menor */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="relacion_con_menor" className="text-sm sm:text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                      Relación con el menor *
                    </Label>
                    <select
                      id="relacion_con_menor"
                      name="relacion_con_menor"
                      value={form.relacion_con_menor}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className={`w-full border-2 rounded-md p-2.5 sm:p-3 text-base sm:text-sm transition-colors ${
                        getFieldError('relacion_con_menor') 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-200 focus:border-braini-blue'
                      }`}
                    >
                      <option value="">Selecciona una opción</option>
                      {RELACIONES.map((rel) => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                    {getFieldError('relacion_con_menor') && (
                      <span className="text-red-500 text-xs mt-1 block">{getFieldError('relacion_con_menor')}</span>
                    )}
                    <p className="text-[11px] sm:text-xs text-gray-500 leading-tight" style={{ fontWeight: 400 }}>
                      Indica tu relación con el niño/niña
                    </p>
                  </div>

                  {/* Número de hijos a registrar */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="children_count" className="text-sm sm:text-base font-semibold text-gray-700" style={{ fontWeight: 600 }}>
                      Número de hijos a registrar *
                    </Label>
                    <select
                      id="children_count"
                      name="children_count"
                      value={form.children_count}
                      onChange={(e) => {
                        const v = parseInt(e.target.value, 10);
                        setForm((prev) => ({ ...prev, children_count: isNaN(v) ? 1 : v }));
                        setTouched((prev) => ({ ...prev, children_count: true }));
                      }}
                      disabled={isSubmitting}
                      className={`w-full border-2 rounded-md p-2.5 sm:p-3 text-base sm:text-sm transition-colors ${
                        getFieldError('children_count') 
                          ? 'border-red-500 focus:border-red-500' 
                          : 'border-gray-200 focus:border-braini-blue'
                      }`}
                    >
                      {NUMERO_HIJOS_OPCIONES.map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? 'hijo' : 'hijos'}
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] sm:text-xs text-gray-500 leading-tight" style={{ fontWeight: 400 }}>
                      Selecciona cuántos niños/niñas vas a registrar (mínimo 1, máximo 5)
                    </p>
                    {getFieldError('children_count') && (
                      <span className="text-red-500 text-xs mt-1 block">{getFieldError('children_count')}</span>
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
                          <span>Guardar y continuar</span>
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

export default ParentsProfile;
