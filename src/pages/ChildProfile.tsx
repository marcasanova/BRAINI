import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import GeometricBackground from '@/components/GeometricBackground';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

const GENEROS = [
  'niño',
  'niña',
  'prefiero no decirlo',
];

const CURSOS = [
  'Infantil 3 años',
  'Infantil 4 años',
  'Infantil 5 años',
  'Primaria 1º',
  'Primaria 2º',
];

const ChildProfile = () => {
  const [form, setForm] = useState({
    nombre: '',
    apellidos: '',
    dni: '',
    genero: '',
    fecha_nacimiento: '',
    centro_escolar: '',
    curso_educativo: '',
    caracteristicas_socioemocionales: '',
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Validaciones básicas
  const isDniValid = /^[0-9]{8}[A-Za-z]$/.test(form.dni);
  const isFechaNacimientoValid = Boolean(form.fecha_nacimiento);
  const isFormValid =
    form.nombre.trim() &&
    form.apellidos.trim() &&
    isDniValid &&
    form.genero &&
    isFechaNacimientoValid &&
    form.centro_escolar.trim() &&
    form.curso_educativo &&
    form.caracteristicas_socioemocionales.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('No se pudo obtener el usuario autenticado.');
      const { error: insertError } = await supabase
        .from('children')
        .insert({
          ...form,
          parent_id: user.id,
        });
      if (insertError) {
        if (insertError.message.includes('dni_formato_valido')) {
          setError('El DNI no tiene un formato válido. Debe ser 8 números y una letra (ej: 12345678A).');
        } else if (insertError.message.includes('dni_unico')) {
          setError('Ya existe un hijo/a con ese DNI.');
        } else if (insertError.message.includes('parent_unico')) {
          setError('Ya tienes un hijo/a registrado.');
        } else {
          setError(insertError.message || 'Error al guardar los datos. Inténtalo de nuevo.');
        }
        toast({ title: 'Error', description: insertError.message || 'Error al guardar los datos.', variant: 'destructive' });
        throw insertError;
      }
      setSuccess(true);
      toast({ title: 'Hijo/a registrado correctamente', description: 'Los datos han sido guardados.', variant: 'default' });
      setTimeout(() => navigate('/home'), 1200);
    } catch (err: any) {
      if (!err.message?.includes('dni_formato_valido') && !err.message?.includes('dni_unico') && !err.message?.includes('parent_unico')) {
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
            Completa los datos del niño o niña
          </h1>
          {loading ? (
            <div className="text-center text-gray-500 py-12">Cargando datos...</div>
          ) : (
            <>
              {error && <div className="text-red-600 text-center mb-2" aria-live="polite">{error}</div>}
              {success && <div className="text-green-600 text-center mb-2" aria-live="polite">¡Datos guardados correctamente!</div>}
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
                    <Label htmlFor="genero">Género *</Label>
                    <select
                      id="genero"
                      name="genero"
                      value={form.genero}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-md p-2 focus:border-braini-blue"
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      {GENEROS.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    {touched.genero && !form.genero && (
                      <span className="text-red-500 text-xs">Campo obligatorio</span>
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
                    <Label htmlFor="centro_escolar">Centro escolar *</Label>
                    <Input id="centro_escolar" name="centro_escolar" value={form.centro_escolar} onChange={handleChange} required />
                    {touched.centro_escolar && !form.centro_escolar.trim() && (
                      <span className="text-red-500 text-xs">Campo obligatorio</span>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="curso_educativo">Curso educativo *</Label>
                    <select
                      id="curso_educativo"
                      name="curso_educativo"
                      value={form.curso_educativo}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-md p-2 focus:border-braini-blue"
                      required
                    >
                      <option value="">Selecciona una opción</option>
                      {CURSOS.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    {touched.curso_educativo && !form.curso_educativo && (
                      <span className="text-red-500 text-xs">Campo obligatorio</span>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="caracteristicas_socioemocionales">Características socioemocionales *</Label>
                    <textarea
                      id="caracteristicas_socioemocionales"
                      name="caracteristicas_socioemocionales"
                      value={form.caracteristicas_socioemocionales}
                      onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-md p-2 focus:border-braini-blue"
                      required
                      rows={2}
                    />
                    {touched.caracteristicas_socioemocionales && !form.caracteristicas_socioemocionales.trim() && (
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

export default ChildProfile; 