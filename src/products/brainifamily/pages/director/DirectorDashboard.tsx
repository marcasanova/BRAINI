import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { fetchMyRole } from '@/integrations/supabase/rpc/roles';
import { useToast } from '@/shared/hooks/use-toast';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { staffInviteRpcMessage } from '@/products/brainifamily/lib/teacherInviteRpcMessages';
import { Baby, BookOpen, Copy, GraduationCap, LogOut, Mail, UserPlus } from 'lucide-react';
import { ADMIN_CHART_COLORS, INVITE_STATUS_LABELS } from '../admin/adminChartPalette';
import DirectorKpiRow from './DirectorKpiRow';
import DirectorSchoolCharts from './DirectorSchoolCharts';

interface TeacherRow {
  id: string;
  email: string | null;
  nombre: string;
}

interface ClassRow {
  id: string;
  name: string;
  teacher_id: string;
  academic_year: string | null;
}

interface ChildRow {
  id: string;
  nombre: string;
  apellidos: string | null;
  class_id: string | null;
  parent_id: string | null;
}

type InviteStatus = 'pending' | 'completed' | 'expired' | 'revoked';

interface TeacherInviteRow {
  id: string;
  email: string;
  school_id: string;
  token: string;
  expires_at: string;
  status: InviteStatus | string;
  teacher_id: string | null;
  completed_at: string | null;
  created_at: string;
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-braini-yellow/20 text-braini-yellow-dark',
  completed: 'bg-braini-turquoise/20 text-braini-turquoise-dark',
  expired: 'bg-braini-pink/20 text-braini-pink-dark',
  revoked: 'bg-gray-200 text-gray-600',
};

