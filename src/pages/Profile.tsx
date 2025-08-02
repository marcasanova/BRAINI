import React, { useEffect, useState } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Baby, Edit3, Save, X, Calendar, Phone, MapPin, GraduationCap, Heart } from 'lucide-react';

const Profile = () => {
  const { toast } = useToast();
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

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      <Navbar />
      <div className="container mx-auto px-4 py-12 pt-20 relative z-10">
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
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={parentForm.email || ''}
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
                          <Input
                            id="relacion_con_menor"
                            name="relacion_con_menor"
                            value={parentForm.relacion_con_menor || ''}
                            onChange={handleParentChange}
                            className="border-2 border-gray-200 focus:border-braini-blue"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="direccion">Dirección</Label>
                        <Input
                          id="direccion"
                          name="direccion"
                          value={parentForm.direccion || ''}
                          onChange={handleParentChange}
                          className="border-2 border-gray-200 focus:border-braini-blue"
                        />
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
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-braini-blue" />
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Nombre</p>
                            <p className="font-semibold text-gray-800">{parent?.nombre}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-braini-blue" />
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Apellidos</p>
                            <p className="font-semibold text-gray-800">{parent?.apellidos}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <User className="w-5 h-5 text-braini-blue" />
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Email</p>
                            <p className="font-semibold text-gray-800">{parent?.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-braini-blue" />
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Fecha de nacimiento</p>
                            <p className="font-semibold text-gray-800">{parent?.fecha_nacimiento}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Phone className="w-5 h-5 text-braini-blue" />
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Teléfono</p>
                            <p className="font-semibold text-gray-800">{parent?.telefono_contacto}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Heart className="w-5 h-5 text-braini-blue" />
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Relación con el menor</p>
                            <p className="font-semibold text-gray-800">{parent?.relacion_con_menor}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-braini-blue" />
                        <div>
                          <p className="text-sm text-gray-500 font-medium">Dirección</p>
                          <p className="font-semibold text-gray-800">{parent?.direccion}</p>
                        </div>
                      </div>
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
                            <Input
                              id="child-genero"
                              name="genero"
                              value={childForm.genero || ''}
                              onChange={handleChildChange}
                              className="border-2 border-gray-200 focus:border-pink-400"
                            />
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
                          <Label htmlFor="child-caracteristicas">Características socioemocionales</Label>
                          <Textarea
                            id="child-caracteristicas"
                            name="caracteristicas_socioemocionales"
                            value={childForm.caracteristicas_socioemocionales || ''}
                            onChange={handleChildChange}
                            className="border-2 border-gray-200 focus:border-pink-400 resize-none"
                            rows={3}
                          />
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
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Baby className="w-5 h-5 text-pink-400" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Nombre</p>
                              <p className="font-semibold text-gray-800">{child?.nombre}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Baby className="w-5 h-5 text-pink-400" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Apellidos</p>
                              <p className="font-semibold text-gray-800">{child?.apellidos}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <User className="w-5 h-5 text-pink-400" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">DNI</p>
                              <p className="font-semibold text-gray-800">{child?.dni}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Heart className="w-5 h-5 text-pink-400" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Género</p>
                              <p className="font-semibold text-gray-800">{child?.genero}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Calendar className="w-5 h-5 text-pink-400" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Fecha de nacimiento</p>
                              <p className="font-semibold text-gray-800">{child?.fecha_nacimiento}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <GraduationCap className="w-5 h-5 text-pink-400" />
                            <div>
                              <p className="text-sm text-gray-500 font-medium">Centro escolar</p>
                              <p className="font-semibold text-gray-800">{child?.centro_escolar}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <GraduationCap className="w-5 h-5 text-pink-400" />
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Curso educativo</p>
                            <p className="font-semibold text-gray-800">{child?.curso_educativo}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <Heart className="w-5 h-5 text-pink-400 mt-1" />
                          <div>
                            <p className="text-sm text-gray-500 font-medium">Características socioemocionales</p>
                            <p className="font-semibold text-gray-800">{child?.caracteristicas_socioemocionales}</p>
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
        </div>
      </div>
    </div>
  );
};

export default Profile; 