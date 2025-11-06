import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import Backgrounds from '@/components/Backgrounds';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { MapPin, Globe, Heart, Brain, Users } from 'lucide-react';

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
  { id: 1, value: 'mejorar_comunicacion', label: 'Mejorar comunicación', icon: Users },
  { id: 2, value: 'gestionar_rabietas', label: 'Gestionar rabietas', icon: Heart },
  { id: 3, value: 'fomentar_autoestima', label: 'Fomentar autoestima', icon: Brain },
  { id: 4, value: 'reducir_miedos', label: 'Reducir miedos', icon: Heart },
  { id: 5, value: 'aumentar_habilidades_sociales', label: 'Aumentar habilidades sociales', icon: Users },
  { id: 6, value: 'otro', label: 'Otro', icon: Globe },
];

const ParentsProfile = () => {
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
  const [success, setSuccess] = useState(false);
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
          .select('profile_completed, nombre, apellidos, dni, fecha_nacimiento, relacion_con_menor, telefono_contacto, codigo_postal, nivel_educativo, genero, pais_origen, ciudad_origen, idioma_casa, estilo_crianza, expectativas_programa')
          .eq('id', user.id)
          .single();
        
        if (fetchError) throw fetchError;
        
        if (data) {
          if (data.profile_completed) {
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

          // Inicializar expectativas si existen
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

  // Función para manejar expectativas múltiples
  const toggleExpectativa = (expectativaValue: string) => {
    setExpectativasSeleccionadas(prev => 
      prev.includes(expectativaValue)
        ? prev.filter(val => val !== expectativaValue)
        : [...prev, expectativaValue]
    );
    // Marcar como tocado para mostrar errores de validación
    setTouched(prev => ({ ...prev, expectativas: true }));
  };

  // Validaciones mejoradas
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

  const isFormValid = Object.keys(validations).every(key => 
    validations[key as keyof typeof validations]()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('No se pudo obtener el usuario autenticado.');

      // Preparar datos para enviar
      const datosPerfil = {
        ...form,
        expectativas_programa: expectativasSeleccionadas,
        profile_completed: true,
      };

      // Actualizar perfil
      const { error: updateError } = await supabase
        .from('parents')
        .update(datosPerfil)
        .eq('id', user.id);

      if (updateError) {
        // Manejar errores específicos de constraints
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

      setSuccess(true);
      toast({ 
        title: 'Perfil guardado correctamente', 
        description: 'Tu perfil ha sido actualizado.', 
        variant: 'default' 
      });
      
      setTimeout(() => navigate('/child-profile'), 1200);
    } catch (err: any) {
      // Error ya manejado arriba
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-montserrat relative overflow-hidden">
      <Backgrounds />
      <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-12 max-w-4xl w-full animate-fade-in">
          <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-6 text-center" style={{ fontWeight: 900 }}>
            Completa el perfil del Padre/Madre
          </h1>
          
          {loading ? (
            <div className="text-center text-gray-500 py-12">Cargando datos...</div>
          ) : (
            <>
              {error && <div className="text-red-600 text-center mb-4 p-3 bg-red-50 rounded-lg" aria-live="polite">{error}</div>}
              {success && <div className="text-green-600 text-center mb-4 p-3 bg-green-50 rounded-lg" aria-live="polite">¡Perfil guardado correctamente!</div>}
              
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5 text-braini-blue" />
                    Información Personal
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input 
                        id="nombre" 
                        name="nombre" 
                        value={form.nombre} 
                        onChange={handleChange} 
                        className={getFieldError('nombre') ? 'border-red-500' : ''}
                        required 
                      />
                      {getFieldError('nombre') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('nombre')}</span>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="apellidos">Apellidos *</Label>
                      <Input 
                        id="apellidos" 
                        name="apellidos" 
                        value={form.apellidos} 
                        onChange={handleChange} 
                        className={getFieldError('apellidos') ? 'border-red-500' : ''}
                        required 
                      />
                      {getFieldError('apellidos') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('apellidos')}</span>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="dni">DNI *</Label>
                      <Input 
                        id="dni" 
                        name="dni" 
                        value={form.dni} 
                        onChange={handleChange} 
                        placeholder="12345678A"
                        className={getFieldError('dni') ? 'border-red-500' : ''}
                        required 
                      />
                      {getFieldError('dni') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('dni')}</span>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="telefono_contacto">Teléfono de contacto *</Label>
                      <Input 
                        id="telefono_contacto" 
                        name="telefono_contacto" 
                        value={form.telefono_contacto} 
                        onChange={handleChange} 
                        placeholder="612345678"
                        className={getFieldError('telefono_contacto') ? 'border-red-500' : ''}
                        required 
                      />
                      {getFieldError('telefono_contacto') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('telefono_contacto')}</span>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="fecha_nacimiento">Fecha de nacimiento *</Label>
                      <Input 
                        id="fecha_nacimiento" 
                        name="fecha_nacimiento" 
                        type="date" 
                        value={form.fecha_nacimiento} 
                        onChange={handleChange} 
                        max={new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                        className={getFieldError('fecha_nacimiento') ? 'border-red-500' : ''}
                        required 
                      />
                      {getFieldError('fecha_nacimiento') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('fecha_nacimiento')}</span>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="genero">Género *</Label>
                      <select
                        id="genero"
                        name="genero"
                        value={form.genero}
                        onChange={handleChange}
                        className={`w-full border-2 rounded-md p-2 focus:border-braini-blue ${
                          getFieldError('genero') ? 'border-red-500' : 'border-gray-200'
                        }`}
                        required
                      >
                        <option value="">Selecciona una opción</option>
                        {GENEROS.map((genero) => (
                          <option key={genero.value} value={genero.value}>
                            {genero.label}
                          </option>
                        ))}
                      </select>
                      {getFieldError('genero') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('genero')}</span>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="relacion_con_menor">Relación con el menor *</Label>
                      <select
                        id="relacion_con_menor"
                        name="relacion_con_menor"
                        value={form.relacion_con_menor}
                        onChange={handleChange}
                        className={`w-full border-2 rounded-md p-2 focus:border-braini-blue ${
                          getFieldError('relacion_con_menor') ? 'border-red-500' : 'border-gray-200'
                        }`}
                        required
                      >
                        <option value="">Selecciona una opción</option>
                        {RELACIONES.map((rel) => (
                          <option key={rel} value={rel}>{rel}</option>
                        ))}
                      </select>
                      {getFieldError('relacion_con_menor') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('relacion_con_menor')}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Ubicación de Origen */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-braini-blue" />
                    Ubicación de Origen
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="pais_origen">País de origen *</Label>
                      <Input
                        id="pais_origen"
                        name="pais_origen"
                        value={form.pais_origen}
                        onChange={handleChange}
                        placeholder="Ej: España, Francia, México..."
                        className={getFieldError('pais_origen') ? 'border-red-500' : ''}
                        required
                      />
                      {getFieldError('pais_origen') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('pais_origen')}</span>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="ciudad_origen">Ciudad de origen *</Label>
                      <Input
                        id="ciudad_origen"
                        name="ciudad_origen"
                        value={form.ciudad_origen}
                        onChange={handleChange}
                        placeholder="Ej: Madrid, Barcelona, Valencia..."
                        className={getFieldError('ciudad_origen') ? 'border-red-500' : ''}
                        required
                      />
                      {getFieldError('ciudad_origen') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('ciudad_origen')}</span>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="codigo_postal">Código postal *</Label>
                      <Input 
                        id="codigo_postal" 
                        name="codigo_postal" 
                        value={form.codigo_postal} 
                        onChange={handleChange} 
                        placeholder="28001"
                        className={getFieldError('codigo_postal') ? 'border-red-500' : ''}
                        required 
                      />
                      {getFieldError('codigo_postal') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('codigo_postal')}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información Educativa y Cultural */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-braini-blue" />
                    Información Educativa y Cultural
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="nivel_educativo">Nivel educativo *</Label>
                      <select
                        id="nivel_educativo"
                        name="nivel_educativo"
                        value={form.nivel_educativo}
                        onChange={handleChange}
                        className={`w-full border-2 rounded-md p-2 focus:border-braini-blue ${
                          getFieldError('nivel_educativo') ? 'border-red-500' : 'border-gray-200'
                        }`}
                        required
                      >
                        <option value="">Selecciona una opción</option>
                        {NIVELES_EDUCATIVOS.map((nivel) => (
                          <option key={nivel.value} value={nivel.value}>
                            {nivel.label}
                          </option>
                        ))}
                      </select>
                      {getFieldError('nivel_educativo') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('nivel_educativo')}</span>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="idioma_casa">Idioma que se habla en casa *</Label>
                      <Input
                        id="idioma_casa"
                        name="idioma_casa"
                        value={form.idioma_casa}
                        onChange={handleChange}
                        placeholder="Ej: Español, Inglés, Catalán..."
                        className={getFieldError('idioma_casa') ? 'border-red-500' : ''}
                        required
                      />
                      {getFieldError('idioma_casa') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('idioma_casa')}</span>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="estilo_crianza">Estilo de crianza percibido *</Label>
                      <select
                        id="estilo_crianza"
                        name="estilo_crianza"
                        value={form.estilo_crianza}
                        onChange={handleChange}
                        className={`w-full border-2 rounded-md p-2 focus:border-braini-blue ${
                          getFieldError('estilo_crianza') ? 'border-red-500' : 'border-gray-200'
                        }`}
                        required
                      >
                        <option value="">Selecciona una opción</option>
                        {ESTILOS_CRIANZA.map((estilo) => (
                          <option key={estilo.value} value={estilo.value}>
                            {estilo.label}
                          </option>
                        ))}
                      </select>
                      {getFieldError('estilo_crianza') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('estilo_crianza')}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expectativas del Programa */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-braini-blue" />
                    Expectativas principales del programa (selección múltiple) *
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {EXPECTATIVAS_PROGRAMA.map((expectativa) => {
                      const Icon = expectativa.icon;
                      return (
                        <div key={expectativa.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                          <Checkbox
                            id={`expectativa-${expectativa.id}`}
                            checked={expectativasSeleccionadas.includes(expectativa.value)}
                            onCheckedChange={() => toggleExpectativa(expectativa.value)}
                          />
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-braini-blue" />
                            <Label htmlFor={`expectativa-${expectativa.id}`} className="cursor-pointer">
                              {expectativa.label}
                            </Label>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {expectativasSeleccionadas.length === 0 && touched.expectativas && (
                    <span className="text-red-500 text-xs">Debes seleccionar al menos una expectativa</span>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3 text-lg bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white" 
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar y continuar'}
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ParentsProfile; 