import React, { useEffect, useMemo, useState } from 'react';
import Backgrounds from '@/shared/components/Backgrounds';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Accordion, AccordionContent, AccordionItem } from '@/shared/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/ui/dialog';
import {
  CHILD_AVATARS,
  childAvatarSrc,
  isChildAvatarId,
} from '@/products/brainifamily/lib/childAvatars';
import { sortChildrenByName } from '@/products/brainifamily/lib/sortChildrenByName';
import {
  fetchFamilyChildProgress,
  type ChildProgressStats,
} from '@/integrations/supabase/queries/profile-progress';
import ProfileChildStats from '@/products/brainifamily/pages/auth/ProfileChildStats';
import {
  User,
  Baby,
  Edit3,
  Save,
  X,
  Phone,
  Heart,
  Brain,
  Users,
  School,
  GraduationCap,
  Eye,
} from 'lucide-react';

type ParentProfile = {
  id: string;
  nombre?: string | null;
  apellidos?: string | null;
  telefono_contacto?: string | null;
  relacion_con_menor?: string | null;
};

type ChildProfileRow = {
  id: string;
  nombre?: string | null;
  apellidos?: string | null;
  genero?: string | null;
  fecha_nacimiento?: string | null;
  school_name?: string | null;
  nivel_educativo?: string | null;
  avatar_id?: string | null;
  schools?: { name?: string | null } | { name?: string | null }[] | null;
};

const RELACION_LABELS: Record<string, string> = {
  madre: 'Madre',
  padre: 'Padre',
  abuelo_a: 'Abuelo/a',
  tutor_a: 'Tutor/a',
  otro: 'Otro',
};

const NIVEL_LABELS: Record<string, string> = {
  infantil_3: 'Infantil 3 años',
  infantil_4: 'Infantil 4 años',
  infantil_5: 'Infantil 5 años',
  primaria_1: '1º Primaria',
  primaria_2: '2º Primaria',
  primaria_3: '3º Primaria',
  primaria_4: '4º Primaria',
  primaria_5: '5º Primaria',
  primaria_6: '6º Primaria',
};

function errorText(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const message = (err as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }
  return fallback;
}

function relacionLabel(value: string | null | undefined): string {
  if (!value) return 'No especificado';
  return RELACION_LABELS[value] ?? value;
}

function nivelLabel(value: string | null | undefined): string {
  if (!value) return 'Asignado por la clase';
  return NIVEL_LABELS[value] ?? value;
}

function parentSubtitle(parent: ParentProfile | null): string {
  if (!parent) return '';
  const name = [parent.nombre, parent.apellidos].filter(Boolean).join(' ');
  const relacion = parent.relacion_con_menor ? relacionLabel(parent.relacion_con_menor) : '';
  return [name, relacion].filter(Boolean).join(' · ');
}

function childSubtitle(child: ChildProfileRow): string {
  const school = child.school_name;
  const nivel = child.nivel_educativo ? nivelLabel(child.nivel_educativo) : null;
  return [school, nivel].filter(Boolean).join(' · ');
}

function ChildFace({ avatarId, alt }: { avatarId?: string | null; alt: string }) {
  if (isChildAvatarId(avatarId)) {
    return (
      <img
        src={childAvatarSrc(avatarId)}
        alt={alt}
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-contain bg-white shrink-0 border border-braini-pink/20"
      />
    );
  }
  return (
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-braini-pink rounded-full flex items-center justify-center shrink-0">
      <Baby className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
    </div>
  );
}

function emptyChildProgress(): ChildProgressStats {
  return {
    medalsEarned: 0,
    medalsTotal: 0,
    activitiesRated: 0,
    diaryDays: 0,
    currentMissionTitle: null,
    currentMissionCount: 0,
  };
}

function sumHouseholdProgress(byChild: Record<string, ChildProgressStats>): ChildProgressStats {
  const acc = emptyChildProgress();
  for (const stats of Object.values(byChild)) {
    acc.medalsEarned += stats.medalsEarned;
    acc.medalsTotal = stats.medalsTotal;
    acc.activitiesRated += stats.activitiesRated;
    acc.diaryDays += stats.diaryDays;
    acc.currentMissionCount += stats.currentMissionCount;
  }
  return acc;
}

