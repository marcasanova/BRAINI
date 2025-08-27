import React, { useEffect, useState } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/navigation/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Baby, Edit3, Save, X, Calendar, Phone, MapPin, GraduationCap, Heart, Globe, Brain, Users, School, Flag, Languages, Home } from 'lucide-react';
import MedalShelf from '@/components/medals/MedalShelf';
import { useUserMedals } from '@/hooks/useUserMedals';

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
  const { userMedals, loading: medalsLoading } = useUserMedals();
  const [parent, setParent] = useState<any>(null);
  const [child, setChild] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editParent, setEditParent] = useState(false);
  const [editChild, setEditChild] = useState(false);
  const [parentForm, setParentForm] = useState<any>({});
  const [childForm, setChildForm] = useState<any>({});

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
        toast({ title: 'Error', description: err.message, variant: 'destructive' });
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
      toast({ title: 'Datos actualizados', description: 'Tu perfil ha sido actualizado.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
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
      toast({ title: 'Datos actualizados', description: 'Datos del hijo/a actualizados.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener el label de una expectativa
  const getExpectativaLabel = (value: string) => {
    const expectativa = EXPECTATIVAS_PROGRAMA.find(exp => exp.value === value);
    return expectativa ? expectativa.label : value;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      <Navbar />
      <div className="container mx-auto px-4 py-12 md:pl-80 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-braini-blue to-braini-blue-light rounded-full flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              <span className="text-braini-blue">Mi Perfil</span>
            </h1>
            {parent?.nombre && (
              <p className="text-xl text-gray-600">
                Hola, <span className="font-semibold text-braini-blue">{parent.nombre}</span> 👋
              </p>
            )}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2 text-gray-500">
                <div className="w-6 h-6 border-2 border-braini-blue border-t-transparent rounded-full animate-spin"></div>
                Cargando datos...
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Parent Card */}
              <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-braini-blue to-braini-blue-light rounded-lg flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      Datos del usuario
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditParent(!editParent)}
                      className="border-braini-blue text-braini-blue hover:bg-braini-blue hover:text-white"
                    >
                      {editParent ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                      {editParent ? 'Cancelar' : 'Editar'}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {editParent ? (
                    <form className="space-y-4" onSubmit={e => { e.preventDefault(); saveParent(); }}>
                      {/* Información Personal */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Users className="w-4 h-4 text-braini-blue" />
                          Información Personal
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nombre">Nombre</Label>
                            <Input
                              id="nombre"
                              name="nombre"
                              value={parentForm.nombre || ''}
                              onChange={handleParentChange}
                              className="border-2 border-gray-200 focus:border-braini-blue"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="apellidos">Apellidos</Label>
                            <Input
                              id="apellidos"
                              name="apellidos"
                              value={parentForm.apellidos || ''}
                              onChange={handleParentChange}
                              className="border-2 border-gray-200 focus:border-braini-blue"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="dni">DNI</Label>
                            <Input
                              id="dni"
                              name="dni"
                              value={parentForm.dni || ''}
                              onChange={handleParentChange}
                              className="border-2 border-gray-200 focus:border-braini-blue"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="fecha_nacimiento">Fecha de nacimiento</Label>
                            <Input
                              id="fecha_nacimiento"
                              name="fecha_nacimiento"
                              type="date"
                              value={parentForm.fecha_nacimiento || ''}
                              onChange={handleParentChange}
                              className="border-2 border-gray-200 focus:border-braini-blue"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="genero">Género</Label>
                            <select
                              id="genero"
                              name="genero"
                              value={parentForm.genero || ''}
                              onChange={handleParentChange}
                              className="w-full border-2 border-gray-200 rounded-md p-2 focus:border-braini-blue"
                            >
                              <option value="">Selecciona una opción</option>
                              <option value="hombre">Hombre</option>
                              <option value="mujer">Mujer</option>
                              <option value="otro">Otro</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="telefono_contacto">Teléfono</Label>
                            <Input
                              id="telefono_contacto"
                              name="telefono_contacto"
                              value={parentForm.telefono_contacto || ''}
                              onChange={handleParentChange}
                              className="border-2 border-gray-200 focus:border-braini-blue"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="relacion_con_menor">Relación con el menor</Label>
                            <select
                              id="relacion_con_menor"
                              name="relacion_con_menor"
                              value={parentForm.relacion_con_menor || ''}
                              onChange={handleParentChange}
                              className="w-full border-2 border-gray-200 rounded-md p-2 focus:border-braini-blue"
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
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-braini-blue" />
                          Ubicación
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="pais_origen">País de origen</Label>
                            <Input
                              id="pais_origen"
                              name="pais_origen"
                              value={parentForm.pais_origen || ''}
                              onChange={handleParentChange}
                              className="border-2 border-gray-200 focus:border-braini-blue"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="ciudad_origen">Ciudad de origen</Label>
                            <Input
                              id="ciudad_origen"
                              name="ciudad_origen"
                              value={parentForm.ciudad_origen || ''}
                              onChange={handleParentChange}
                              className="border-2 border-gray-200 focus:border-braini-blue"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="codigo_postal">Código postal</Label>
                            <Input
                              id="codigo_postal"
                              name="codigo_postal"
                              value={parentForm.codigo_postal || ''}
                              onChange={handleParentChange}
                              className="border-2 border-gray-200 focus:border-braini-blue"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Información Educativa y Cultural */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Brain className="w-4 h-4 text-braini-blue" />
                          Información Educativa y Cultural
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="nivel_educativo">Nivel educativo</Label>
                            <select
                              id="nivel_educativo"
                              name="nivel_educativo"
                              value={parentForm.nivel_educativo || ''}
                              onChange={handleParentChange}
                              className="w-full border-2 border-gray-200 rounded-md p-2 focus:border-braini-blue"
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
                          <div className="space-y-2">
                            <Label htmlFor="idioma_casa">Idioma que se habla en casa</Label>
                            <Input
                              id="idioma_casa"
                              name="idioma_casa"
                              value={parentForm.idioma_casa || ''}
                              onChange={handleParentChange}
                              className="border-2 border-gray-200 focus:border-braini-blue"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="estilo_crianza">Estilo de crianza percibido</Label>
                            <select
                              id="estilo_crianza"
                              name="estilo_crianza"
                              value={parentForm.estilo_crianza || ''}
                              onChange={handleParentChange}
                              className="w-full border-2 border-gray-200 rounded-md p-2 focus:border-braini-blue"
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

                      <div className="flex justify-end pt-4">
                        <Button
                          type="submit"
                          className="bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Guardar cambios
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      {/* Información Personal */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Users className="w-4 h-4 text-braini-blue" />
                          Información Personal
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-braini-blue" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Nombre</p>
                              <p className="font-semibold text-gray-800">{parent?.nombre || 'No especificado'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-braini-blue" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Apellidos</p>
                              <p className="font-semibold text-gray-800">{parent?.apellidos || 'No especificado'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-braini-blue" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">DNI</p>
                              <p className="font-semibold text-gray-800">{parent?.dni || 'No especificado'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-braini-blue" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Fecha de nacimiento</p>
                              <p className="font-semibold text-gray-800">{parent?.fecha_nacimiento || 'No especificado'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Heart className="w-5 h-5 text-braini-blue" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Género</p>
                              <p className="font-semibold text-gray-800">{parent?.genero || 'No especificado'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Phone className="w-5 h-5 text-braini-blue" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Teléfono</p>
                              <p className="font-semibold text-gray-800">{parent?.telefono_contacto || 'No especificado'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Heart className="w-5 h-5 text-braini-blue" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Relación con el menor</p>
                              <p className="font-semibold text-gray-800">{parent?.relacion_con_menor || 'No especificado'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Ubicación */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-braini-blue" />
                          Ubicación
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Flag className="w-5 h-5 text-braini-blue" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">País de origen</p>
                              <p className="font-semibold text-gray-800">{parent?.pais_origen || 'No especificado'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-braini-blue" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Ciudad de origen</p>
                              <p className="font-semibold text-gray-800">{parent?.ciudad_origen || 'No especificado'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <MapPin className="w-5 h-5 text-braini-blue" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Código postal</p>
                              <p className="font-semibold text-gray-800">{parent?.codigo_postal || 'No especificado'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Información Educativa y Cultural */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                          <Brain className="w-4 h-4 text-braini-blue" />
                          Información Educativa y Cultural
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-braini-blue" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Nivel educativo</p>
                              <p className="font-semibold text-gray-800">{parent?.nivel_educativo || 'No especificado'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Languages className="w-5 h-5 text-braini-blue" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Idioma que se habla en casa</p>
                              <p className="font-semibold text-gray-800">{parent?.idioma_casa || 'No especificado'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Heart className="w-5 h-5 text-braini-blue" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Estilo de crianza percibido</p>
                              <p className="font-semibold text-gray-800">{parent?.estilo_crianza || 'No especificado'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Expectativas del Programa */}
                      {parent?.expectativas_programa && parent.expectativas_programa.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-braini-blue" />
                            Expectativas del Programa
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {parent.expectativas_programa.map((expectativa: string, index: number) => (
                              <div key={index} className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                                <Heart className="w-4 h-4 text-braini-blue" />
                                <span className="text-sm font-medium text-gray-700">
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
              </Card>

              {/* Child Card */}
              <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
                      <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg flex items-center justify-center">
                        <Baby className="w-5 h-5 text-white" />
                      </div>
                      Datos del hijo/a
                    </CardTitle>
                    {child && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditChild(!editChild)}
                        className="border-pink-400 text-pink-400 hover:bg-pink-400 hover:text-white"
                      >
                        {editChild ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        {editChild ? 'Cancelar' : 'Editar'}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {child ? (
                    editChild ? (
                      <form className="space-y-4" onSubmit={e => { e.preventDefault(); saveChild(); }}>
                        {/* Información Personal */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Baby className="w-4 h-4 text-pink-400" />
                            Información Personal
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="child-nombre">Nombre</Label>
                              <Input
                                id="child-nombre"
                                name="nombre"
                                value={childForm.nombre || ''}
                                onChange={handleChildChange}
                                className="border-2 border-gray-200 focus:border-pink-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="child-apellidos">Apellidos</Label>
                              <Input
                                id="child-apellidos"
                                name="apellidos"
                                value={childForm.apellidos || ''}
                                onChange={handleChildChange}
                                className="border-2 border-gray-200 focus:border-pink-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="child-dni">DNI</Label>
                              <Input
                                id="child-dni"
                                name="dni"
                                value={childForm.dni || ''}
                                onChange={handleChildChange}
                                className="border-2 border-gray-200 focus:border-pink-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="child-genero">Género</Label>
                              <select
                                id="child-genero"
                                name="genero"
                                value={childForm.genero || ''}
                                onChange={handleChildChange}
                                className="w-full border-2 border-gray-200 rounded-md p-2 focus:border-pink-400"
                              >
                                <option value="">Selecciona una opción</option>
                                <option value="niño">Niño</option>
                                <option value="niña">Niña</option>
                                <option value="prefiero_no_decirlo">Prefiero no decirlo</option>
                              </select>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="child-fecha_nacimiento">Fecha de nacimiento</Label>
                              <Input
                                id="child-fecha_nacimiento"
                                name="fecha_nacimiento"
                                type="date"
                                value={childForm.fecha_nacimiento || ''}
                                onChange={handleChildChange}
                                className="border-2 border-gray-200 focus:border-pink-400"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Información Educativa */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                            <School className="w-4 h-4 text-pink-400" />
                            Información Educativa
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="child-centro_escolar">Centro escolar</Label>
                              <Input
                                id="child-centro_escolar"
                                name="centro_escolar"
                                value={childForm.centro_escolar || ''}
                                onChange={handleChildChange}
                                className="border-2 border-gray-200 focus:border-pink-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="child-curso_educativo">Curso educativo</Label>
                              <Input
                                id="child-curso_educativo"
                                name="curso_educativo"
                                value={childForm.curso_educativo || ''}
                                onChange={handleChildChange}
                                className="border-2 border-gray-200 focus:border-pink-400"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="child-nivel_educativo">Nivel educativo</Label>
                              <select
                                id="child-nivel_educativo"
                                name="nivel_educativo"
                                value={childForm.nivel_educativo || ''}
                                onChange={handleChildChange}
                                className="w-full border-2 border-gray-200 rounded-md p-2 focus:border-pink-400"
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

                        {/* Características Socioemocionales */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-pink-400" />
                            Características Socioemocionales
                          </h4>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="child-fortalezas">Fortalezas</Label>
                              <Textarea
                                id="child-fortalezas"
                                name="fortalezas"
                                value={childForm.fortalezas || ''}
                                onChange={handleChildChange}
                                className="border-2 border-gray-200 focus:border-pink-400 resize-none"
                                rows={3}
                                placeholder="Describe las fortalezas del niño/niña..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="child-debilidades">Debilidades</Label>
                              <Textarea
                                id="child-debilidades"
                                name="debilidades"
                                value={childForm.debilidades || ''}
                                onChange={handleChildChange}
                                className="border-2 border-gray-200 focus:border-pink-400 resize-none"
                                rows={3}
                                placeholder="Describe las áreas de mejora..."
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="child-caracteristicas">Características socioemocionales</Label>
                              <Textarea
                                id="child-caracteristicas"
                                name="caracteristicas_socioemocionales"
                                value={childForm.caracteristicas_socioemocionales || ''}
                                onChange={handleChildChange}
                                className="border-2 border-gray-200 focus:border-pink-400 resize-none"
                                rows={3}
                                placeholder="Describe las características socioemocionales..."
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end pt-4">
                          <Button
                            type="submit"
                            className="bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Guardar cambios
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        {/* Información Personal */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Baby className="w-4 h-4 text-pink-400" />
                            Información Personal
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Baby className="w-5 h-5 text-pink-400" />
                              <div>
                                <p className="text-sm text-gray-500 font-medium">Nombre</p>
                                <p className="font-semibold text-gray-800">{child?.nombre || 'No especificado'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Baby className="w-5 h-5 text-pink-400" />
                              <div>
                                <p className="text-sm text-gray-500 font-medium">Apellidos</p>
                                <p className="font-semibold text-gray-800">{child?.apellidos || 'No especificado'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <User className="w-5 h-5 text-pink-400" />
                              <div>
                                <p className="text-sm text-gray-500 font-medium">DNI</p>
                                <p className="font-semibold text-gray-800">{child?.dni || 'No especificado'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Heart className="w-5 h-5 text-pink-400" />
                              <div>
                                <p className="text-sm text-gray-500 font-medium">Género</p>
                                <p className="font-semibold text-gray-800">{child?.genero || 'No especificado'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <Calendar className="w-5 h-5 text-pink-400" />
                              <div>
                                <p className="text-sm text-gray-500 font-medium">Fecha de nacimiento</p>
                                <p className="font-semibold text-gray-800">{child?.fecha_nacimiento || 'No especificado'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Información Educativa */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                            <School className="w-4 h-4 text-pink-400" />
                            Información Educativa
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <GraduationCap className="w-5 h-5 text-pink-400" />
                              <div>
                                <p className="text-sm text-gray-500 font-medium">Centro escolar</p>
                                <p className="font-semibold text-gray-800">{child?.centro_escolar || 'No especificado'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <GraduationCap className="w-5 h-5 text-pink-400" />
                              <div>
                                <p className="text-sm text-gray-500 font-medium">Curso educativo</p>
                                <p className="font-semibold text-gray-800">{child?.curso_educativo || 'No especificado'}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <GraduationCap className="w-5 h-5 text-pink-400" />
                              <div>
                                <p className="text-sm text-gray-500 font-medium">Nivel educativo</p>
                                <p className="font-semibold text-gray-800">{child?.nivel_educativo || 'No especificado'}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Características Socioemocionales */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                            <Heart className="w-4 h-4 text-pink-400" />
                            Características Socioemocionales
                          </h4>
                          <div className="space-y-4">
                            {child?.fortalezas && (
                              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <Brain className="w-5 h-5 text-pink-400 mt-1" />
                                <div>
                                  <p className="text-sm text-gray-500 font-medium">Fortalezas</p>
                                  <p className="font-semibold text-gray-800">{child.fortalezas}</p>
                                </div>
                              </div>
                            )}
                            {child?.debilidades && (
                              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <Heart className="w-5 h-5 text-pink-400 mt-1" />
                                <div>
                                  <p className="text-sm text-gray-500 font-medium">Debilidades</p>
                                  <p className="font-semibold text-gray-800">{child.debilidades}</p>
                                </div>
                              </div>
                            )}
                            {child?.caracteristicas_socioemocionales && (
                              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <Heart className="w-5 h-5 text-pink-400 mt-1" />
                                <div>
                                  <p className="text-sm text-gray-500 font-medium">Características socioemocionales</p>
                                  <p className="font-semibold text-gray-800">{child.caracteristicas_socioemocionales}</p>
                                </div>
                              </div>
                            )}
                            {!child?.fortalezas && !child?.debilidades && !child?.caracteristicas_socioemocionales && (
                              <div className="text-center py-4 text-gray-500">
                                <p className="text-sm">No hay características socioemocionales registradas</p>
                              </div>
                            )}
                          </div>
                        </div>
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
              </Card>
            </div>
          )}

          {/* Sección de Medallas */}
          <div className="mt-12">
            <MedalShelf 
              userMedals={userMedals} 
              isLoading={medalsLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 