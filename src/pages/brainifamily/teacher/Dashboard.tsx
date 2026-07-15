import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacherContext } from '@/contexts/TeacherContext';
import { normalizeCourseName } from '@/hooks/useTeacher';
import { useTeacherChildren } from '@/hooks/useTeacherChildren';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/lib/clipboard';
import { createParentInviteLink } from '@/lib/teacherParentInvite';
import type { TeacherChild } from '@/hooks/useTeacherChildren';
import {
  Users,
  BookOpen,
  GraduationCap,
  Sparkles,
  AlertCircle,
  Plus,
  Link2,
  Mail,
} from 'lucide-react';

type CourseRow = { id: number; nombre: string };
type NivelEducativoValue =
  | 'infantil_3'
  | 'infantil_4'
  | 'infantil_5'
  | 'primaria_1'
  | 'primaria_2'
  | 'primaria_3'
  | 'primaria_4'
  | 'primaria_5'
  | 'primaria_6';

const NIVELES_INFANTIL: Array<{ value: NivelEducativoValue; label: string }> = [
  { value: 'infantil_3', label: 'Infantil 3 años' },
  { value: 'infantil_4', label: 'Infantil 4 años' },
  { value: 'infantil_5', label: 'Infantil 5 años' },
];

const NIVELES_PRIMARIA: Array<{ value: NivelEducativoValue; label: string }> = [
  { value: 'primaria_1', label: '1º Primaria' },
  { value: 'primaria_2', label: '2º Primaria' },
  { value: 'primaria_3', label: '3º Primaria' },
  { value: 'primaria_4', label: '4º Primaria' },
  { value: 'primaria_5', label: '5º Primaria' },
  { value: 'primaria_6', label: '6º Primaria' },
];

function inferCourseStage(courseName: string | null | undefined): 'infantil' | 'primaria' | null {
  const n = (courseName ?? '').toLowerCase();
  if (n.includes('infantil')) return 'infantil';
  if (n.includes('primaria')) return 'primaria';
  return null;
}