function hasChanges(original: object | null, current: object | null, keys: string[]): boolean {
  if (!original || !current) return false;
  const originalRecord = original as Record<string, unknown>;
  const currentRecord = current as Record<string, unknown>;
  return keys.some((key) => (originalRecord[key] ?? '') !== (currentRecord[key] ?? ''));
}

const Profile = () => {
  const { toast } = useToast();
  const [parent, setParent] = useState<ParentProfile | null>(null);
  const [children, setChildren] = useState<ChildProfileRow[]>([]);
  const [child, setChild] = useState<ChildProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [editParent, setEditParent] = useState(false);
  const [editChild, setEditChild] = useState(false);
  const [parentForm, setParentForm] = useState<Partial<ParentProfile>>({});
  const [childForm, setChildForm] = useState<Partial<ChildProfileRow>>({});
  const [accordionValue, setAccordionValue] = useState<string>('');
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [savingChild, setSavingChild] = useState(false);
  const [progressByChild, setProgressByChild] = useState<Record<string, ChildProgressStats>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) throw new Error('No autenticado');
        const { data: parentData, error: parentError } = await supabase
          .from('parents')
          .select('id, nombre, apellidos, telefono_contacto, relacion_con_menor')
          .eq('id', user.id)
          .single();
        if (parentError) throw parentError;
        setParent(parentData);
        setParentForm(parentData);
        const { data: childrenData, error: childrenError } = await supabase
          .from('children')
          .select('*, schools ( name )')
          .eq('parent_id', user.id)
          .order('nombre', { ascending: true })
          .order('apellidos', { ascending: true });
        if (childrenError) throw childrenError;
        const childrenWithSchool = (childrenData ?? []).map((row: ChildProfileRow) => {
          const school = Array.isArray(row.schools) ? row.schools[0] : row.schools;
          return { ...row, school_name: school?.name ?? null };
        });
        setChildren(sortChildrenByName(childrenWithSchool));
        setChild(null);
        setChildForm({});
        setEditChild(false);
        const ids = childrenWithSchool.map((row) => row.id);
        try {
          setProgressByChild(ids.length > 0 ? await fetchFamilyChildProgress(ids) : {});
        } catch (progressErr: unknown) {
          setProgressByChild({});
          toast({
            title: 'No se pudo cargar el progreso',
            description: errorText(
              progressErr,
              'Los perfiles se han cargado, pero las métricas de misiones y diario no están disponibles ahora.',
            ),
            variant: 'destructive',
          });
        }
      } catch (err: unknown) {
        toast({
          title: '❌ Error al cargar los datos',
          description: errorText(err, 'No se pudieron cargar los datos del perfil. Por favor, recarga la página.'),
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleParentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setParentForm({ ...parentForm, [e.target.name]: e.target.value });
  };

  const handleChildChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setChildForm({ ...childForm, [e.target.name]: e.target.value });
  };

  const saveParent = async () => {
    if (!parent?.id) return;
    try {
      setLoading(true);
      const parentUpdatePayload = {
        nombre: parentForm.nombre ?? null,
        apellidos: parentForm.apellidos ?? null,
        telefono_contacto: parentForm.telefono_contacto ?? null,
        relacion_con_menor: parentForm.relacion_con_menor ?? null,
      };
      const { error } = await supabase.from('parents').update(parentUpdatePayload).eq('id', parent.id);
      if (error) throw error;
      setParent((prev) => (prev ? { ...prev, ...parentUpdatePayload } : prev));
      setEditParent(false);
      toast({
        title: '✅ Perfil actualizado correctamente',
        description: 'Los cambios en tu perfil han sido guardados exitosamente.',
      });
    } catch (err: unknown) {
      toast({
        title: '❌ Error al actualizar el perfil',
        description: errorText(err, 'No se pudieron guardar los cambios. Por favor, inténtalo de nuevo.'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveChild = async () => {
    if (!child?.id) return;
    try {
      setSavingChild(true);
      const childUpdatePayload = {
        nombre: childForm.nombre ?? null,
        apellidos: childForm.apellidos ?? null,
        genero: childForm.genero || null,
        avatar_id: isChildAvatarId(childForm.avatar_id) ? childForm.avatar_id : null,
      };
      const { error } = await supabase.from('children').update(childUpdatePayload).eq('id', child.id);
      if (error) throw error;
      setChild((prev) => (prev ? { ...prev, ...childUpdatePayload } : prev));
      setChildren((prev) =>
        sortChildrenByName(
          prev.map((ch) => (ch.id === child.id ? { ...ch, ...childUpdatePayload } : ch)),
        ),
      );
      setEditChild(false);
      setAccordionValue('');
      setAvatarPickerOpen(false);
      toast({
        title: '✅ Datos del menor actualizados',
        description: 'La información del menor ha sido guardada correctamente.',
      });
    } catch (err: unknown) {
      toast({
        title: '❌ Error al actualizar los datos del menor',
        description: errorText(err, 'No se pudieron guardar los cambios. Por favor, inténtalo de nuevo.'),
        variant: 'destructive',
      });
    } finally {
      setSavingChild(false);
    }
  };

  const householdProgress = useMemo(
    () => sumHouseholdProgress(progressByChild),
    [progressByChild],
  );

  const hasParentChanges = useMemo(() => {
    if (!editParent || !parent) return false;
    return hasChanges(parent, parentForm, [
      'nombre',
      'apellidos',
      'telefono_contacto',
      'relacion_con_menor',
    ]);
  }, [editParent, parent, parentForm]);

  const hasChildChanges = useMemo(() => {
    if (!editChild || !child) return false;
    return hasChanges(child, childForm, [
      'nombre',
      'apellidos',
      'genero',
      'avatar_id',
    ]);
  }, [editChild, child, childForm]);

  return (
    <Backgrounds wrapWithCard={true} customColor="#f5827b" showCircles={true}>
            <div className="mb-4 sm:mb-5 md:mb-6 animate-fade-in shrink-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-1 sm:mb-2" style={{ fontWeight: 900 }}>
                Mi familia
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/90 font-medium">
                Tus datos y los de tus hijos e hijas.
              </p>
            </div>

            <div>
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center gap-2 text-gray-500">
                    <div className="w-6 h-6 border-2 border-braini-pink border-t-transparent rounded-full animate-spin"></div>
                    Cargando datos...
                  </div>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-5 md:space-y-6 pb-20 md:pb-4">
                  <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
                    <Card className={`bg-white/95 backdrop-blur-lg shadow-xl border-0 ${children.length >= 2 ? 'lg:col-span-5' : 'lg:col-span-12'}`}>
                      <CardHeader className="pb-3 sm:pb-4">
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-braini-pink rounded-lg flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="min-w-0">
                              <CardTitle className="text-base sm:text-lg md:text-xl text-gray-800">
                                Tu perfil
                              </CardTitle>
                              <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5 truncate">
                                {parentSubtitle(parent) || 'Completa tus datos'}
                              </p>
                              {editParent && (
                                <p className="text-[10px] sm:text-xs text-braini-pink font-medium mt-0.5 flex items-center gap-1">
                                  <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                  Modo edición
                                </p>
                              )}
                            </div>
                          </div>
                          {!editParent ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditParent(true);
                                setParentForm(parent ?? {});
                              }}
                              className="border-braini-pink text-braini-pink hover:bg-braini-pink hover:text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 w-full"
                            >
                              <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Editar
                            </Button>
                          ) : (
                            <div className="flex gap-1.5 sm:gap-2 w-full">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditParent(false);
                                  setParentForm(parent ?? {});
                                }}
                                className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1"
                              >
                                <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                Cancelar
                              </Button>
                              <Button
                                size="sm"
                                onClick={(e) => {
                                  e.preventDefault();
                                  void saveParent();
                                }}
                                disabled={!hasParentChanges || loading}
                                className="bg-braini-pink hover:bg-braini-pink-dark text-white font-semibold text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                Guardar
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        {editParent ? (
                          <form
                            className="space-y-3 sm:space-y-4"
                            onSubmit={(e) => {
                              e.preventDefault();
                              void saveParent();
                            }}
                          >
                            <div className="space-y-3 sm:space-y-4 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                              <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Datos personales</h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="nombre" className="text-xs sm:text-sm">
                                    Nombre
                                  </Label>
                                  <Input
                                    id="nombre"
                                    name="nombre"
                                    value={parentForm.nombre || ''}
                                    onChange={handleParentChange}
                                    className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                  />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="apellidos" className="text-xs sm:text-sm">
                                    Apellidos
                                  </Label>
                                  <Input
                                    id="apellidos"
                                    name="apellidos"
                                    value={parentForm.apellidos || ''}
                                    onChange={handleParentChange}
                                    className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                  />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="telefono_contacto" className="text-xs sm:text-sm">
                                    Teléfono
                                  </Label>
                                  <Input
                                    id="telefono_contacto"
                                    name="telefono_contacto"
                                    value={parentForm.telefono_contacto || ''}
                                    onChange={handleParentChange}
                                    className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                  />
                                </div>
                                <div className="space-y-1.5 sm:space-y-2">
                                  <Label htmlFor="relacion_con_menor" className="text-xs sm:text-sm">
                                    Relación con el menor
                                  </Label>
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
                                    <option value="abuelo_a">Abuelo/a</option>
                                    <option value="tutor_a">Tutor/a</option>
                                    <option value="otro">Otro</option>
                                  </select>
                                </div>
                              </div>
                            </div>
                          </form>
                        ) : (
                          <div className="space-y-2 sm:space-y-3 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Datos personales</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Nombre</p>
                                  <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                                    {parent?.nombre || 'No especificado'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Apellidos</p>
                                  <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                                    {parent?.apellidos || 'No especificado'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Teléfono</p>
                                  <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                                    {parent?.telefono_contacto || 'No especificado'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Relación con el menor</p>
                                  <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                                    {relacionLabel(parent?.relacion_con_menor)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {children.length >= 2 && (
                      <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 lg:col-span-7 h-full">
                        <CardHeader className="pb-2 sm:pb-3">
                          <CardTitle className="text-base sm:text-lg text-gray-800">
                            Progreso del hogar
                          </CardTitle>
                          <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                            Suma de misiones, actividades y diario de todos tus hijos
                          </p>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <ProfileChildStats
                            variant="household"
                            stats={householdProgress}
                            childrenCount={children.length}
                          />
                        </CardContent>
                      </Card>
                    )}
                  </section>

                  <section className="space-y-3 sm:space-y-4">
                      <h2 className="text-lg sm:text-xl font-bold text-white" style={{ fontWeight: 800 }}>
                        Hijos e hijas
                      </h2>
                      {children.length === 0 ? (
                        <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0">
                          <CardContent className="py-12">
                            <div className="text-center">
                              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Baby className="w-8 h-8 text-gray-400" />
                              </div>
                              <p className="text-gray-500 font-medium">No hay hijos o hijas registrados</p>
                              <p className="text-sm text-gray-400 mt-1">
                                Aparecerán aquí cuando el centro los vincule a tu cuenta
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {children.map((c) => {
                          const childAccordionValue = 'child-info-' + c.id;
                          const isEditingThis = editChild && child?.id === c.id;
                          const displayChild = isEditingThis ? { ...c, ...child, ...childForm } : c;
                          const shownAvatarId = displayChild?.avatar_id ?? c.avatar_id;
                          return (
                            <Card key={c.id} className="bg-white/95 backdrop-blur-lg shadow-xl border-0">
                              <CardHeader className="pb-3 sm:pb-4">
                                <div className="flex flex-col gap-3">
                                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                                    <ChildFace
                                      avatarId={shownAvatarId}
                                      alt={displayChild?.nombre ? `Personaje de ${displayChild.nombre}` : 'Personaje'}
                                    />
                                    <div className="min-w-0">
                                      <CardTitle className="text-base sm:text-lg md:text-xl text-gray-800">
                                        Perfil de {displayChild?.nombre ? displayChild.nombre : 'hijo/a'}
                                      </CardTitle>
                                      <p className="text-[10px] sm:text-xs text-gray-500 font-medium mt-0.5 truncate">
                                        {childSubtitle(displayChild ?? c) || 'Colegio asignado por la clase'}
                                      </p>
                                      {isEditingThis && (
                                        <p className="text-[10px] sm:text-xs text-braini-pink font-medium mt-0.5 flex items-center gap-1">
                                          <Edit3 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                          Modo edición
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <ProfileChildStats stats={progressByChild[c.id] ?? emptyChildProgress()} />
                                  {isEditingThis && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setAvatarPickerOpen(true)}
                                      className="border-braini-pink text-braini-pink hover:bg-braini-pink hover:text-white text-xs sm:text-sm w-full"
                                    >
                                      Cambiar personaje
                                    </Button>
                                  )}
                                  {!isEditingThis ? (
                                    <div className="flex gap-1.5 sm:gap-2 w-full">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          setAccordionValue(
                                            accordionValue === childAccordionValue ? '' : childAccordionValue,
                                          )
                                        }
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1"
                                      >
                                        <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        {accordionValue === childAccordionValue ? 'Ocultar' : 'Ver'}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setChild(c);
                                          setChildForm({ ...c });
                                          setEditChild(true);
                                          setAccordionValue(childAccordionValue);
                                        }}
                                        className="border-braini-pink text-braini-pink hover:bg-braini-pink hover:text-white text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1"
                                      >
                                        <Edit3 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        Editar
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="flex gap-1.5 sm:gap-2 w-full">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                          setEditChild(false);
                                          setChild(null);
                                          setChildForm({});
                                          setAccordionValue('');
                                          setAvatarPickerOpen(false);
                                        }}
                                        className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1"
                                      >
                                        <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        Cancelar
                                      </Button>
                                      <Button
                                        size="sm"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          void saveChild();
                                        }}
                                        disabled={!hasChildChanges || loading || savingChild}
                                        className="bg-braini-pink hover:bg-braini-pink-dark text-white font-semibold text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                        <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                                        Guardar
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </CardHeader>
                              <Accordion
                                type="single"
                                collapsible
                                value={accordionValue}
                                onValueChange={setAccordionValue}
                                className="w-full"
                              >
                                <AccordionItem value={childAccordionValue} className="border-none">
                                  <AccordionContent>
                                    <CardContent className="pt-0">
                                      {isEditingThis ? (
                                        <form
                                          className="space-y-3 sm:space-y-4"
                                          onSubmit={(e) => {
                                            e.preventDefault();
                                            void saveChild();
                                          }}
                                        >
                                          <div className="space-y-3 sm:space-y-4 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                              Datos personales
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                              <div className="space-y-1.5 sm:space-y-2">
                                                <Label htmlFor={`child-nombre-${c.id}`} className="text-xs sm:text-sm">
                                                  Nombre
                                                </Label>
                                                <Input
                                                  id={`child-nombre-${c.id}`}
                                                  name="nombre"
                                                  value={childForm.nombre || ''}
                                                  onChange={handleChildChange}
                                                  className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                                />
                                              </div>
                                              <div className="space-y-1.5 sm:space-y-2">
                                                <Label htmlFor={`child-apellidos-${c.id}`} className="text-xs sm:text-sm">
                                                  Apellidos
                                                </Label>
                                                <Input
                                                  id={`child-apellidos-${c.id}`}
                                                  name="apellidos"
                                                  value={childForm.apellidos || ''}
                                                  onChange={handleChildChange}
                                                  className="border-2 border-gray-200 focus:border-braini-pink text-base sm:text-sm py-2 sm:py-2.5"
                                                />
                                              </div>
                                              <div className="space-y-1.5 sm:space-y-2">
                                                <Label htmlFor={`child-genero-${c.id}`} className="text-xs sm:text-sm">
                                                  Género
                                                </Label>
                                                <select
                                                  id={`child-genero-${c.id}`}
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
                                            </div>
                                          </div>
                                          <div className="space-y-3 sm:space-y-4 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Colegio</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                              <div className="space-y-1.5 sm:space-y-2">
                                                <Label htmlFor={`child-centro-${c.id}`} className="text-xs sm:text-sm">
                                                  Centro escolar
                                                </Label>
                                                <Input
                                                  id={`child-centro-${c.id}`}
                                                  value={childForm.school_name || 'Asignado por la clase'}
                                                  disabled
                                                  className="border-2 border-gray-200 bg-gray-50 text-base sm:text-sm py-2 sm:py-2.5"
                                                />
                                              </div>
                                              <div className="space-y-1.5 sm:space-y-2">
                                                <Label htmlFor={`child-nivel-${c.id}`} className="text-xs sm:text-sm">
                                                  Nivel educativo
                                                </Label>
                                                <Input
                                                  id={`child-nivel-${c.id}`}
                                                  value={nivelLabel(childForm.nivel_educativo)}
                                                  disabled
                                                  className="border-2 border-gray-200 bg-gray-50 text-base sm:text-sm py-2 sm:py-2.5"
                                                />
                                              </div>
                                            </div>
                                          </div>
                                        </form>
                                      ) : (
                                        <div className="space-y-3 sm:space-y-4">
                                          <div className="space-y-2 sm:space-y-3 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                                              Datos personales
                                            </h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                                <Baby className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Nombre</p>
                                                  <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                                                    {c?.nombre || 'No especificado'}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                                <Baby className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                                                    Apellidos
                                                  </p>
                                                  <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                                                    {c?.apellidos || 'No especificado'}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium">Género</p>
                                                  <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                                                    {c?.genero || 'No especificado'}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="space-y-2 sm:space-y-3 bg-braini-pink/10 p-3 sm:p-4 rounded-lg border border-braini-pink/20">
                                            <h4 className="font-semibold text-gray-800 text-sm sm:text-base">Colegio</h4>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                                              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                                <School className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                                                    Centro escolar
                                                  </p>
                                                  <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                                                    {c?.school_name || 'No especificado'}
                                                  </p>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white rounded-lg">
                                                <GraduationCap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-braini-pink shrink-0" />
                                                <div className="min-w-0 flex-1">
                                                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                                                    Nivel educativo
                                                  </p>
                                                  <p className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                                                    {c?.nivel_educativo ? nivelLabel(c.nivel_educativo) : 'No especificado'}
                                                  </p>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </CardContent>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                            </Card>
                          );
                        })}
                        </div>
                      )}
                  </section>

                  <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg md:text-xl text-gray-800">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-braini-pink rounded-lg flex items-center justify-center shrink-0">
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
                        <p className="text-xs sm:text-sm text-gray-400 mt-1">
                          Los resultados de tus tests aparecerán aquí
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
      <Dialog
        open={avatarPickerOpen && editChild}
        onOpenChange={setAvatarPickerOpen}
      >
        <DialogContent className="max-w-md sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Elige un personaje</DialogTitle>
            <DialogDescription>
              {childForm.nombre || child?.nombre
                ? `Perfil de ${childForm.nombre || child?.nombre}`
                : 'Elige el personaje de tu hijo o hija'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
            {CHILD_AVATARS.map((avatar) => {
              const selected = childForm.avatar_id === avatar.id;
              return (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => {
                    setChildForm((prev) => ({ ...prev, avatar_id: avatar.id }));
                    setAvatarPickerOpen(false);
                  }}
                  className={`flex flex-col items-center gap-1 rounded-xl p-1.5 border-2 transition-colors ${
                    selected
                      ? 'border-braini-pink bg-braini-pink/10'
                      : 'border-transparent hover:bg-gray-50'
                  }`}
                >
                  <img
                    src={childAvatarSrc(avatar.id)}
                    alt={avatar.label}
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
                  />
                  <span className="text-[10px] font-medium text-gray-700">{avatar.label}</span>
                </button>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </Backgrounds>
  );
};

export default Profile;
