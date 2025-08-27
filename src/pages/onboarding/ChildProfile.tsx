import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import GeometricBackground from '@/components/GeometricBackground';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, Heart, Brain, Baby, School } from 'lucide-react';

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

const ChildProfile = () => {
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
  const [success, setSuccess] = useState(false);
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
          // Ya existe un hijo registrado, redirigir a home
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

  // Validaciones mejoradas
  const validations = {
    nombre: () => form.nombre.trim().length >= 2,
    apellidos: () => form.apellidos.trim().length >= 2,
    dni: () => {
      // DNI es opcional, pero si se proporciona debe tener formato válido
      if (!form.dni.trim()) return true; // Válido si está vacío
      return /^[0-9]{8}[A-Za-z]$/.test(form.dni);
    },
    genero: () => form.genero !== '',
    fecha_nacimiento: () => {
      if (!form.fecha_nacimiento) return false;
      // Solo validar que sea una fecha válida, sin restricción de edad
      const fecha = new Date(form.fecha_nacimiento);
      const hoy = new Date();
      return fecha <= hoy; // Solo que no sea una fecha futura
    },
    centro_escolar: () => form.centro_escolar.trim().length >= 3,
    nivel_educativo: () => form.nivel_educativo !== '',
    fortalezas: () => true, // Campo opcional, siempre válido
    debilidades: () => true, // Campo opcional, siempre válido
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
      case 'fortalezas':
        return ''; // Campo opcional, no hay validación mínima
      case 'debilidades':
        return ''; // Campo opcional, no hay validación mínima
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

      // Preparar datos para enviar (convertir DNI vacío a null)
      const datosHijo = {
        ...form,
        dni: form.dni.trim() || null, // Si está vacío, enviar null
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

      setSuccess(true);
      toast({ 
        title: 'Niño/niña registrado correctamente', 
        description: 'Los datos han sido guardados.', 
        variant: 'default' 
      });
      
      setTimeout(() => navigate('/home'), 1200);
    } catch (err: any) {
      // Error ya manejado arriba
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-12 max-w-4xl w-full animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Completa el perfil del Niño/Niña
          </h1>
          
          {loading ? (
            <div className="text-center text-gray-500 py-12">Cargando datos...</div>
          ) : (
            <>
              {error && <div className="text-red-600 text-center mb-4 p-3 bg-red-50 rounded-lg" aria-live="polite">{error}</div>}
              {success && <div className="text-green-600 text-center mb-4 p-3 bg-green-50 rounded-lg" aria-live="polite">¡Datos guardados correctamente!</div>}
              
              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Información Personal */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Baby className="w-5 h-5 text-braini-blue" />
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
                        placeholder="Nombre del niño/niña"
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
                        placeholder="Apellidos del niño/niña"
                        className={getFieldError('apellidos') ? 'border-red-500' : ''}
                        required 
                      />
                      {getFieldError('apellidos') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('apellidos')}</span>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="dni">DNI/NIE (Opcional)</Label>
                      <Input 
                        id="dni" 
                        name="dni" 
                        value={form.dni} 
                        onChange={handleChange} 
                        placeholder="12345678A o dejar vacío"
                        className={getFieldError('dni') ? 'border-red-500' : ''}
                      />
                      <span className="text-xs text-gray-500 mt-1">
                        Si el niño/niña no tiene DNI aún, puedes dejarlo vacío
                      </span>
                      {getFieldError('dni') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('dni')}</span>
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
                      <Label htmlFor="fecha_nacimiento">Fecha de nacimiento *</Label>
                      <Input 
                        id="fecha_nacimiento" 
                        name="fecha_nacimiento" 
                        type="date" 
                        value={form.fecha_nacimiento} 
                        onChange={handleChange} 
                        max={new Date().toISOString().split('T')[0]}
                        className={getFieldError('fecha_nacimiento') ? 'border-red-500' : ''}
                        required 
                      />
                      <span className="text-xs text-gray-500 mt-1">
                        Selecciona la fecha de nacimiento del niño/niña
                      </span>
                      {getFieldError('fecha_nacimiento') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('fecha_nacimiento')}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información Educativa */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <School className="w-5 h-5 text-braini-blue" />
                    Información Educativa
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="centro_escolar">Centro escolar *</Label>
                      <Input 
                        id="centro_escolar" 
                        name="centro_escolar" 
                        value={form.centro_escolar} 
                        onChange={handleChange} 
                        placeholder="Nombre del colegio o escuela"
                        className={getFieldError('centro_escolar') ? 'border-red-500' : ''}
                        required 
                      />
                      {getFieldError('centro_escolar') && (
                        <span className="text-red-500 text-xs mt-1">{getFieldError('centro_escolar')}</span>
                      )}
                    </div>
                    
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
                  </div>
                </div>

                {/* Características Socioemocionales */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-braini-blue" />
                    Características Socioemocionales (Opcional)
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fortalezas">Fortalezas</Label>
                      <Textarea
                        id="fortalezas"
                        name="fortalezas"
                        value={form.fortalezas}
                        onChange={handleChange}
                        placeholder="Describe las fortalezas del niño/niña (ej: sociable, creativo, perseverante...)"
                        className="w-full border-2 border-gray-200 rounded-md p-2 focus:border-braini-blue"
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="debilidades">Debilidades</Label>
                      <Textarea
                        id="debilidades"
                        name="debilidades"
                        value={form.debilidades}
                        onChange={handleChange}
                        placeholder="Describe las áreas de mejora (ej: timidez, impulsividad, frustración...)"
                        className="w-full border-2 border-gray-200 rounded-md p-2 focus:border-braini-blue"
                        rows={4}
                      />
                    </div>
                  </div>
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

export default ChildProfile; 