function nivelLabel(value: string | null | undefined): string {
  if (!value) return 'Sin nivel';
  const map: Record<string, string> = {
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
  return map[value] ?? value;
}

/** Recuerda la clase activa al ir al detalle de un alumno y volver al panel. */
const TEACHER_SELECTED_CLASS_KEY = 'brainifamily_teacher_selected_class_id';

function readStoredClassId(): string | null {
  try {
    const v = sessionStorage.getItem(TEACHER_SELECTED_CLASS_KEY);
    return v && v.length > 0 ? v : null;
  } catch {
    return null;
  }
}

const TeacherDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { teacher, refetch: refetchTeacher } = useTeacherContext();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  const [dialogClassOpen, setDialogClassOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassCourseId, setNewClassCourseId] = useState<string>('');
  const [newClassNivelEducativo, setNewClassNivelEducativo] = useState<string>('');
  const [newClassYear, setNewClassYear] = useState('');
  const [submittingClass, setSubmittingClass] = useState(false);

  const [dialogStudentOpen, setDialogStudentOpen] = useState(false);
  const [newStudentNombre, setNewStudentNombre] = useState('');
  const [newStudentApellidos, setNewStudentApellidos] = useState('');
  const [newStudentParentEmail, setNewStudentParentEmail] = useState('');
  const [submittingStudent, setSubmittingStudent] = useState(false);

  const [dialogInviteOpen, setDialogInviteOpen] = useState(false);
  const [inviteTargetChild, setInviteTargetChild] = useState<TeacherChild | null>(null);
  const [inviteEmailLater, setInviteEmailLater] = useState('');
  const [submittingInvite, setSubmittingInvite] = useState(false);

  const {
    children,
    loading,
    error,
    refetch: refetchChildren,
  } = useTeacherChildren(selectedClassId);

  const loadCourses = useCallback(async () => {
    setCoursesLoading(true);
    const { data, error: err } = await supabase
      .from('courses')
      .select('id, nombre')
      .eq('activo', true)
      .order('nombre');
    setCoursesLoading(false);
    if (err) {
      toast({
        title: 'No se pudieron cargar los cursos',
        description:
          err.message ||
          'No pudimos cargar el listado de cursos. Recarga la página; si sigue igual, revisa con administración que existan cursos activos.',
        variant: 'destructive',
      });
      setCourses([]);
      return;
    }
    setCourses((data ?? []) as CourseRow[]);
  }, [toast]);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    const list = teacher?.classList ?? [];
    if (list.length === 0) {
      setSelectedClassId(null);
      return;
    }
    setSelectedClassId((prev) => {
      if (prev && list.some((c) => c.id === prev)) return prev;
      const stored = readStoredClassId();
      if (stored && list.some((c) => c.id === stored)) return stored;
      return list[0].id;
    });
  }, [teacher?.classList]);

  useEffect(() => {
    try {
      if (selectedClassId) {
        sessionStorage.setItem(TEACHER_SELECTED_CLASS_KEY, selectedClassId);
      } else {
        sessionStorage.removeItem(TEACHER_SELECTED_CLASS_KEY);
      }
    } catch {
      /* ignore quota / private mode */
    }
  }, [selectedClassId]);

  const selectedClass = useMemo(
    () => teacher?.classList.find((c) => c.id === selectedClassId) ?? null,
    [teacher?.classList, selectedClassId],
  );

  const totalClasses = teacher?.classList.length ?? 0;
  const totalStudentsAllClasses = useMemo(() => {
    if (!teacher) return 0;
    return Object.values(teacher.classStudentCounts).reduce((a, b) => a + b, 0);
  }, [teacher]);

  const studentsInSelectedClass = selectedClassId
    ? (teacher?.classStudentCounts[selectedClassId] ?? 0)
    : 0;

  const hasChildren = !loading && !error && children.length > 0;

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher) return;
    const name = newClassName.trim();
    const cid = newClassCourseId ? Number(newClassCourseId) : NaN;
    if (name.length < 2) {
      toast({
        title: 'Nombre de clase',
        description:
          'El nombre de la clase debe tener al menos 2 caracteres para poder identificarla en el panel.',
        variant: 'destructive',
      });
      return;
    }
    if (!Number.isFinite(cid)) {
      toast({
        title: 'Curso',
        description:
          'Selecciona un curso escolar antes de guardar. Sin curso no podemos crear la clase.',
        variant: 'destructive',
      });
      return;
    }
    if (!newClassNivelEducativo) {
      toast({
        title: 'Nivel educativo',
        description:
          'Selecciona el nivel educativo de la clase. Este nivel se heredará automáticamente al registrar alumnado.',
        variant: 'destructive',
      });
      return;
    }

    setSubmittingClass(true);
    const { data, error: insErr } = await supabase
      .from('classes')
      .insert({
        school_id: teacher.school_id,
        teacher_id: teacher.id,
        course_id: cid,
        nivel_educativo: newClassNivelEducativo,
        name,
        academic_year: newClassYear.trim() || null,
      })
      .select('id')
      .single();

    setSubmittingClass(false);

    if (insErr) {
      toast({
        title: 'No se pudo crear la clase',
        description:
          insErr.message ||
          'No pudimos crear la clase. Comprueba tu conexión y que tu usuario docente tenga permisos en este centro.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Clase creada',
      description: `La clase «${name}» se ha guardado correctamente. Ya puedes añadir alumnos y generar invitaciones para las familias.`,
    });
    setDialogClassOpen(false);
    setNewClassName('');
    setNewClassCourseId('');
    setNewClassNivelEducativo('');
    setNewClassYear('');
    await refetchTeacher();
    if (data?.id) setSelectedClassId(data.id);
  };

  const selectedCourseNameForNewClass = useMemo(() => {
    if (!newClassCourseId) return null;
    const row = courses.find((c) => String(c.id) === newClassCourseId);
    return row?.nombre ?? null;
  }, [courses, newClassCourseId]);

  const selectedCourseStageForNewClass = useMemo(
    () => inferCourseStage(selectedCourseNameForNewClass),
    [selectedCourseNameForNewClass],
  );

  const availableNivelesForNewClass = useMemo(() => {
    if (selectedCourseStageForNewClass === 'infantil') return NIVELES_INFANTIL;
    if (selectedCourseStageForNewClass === 'primaria') return NIVELES_PRIMARIA;
    return [] as Array<{ value: NivelEducativoValue; label: string }>;
  }, [selectedCourseStageForNewClass]);

  useEffect(() => {
    if (availableNivelesForNewClass.some((n) => n.value === newClassNivelEducativo)) return;
    setNewClassNivelEducativo('');
  }, [availableNivelesForNewClass, newClassNivelEducativo]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teacher || !selectedClassId || !selectedClass) {
      toast({
        title: 'Selecciona una clase',
        description:
          'Primero elige la clase donde quieres registrar al alumno. Después podrás completar el alta.',
        variant: 'destructive',
      });
      return;
    }

    const nombre = newStudentNombre.trim();
    if (nombre.length < 2) {
      toast({
        title: 'Nombre del alumno',
        description:
          'Es necesario indicar un nombre con al menos 2 caracteres para registrar al alumno.',
        variant: 'destructive',
      });
      return;
    }

    const emailRaw = newStudentParentEmail.trim().toLowerCase();
    const emailOk =
      emailRaw === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailRaw);
    if (!emailOk) {
      toast({
        title: 'Correo del padre/tutor',
        description:
          'El correo no tiene formato válido. Corrígelo o déjalo vacío para invitar a la familia más tarde.',
        variant: 'destructive',
      });
      return;
    }

    setSubmittingStudent(true);
    const { data: childRow, error: childErr } = await supabase
      .from('children')
      .insert({
        nombre,
        apellidos: newStudentApellidos.trim() || null,
        class_id: selectedClassId,
        parent_id: null,
        profile_completed: false,
      })
      .select('id')
      .single();

    if (childErr || !childRow) {
      setSubmittingStudent(false);
      toast({
        title: 'No se pudo registrar al alumno',
        description:
          childErr?.message ||
          'No pudimos guardar el alumno en esta clase. Revisa la conexión y vuelve a intentarlo.',
        variant: 'destructive',
      });
      return;
    }

    let inviteLink: string | null = null;
    if (emailRaw) {
      const inv = await createParentInviteLink(childRow.id, emailRaw);
      if (!inv.ok) {
        toast({
          title: 'Alumno creado; invitación pendiente',
          description: `${inv.message} Puedes volver a intentarlo luego desde «Invitar familia» en la fila del alumno.`,
          variant: 'destructive',
        });
      } else {
        inviteLink = inv.url;
      }
    } else {
      toast({
        title: 'Alumno añadido',
        description:
          'Alumno guardado sin correo de familia. Cuando lo tengas, usa «Invitar familia» en su fila para generar el enlace.',
      });
    }

    setSubmittingStudent(false);
    setDialogStudentOpen(false);
    setNewStudentNombre('');
    setNewStudentApellidos('');
    setNewStudentParentEmail('');

    await refetchTeacher();
    await refetchChildren();

    if (inviteLink) {
      const copied = await copyToClipboard(inviteLink);
      toast({
        title: copied ? 'Alumno añadido — enlace copiado' : 'Alumno añadido — copia el enlace',
        description: copied
          ? `Comparte el acceso con la familia (${emailRaw}). El enlace ya está en el portapapeles.`
          : inviteLink,
      });
    }
  };

  const handleSubmitInviteFromList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteTargetChild) return;
    const email = inviteEmailLater.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: 'Correo necesario',
        description:
          'Introduce un correo válido del padre, madre o tutor para poder generar el enlace de invitación.',
        variant: 'destructive',
      });
      return;
    }

    setSubmittingInvite(true);
    const result = await createParentInviteLink(inviteTargetChild.id, email);
    setSubmittingInvite(false);

    if (!result.ok) {
      toast({
        title: 'No se pudo generar la invitación',
        description: `${result.message} Revisa el correo y vuelve a intentarlo.`,
        variant: 'destructive',
      });
      return;
    }

    const copied = await copyToClipboard(result.url);
    toast({
      title: copied ? 'Enlace listo' : 'Copia el enlace manualmente',
      description: copied
        ? `El enlace para ${email} ya está copiado. Pégalo en WhatsApp o en un correo para la familia.`
        : result.url,
    });

    setDialogInviteOpen(false);
    setInviteTargetChild(null);
    setInviteEmailLater('');
    await refetchTeacher();
    await refetchChildren();
  };

  const handleCopyInviteLink = async (child: TeacherChild) => {
    if (!child.pending_invite_token) return;
    const inviteLink = `${window.location.origin}/brainifamily/invite/parent?token=${encodeURIComponent(child.pending_invite_token)}`;
    const copied = await copyToClipboard(inviteLink);
    toast({
      title: copied ? 'Enlace copiado' : 'Copia el enlace manualmente',
      description: copied
        ? `Enlace listo para ${child.pending_invite_email ?? 'la familia'}. Compártelo para que completen el registro.`
        : inviteLink,
    });
  };

  if (!teacher) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-braini-blue/10 via-white to-braini-turquoise/10 p-6">
      <div className="space-y-8 max-w-6xl mx-auto">
        <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] items-start">
          <Card className="relative overflow-hidden border-none bg-gradient-to-r from-braini-blue to-braini-turquoise text-white shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <GraduationCap className="h-7 w-7" />
                <span>
                  Bienvenido/a,{' '}
                  <span className="font-semibold">
                    {teacher.nombre || 'profesor/a'}
                  </span>
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm md:text-base text-blue-50/90">
                Crea clases, registra alumnos y envía invitaciones a las familias desde este panel.
              </p>
              <div className="flex flex-wrap gap-3 text-xs md:text-sm">
                <Badge
                  variant="secondary"
                  className="bg-white/15 text-white border-white/30 backdrop-blur"
                >
                  {totalClasses}{' '}
                  {totalClasses === 1 ? 'clase' : 'clases'}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-white/15 text-white border-white/30 backdrop-blur"
                >
                  {totalStudentsAllClasses}{' '}
                  {totalStudentsAllClasses === 1
                    ? 'alumno en total'
                    : 'alumnos en total'}
                </Badge>
                {selectedClass && (
                  <Badge
                    variant="secondary"
                    className="bg-white/15 text-white border-white/30 backdrop-blur"
                  >
                    {studentsInSelectedClass}{' '}
                    {studentsInSelectedClass === 1 ? 'alumno en' : 'alumnos en'}{' '}
                    {selectedClass.name}
                  </Badge>
                )}
              </div>
            </CardContent>
            <div className="pointer-events-none absolute inset-y-0 right-[-40px] opacity-30">
              <div className="h-full w-40 bg-gradient-to-b from-white/40 to-transparent blur-3xl" />
            </div>
          </Card>

          <div className="grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <Card className="border border-braini-blue/20 bg-white/80 backdrop-blur">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Sparkles className="h-4 w-4 text-braini-yellow" />
                  Resumen rápido
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-700">
                <p>
                  Estás viendo{' '}
                  <span className="font-semibold">
                    {selectedClass?.name || 'tus clases'}
                  </span>
                  . Usa «Nueva clase» o «Nuevo alumno» para dar de alta datos.
                </p>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
                  <div>
                    <p className="text-gray-500">Clases activas</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {totalClasses || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Alumnos en la clase</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {studentsInSelectedClass || '—'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error al cargar alumnos</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)] items-start">
          <Card className="bg-white/90 backdrop-blur-sm border-braini-blue/20">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-braini-blue" />
                Tus clases
              </CardTitle>
              <Button
                type="button"
                size="sm"
                className="gap-1 bg-braini-blue hover:bg-braini-blue-dark text-white"
                onClick={() => setDialogClassOpen(true)}
              >
                <Plus className="h-4 w-4" />
                Nueva clase
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {totalClasses === 0 ? (
                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/70 px-4 py-6 text-sm text-gray-700">
                  <p className="font-medium text-gray-900 mb-2">Aún no tienes clases</p>
                  <p className="mb-3">
                    Crea una clase indicando su nombre y el curso escolar. Después podrás añadir alumnos y
                    enviar invitaciones a las familias.
                  </p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setDialogClassOpen(true)}
                    className="gap-1 bg-braini-turquoise hover:bg-braini-turquoise-dark text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Crear mi primera clase
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600">
                      Elige una clase para ver el listado de alumnos y su seguimiento.
                    </p>
                  </div>
                  <Select
                    value={selectedClassId ?? ''}
                    onValueChange={(v) => setSelectedClassId(v)}
                  >
                    <SelectTrigger className="w-full max-w-sm">
                      <SelectValue placeholder="Selecciona una clase" />
                    </SelectTrigger>
                    <SelectContent>
                      {teacher.classList.map((cls) => {
                        const cn = normalizeCourseName(cls.courses);
                        const label = cn ? `${cls.name} (${cn})` : cls.name;
                        return (
                          <SelectItem key={cls.id} value={cls.id}>
                            {label}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {selectedClass && (
                    <div className="mt-2 rounded-lg border border-dashed border-gray-200 bg-gray-50/70 px-4 py-3 text-sm text-gray-700">
                      <p className="font-medium text-gray-800">
                        Clase seleccionada: {selectedClass.name}
                      </p>
                      {normalizeCourseName(selectedClass.courses) && (
                        <p className="text-xs text-gray-600 mt-1">
                          Curso: {normalizeCourseName(selectedClass.courses)}
                        </p>
                      )}
                      <p className="text-xs text-gray-600 mt-1">
                        Nivel: {nivelLabel(selectedClass.nivel_educativo)}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {studentsInSelectedClass}{' '}
                        {studentsInSelectedClass === 1
                          ? 'alumno asignado'
                          : 'alumnos asignados'}{' '}
                        a este grupo.
                      </p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm border-braini-blue/20">
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-braini-blue" />
                  Alumnado de {selectedClass?.name ?? 'la clase'}
                </CardTitle>
              </div>
              <div className="flex items-center gap-2">
                {hasChildren && (
                  <Badge variant="outline" className="text-xs">
                    {children.length}{' '}
                    {children.length === 1 ? 'alumno' : 'alumnos'} en la lista
                  </Badge>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="gap-1"
                  disabled={!selectedClassId}
                  onClick={() => setDialogStudentOpen(true)}
                >
                  <Plus className="h-4 w-4" />
                  Nuevo alumno
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {!selectedClassId && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Crea o selecciona una clase</AlertTitle>
                  <AlertDescription>
                    Primero debes tener una clase activa para poder añadir alumnos.
                  </AlertDescription>
                </Alert>
              )}
              {loading && (
                <div className="py-8 text-center text-gray-500">
                  Cargando alumnos...
                </div>
              )}
              {!loading && !error && selectedClassId && children.length === 0 && (
                <div className="py-8 text-center text-gray-600 space-y-3">
                  <p>No hay alumnos en esta clase todavía.</p>
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => setDialogStudentOpen(true)}
                    className="gap-1 bg-braini-pink hover:bg-braini-pink-dark text-white"
                  >
                    <Plus className="h-4 w-4" />
                    Añadir primer alumno
                  </Button>
                </div>
              )}
              {hasChildren && (
                <ScrollArea className="h-[360px] pr-2">
                  <ul className="space-y-3 py-4">
                    {children.map((child) => {
                      const linked = Boolean(child.parent_id);
                      const hasPendingInvite = Boolean(child.pending_invite_token);
                      return (
                        <li key={child.id}>
                          <div className="flex flex-col gap-2 rounded-xl border border-gray-200 bg-white/80 p-2 shadow-sm transition hover:border-braini-blue/40 sm:flex-row sm:items-center sm:gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`/brainifamily/teacher/nino/${child.id}`)
                              }
                              className="group flex min-w-0 flex-1 items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-gray-50"
                            >
                              <div className="flex min-w-0 flex-col">
                                <span className="font-medium text-gray-900">
                                  {child.nombre} {child.apellidos ?? ''}
                                </span>
                                <span className="text-xs text-gray-500">
                                  Pulsa para ver el progreso emocional y las misiones.
                                </span>
                              </div>
                              <span className="shrink-0 text-xs font-medium text-braini-blue group-hover:underline">
                                Ver progreso
                              </span>
                            </button>
                            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-gray-100 pt-2 sm:border-t-0 sm:pt-0">
                              {linked ? (
                                <Badge variant="secondary" className="text-[10px] font-normal">
                                  Familia vinculada
                                </Badge>
                              ) : hasPendingInvite ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="gap-1 border-braini-blue/40 text-braini-blue hover:bg-braini-blue/10"
                                  title="Copiar enlace ya generado para la familia"
                                  onClick={() => {
                                    void handleCopyInviteLink(child);
                                  }}
                                >
                                  <Link2 className="h-4 w-4" />
                                  <span className="hidden sm:inline">Copiar link</span>
                                </Button>
                              ) : (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="gap-1 border-braini-pink/40 text-braini-pink-dark hover:bg-braini-pink/10"
                                  title="Generar enlace de invitación para la familia"
                                  onClick={() => {
                                    setInviteTargetChild(child);
                                    setInviteEmailLater('');
                                    setDialogInviteOpen(true);
                                  }}
                                >
                                  <Mail className="h-4 w-4" />
                                  <span className="hidden sm:inline">Invitar familia</span>
                                </Button>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      <Dialog open={dialogClassOpen} onOpenChange={setDialogClassOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nueva clase</DialogTitle>
            <DialogDescription>
              La clase quedará asociada a tu centro y a tu usuario como docente responsable.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateClass} className="space-y-4">
            <div>
              <Label htmlFor="tc-name">Nombre del grupo</Label>
              <Input
                id="tc-name"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder="Ej.: 3º A Mañana"
                className="mt-1"
                autoComplete="off"
              />
            </div>
            <div>
              <Label htmlFor="tc-course">Curso escolar</Label>
              <Select
                value={newClassCourseId}
                onValueChange={setNewClassCourseId}
                disabled={coursesLoading || courses.length === 0}
              >
                <SelectTrigger id="tc-course" className="mt-1">
                  <SelectValue
                    placeholder={
                      coursesLoading ? 'Cargando cursos…' : 'Selecciona curso'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {courses.length === 0 && !coursesLoading && (
                <p className="text-xs text-destructive mt-1">
                  No hay cursos activos en el sistema. Contacta con el administrador.
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="tc-level">Nivel educativo</Label>
              <Select
                value={newClassNivelEducativo}
                onValueChange={setNewClassNivelEducativo}
                disabled={!newClassCourseId || availableNivelesForNewClass.length === 0}
              >
                <SelectTrigger id="tc-level" className="mt-1">
                  <SelectValue
                    placeholder={
                      !newClassCourseId
                        ? 'Selecciona primero el curso'
                        : availableNivelesForNewClass.length === 0
                          ? 'El curso no es Infantil/Primaria'
                          : 'Selecciona nivel'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {availableNivelesForNewClass.map((n) => (
                    <SelectItem key={n.value} value={n.value}>
                      {n.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                Este nivel se heredará automáticamente al crear alumnado en esta clase.
              </p>
            </div>
            <div>
              <Label htmlFor="tc-year">Curso académico (opcional)</Label>
              <Input
                id="tc-year"
                value={newClassYear}
                onChange={(e) => setNewClassYear(e.target.value)}
                placeholder="Ej.: 2025-2026"
                className="mt-1"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogClassOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={
                  submittingClass ||
                  courses.length === 0 ||
                  !newClassCourseId ||
                  !newClassNivelEducativo
                }
                className="bg-braini-blue hover:bg-braini-blue-dark text-white"
              >
                {submittingClass ? 'Guardando…' : 'Crear clase'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogStudentOpen} onOpenChange={setDialogStudentOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo alumno</DialogTitle>
            <DialogDescription>
              Se dará de alta en{' '}
              <strong>{selectedClass?.name ?? 'la clase seleccionada'}</strong>.
              El vínculo con la familia se completa cuando el padre o tutor acepte la invitación.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateStudent} className="space-y-4">
            <div>
              <Label htmlFor="ts-nombre">Nombre *</Label>
              <Input
                id="ts-nombre"
                value={newStudentNombre}
                onChange={(e) => setNewStudentNombre(e.target.value)}
                placeholder="Nombre del menor"
                className="mt-1"
                autoComplete="given-name"
              />
            </div>
            <div>
              <Label htmlFor="ts-apellidos">Apellidos</Label>
              <Input
                id="ts-apellidos"
                value={newStudentApellidos}
                onChange={(e) => setNewStudentApellidos(e.target.value)}
                placeholder="Opcional"
                className="mt-1"
                autoComplete="family-name"
              />
            </div>
            <div className="rounded-md border border-braini-blue/20 bg-braini-blue/5 p-3 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                <Mail className="h-4 w-4 text-braini-blue" />
                Invitación a la familia
              </div>
              <Label htmlFor="ts-email" className="text-xs font-normal text-muted-foreground">
                Correo del padre, madre o tutor (opcional)
              </Label>
              <Input
                id="ts-email"
                type="email"
                value={newStudentParentEmail}
                onChange={(e) => setNewStudentParentEmail(e.target.value)}
                placeholder="Si lo rellenas, generamos el enlace de invitación"
                className="mt-1"
                autoComplete="email"
              />
              <p className="text-xs text-muted-foreground flex gap-1.5 items-start">
                <Link2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                Tras guardar, copiaremos al portapapeles el enlace para que lo envíes por WhatsApp o correo.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogStudentOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submittingStudent || !selectedClassId}
                className="bg-braini-pink hover:bg-braini-pink-dark text-white"
              >
                {submittingStudent ? 'Guardando…' : 'Guardar alumno'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogInviteOpen}
        onOpenChange={(open) => {
          setDialogInviteOpen(open);
          if (!open) {
            setInviteTargetChild(null);
            setInviteEmailLater('');
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invitar familia</DialogTitle>
            <DialogDescription>
              {inviteTargetChild ? (
                <>
                  Genera el enlace para que los padres o tutores de{' '}
                  <strong>
                    {inviteTargetChild.nombre} {inviteTargetChild.apellidos ?? ''}
                  </strong>{' '}
                  completen el alta en Braini.
                </>
              ) : (
                'Introduce el correo al que enviarás la invitación.'
              )}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitInviteFromList} className="space-y-4">
            <div>
              <Label htmlFor="inv-later-email">Correo del padre, madre o tutor</Label>
              <Input
                id="inv-later-email"
                type="email"
                value={inviteEmailLater}
                onChange={(e) => setInviteEmailLater(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="mt-1"
                autoComplete="email"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-2 flex gap-1.5 items-start">
                <Link2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                Si ya habías generado un enlace pendiente para este alumno, se sustituirá por uno nuevo al mismo correo.
              </p>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogInviteOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={submittingInvite}
                className="gap-1 bg-braini-pink hover:bg-braini-pink-dark text-white"
              >
                {submittingInvite ? 'Generando…' : 'Generar enlace'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeacherDashboard;