const DirectorDashboard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [children, setChildren] = useState<ChildRow[]>([]);
  const [teacherInvites, setTeacherInvites] = useState<TeacherInviteRow[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [lastInviteLink, setLastInviteLink] = useState('');
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [loading, setLoading] = useState(true);

  const formatDate = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleString();
  };

  const teacherLink = (token: string) =>
    `${window.location.origin}/brainifamily/invite/teacher?token=${encodeURIComponent(token)}`;

  const copyLink = async (link: string, description: string) => {
    const copied = await copyToClipboard(link);
    toast(
      copied
        ? { title: 'Enlace copiado', description }
        : {
            title: 'No se pudo copiar',
            description: 'Copia el enlace manualmente desde el campo.',
            variant: 'destructive',
          },
    );
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    const role = await fetchMyRole();
    const sid = role?.school_id ?? null;
    setSchoolId(sid);
    if (!sid) {
      setSchoolName(null);
      setTeachers([]);
      setClasses([]);
      setChildren([]);
      setTeacherInvites([]);
      setLoading(false);
      return;
    }

    const { data: school, error: schoolErr } = await supabase
      .from('schools')
      .select('name')
      .eq('id', sid)
      .maybeSingle();

    if (schoolErr) {
      toast({
        title: 'Error al cargar el centro',
        description: schoolErr.message,
        variant: 'destructive',
      });
    } else {
      setSchoolName((school as { name?: string } | null)?.name ?? null);
    }

    const [
      { data: trows, error: tErr },
      { data: crows, error: cErr },
      { data: invRows, error: invErr },
      { data: chRows, error: chErr },
    ] = await Promise.all([
      supabase.from('teachers').select('id, email, nombre').eq('school_id', sid).order('nombre', { ascending: true }),
      supabase.from('classes').select('id, name, teacher_id, academic_year').eq('school_id', sid),
      supabase
        .from('teacher_invited')
        .select('id, email, school_id, token, expires_at, status, teacher_id, completed_at, created_at')
        .eq('school_id', sid)
        .order('created_at', { ascending: false }),
      supabase.from('children').select('id, nombre, apellidos, class_id, parent_id').eq('school_id', sid),
    ]);

    if (tErr) {
      toast({
        title: 'Error al cargar docentes',
        description: tErr.message,
        variant: 'destructive',
      });
      setTeachers([]);
    } else {
      setTeachers((trows ?? []) as TeacherRow[]);
    }

    if (cErr) {
      toast({
        title: 'Error al cargar clases',
        description: cErr.message,
        variant: 'destructive',
      });
      setClasses([]);
    } else {
      setClasses((crows ?? []) as ClassRow[]);
    }

    if (invErr) {
      toast({
        title: 'Error al cargar invitaciones',
        description: invErr.message,
        variant: 'destructive',
      });
      setTeacherInvites([]);
    } else {
      setTeacherInvites((invRows ?? []) as TeacherInviteRow[]);
    }

    if (chErr) {
      toast({
        title: 'Error al cargar alumnos',
        description: chErr.message,
        variant: 'destructive',
      });
      setChildren([]);
    } else {
      setChildren((chRows ?? []) as ChildRow[]);
    }

    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const childrenByClass = useMemo(() => {
    const map: Record<string, ChildRow[]> = {};
    for (const ch of children) {
      const cid = ch.class_id;
      if (!cid) continue;
      if (!map[cid]) map[cid] = [];
      map[cid].push(ch);
    }
    return map;
  }, [children]);

  const classesByTeacher = useMemo(() => {
    const m: Record<string, ClassRow[]> = {};
    for (const c of classes) {
      if (!m[c.teacher_id]) m[c.teacher_id] = [];
      m[c.teacher_id].push(c);
    }
    for (const k of Object.keys(m)) {
      m[k].sort((a, b) => a.name.localeCompare(b.name, 'es'));
    }
    return m;
  }, [classes]);

  const familiesTotal = useMemo(() => {
    const ids = new Set<string>();
    for (const ch of children) {
      if (ch.parent_id) ids.add(ch.parent_id);
    }
    return ids.size;
  }, [children]);

  const childrenWithoutFamily = children.filter((ch) => !ch.parent_id).length;
  const childrenWithoutClass = children.filter((ch) => !ch.class_id).length;
  const childrenWithFamily = children.length - childrenWithoutFamily;

  const teachersWithoutClass = teachers.filter((t) => (classesByTeacher[t.id] ?? []).length === 0).length;

  const teacherStats = useMemo(
    () =>
      teachers.map((t) => {
        const tClasses = classesByTeacher[t.id] ?? [];
        const studentCount = tClasses.reduce((sum, cl) => sum + (childrenByClass[cl.id]?.length ?? 0), 0);
        return { ...t, classCount: tClasses.length, studentCount };
      }),
    [teachers, classesByTeacher, childrenByClass],
  );

  const childrenByClassShare = useMemo(
    () =>
      [...classes]
        .map((cl) => ({ name: cl.name, count: childrenByClass[cl.id]?.length ?? 0 }))
        .sort((a, b) => b.count - a.count),
    [classes, childrenByClass],
  );

  const volume = useMemo(
    () => [
      { label: 'Docentes', count: teachers.length, color: ADMIN_CHART_COLORS.yellow },
      { label: 'Clases', count: classes.length, color: ADMIN_CHART_COLORS.blue },
      { label: 'Alumnos', count: children.length, color: ADMIN_CHART_COLORS.turquoise },
      { label: 'Familias', count: familiesTotal, color: ADMIN_CHART_COLORS.pink },
    ],
    [teachers.length, classes.length, children.length, familiesTotal],
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/brainifamily/login');
  };

  const handleCreateTeacherInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inviteEmail.trim().toLowerCase();
    if (!schoolId) return;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      toast({
        title: 'Email inválido',
        description: 'Introduce un correo válido para el docente.',
        variant: 'destructive',
      });
      return;
    }

    setLoadingInvite(true);
    const { data, error } = await supabase.rpc('create_teacher_invite', {
      p_school_id: schoolId,
      p_email: email,
    });
    setLoadingInvite(false);

    if (error) {
      toast({
        title: 'No se pudo crear la invitación',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }

    const payload = data as { ok?: boolean; error?: string; token?: string } | null;
    const token = payload?.token;
    if (payload?.ok !== true || !token) {
      toast({
        title: 'No se pudo crear la invitación',
        description: staffInviteRpcMessage(data, 'teacher'),
        variant: 'destructive',
      });
      return;
    }

    const link = teacherLink(token);
    setLastInviteLink(link);
    setInviteEmail('');
    await loadData();
    toast({
      title: 'Invitación creada',
      description: 'Enlace generado. Cópialo para compartirlo con el docente.',
    });
  };

  return (
    <div className="min-h-screen font-montserrat bg-linear-to-br from-braini-blue/10 via-white to-braini-turquoise/10 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo/logoBraini.png" alt="BRAINI" className="h-12 w-auto object-contain" />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontWeight: 900 }}>
                Panel de dirección
              </h1>
              <p className="text-gray-600 text-sm">{schoolName ?? 'Tu centro escolar'}</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-braini-blue/30">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </header>

        {loading ? (
          <p className="text-sm text-gray-600">Cargando…</p>
        ) : !schoolId ? (
          <p className="text-sm text-amber-700">
            No se ha podido resolver el centro (`school_id`). Revisa tu fila en `directors` y la RPC
            `get_my_role`.
          </p>
        ) : (
          <>
            <DirectorKpiRow
              teachersTotal={teachers.length}
              teachersWithoutClass={teachersWithoutClass}
              classesTotal={classes.length}
              childrenTotal={children.length}
              childrenWithoutClass={childrenWithoutClass}
              familiesTotal={familiesTotal}
              childrenWithoutFamily={childrenWithoutFamily}
            />

            <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm lg:col-span-5 h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <UserPlus className="w-5 h-5 text-braini-blue-dark" />
                    Invitar docente
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateTeacherInvite} className="space-y-3">
                    <div>
                      <Label htmlFor="teacher-invite-email">Email del docente</Label>
                      <Input
                        id="teacher-invite-email"
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="profesor@colegio.es"
                        autoComplete="email"
                        className="mt-1 bg-white"
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={loadingInvite}
                      className="bg-braini-blue hover:bg-braini-blue-dark text-white"
                    >
                      {loadingInvite ? 'Generando…' : 'Generar enlace'}
                    </Button>
                  </form>

                  {lastInviteLink && (
                    <div className="mt-4 space-y-2">
                      <Label>Último enlace generado</Label>
                      <div className="flex gap-2">
                        <Input value={lastInviteLink} readOnly className="bg-white text-xs" />
                        <Button
                          type="button"
                          variant="outline"
                          className="border-braini-blue/30 text-gray-700 hover:bg-braini-blue/10"
                          onClick={() => copyLink(lastInviteLink, 'Comparte este enlace con el docente.')}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <DirectorSchoolCharts
                volume={volume}
                childrenWithFamily={childrenWithFamily}
                childrenTotal={children.length}
                childrenByClass={childrenByClassShare}
              />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <GraduationCap className="w-5 h-5 text-braini-yellow-dark" />
                    Docentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {teachers.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                      No hay docentes dados de alta todavía. Cuando acepten la invitación aparecerán aquí.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                            <th className="py-2 pr-3 font-medium">Nombre</th>
                            <th className="py-2 pr-3 font-medium">Email</th>
                            <th className="py-2 pr-3 font-medium">Clases</th>
                            <th className="py-2 font-medium">Alumnos</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teacherStats.map((t) => (
                            <tr key={t.id} className="border-b border-gray-50 last:border-0">
                              <td className="py-2.5 pr-3 font-medium text-gray-900">{t.nombre}</td>
                              <td className="py-2.5 pr-3 text-xs text-gray-600">{t.email ?? '—'}</td>
                              <td className="py-2.5 pr-3 text-xs text-gray-700">{t.classCount}</td>
                              <td className="py-2.5 text-xs text-gray-700">{t.studentCount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base font-bold">
                    <Mail className="w-5 h-5 text-braini-blue-dark" />
                    Invitaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {teacherInvites.length === 0 ? (
                    <p className="text-gray-500 text-sm">Aún no hay invitaciones registradas para este centro.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                            <th className="py-2 pr-3 font-medium">Email</th>
                            <th className="py-2 pr-3 font-medium">Estado</th>
                            <th className="py-2 pr-3 font-medium">Caduca</th>
                            <th className="py-2 font-medium">Enlace</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teacherInvites.map((inv) => {
                            const link = teacherLink(inv.token);
                            return (
                              <tr key={inv.id} className="border-b border-gray-50 last:border-0">
                                <td className="py-2.5 pr-3 font-medium text-gray-900">{inv.email}</td>
                                <td className="py-2.5 pr-3">
                                  <span
                                    className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[String(inv.status)] ?? 'bg-gray-200 text-gray-600'}`}
                                  >
                                    {INVITE_STATUS_LABELS[String(inv.status)] ?? inv.status}
                                  </span>
                                </td>
                                <td className="py-2.5 pr-3 text-xs text-gray-600 whitespace-nowrap">
                                  {formatDate(inv.expires_at)}
                                </td>
                                <td className="py-2.5">
                                  <div className="flex items-center gap-2 min-w-[180px]">
                                    <Input value={link} readOnly className="bg-white text-xs h-8" />
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      className="border-braini-blue/30 text-gray-700 hover:bg-braini-blue/10 shrink-0"
                                      onClick={() => copyLink(link, 'Comparte este enlace con el docente.')}
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>

            <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <Baby className="w-5 h-5 text-braini-turquoise-dark" />
                  Clases y alumnos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {teachers.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No hay docentes dados de alta todavía. Cuando acepten la invitación aparecerán aquí.
                  </p>
                ) : (
                  teachers.map((t) => {
                    const tClasses = classesByTeacher[t.id] ?? [];
                    return (
                      <div key={t.id} className="rounded-xl border border-gray-100 bg-white/80 p-4">
                        <p className="font-semibold text-gray-900">{t.nombre}</p>
                        <p className="text-xs text-gray-500 mb-3">{t.email ?? '—'}</p>
                        {tClasses.length === 0 ? (
                          <p className="text-sm text-gray-500">Sin clases creadas aún.</p>
                        ) : (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                                  <th className="py-2 pr-3 font-medium">Clase</th>
                                  <th className="py-2 font-medium">Alumnos</th>
                                </tr>
                              </thead>
                              <tbody>
                                {tClasses.map((cl) => {
                                  const kids = childrenByClass[cl.id] ?? [];
                                  return (
                                    <tr key={cl.id} className="border-b border-gray-50 last:border-0 align-top">
                                      <td className="py-2.5 pr-3">
                                        <span className="inline-flex items-center gap-2 font-medium text-gray-800">
                                          <BookOpen className="w-4 h-4 text-braini-blue-dark shrink-0" />
                                          {cl.name}
                                        </span>
                                        {cl.academic_year ? (
                                          <p className="text-xs text-gray-500 ml-6">{cl.academic_year}</p>
                                        ) : null}
                                      </td>
                                      <td className="py-2.5 text-gray-700">
                                        {kids.length === 0 ? (
                                          <span className="text-xs text-gray-500">Sin alumnos asignados</span>
                                        ) : (
                                          <ul className="text-sm space-y-0.5">
                                            {kids.map((ch) => (
                                              <li key={ch.id}>
                                                {ch.nombre}
                                                {ch.apellidos ? ` ${ch.apellidos}` : ''}
                                              </li>
                                            ))}
                                          </ul>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default DirectorDashboard;
