import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import GeometricBackground from '@/components/GeometricBackground';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const RELACIONES = [
  'madre',
  'padre',
  'abuelo/a',
  'tutor/a',
  'otros',
];

const ParentsProfile = () => {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    fecha_nacimiento: '',
    relacion_con_menor: '',
    telefono_contacto: '',
    direccion: '',
    codigo_postal: '',
    nivel_educativo: '',
  });
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
          .select('profile_completed, nombre, apellidos, dni, fecha_nacimiento, relacion_con_menor, telefono_contacto, direccion, codigo_postal, nivel_educativo')
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
            direccion: data.direccion || '',
            codigo_postal: data.codigo_postal || '',
            nivel_educativo: data.nivel_educativo || '',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Validaciones básicas
  const isDniValid = /^\w{5,}$/.test(form.dni); // Simplificado, ajusta según formato real
  const isFechaNacimientoValid = Boolean(form.fecha_nacimiento);
  const isTelefonoValid = form.telefono_contacto.length >= 7;
  const isCodigoPostalValid = form.codigo_postal.length >= 4;
  const isFormValid =
    form.nombre.trim() &&
    form.apellidos.trim() &&
    isDniValid &&
    isFechaNacimientoValid &&
    form.relacion_con_menor &&
    isTelefonoValid &&
    form.direccion.trim() &&
    isCodigoPostalValid &&
    form.nivel_educativo.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('No se pudo obtener el usuario autenticado.');
      // Intentar actualizar la fila existente
      const { error: updateError, data } = await supabase
        .from('parents')
        .update({
          ...form,
          profile_completed: true,
        })
        .eq('id', user.id)
        .select();
      if (updateError) {
        // Feedback específico según el constraint que falle
        if (updateError.message.includes('dni_formato_valido')) {
          setError('El DNI no tiene un formato válido. Debe ser 8 números y una letra (ej: 12345678A).');
        } else if (updateError.message.includes('telefono_formato_valido')) {
          setError('El teléfono debe tener 9 dígitos y empezar por 6, 7, 8 o 9.');
        } else if (updateError.message.includes('codigo_postal_formato_valido')) {
          setError('El código postal debe tener 5 dígitos.');
        } else {
          setError(updateError.message || 'Error al guardar los datos. Inténtalo de nuevo.');
        }
        toast({ title: 'Error', description: updateError.message || 'Error al guardar los datos.', variant: 'destructive' });
        throw updateError;
      }
      if (!data || data.length === 0) throw new Error('No se encontró el perfil del usuario para actualizar.');
      setSuccess(true);
      toast({ title: 'Perfil guardado correctamente', description: 'Tu perfil ha sido actualizado.', variant: 'default' });
      setTimeout(() => navigate('/child-profile'), 1200);
    } catch (err: any) {
      if (!err.message?.includes('dni_formato_valido') && !err.message?.includes('telefono_formato_valido') && !err.message?.includes('codigo_postal_formato_valido')) {
        setError(err.message || 'Error al guardar los datos. Inténtalo de nuevo.');
        toast({ title: 'Error', description: err.message || 'Error al guardar los datos.', variant: 'destructive' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-12 max-w-2xl w-full animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Completa tu perfil de adulto responsable
          </h1>
          {loading ? (
            <div className="text-center text-gray-500 py-12">Cargando datos...</div>
          ) : (
            <>
              {error && <div className="text-red-600 text-center mb-2" aria-live="polite">{error}</div>}
              {success && <div className="text-green-600 text-center mb-2" aria-live="polite">¡Perfil guardado correctamente!</div>}
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="nombre">Nombre *</Label>
                    <Input id="nombre" name="nombre" value={form.nombre} onChange={handleChange} required />
                    {touched.nombre && !form.nombre.trim() && (
                      <span className="text-red-500 text-xs">Campo obligatorio</span>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="apellidos">Apellidos *</Label>
                    <Input id="apellidos" name="apellidos" value={form.apellidos} onChange={handleChange} required />
                    {touched.apellidos && !form.apellidos.trim() && (
                      <span className="text-red-500 text-xs">Campo obligatorio</span>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dni">DNI *</Label>
                    <Input id="dni" name="dni" value={form.dni} onChange={handleChange} required />
                    {touched.dni && !isDniValid && (
                      <span className="text-red-500 text-xs">DNI no válido</span>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="fecha_nacimiento">Fecha de nacimiento *</Label>
                    <Input id="fecha_nacimiento" name="fecha_nacimiento" type="date" value={form.fecha_nacimiento} onChange={handleChange} required />
                    {touched.fecha_nacimiento && !isFechaNacimientoValid && (
                      <span className="text-red-500 text-xs">Campo obligatorio</span>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="relacion_con_menor">Relación con el menor *</Label>
                    <select
                      id="relacion_con_menor"
                      name="relacion_con_menor"
                      value={form.relacion_con_menor}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-md p-2 focus:border-braini-blue"
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      {RELACIONES.map((rel) => (
                        <option key={rel} value={rel}>{rel}</option>
                      ))}
                    </select>
                    {touched.relacion_con_menor && !form.relacion_con_menor && (
                      <span className="text-red-500 text-xs">Campo obligatorio</span>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="telefono_contacto">Teléfono de contacto *</Label>
                    <Input id="telefono_contacto" name="telefono_contacto" value={form.telefono_contacto} onChange={handleChange} required />
                    {touched.telefono_contacto && !isTelefonoValid && (
                      <span className="text-red-500 text-xs">Teléfono no válido</span>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="direccion">Dirección *</Label>
                    <Input id="direccion" name="direccion" value={form.direccion} onChange={handleChange} required />
                    {touched.direccion && !form.direccion.trim() && (
                      <span className="text-red-500 text-xs">Campo obligatorio</span>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="codigo_postal">Código postal *</Label>
                    <Input id="codigo_postal" name="codigo_postal" value={form.codigo_postal} onChange={handleChange} required />
                    {touched.codigo_postal && !isCodigoPostalValid && (
                      <span className="text-red-500 text-xs">Código postal no válido</span>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="nivel_educativo">Nivel educativo *</Label>
                    <Input id="nivel_educativo" name="nivel_educativo" value={form.nivel_educativo} onChange={handleChange} required />
                    {touched.nivel_educativo && !form.nivel_educativo.trim() && (
                      <span className="text-red-500 text-xs">Campo obligatorio</span>
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full py-3 text-lg" disabled={!isFormValid || isSubmitting}>
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