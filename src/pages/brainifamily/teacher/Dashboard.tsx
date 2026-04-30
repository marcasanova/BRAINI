import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacher, normalizeCourseName } from '@/hooks/useTeacher';
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
import { Users, BookOpen, GraduationCap, Sparkles, AlertCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { teacher } = useTeacher();
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);

  useEffect(() => {
    const list = teacher?.classList ?? [];
    if (list.length === 0) {
      setSelectedClassId(null);
      return;
    }
    setSelectedClassId((prev) => {
      if (prev && list.some((c) => c.id === prev)) return prev;
      return list[0].id;
    });
  }, [teacher?.classList]);

  const selectedClass = useMemo(
    () => teacher?.classList.find((c) => c.id === selectedClassId) ?? null,
    [teacher?.classList, selectedClassId],
  );

  const { children, loading, error } = useTeacherChildren(selectedClassId);

  const totalClasses = teacher?.classList.length ?? 0;
  const totalStudentsAllClasses = useMemo(() => {
    if (!teacher) return 0;
    return Object.values(teacher.classStudentCounts).reduce((a, b) => a + b, 0);
  }, [teacher]);

  const studentsInSelectedClass = selectedClassId
    ? (teacher?.classStudentCounts[selectedClassId] ?? 0)
    : 0;

  const hasChildren = !loading && !error && children.length > 0;

  if (!teacher) return null;

  return (
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
              Gestiona tus clases, acompaña el progreso emocional y celebra los logros
              de tus alumnos desde un panel pensado para ti.
            </p>
            <div className="flex flex-wrap gap-3 text-xs md:text-sm">
              <Badge
                variant="secondary"
                className="bg-white/15 text-white border-white/30 backdrop-blur"
              >
                {totalClasses}{' '}
                {totalClasses === 1 ? 'clase asignada' : 'clases asignadas'}
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
                  {studentsInSelectedClass === 1 ? 'alumno en' : 'alumnos en'} "
                  {selectedClass.name}"
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
                Estás viendo el panel de{' '}
                <span className="font-semibold">
                  {selectedClass?.name || 'tus clases'}
                </span>
                . Selecciona otra clase para cambiar el grupo de alumnos.
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

      {totalClasses === 0 ? (
        <section>
          <Card className="border-dashed border-2 border-gray-200 bg-white/70 backdrop-blur-sm">
            <CardContent className="py-10 text-center text-gray-600 flex flex-col items-center gap-3">
              <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p className="text-base font-medium">Aún no tienes clases creadas.</p>
              <p className="text-sm max-w-md">
                Las clases se gestionan en la base de datos (tabla <code className="text-xs bg-gray-100 px-1 rounded">classes</code>) con tu <code className="text-xs bg-gray-100 px-1 rounded">teacher_id</code>.
                Cuando existan, aparecerán aquí con sus alumnos vinculados por{' '}
                <code className="text-xs bg-gray-100 px-1 rounded">class_id</code>.
              </p>
            </CardContent>
          </Card>
        </section>
      ) : (
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)] items-start">
          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-braini-blue" />
                Gestión de clases
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  Elige una clase para ver el listado de alumnos y acceder a su panel
                  individual.
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
                    {studentsInSelectedClass}{' '}
                    {studentsInSelectedClass === 1
                      ? 'alumno asignado'
                      : 'alumnos asignados'}{' '}
                    a este grupo.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-braini-blue" />
                  Alumnado de {selectedClass?.name ?? 'la clase'}
                </CardTitle>
              </div>
              {hasChildren && (
                <Badge variant="outline" className="text-xs">
                  {children.length}{' '}
                  {children.length === 1 ? 'alumno' : 'alumnos'} en la lista
                </Badge>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              {loading && (
                <div className="py-8 text-center text-gray-500">
                  Cargando alumnos...
                </div>
              )}
              {!loading && !error && children.length === 0 && (
                <div className="py-8 text-center text-gray-500">
                  No hay alumnos con esta clase asignada (
                  <code className="text-xs">children.class_id</code>).
                </div>
              )}
              {hasChildren && (
                <ScrollArea className="h-[360px] pr-2">
                  <ul className="space-y-3 py-4">
                    {children.map((child) => (
                      <li key={child.id}>
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/brainifamily/teacher/nino/${child.id}`)
                          }
                          className="group flex w-full items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white/80 px-4 py-3 text-left shadow-sm transition hover:-translate-y-[1px] hover:border-braini-blue/60 hover:shadow-md"
                        >
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">
                              {child.nombre} {child.apellidos ?? ''}
                            </span>
                            <span className="text-xs text-gray-500">
                              Pulsa para ver el progreso emocional y las misiones.
                            </span>
                          </div>
                          <span className="text-xs font-medium text-braini-blue group-hover:underline">
                            Ver progreso
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
