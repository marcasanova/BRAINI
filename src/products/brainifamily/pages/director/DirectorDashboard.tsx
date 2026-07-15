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
import { BookOpen, Building2, Copy, GraduationCap, LogOut, MailPlus, Users } from 'lucide-react';

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

const DirectorDashboard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [classes, setClasses] = useState<ClassRow[]>([]);
  const [childrenByClass, setChildrenByClass] = useState<Record<string, ChildRow[]>>({});
  const [teacherInvites, setTeacherInvites] = useState<TeacherInviteRow[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [loading, setLoading] = useState(true);

  const formatDate = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleString();
  };

  const teacherLink = (token: string) =>
    `${window.location.origin}/brainifamily/invite/teacher?token=${encodeURIComponent(token)}`;

  const loadData = useCallback(async () => {
    setLoading(true);
    const role = await fetchMyRole();
    const sid = role?.school_id ?? null;
    setSchoolId(sid);
    if (!sid) {
      setSchoolName(null);
      setTeachers([]);
      setClasses([]);
      setChildrenByClass({});
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
    ] = await Promise.all([
      supabase.from('teachers').select('id, email, nombre').eq('school_id', sid).order('nombre', { ascending: true }),
      supabase.from('classes').select('id, name, teacher_id, academic_year').eq('school_id', sid),
      supabase
        .from('teacher_invited')
        .select('id, email, school_id, token, expires_at, status, teacher_id, completed_at, created_at')
        .eq('school_id', sid)
        .order('created_at', { ascending: false }),
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

    const classIds = (crows ?? []).map((c: { id: string }) => c.id).filter(Boolean);
    if (classIds.length > 0) {
      const { data: chRows, error: chErr } = await supabase
        .from('children')
        .select('id, nombre, apellidos, class_id')
        .in('class_id', classIds);

      if (chErr) {
        toast({
          title: 'Error al cargar alumnos',
          description: chErr.message,
          variant: 'destructive',
        });
        setChildrenByClass({});
      } else {
        const map: Record<string, ChildRow[]> = {};
        for (const ch of (chRows ?? []) as ChildRow[]) {
          const cid = ch.class_id;
          if (!cid) continue;
          if (!map[cid]) map[cid] = [];
          map[cid].push(ch);
        }
        setChildrenByClass(map);
      }
    } else {
      setChildrenByClass({});
    }

    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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

    setInviteEmail('');
    await loadData();
    toast({
      title: 'Invitación creada',
      description: 'Enlace generado. Cópialo con el botón en la lista inferior.',
    });
  };

  const pendingInvites = teacherInvites.filter((i) => String(i.status) === 'pending').length;

  return (
    <div className="min-h-screen bg-linear-to-br from-braini-blue/10 via-white to-braini-turquoise/10 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-10 h-10 text-braini-blue" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de dirección</h1>
              <p className="text-gray-600 text-sm">
                Invita docentes, revisa invitaciones y consulta clases y alumnos (solo lectura).
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
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
            <div className="flex flex-wrap gap-4 text-sm text-gray-700">
              <p>
                Centro: <strong>{schoolName ?? schoolId}</strong>
              </p>
              <p>
                Docentes: <strong>{teachers.length}</strong>
              </p>
              <p>
                Invitaciones pendientes: <strong>{pendingInvites}</strong>
              </p>
            </div>

            <Card className="bg-white/90 border-braini-blue/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MailPlus className="w-5 h-5" />
                  Invitar docente (enlace manual)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateTeacherInvite} className="flex flex-col sm:flex-row gap-3 max-w-xl">
                  <div className="flex-1 space-y-1">
                    <Label htmlFor="teacher-invite-email">Email del docente</Label>
                    <Input
                      id="teacher-invite-email"
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="profesor@colegio.es"
                      autoComplete="email"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button type="submit" disabled={loadingInvite} className="bg-braini-blue hover:bg-braini-blue-dark text-white">
                      {loadingInvite ? 'Generando…' : 'Generar invitación'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-braini-blue/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="w-5 h-5" />
                  Invitaciones a docentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {teacherInvites.length === 0 ? (
                  <p className="text-gray-500 text-sm">Aún no hay invitaciones registradas para este centro.</p>
                ) : (
                  <ul className="space-y-3">
                    {teacherInvites.map((inv) => {
                      const link = teacherLink(inv.token);
                      return (
                        <li key={inv.id} className="rounded-md border bg-white p-3 text-sm">
                          <p className="font-medium">{inv.email}</p>
                          <p className="text-gray-600">
                            Estado: <span className="font-medium">{inv.status}</span> · Caduca:{' '}
                            {formatDate(inv.expires_at)}
                          </p>
                          <p className="text-xs text-gray-500">Creada: {formatDate(inv.created_at)}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Input value={link} readOnly className="text-xs font-mono flex-1 min-w-[200px]" />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                const copied = await copyToClipboard(link);
                                toast(
                                  copied
                                    ? { title: 'Enlace copiado', description: 'Comparte este enlace con el docente.' }
                                    : {
                                        title: 'No se pudo copiar',
                                        description: 'Copia el enlace manualmente desde el campo.',
                                        variant: 'destructive',
                                      },
                                );
                              }}
                            >
                              <Copy className="w-4 h-4 mr-1" />
                              Copiar
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white/90 border-braini-blue/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5" />
                  Docentes, clases y alumnos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {teachers.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    No hay docentes dados de alta todavía. Cuando acepten la invitación aparecerán aquí.
                  </p>
                ) : (
                  teachers.map((t) => {
                    const tClasses = classesByTeacher[t.id] ?? [];
                    return (
                      <div key={t.id} className="border rounded-lg p-4 bg-white/80">
                        <p className="font-semibold text-gray-900">{t.nombre}</p>
                        <p className="text-sm text-gray-600 mb-3">{t.email ?? '—'}</p>
                        {tClasses.length === 0 ? (
                          <p className="text-sm text-gray-500">Sin clases creadas aún.</p>
                        ) : (
                          <ul className="space-y-3">
                            {tClasses.map((cl) => {
                              const kids = childrenByClass[cl.id] ?? [];
                              return (
                                <li key={cl.id} className="border-l-2 border-indigo-200 pl-3">
                                  <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-gray-800">
                                    <BookOpen className="w-4 h-4 text-indigo-600 shrink-0" />
                                    {cl.name}
                                    {cl.academic_year ? (
                                      <span className="text-xs font-normal text-gray-500">
                                        ({cl.academic_year})
                                      </span>
                                    ) : null}
                                  </p>
                                  {kids.length === 0 ? (
                                    <p className="text-xs text-gray-500 mt-1">Sin alumnos asignados a esta clase.</p>
                                  ) : (
                                    <ul className="mt-1 ml-6 list-disc text-sm text-gray-700">
                                      {kids.map((ch) => (
                                        <li key={ch.id}>
                                          {ch.nombre}
                                          {ch.apellidos ? ` ${ch.apellidos}` : ''}
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
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
