import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Backgrounds from '@/components/Backgrounds';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { MapPin, Globe, Heart, Brain, Users, CheckCircle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const RELACIONES = [
  'madre',
  'padre',
  'abuelo/a',
  'tutor/a',
  'otros',
];

const GENEROS = [
  { value: 'hombre', label: 'Hombre' },
  { value: 'mujer', label: 'Mujer' },
  { value: 'otro', label: 'Otro' },
];

const NIVELES_EDUCATIVOS = [
  { value: 'sin_estudios', label: 'Sin estudios' },
  { value: 'educacion_primaria', label: 'Educación Primaria' },
  { value: 'eso', label: 'Educación Secundaria Obligatoria (ESO)' },
  { value: 'bachillerato', label: 'Bachillerato' },
  { value: 'fp_grado_medio', label: 'Formación Profesional (Grado Medio)' },
  { value: 'fp_grado_superior', label: 'Formación Profesional (Grado Superior)' },
  { value: 'grado_universitario', label: 'Grado Universitario' },
  { value: 'master_posgrado', label: 'Máster / Posgrado' },
  { value: 'doctorado', label: 'Doctorado' },
  { value: 'otro', label: 'Otro' },
];

const ESTILOS_CRIANZA = [
  { value: 'permisivo', label: 'Permisivo' },
  { value: 'autoritario', label: 'Autoritario' },
  { value: 'democratico', label: 'Democrático' },
  { value: 'respetuoso', label: 'Respetuoso' },
  { value: 'otro', label: 'Otro' },
];

const EXPECTATIVAS_PROGRAMA = [
  { id: 1, value: 'mejorar_comunicacion', label: 'Mejorar comunicación', icon: Users, emoji: '💬' },
  { id: 2, value: 'gestionar_rabietas', label: 'Gestionar rabietas', icon: Heart, emoji: '😤' },
  { id: 3, value: 'fomentar_autoestima', label: 'Fomentar autoestima', icon: Brain, emoji: '🌟' },
  { id: 4, value: 'reducir_miedos', label: 'Reducir miedos', icon: Heart, emoji: '😰' },
  { id: 5, value: 'aumentar_habilidades_sociales', label: 'Aumentar habilidades sociales', icon: Users, emoji: '👥' },
  { id: 6, value: 'otro', label: 'Otro', icon: Globe, emoji: '✨' },
];

// Configuración de pasos
const STEPS = [
  {
    id: 1,
    title: '¡Hola! Conozcámonos 👋',
    subtitle: 'Empecemos con lo básico',
    emoji: '👋',
    fields: ['nombre', 'apellidos', 'relacion_con_menor']
  },
  {
    id: 2,
    title: 'Un poco más sobre ti 👤',
    subtitle: 'Datos personales',
    emoji: '👤',
    fields: ['dni', 'fecha_nacimiento', 'genero', 'telefono_contacto']
  },
  {
    id: 3,
    title: 'Tu ubicación y educación 📍',
    subtitle: 'Información adicional',
    emoji: '📍',
    fields: ['pais_origen', 'ciudad_origen', 'codigo_postal', 'nivel_educativo', 'idioma_casa', 'estilo_crianza']
  },
  {
    id: 4,
    title: 'Tus expectativas 🎯',
    subtitle: '¿Qué esperas del programa?',
    emoji: '🎯',
    fields: ['expectativas']
  }
];

const ParentsProfile = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    fecha_nacimiento: '',
    relacion_con_menor: '',
    telefono_contacto: '',
    codigo_postal: '',
    nivel_educativo: '',
    genero: '',
    pais_origen: '',
    ciudad_origen: '',
    idioma_casa: '',
    estilo_crianza: '',
  });

  const [expectativasSeleccionadas, setExpectativasSeleccionadas] = useState<string[]>([]);
  const [touched, setTouched] = useState<{ [k: string]: boolean }>({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const isTogglingRef = React.useRef(false);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) throw new Error('No se pudo obtener el usuario autenticado.');
        
        const { data, error: fetchError } = await supabase
          .from('parents')
          .select('profile_completed, nombre, apellidos, dni, fecha_nacimiento, relacion_con_menor, telefono_contacto, codigo_postal, nivel_educativo, genero, pais_origen, ciudad_origen, idioma_casa, estilo_crianza, expectativas_programa, is_trial_user')
          .eq('id', user.id)
          .single();
        
        if (fetchError) throw fetchError;
        
        if (data) {
          if (data.profile_completed) {
            navigate('/home');
            return;
          }
          
          // Verificar si es usuario de prueba (saltar onboarding)
          if (data.is_trial_user === true) {
            navigate('/home');
            return;
          }
          
          setForm({
            nombre: data.nombre || '',
            apellidos: data.apellidos || '',
            dni: data.dni || '',
            fecha_nacimiento: data.fecha_nacimiento || '',
            relacion_con_menor: data.relacion_con_menor || '',
            telefono_contacto: data.telefono_contacto || '',
            codigo_postal: data.codigo_postal || '',
            nivel_educativo: data.nivel_educativo || '',
            genero: data.genero || '',
            pais_origen: data.pais_origen || '',
            ciudad_origen: data.ciudad_origen || '',
            idioma_casa: data.idioma_casa || '',
            estilo_crianza: data.estilo_crianza || '',
          });

          if (data.expectativas_programa) {
            setExpectativasSeleccionadas(data.expectativas_programa);
          }
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

  const toggleExpectativa = React.useCallback((expectativaValue: string) => {
    // Prevenir múltiples llamadas simultáneas
    if (isTogglingRef.current) {
      return;
    }
    
    isTogglingRef.current = true;
    
    setExpectativasSeleccionadas(prev => {
      const isAlreadySelected = prev.includes(expectativaValue);
      if (isAlreadySelected) {
        return prev.filter(val => val !== expectativaValue);
      } else {
        return [...prev, expectativaValue];
      }
    });
    setTouched(prev => ({ ...prev, expectativas: true }));
    
    // Resetear el flag después de un breve delay
    setTimeout(() => {
      isTogglingRef.current = false;
    }, 100);
  }, []);

  const validations = {
    nombre: () => form.nombre.trim().length >= 2,
    apellidos: () => form.apellidos.trim().length >= 2,
    dni: () => /^[0-9]{8}[A-Za-z]$/.test(form.dni),
    fecha_nacimiento: () => {
      if (!form.fecha_nacimiento) return false;
      const fecha = new Date(form.fecha_nacimiento);
      const hoy = new Date();
      const edadMinima = new Date(hoy.getFullYear() - 18, hoy.getMonth(), hoy.getDate());
      return fecha >= new Date('1900-01-01') && fecha <= edadMinima;
    },
    relacion_con_menor: () => form.relacion_con_menor !== '',
    telefono_contacto: () => /^[6789][0-9]{8}$/.test(form.telefono_contacto),
    codigo_postal: () => /^[0-9]{5}$/.test(form.codigo_postal),
    nivel_educativo: () => form.nivel_educativo !== '',
    genero: () => form.genero !== '',
    pais_origen: () => form.pais_origen.trim().length >= 2,
    ciudad_origen: () => form.ciudad_origen.trim().length >= 2,
    idioma_casa: () => form.idioma_casa.trim().length >= 2,
    estilo_crianza: () => form.estilo_crianza !== '',
    expectativas: () => expectativasSeleccionadas.length >= 1,
  };

  const getFieldError = (fieldName: string): string => {
    if (!touched[fieldName]) return '';
    
    switch (fieldName) {
      case 'nombre':
        return !validations.nombre() ? 'El nombre debe tener al menos 2 caracteres' : '';
      case 'apellidos':
        return !validations.apellidos() ? 'Los apellidos deben tener al menos 2 caracteres' : '';
      case 'dni':
        return !validations.dni() ? 'DNI debe ser 8 números y una letra (ej: 12345678A)' : '';
      case 'fecha_nacimiento':
        return !validations.fecha_nacimiento() ? 'Debes ser mayor de 18 años' : '';
      case 'relacion_con_menor':
        return !validations.relacion_con_menor() ? 'Selecciona tu relación con el menor' : '';
      case 'telefono_contacto':
        return !validations.telefono_contacto() ? 'Teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9' : '';
      case 'codigo_postal':
        return !validations.codigo_postal() ? 'Código postal debe tener 5 dígitos' : '';
      case 'nivel_educativo':
        return !validations.nivel_educativo() ? 'Selecciona tu nivel educativo' : '';
      case 'genero':
        return !validations.genero() ? 'Selecciona tu género' : '';
      case 'pais_origen':
        return !validations.pais_origen() ? 'Selecciona tu país de origen' : '';
      case 'ciudad_origen':
        return !validations.ciudad_origen() ? 'Selecciona tu ciudad de origen' : '';
      case 'idioma_casa':
        return !validations.idioma_casa() ? 'Especifica el idioma que se habla en casa' : '';
      case 'estilo_crianza':
        return !validations.estilo_crianza() ? 'Selecciona tu estilo de crianza' : '';
      default:
        return '';
    }
  };

  const isCurrentStepValid = () => {
    const currentStepConfig = STEPS.find(s => s.id === currentStep);
    if (!currentStepConfig) return false;

    if (currentStepConfig.id === 4) {
      return validations.expectativas();
    }

    return currentStepConfig.fields.every(field => {
      if (field === 'expectativas') return validations.expectativas();
      return validations[field as keyof typeof validations]();
    });
  };

  const handleNext = async () => {
    if (isCurrentStepValid()) {
      // Si estamos en el último paso, guardar antes de navegar
      if (currentStep === STEPS.length) {
        await handleSaveAndNavigate();
      } else if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
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
        ...form,
        expectativas_programa: expectativasSeleccionadas,
        profile_completed: true,
      };

      const { error: updateError } = await supabase
        .from('parents')
        .update(datosPerfil)
        .eq('id', user.id);

      if (updateError) {
        if (updateError.message.includes('dni_formato_valido')) {
          setError('El DNI no tiene un formato válido. Debe ser 8 números y una letra (ej: 12345678A).');
        } else if (updateError.message.includes('telefono_formato_valido')) {
          setError('El teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9.');
        } else if (updateError.message.includes('check_al_menos_una_expectativa')) {
          setError('Debes seleccionar al menos una expectativa del programa.');
        } else {
          setError(updateError.message || 'Error al guardar los datos. Inténtalo de nuevo.');
        }
        toast({ 
          title: 'Error', 
          description: updateError.message || 'Error al guardar los datos.', 
          variant: 'destructive' 
        });
        throw updateError;
      }

      toast({ 
        title: '¡Perfil completado! 🎉', 
        description: 'Tu perfil ha sido guardado correctamente.', 
        variant: 'default' 
      });
      
      setTimeout(() => navigate('/child-profile'), 1200);
    } catch (err: any) {
      // Error ya manejado arriba
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <span className="text-sm font-semibold text-braini-blue">
                {Math.round(progress)}% completado
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-braini-blue to-braini-turquoise rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Indicadores de pasos */}
          <div className="flex justify-between mb-8">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex-1 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-all duration-300 ${
                  currentStep > step.id 
                    ? 'bg-gradient-to-r from-braini-blue to-braini-turquoise text-white shadow-lg scale-110' 
                    : currentStep === step.id
                    ? 'bg-braini-blue text-white shadow-lg scale-110'
                    : 'bg-gray-200 text-gray-400'
                }`}>
                  {currentStep > step.id ? '✓' : step.emoji}
                </div>
                <div className={`text-xs font-medium text-center ${
                  currentStep >= step.id ? 'text-braini-blue' : 'text-gray-400'
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
              
              <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
                {/* Header del paso actual */}
                <div className="flex items-center justify-between mb-8 animate-fade-in-up">
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-800" style={{ fontWeight: 900 }}>
                    {currentStepConfig?.title}
                  </h2>
                  <div className="w-20 h-20 bg-gradient-to-r from-braini-blue to-braini-turquoise rounded-full flex items-center justify-center shadow-lg">
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
                          className={getFieldError('nombre') ? 'border-red-500' : 'border-gray-200'}
                          placeholder="Tu nombre"
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
                          className={getFieldError('apellidos') ? 'border-red-500' : 'border-gray-200'}
                          placeholder="Tus apellidos"
                        />
                        {getFieldError('apellidos') && (
                          <span className="text-red-500 text-xs mt-1 block">{getFieldError('apellidos')}</span>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="relacion_con_menor" className="text-base font-semibold flex items-center gap-2">
                          <span>👨‍👩‍👧</span> Relación con el menor *
                        </Label>
                        <select
                          id="relacion_con_menor"
                          name="relacion_con_menor"
                          value={form.relacion_con_menor}
                          onChange={handleChange}
                          className={`w-full border-2 rounded-md p-3 focus:border-braini-blue ${
                            getFieldError('relacion_con_menor') ? 'border-red-500' : 'border-gray-200'
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
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="dni" className="text-base font-semibold flex items-center gap-2">
                          <span>🆔</span> DNI *
                        </Label>
                        <Input 
                          id="dni" 
                          name="dni" 
                          value={form.dni} 
                          onChange={handleChange} 
                          placeholder="12345678A"
                          className={getFieldError('dni') ? 'border-red-500' : 'border-gray-200'}
                        />
                        {getFieldError('dni') && (
                          <span className="text-red-500 text-xs mt-1 block">{getFieldError('dni')}</span>
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
                          max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                          className={getFieldError('fecha_nacimiento') ? 'border-red-500' : 'border-gray-200'}
                        />
                        {getFieldError('fecha_nacimiento') && (
                          <span className="text-red-500 text-xs mt-1 block">{getFieldError('fecha_nacimiento')}</span>
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
                          className={`w-full border-2 rounded-md p-3 focus:border-braini-blue ${
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
                        <Label htmlFor="telefono_contacto" className="text-base font-semibold flex items-center gap-2">
                          <span>📱</span> Teléfono de contacto *
                        </Label>
                        <Input 
                          id="telefono_contacto" 
                          name="telefono_contacto" 
                          value={form.telefono_contacto} 
                          onChange={handleChange} 
                          placeholder="612345678"
                          className={getFieldError('telefono_contacto') ? 'border-red-500' : 'border-gray-200'}
                        />
                        {getFieldError('telefono_contacto') && (
                          <span className="text-red-500 text-xs mt-1 block">{getFieldError('telefono_contacto')}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="pais_origen" className="text-base font-semibold flex items-center gap-2">
                            <span>🌍</span> País de origen *
                          </Label>
                          <Input
                            id="pais_origen"
                            name="pais_origen"
                            value={form.pais_origen}
                            onChange={handleChange}
                            placeholder="Ej: España, Francia..."
                            className={getFieldError('pais_origen') ? 'border-red-500' : 'border-gray-200'}
                          />
                          {getFieldError('pais_origen') && (
                            <span className="text-red-500 text-xs mt-1 block">{getFieldError('pais_origen')}</span>
                          )}
                        </div>

                        <div>
                          <Label htmlFor="ciudad_origen" className="text-base font-semibold flex items-center gap-2">
                            <span>🏙️</span> Ciudad de origen *
                          </Label>
                          <Input
                            id="ciudad_origen"
                            name="ciudad_origen"
                            value={form.ciudad_origen}
                            onChange={handleChange}
                            placeholder="Ej: Madrid, Barcelona..."
                            className={getFieldError('ciudad_origen') ? 'border-red-500' : 'border-gray-200'}
                          />
                          {getFieldError('ciudad_origen') && (
                            <span className="text-red-500 text-xs mt-1 block">{getFieldError('ciudad_origen')}</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="codigo_postal" className="text-base font-semibold flex items-center gap-2">
                          <span>📮</span> Código postal *
                        </Label>
                        <Input 
                          id="codigo_postal" 
                          name="codigo_postal" 
                          value={form.codigo_postal} 
                          onChange={handleChange} 
                          placeholder="28001"
                          className={getFieldError('codigo_postal') ? 'border-red-500' : 'border-gray-200'}
                        />
                        {getFieldError('codigo_postal') && (
                          <span className="text-red-500 text-xs mt-1 block">{getFieldError('codigo_postal')}</span>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="nivel_educativo" className="text-base font-semibold flex items-center gap-2">
                          <span>🎓</span> Nivel educativo *
                        </Label>
                        <select
                          id="nivel_educativo"
                          name="nivel_educativo"
                          value={form.nivel_educativo}
                          onChange={handleChange}
                          className={`w-full border-2 rounded-md p-3 focus:border-braini-blue ${
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
                      
                      <div>
                        <Label htmlFor="idioma_casa" className="text-base font-semibold flex items-center gap-2">
                          <span>🗣️</span> Idioma que se habla en casa *
                        </Label>
                        <Input
                          id="idioma_casa"
                          name="idioma_casa"
                          value={form.idioma_casa}
                          onChange={handleChange}
                          placeholder="Ej: Español, Inglés..."
                          className={getFieldError('idioma_casa') ? 'border-red-500' : 'border-gray-200'}
                        />
                        {getFieldError('idioma_casa') && (
                          <span className="text-red-500 text-xs mt-1 block">{getFieldError('idioma_casa')}</span>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="estilo_crianza" className="text-base font-semibold flex items-center gap-2">
                          <span>💝</span> Estilo de crianza percibido *
                        </Label>
                        <select
                          id="estilo_crianza"
                          name="estilo_crianza"
                          value={form.estilo_crianza}
                          onChange={handleChange}
                          className={`w-full border-2 rounded-md p-3 focus:border-braini-blue ${
                            getFieldError('estilo_crianza') ? 'border-red-500' : 'border-gray-200'
                          }`}
                        >
                          <option value="">Selecciona una opción</option>
                          {ESTILOS_CRIANZA.map((estilo) => (
                            <option key={estilo.value} value={estilo.value}>
                              {estilo.label}
                            </option>
                          ))}
                        </select>
                        {getFieldError('estilo_crianza') && (
                          <span className="text-red-500 text-xs mt-1 block">{getFieldError('estilo_crianza')}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <p className="text-center text-gray-600 mb-6">
                        Selecciona al menos una expectativa que tengas sobre el programa ✨
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {EXPECTATIVAS_PROGRAMA.map((expectativa) => {
                          const Icon = expectativa.icon;
                          const isSelected = expectativasSeleccionadas.includes(expectativa.value);
                          return (
                            <div 
                              key={expectativa.id} 
                              role="button"
                              tabIndex={0}
                              className={`flex items-center space-x-3 p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'bg-gradient-to-r from-braini-blue/10 to-braini-turquoise/10 border-braini-blue shadow-md'
                                  : 'border-gray-200 hover:bg-gray-50 hover:border-braini-blue/50'
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleExpectativa(expectativa.value);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  toggleExpectativa(expectativa.value);
                                }
                              }}
                            >
                              <div 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                              >
                                <Checkbox
                                  id={`expectativa-${expectativa.id}`}
                                  checked={isSelected}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                />
                              </div>
                              <div className="flex items-center gap-3 flex-1">
                                <span className="text-2xl">{expectativa.emoji}</span>
                                <Icon className="w-5 h-5 text-braini-blue" />
                                <span className="cursor-pointer font-medium">
                                  {expectativa.label}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {expectativasSeleccionadas.length === 0 && touched.expectativas && (
                        <span className="text-red-500 text-xs block text-center">Debes seleccionar al menos una expectativa</span>
                      )}
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
                  
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={!isCurrentStepValid() || isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-braini-blue to-braini-turquoise hover:from-braini-blue-dark hover:to-braini-turquoise-dark text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Guardando...
                      </>
                    ) : currentStep === STEPS.length ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Guardar y continuar
                      </>
                    ) : (
                      <>
                        Siguiente
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentsProfile;
