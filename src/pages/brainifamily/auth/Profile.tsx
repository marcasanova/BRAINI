import React, { useEffect, useState, useMemo } from 'react';
import Backgrounds from '@/components/Backgrounds';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { User, Baby, Edit3, Save, X, Calendar, Phone, MapPin, GraduationCap, Heart, Globe, Brain, Users, School, Flag, Languages, CreditCard, Mail, Eye } from 'lucide-react';

// Constantes para las expectativas del programa
const EXPECTATIVAS_PROGRAMA = [
  { id: 1, value: 'mejorar_comunicacion', label: 'Mejorar comunicación', icon: Users },
  { id: 2, value: 'gestionar_rabietas', label: 'Gestionar rabietas', icon: Heart },
  { id: 3, value: 'fomentar_autoestima', label: 'Fomentar autoestima', icon: Brain },
  { id: 4, value: 'reducir_miedos', label: 'Reducir miedos', icon: Heart },
  { id: 5, value: 'aumentar_habilidades_sociales', label: 'Aumentar habilidades sociales', icon: Users },
  { id: 6, value: 'otro', label: 'Otro', icon: Globe },
];

const Profile = () => {
  const { toast } = useToast();
  const [parent, setParent] = useState<any>(null);
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editParent, setEditParent] = useState(false);
  const [editChild, setEditChild] = useState(false);
  const [parentForm, setParentForm] = useState<any>({});
  const [childForm, setChildForm] = useState<any>({});
  const [accordionValue, setAccordionValue] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No autenticado');
        // Obtener datos del parent
        const { data: parentData, error: parentError } = await supabase
          .from('parents')
          .select('*')
          .eq('id', user.id)
          .single();
        if (parentError) throw parentError;
        setParent(parentData);
        setParentForm(parentData);
        // Obtener datos del hijo/a
        const { data: childData } = await supabase
          .from('children')
          .select('*')
          .eq('parent_id', user.id)
          .single();
        setChild(childData);
        setChildForm(childData || {});
      } catch (err: any) {
        toast({ 
          title: '❌ Error al cargar los datos', 
          description: err.message || 'No se pudieron cargar los datos del perfil. Por favor, recarga la página.', 
          variant: 'destructive' 
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    // eslint-disable-next-line
  }, []);

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setParentForm({ ...parentForm, [e.target.name]: e.target.value });
  };

  const handleChildChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setChildForm({ ...childForm, [e.target.name]: e.target.value });
  };

  const saveParent = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('parents')
        .update(parentForm)
        .eq('id', parent.id);
      if (error) throw error;
      setParent(parentForm);
      setEditParent(false);
      setAccordionValue('');
      toast({ 
        title: '✅ Perfil actualizado correctamente', 
        description: 'Los cambios en tu perfil han sido guardados exitosamente.' 
      });
    } catch (err: any) {
      toast({ 
        title: '❌ Error al actualizar el perfil', 
        description: err.message || 'No se pudieron guardar los cambios. Por favor, inténtalo de nuevo.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const saveChild = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('children')
        .update(childForm)
        .eq('id', child.id);
      if (error) throw error;
      setChild(childForm);
      setEditChild(false);
      setAccordionValue('');
      toast({ 
        title: '✅ Datos del menor actualizados', 
        description: 'La información del menor ha sido guardada correctamente.' 
      });
    } catch (err: any) {
      toast({ 
        title: '❌ Error al actualizar los datos del menor', 
        description: err.message || 'No se pudieron guardar los cambios. Por favor, inténtalo de nuevo.', 
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el label de una expectativa
  const getExpectativaLabel = (value: string) => {
    const expectativa = EXPECTATIVAS_PROGRAMA.find(exp => exp.value === value);
    return expectativa ? expectativa.label : value;
  };

  // Función para comparar objetos y detectar cambios
  const hasChanges = (original: any, current: any): boolean => {
    if (!original || !current) return false;
    
    // Obtener todas las claves únicas de ambos objetos
    const allKeys = new Set([...Object.keys(original), ...Object.keys(current)]);
    
    for (const key of allKeys) {
      const originalValue = original[key];
      const currentValue = current[key];
      
      // Comparar valores (manejar null/undefined)
      if (originalValue !== currentValue) {
        // Si son arrays, comparar contenido
        if (Array.isArray(originalValue) && Array.isArray(currentValue)) {
          if (JSON.stringify(originalValue.sort()) !== JSON.stringify(currentValue.sort())) {
            return true;
          }
        } else {
          return true;
        }
      }
    }
    
    return false;
  };

  // Verificar si hay cambios en el formulario del parent
  const hasParentChanges = useMemo(() => {
    if (!editParent || !parent) return false;
    return hasChanges(parent, parentForm);
  }, [editParent, parent, parentForm]);

  // Verificar si hay cambios en el formulario del child
  const hasChildChanges = useMemo(() => {
    if (!editChild || !child) return false;
    return hasChanges(child, childForm);
  }, [editChild, child, childForm]);

  return (
    <Backgrounds 
      wrapWithCard={true}
      enableInternalScroll={true}
      customColor="#f5827b"
      showCircles={true}
    >
      <div className="h-full flex flex-col relative z-10">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-4 md:py-6 flex-1 flex flex-col min-h-0">
          <div className="max-w-4xl mx-auto w-full flex flex-col min-h-0">
            {/* Header Section - Fijo en la parte superior */}
            <div className="mb-4 sm:mb-5 md:mb-6 animate-fade-in flex-shrink-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 sm:mb-2" style={{ fontWeight: 900 }}>
                Mi Familia
              </h1>
              {parent?.nombre && (
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-medium">
                  Bienvenido al perfil, <span className="font-bold text-white">{parent.nombre}</span>.
                </p>
              )}
            </div>

          {/* Área de contenido con scroll */}
          <div className="flex-1 overflow-y-auto min-h-0">
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-2 text-gray-500">
                  <div className="w-6 h-6 border-2 border-braini-pink border-t-transparent rounded-full animate-spin"></div>
                  Cargando datos...
                </div>
              </div>
            ) : (
              <div className="space-y-4 sm:space-y-5 md:space-y-6 pb-20 md:pb-4">
              {/* 1. Datos del Usuario (Padre) */}
              <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-braini-pink rounded-lg flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg md:text-xl text-gray-800">
                          Datos de {parent?.nombre || 'Usuario'}
                        </CardTitle>
                        {editParent && (
                          <p className="text-[10px] sm:text-xs text-braini-pink font-medium mt-0.5 sm:mt-1 flex items-center gap-1">
                            <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            Modo edición
                          </p>
                        )}
                      </div>
                    </div>
                    {!editParent ? (
                      <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAccordionValue(accordionValue === 'parent-info' ? '' : 'parent-info');
                          }}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">{accordionValue === 'parent-info' ? 'Ocultar' : 'Ver'}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditParent(true);
                            setAccordionValue('parent-info');
                          }}
                          className="border-braini-pink text-braini-pink hover:bg-braini-pink hover:text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                        >
                          <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Editar
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditParent(false);
                            setParentForm(parent);
                            setAccordionValue('');
                          }}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            saveParent();
                          }}
                          disabled={!hasParentChanges || loading}
                          className="bg-braini-pink hover:bg-braini-pink-dark text-white font-semibold text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Guardar
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue} className="w-full">
                  <AccordionItem value="parent-info" className="border-none">
                    <AccordionContent>
                      <CardContent className="pt-0">
                        {editParent ? (
                          <form className="space-y-3 sm:space-y-4" onSubmit={e => { e.preventDefault(); saveParent(); }}>
                            {/* Información Personal */}
                            <div className="space-y-3 sm:space-y-4 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                Información Personal
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="nombre" className="text-xs sm:text-sm">Nombre</Label>
                                  <Input
                                    id="nombre"
                                    name="nombre"
                                    value={parentForm.nombre || ''}
                                    onChange={handleParentChange}
                                    className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                  />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="apellidos" className="text-xs sm:text-sm">Apellidos</Label>
                                  <Input
                                    id="apellidos"
                                    name="apellidos"
                                    value={parentForm.apellidos || ''}
                                    onChange={handleParentChange}
                                    className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                  />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="dni" className="text-xs sm:text-sm">DNI</Label>
                                  <Input
                                    id="dni"
                                    name="dni"
                                    value={parentForm.dni || ''}
                                    onChange={handleParentChange}
                                    className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                  />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="fecha_nacimiento" className="text-xs sm:text-sm">Fecha de nacimiento</Label>
                                  <Input
                                    id="fecha_nacimiento"
                                    name="fecha_nacimiento"
                                    type="date"
                                    value={parentForm.fecha_nacimiento || ''}
                                    onChange={handleParentChange}
                                    className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                  />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="genero" className="text-xs sm:text-sm">Género</Label>
                                  <select
                                    id="genero"
                                    name="genero"
                                    value={parentForm.genero || ''}
                                    onChange={handleParentChange}
                                    className="w-full border-2 border-gray-200 rounded-md p-2 sm:p-2.5 text-base sm:text-sm focus:border-braini-pink"
                                  >
                                    <option value="">Selecciona una opción</option>
                                    <option value="hombre">Hombre</option>
                                    <option value="mujer">Mujer</option>
                                    <option value="otro">Otro</option>
                                  </select>
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="telefono_contacto" className="text-xs sm:text-sm">Teléfono</Label>
                                  <Input
                                    id="telefono_contacto"
                                    name="telefono_contacto"
                                    value={parentForm.telefono_contacto || ''}
                                    onChange={handleParentChange}
                                    className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                  />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="relacion_con_menor" className="text-xs sm:text-sm">Relación con el menor</Label>
                                  <select
                                    id="relacion_con_menor"
                                    name="relacion_con_menor"
                                    value={parentForm.relacion_con_menor || ''}
                                    onChange={handleParentChange}
                                    className="w-full border-2 border-gray-200 rounded-md p-2 sm:p-2.5 text-base sm:text-sm focus:border-braini-pink"
                                  >
                                    <option value="">Selecciona una opción</option>
                                    <option value="madre">Madre</option>
                                    <option value="padre">Padre</option>
                                    <option value="abuelo/a">Abuelo/a</option>
                                    <option value="tutor/a">Tutor/a</option>
                                    <option value="otros">Otros</option>
                                  </select>
                                </div>
                              </div>
                            </div>

                            {/* Ubicación */}
                            <div className="space-y-3 sm:space-y-4 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                Ubicación
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="pais_origen" className="text-xs sm:text-sm">País de origen</Label>
                                  <Input
                                    id="pais_origen"
                                    name="pais_origen"
                                    value={parentForm.pais_origen || ''}
                                    onChange={handleParentChange}
                                    className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                  />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="ciudad_origen" className="text-xs sm:text-sm">Ciudad de origen</Label>
                                  <Input
                                    id="ciudad_origen"
                                    name="ciudad_origen"
                                    value={parentForm.ciudad_origen || ''}
                                    onChange={handleParentChange}
                                    className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                  />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="codigo_postal" className="text-xs sm:text-sm">Código postal</Label>
                                  <Input
                                    id="codigo_postal"
                                    name="codigo_postal"
                                    value={parentForm.codigo_postal || ''}
                                    onChange={handleParentChange}
                                    className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Información Educativa y Cultural */}
                            <div className="space-y-3 sm:space-y-4 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                Información Educativa y Cultural
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="nivel_educativo" className="text-xs sm:text-sm">Nivel educativo</Label>
                                  <select
                                    id="nivel_educativo"
                                    name="nivel_educativo"
                                    value={parentForm.nivel_educativo || ''}
                                    onChange={handleParentChange}
                                    className="w-full border-2 border-gray-200 rounded-md p-2 sm:p-2.5 text-base sm:text-sm focus:border-braini-pink"
                                  >
                                    <option value="">Selecciona una opción</option>
                                    <option value="sin_estudios">Sin estudios</option>
                                    <option value="educacion_primaria">Educación Primaria</option>
                                    <option value="eso">Educación Secundaria Obligatoria (ESO)</option>
                                    <option value="bachillerato">Bachillerato</option>
                                    <option value="fp_grado_medio">Formación Profesional (Grado Medio)</option>
                                    <option value="fp_grado_superior">Formación Profesional (Grado Superior)</option>
                                    <option value="grado_universitario">Grado Universitario</option>
                                    <option value="master_posgrado">Máster / Posgrado</option>
                                    <option value="doctorado">Doctorado</option>
                                    <option value="otro">Otro</option>
                                  </select>
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="idioma_casa" className="text-xs sm:text-sm">Idioma que se habla en casa</Label>
                                  <Input
                                    id="idioma_casa"
                                    name="idioma_casa"
                                    value={parentForm.idioma_casa || ''}
                                    onChange={handleParentChange}
                                    className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                  />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="estilo_crianza" className="text-xs sm:text-sm">Estilo de crianza percibido</Label>
                                  <select
                                    id="estilo_crianza"
                                    name="estilo_crianza"
                                    value={parentForm.estilo_crianza || ''}
                                    onChange={handleParentChange}
                                    className="w-full border-2 border-gray-200 rounded-md p-2 sm:p-2.5 text-base sm:text-sm focus:border-braini-pink"
                                  >
                                    <option value="">Selecciona una opción</option>
                                    <option value="permisivo">Permisivo</option>
                                    <option value="autoritario">Autoritario</option>
                                    <option value="democratico">Democrático</option>
                                    <option value="respetuoso">Respetuoso</option>
                                    <option value="otro">Otro</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </form>
                        ) : (
                          <div className="space-y-3 sm:space-y-4">
                            {/* Información Personal */}
                            <div className="space-y-2 sm:space-y-3 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                Información Personal
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Nombre</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{parent?.nombre || 'No especificado'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Apellidos</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{parent?.apellidos || 'No especificado'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                  <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">DNI</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{parent?.dni || 'No especificado'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Fecha de nacimiento</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{parent?.fecha_nacimiento || 'No especificado'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Género</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{parent?.genero || 'No especificado'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                  <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Teléfono</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{parent?.telefono_contacto || 'No especificado'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Relación con el menor</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{parent?.relacion_con_menor || 'No especificado'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Ubicación */}
                            <div className="space-y-2 sm:space-y-3 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                Ubicación
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                  <Flag className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">País de origen</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{parent?.pais_origen || 'No especificado'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Ciudad de origen</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{parent?.ciudad_origen || 'No especificado'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Código postal</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{parent?.codigo_postal || 'No especificado'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Información Educativa y Cultural */}
                            <div className="space-y-2 sm:space-y-3 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                Información Educativa y Cultural
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                  <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Nivel educativo</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{parent?.nivel_educativo || 'No especificado'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                  <Languages className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Idioma que se habla en casa</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{parent?.idioma_casa || 'No especificado'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                  <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Estilo de crianza percibido</p>
                                    <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{parent?.estilo_crianza || 'No especificado'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Expectativas del Programa */}
                            {parent?.expectativas_programa && parent.expectativas_programa.length > 0 && (
                              <div className="space-y-2 sm:space-y-3 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                  Expectativas del Programa
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2">
                                  {parent.expectativas_programa.map((expectativa: string, index: number) => (
                                    <div key={index} className="flex items-center gap-1.5 sm:gap-2 p-1.5 bg-white rounded-lg">
                                      <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-braini-pink flex-shrink-0" />
                                      <span className="text-[10px] sm:text-xs font-medium text-gray-700">
                                        {getExpectativaLabel(expectativa)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>

              {/* 2. Datos del Hijo/a */}
              <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0">
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-braini-pink rounded-lg flex items-center justify-center flex-shrink-0">
                        <Baby className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg md:text-xl text-gray-800">
                          Datos de {child?.nombre ? child.nombre : 'Hijo/a'}
                        </CardTitle>
                        {editChild && (
                          <p className="text-[10px] sm:text-xs text-braini-pink font-medium mt-0.5 sm:mt-1 flex items-center gap-1">
                            <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                            Modo edición
                          </p>
                        )}
                      </div>
                    </div>
                    {child && !editChild ? (
                      <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setAccordionValue(accordionValue === 'child-info' ? '' : 'child-info');
                          }}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                        >
                          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">{accordionValue === 'child-info' ? 'Ocultar' : 'Ver'}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditChild(true);
                            setAccordionValue('child-info');
                          }}
                          className="border-braini-pink text-braini-pink hover:bg-braini-pink hover:text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                        >
                          <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Editar
                        </Button>
                      </div>
                    ) : child && editChild ? (
                      <div className="flex gap-1.5 sm:gap-2 w-full sm:w-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditChild(false);
                            setChildForm(child);
                            setAccordionValue('');
                          }}
                          className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1 sm:flex-initial"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Cancelar
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            saveChild();
                          }}
                          disabled={!hasChildChanges || loading}
                          className="bg-braini-pink hover:bg-braini-pink-dark text-white font-semibold text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1 sm:flex-initial disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                          Guardar
                        </Button>
                      </div>
                    ) : null}
                  </div>
                </CardHeader>
                <Accordion type="single" collapsible value={accordionValue} onValueChange={setAccordionValue} className="w-full">
                  <AccordionItem value="child-info" className="border-none">
                    <AccordionContent>
                      <CardContent className="pt-0">
                        {child ? (
                          editChild ? (
                            <form className="space-y-3 sm:space-y-4" onSubmit={e => { e.preventDefault(); saveChild(); }}>
                              {/* Información Personal */}
                              <div className="space-y-3 sm:space-y-4 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                  Información Personal
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                  <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="child-nombre" className="text-xs sm:text-sm">Nombre</Label>
                                    <Input
                                      id="child-nombre"
                                      name="nombre"
                                      value={childForm.nombre || ''}
                                      onChange={handleChildChange}
                                      className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                    />
                                  </div>
                                  <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="child-apellidos" className="text-xs sm:text-sm">Apellidos</Label>
                                    <Input
                                      id="child-apellidos"
                                      name="apellidos"
                                      value={childForm.apellidos || ''}
                                      onChange={handleChildChange}
                                      className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                    />
                                  </div>
                                  <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="child-dni" className="text-xs sm:text-sm">DNI</Label>
                                    <Input
                                      id="child-dni"
                                      name="dni"
                                      value={childForm.dni || ''}
                                      onChange={handleChildChange}
                                      className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                    />
                                  </div>
                                  <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="child-genero" className="text-xs sm:text-sm">Género</Label>
                                    <select
                                      id="child-genero"
                                      name="genero"
                                      value={childForm.genero || ''}
                                      onChange={handleChildChange}
                                      className="w-full border-2 border-gray-200 rounded-md p-2 sm:p-2.5 text-base sm:text-sm focus:border-braini-pink"
                                    >
                                      <option value="">Selecciona una opción</option>
                                      <option value="niño">Niño</option>
                                      <option value="niña">Niña</option>
                                      <option value="prefiero_no_decirlo">Prefiero no decirlo</option>
                                    </select>
                                  </div>
                                  <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="child-nivel_educativo" className="text-xs sm:text-sm">Nivel educativo</Label>
                                    <select
                                      id="child-nivel_educativo"
                                      name="nivel_educativo"
                                      value={childForm.nivel_educativo || ''}
                                      onChange={handleChildChange}
                                      className="w-full border-2 border-gray-200 rounded-md p-2 sm:p-2.5 text-base sm:text-sm focus:border-braini-pink"
                                    >
                                      <option value="">Selecciona una opción</option>
                                      <option value="infantil_3">Infantil 3 años</option>
                                      <option value="infantil_4">Infantil 4 años</option>
                                      <option value="infantil_5">Infantil 5 años</option>
                                      <option value="primaria_1">1º Ed. Primaria</option>
                                      <option value="primaria_2">2º Ed. Primaria</option>
                                      <option value="otro">Otro</option>
                                    </select>
                                  </div>
                                </div>
                              </div>

                              {/* Información Educativa */}
                              <div className="space-y-3 sm:space-y-4 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                  Información Educativa
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                                  <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="child-centro_escolar" className="text-xs sm:text-sm">Centro escolar</Label>
                                    <Input
                                      id="child-centro_escolar"
                                      name="centro_escolar"
                                      value={childForm.centro_escolar || ''}
                                      onChange={handleChildChange}
                                      className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Características Socioemocionales */}
                              <div className="space-y-3 sm:space-y-4 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                  Características Socioemocionales
                                </h4>
                                <div className="space-y-3 sm:space-y-4">
                                  <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="child-fortalezas" className="text-xs sm:text-sm">Fortalezas</Label>
                                    <Textarea
                                      id="child-fortalezas"
                                      name="fortalezas"
                                      value={childForm.fortalezas || ''}
                                      onChange={handleChildChange}
                                      className="border-2 border-gray-200 focus:border-braini-pink resize-none text-base sm:text-sm"
                                      rows={3}
                                      placeholder="Describe las fortalezas del niño/niña..."
                                    />
                                  </div>
                                  <div className="space-y-1.5 sm:space-y-2">
                                    <Label htmlFor="child-debilidades" className="text-xs sm:text-sm">Debilidades</Label>
                                    <Textarea
                                      id="child-debilidades"
                                      name="debilidades"
                                      value={childForm.debilidades || ''}
                                      onChange={handleChildChange}
                                      className="border-2 border-gray-200 focus:border-braini-pink resize-none text-base sm:text-sm"
                                      rows={3}
                                      placeholder="Describe las áreas de mejora..."
                                    />
                                  </div>
                                </div>
                              </div>
                            </form>
                          ) : (
                            <div className="space-y-3 sm:space-y-4">
                              {/* Información Personal */}
                              <div className="space-y-2 sm:space-y-3 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                  Información Personal
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                    <Baby className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Nombre</p>
                                      <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{child?.nombre || 'No especificado'}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                    <Baby className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Apellidos</p>
                                      <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{child?.apellidos || 'No especificado'}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                    <CreditCard className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">DNI</p>
                                      <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{child?.dni || 'No especificado'}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Género</p>
                                      <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{child?.genero || 'No especificado'}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Fecha de nacimiento</p>
                                      <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{child?.fecha_nacimiento || 'No especificado'}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Información Educativa */}
                              <div className="space-y-2 sm:space-y-3 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                                <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                  Información Educativa
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                    <School className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Centro escolar</p>
                                      <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{child?.centro_escolar || 'No especificado'}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                    <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink flex-shrink-0" />
                                    <div className="min-w-0 flex-1">
                                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Nivel educativo</p>
                                      <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">{child?.nivel_educativo || 'No especificado'}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Características Socioemocionales */}
                              {(child?.fortalezas || child?.debilidades) && (
                                <div className="space-y-2 sm:space-y-3 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                    Características Socioemocionales
                                  </h4>
                                  <div className="space-y-2 sm:space-y-3">
                                    {child?.fortalezas && (
                                      <div className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                        <Brain className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Fortalezas</p>
                                          <p className="font-semibold text-gray-800 text-xs sm:text-sm break-words">{child.fortalezas}</p>
                                        </div>
                                      </div>
                                    )}
                                    {child?.debilidades && (
                                      <div className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                        <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink mt-0.5 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Debilidades</p>
                                          <p className="font-semibold text-gray-800 text-xs sm:text-sm break-words">{child.debilidades}</p>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Baby className="w-8 h-8 text-gray-400" />
                            </div>
                            <p className="text-gray-500 font-medium">No hay datos de hijo/a registrados</p>
                            <p className="text-sm text-gray-400 mt-1">Los datos aparecerán aquí cuando se registren</p>
                          </div>
                        )}
                      </CardContent>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>

              {/* 3. Resultados de Tests */}
              <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0">
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl text-gray-800">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-braini-pink rounded-lg flex items-center justify-center flex-shrink-0">
                      <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    Resultados de Tests
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-center py-8 sm:py-12">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                      <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium text-sm sm:text-base">Próximamente</p>
                    <p className="text-xs sm:text-sm text-gray-400 mt-1">Los resultados de tus tests aparecerán aquí</p>
                  </div>
                </CardContent>
              </Card>

              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </Backgrounds>
  );
};

export default Profile;
