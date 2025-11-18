import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import Backgrounds from '@/components/Backgrounds';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, Heart, Brain, Baby, School, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

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
    title: 'Información básica 👶',
    subtitle: 'Datos personales del niño/niña',
    emoji: '👶',
    fields: ['nombre', 'apellidos', 'genero', 'fecha_nacimiento']
  },
  {
    id: 2,
    title: 'Información educativa 🎓',
    subtitle: 'Datos del colegio',
    emoji: '🎓',
    fields: ['centro_escolar', 'nivel_educativo']
  },
  {
    id: 3,
    title: 'Características (Opcional) 💫',
    subtitle: 'Fortalezas y áreas de mejora',
    emoji: '💫',
    fields: ['fortalezas', 'debilidades']
  }
];

const ChildProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    genero: '',
    fecha_nacimiento: '',
    centro_escolar: '',
    nivel_educativo: '',
    fortalezas: '',
    debilidades: '',
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
        
        const { data, error: fetchError } = await supabase
          .from('children')
          .select('id')
          .eq('parent_id', user.id)
          .single();
        
        if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
        
        if (data) {
          navigate('/home');
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
    dni: () => {
      if (!form.dni.trim()) return true;
      return /^[0-9]{8}[A-Za-z]$/.test(form.dni);
    },
    genero: () => form.genero !== '',
    fecha_nacimiento: () => {
      if (!form.fecha_nacimiento) return false;
      const fecha = new Date(form.fecha_nacimiento);
      const hoy = new Date();
      return fecha <= hoy;
    },
    centro_escolar: () => form.centro_escolar.trim().length >= 3,
    nivel_educativo: () => form.nivel_educativo !== '',
    fortalezas: () => true,
    debilidades: () => true,
  };

  const getFieldError = (fieldName: string): string => {
    if (!touched[fieldName]) return '';
    
    switch (fieldName) {
      case 'nombre':
        return !validations.nombre() ? 'El nombre debe tener al menos 2 caracteres' : '';
      case 'apellidos':
        return !validations.apellidos() ? 'Los apellidos deben tener al menos 2 caracteres' : '';
      case 'dni':
        return !validations.dni() ? 'DNI/NIE debe ser 8 números y una letra (ej: 12345678A) o dejarlo vacío' : '';
      case 'genero':
        return !validations.genero() ? 'Selecciona el género del niño/niña' : '';
      case 'fecha_nacimiento':
        return !validations.fecha_nacimiento() ? 'La fecha de nacimiento debe ser válida' : '';
      case 'centro_escolar':
        return !validations.centro_escolar() ? 'El centro escolar debe tener al menos 3 caracteres' : '';
      case 'nivel_educativo':
        return !validations.nivel_educativo() ? 'Selecciona el nivel educativo' : '';
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
    if (isCurrentStepValid()) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
        dni: form.dni.trim() || null,
        parent_id: user.id,
      };

      const { error: insertError } = await supabase
        .from('children')
        .insert(datosHijo);

      if (insertError) {
        if (insertError.message.includes('dni_formato_valido_opcional')) {
          setError('El DNI/NIE no tiene un formato válido. Debe ser 8 números y una letra (ej: 12345678A).');
        } else if (insertError.message.includes('dni_unico')) {
          setError('Ya existe un niño/niña con ese DNI/NIE.');
        } else if (insertError.message.includes('parent_unico')) {
          setError('Ya tienes un niño/niña registrado.');
        } else {
          setError(insertError.message || 'Error al guardar los datos. Inténtalo de nuevo.');
        }
        toast({ 
          title: 'Error', 
          description: insertError.message || 'Error al guardar los datos.', 
          variant: 'destructive' 
        });
        throw insertError;
      }

      toast({ 
        title: '¡Niño/niña registrado! 🎉', 
        description: 'Los datos han sido guardados correctamente.', 
        variant: 'default' 
      });
      
      setTimeout(() => navigate('/home'), 1200);
    } catch (err: any) {
      // Error ya manejado arriba
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepConfig = STEPS.find(s => s.id === currentStep);
  const progress = (currentStep / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-white font-montserrat relative overflow-hidden">
      <Backgrounds />
      <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 md:p-12 max-w-4xl w-full animate-fade-in">
          {/* Barra de progreso */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">
                Paso {currentStep} de {STEPS.length}
              </span>
              <span className="text-sm font-semibold text-braini-pink">
                {Math.round(progress)}% completado
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-braini-pink to-braini-yellow rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Indicadores de pasos */}
          <div className="flex justify-between mb-8">
            {STEPS.map((step) => (
              <div key={step.id} className="flex-1 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-all duration-300 ${
                  currentStep > step.id 
                    ? 'bg-gradient-to-r from-braini-pink to-braini-yellow text-white shadow-lg scale-110' 
                    : currentStep === step.id
                    ? 'bg-braini-pink text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentStep > step.id ? '✓' : step.emoji}
                </div>
                <div className={`text-xs font-medium text-center ${
                  currentStep >= step.id ? 'text-braini-pink' : 'text-gray-400'
                }`}>
                  Paso {step.id}
                </div>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="text-center text-gray-500 py-12">Cargando datos...</div>
          ) : (
            <>
              {error && (
                <div className="text-red-600 text-center mb-4 p-3 bg-red-50 rounded-lg animate-fade-in" aria-live="polite">
                  {error}
                </div>
              )}
              
              <form onSubmit={currentStep === STEPS.length ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
                {/* Header del paso actual */}
                <div className="flex items-center justify-between mb-8 animate-fade-in-up">
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-800" style={{ fontWeight: 900 }}>
                    {currentStepConfig?.title}
                  </h2>
                  <div className="w-20 h-20 bg-gradient-to-r from-braini-pink to-braini-yellow rounded-full flex items-center justify-center shadow-lg">
                    <img 
                      src="/logo/LogoBraini_new.png" 
                      alt="Braini" 
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                </div>

                {/* Contenido del paso */}
                <div className="space-y-6 animate-fade-in-up">
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="nombre" className="text-base font-semibold flex items-center gap-2">
                          <span>👤</span> Nombre *
                        </Label>
                        <Input 
                          id="nombre" 
                          name="nombre" 
                          value={form.nombre} 
                          onChange={handleChange} 
                          placeholder="Nombre del niño/niña"
                          className={getFieldError('nombre') ? 'border-red-500' : 'border-gray-200'}
                        />
                        {getFieldError('nombre') && (
                          <span className="text-red-500 text-xs mt-1 block">{getFieldError('nombre')}</span>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="apellidos" className="text-base font-semibold flex items-center gap-2">
                          <span>📝</span> Apellidos *
                        </Label>
                        <Input 
                          id="apellidos" 
                          name="apellidos" 
                          value={form.apellidos} 
                          onChange={handleChange} 
                          placeholder="Apellidos del niño/niña"
                          className={getFieldError('apellidos') ? 'border-red-500' : 'border-gray-200'}
                        />
                        {getFieldError('apellidos') && (
                          <span className="text-red-500 text-xs mt-1 block">{getFieldError('apellidos')}</span>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="dni" className="text-base font-semibold flex items-center gap-2">
                          <span>🆔</span> DNI/NIE (Opcional)
                        </Label>
                        <Input 
                          id="dni" 
                          name="dni" 
                          value={form.dni} 
                          onChange={handleChange} 
                          placeholder="12345678A o dejar vacío"
                          className={getFieldError('dni') ? 'border-red-500' : 'border-gray-200'}
                        />
                        <span className="text-xs text-gray-500 mt-1 block">
                          Si el niño/niña no tiene DNI aún, puedes dejarlo vacío
                        </span>
                        {getFieldError('dni') && (
                          <span className="text-red-500 text-xs mt-1 block">{getFieldError('dni')}</span>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="genero" className="text-base font-semibold flex items-center gap-2">
                          <span>⚧️</span> Género *
                        </Label>
                        <select
                          id="genero"
                          name="genero"
                          value={form.genero}
                          onChange={handleChange}
                          className={`w-full border-2 rounded-md p-3 focus:border-braini-pink ${
                            getFieldError('genero') ? 'border-red-500' : 'border-gray-200'
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
                      
                      <div>
                        <Label htmlFor="fecha_nacimiento" className="text-base font-semibold flex items-center gap-2">
                          <span>🎂</span> Fecha de nacimiento *
                        </Label>
                        <Input 
                          id="fecha_nacimiento" 
                          name="fecha_nacimiento" 
                          type="date" 
                          value={form.fecha_nacimiento} 
                          onChange={handleChange} 
                          max={new Date().toISOString().split('T')[0]}
                          className={getFieldError('fecha_nacimiento') ? 'border-red-500' : 'border-gray-200'}
                        />
                        <span className="text-xs text-gray-500 mt-1 block">
                          Selecciona la fecha de nacimiento del niño/niña
                        </span>
                        {getFieldError('fecha_nacimiento') && (
                          <span className="text-red-500 text-xs mt-1 block">{getFieldError('fecha_nacimiento')}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="centro_escolar" className="text-base font-semibold flex items-center gap-2">
                          <span>🏫</span> Centro escolar *
                        </Label>
                        <Input 
                          id="centro_escolar" 
                          name="centro_escolar" 
                          value={form.centro_escolar} 
                          onChange={handleChange} 
                          placeholder="Nombre del colegio o escuela"
                          className={getFieldError('centro_escolar') ? 'border-red-500' : 'border-gray-200'}
                        />
                        {getFieldError('centro_escolar') && (
                          <span className="text-red-500 text-xs mt-1 block">{getFieldError('centro_escolar')}</span>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="nivel_educativo" className="text-base font-semibold flex items-center gap-2">
                          <span>📚</span> Nivel educativo *
                        </Label>
                        <select
                          id="nivel_educativo"
                          name="nivel_educativo"
                          value={form.nivel_educativo}
                          onChange={handleChange}
                          className={`w-full border-2 rounded-md p-3 focus:border-braini-pink ${
                            getFieldError('nivel_educativo') ? 'border-red-500' : 'border-gray-200'
                          }`}
                        >
                          <option value="">Selecciona una opción</option>
                          {NIVELES_EDUCATIVOS.map((nivel) => (
                            <option key={nivel.value} value={nivel.value}>
                              {nivel.label}
                            </option>
                          ))}
                        </select>
                        {getFieldError('nivel_educativo') && (
                          <span className="text-red-500 text-xs mt-1 block">{getFieldError('nivel_educativo')}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <p className="text-center text-gray-600 mb-4">
                        Estos campos son opcionales, pero nos ayudan a personalizar mejor la experiencia ✨
                      </p>
                      <div>
                        <Label htmlFor="fortalezas" className="text-base font-semibold flex items-center gap-2">
                          <span>💪</span> Fortalezas
                        </Label>
                        <Textarea
                          id="fortalezas"
                          name="fortalezas"
                          value={form.fortalezas}
                          onChange={handleChange}
                          placeholder="Describe las fortalezas del niño/niña (ej: sociable, creativo, perseverante...)"
                          className="w-full border-2 border-gray-200 rounded-md p-3 focus:border-braini-pink"
                          rows={4}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="debilidades" className="text-base font-semibold flex items-center gap-2">
                          <span>🌱</span> Áreas de mejora
                        </Label>
                        <Textarea
                          id="debilidades"
                          name="debilidades"
                          value={form.debilidades}
                          onChange={handleChange}
                          placeholder="Describe las áreas de mejora (ej: timidez, impulsividad, frustración...)"
                          className="w-full border-2 border-gray-200 rounded-md p-3 focus:border-braini-pink"
                          rows={4}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Botones de navegación */}
                <div className="flex justify-between gap-4 pt-6 border-t border-gray-200">
                  <Button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    variant="outline"
                    className="flex items-center gap-2 px-6 py-3"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    Anterior
                  </Button>
                  
                  {currentStep < STEPS.length ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      disabled={!isCurrentStepValid()}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-braini-pink to-braini-yellow hover:from-braini-pink-dark hover:to-braini-yellow-dark text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      Siguiente
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={!isCurrentStepValid() || isSubmitting}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-braini-pink to-braini-yellow hover:from-braini-pink-dark hover:to-braini-yellow-dark text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Completar perfil
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChildProfile;
