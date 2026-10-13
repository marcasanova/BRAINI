import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';
import { Copy, LogOut, Mail, School, UserCog, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router';
import { copyToClipboard } from '@/shared/lib/clipboard';
import { staffInviteRpcMessage } from '@/products/brainifamily/lib/teacherInviteRpcMessages';
import AdminKpiRow from './AdminKpiRow';
import AdminPlatformCharts from './AdminInviteCharts';
import { INVITE_STATUS_LABELS } from './adminChartPalette';

interface SchoolRow {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
}

interface DirectorInviteRow {
  id: string;
  email: string;
  school_id: string;
  invited_by: string;
  token: string;
  expires_at: string;
  status: 'pending' | 'completed' | 'expired' | 'revoked';
  director_id: string | null;
  completed_at: string | null;
  created_at: string;
}

interface DirectorRow {
  id: string;
  email: string | null;
  nombre: string;
  school_id: string;
  active: boolean;
  created_at: string;
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'bg-braini-yellow/20 text-braini-yellow-dark',
  completed: 'bg-braini-turquoise/20 text-braini-turquoise-dark',
  expired: 'bg-braini-pink/20 text-braini-pink-dark',
  revoked: 'bg-gray-200 text-gray-600',
};

const AdminDashboard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [schoolName, setSchoolName] = useState('');
  const [schools, setSchools] = useState<SchoolRow[]>([]);
  const [directorInvites, setDirectorInvites] = useState<DirectorInviteRow[]>([]);
  const [directors, setDirectors] = useState<DirectorRow[]>([]);
  const [loadingSchool, setLoadingSchool] = useState(false);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [directorEmail, setDirectorEmail] = useState('');
  const [selectedSchoolId, setSelectedSchoolId] = useState('');
  const [lastInviteLink, setLastInviteLink] = useState('');
  const [teachersTotal, setTeachersTotal] = useState(0);
  const [parentsTotal, setParentsTotal] = useState(0);
  const [childrenTotal, setChildrenTotal] = useState(0);
  const [classesTotal, setClassesTotal] = useState(0);
  const [childrenBySchoolId, setChildrenBySchoolId] = useState<Record<string, number>>({});

  const formatDate = (value: string | null) => {
    if (!value) return '—';
    return new Date(value).toLocaleString();
  };

  const schoolNameById = (id: string) => {
    return schools.find((s) => s.id === id)?.name ?? id;
  };

  const loadData = useCallback(async () => {
    setListLoading(true);
    const schoolsPromise = supabase
      .from('schools')
      .select('id, name, active, created_at')
      .order('created_at', { ascending: false });

    const invitesPromise = supabase
      .from('director_invited')
      .select('id, email, school_id, invited_by, token, expires_at, status, director_id, completed_at, created_at')
      .order('created_at', { ascending: false });

    const directorsPromise = supabase
      .from('directors')
      .select('id, email, nombre, school_id, active, created_at')
      .order('created_at', { ascending: false });

    const countExact = async (table: 'teachers' | 'parents' | 'children' | 'classes') => {
      const { count, error } = await supabase.from(table).select('id', { count: 'exact', head: true });
      if (error) {
        toast({
          title: 'No se pudieron cargar métricas',
          description: error.message,
          variant: 'destructive',
        });
        return 0;
      }
      return count ?? 0;
    };

    const childrenDistPromise = supabase.from('children').select('school_id');

    const [
      { data: schoolsData, error: schoolsError },
      { data: invitesData, error: invitesError },
      { data: directorsData, error: directorsError },
      teachersCount,
      parentsCount,
      childrenCount,
      classesCount,
      { data: childrenDist, error: childrenDistError },
    ] = await Promise.all([
      schoolsPromise,
      invitesPromise,
      directorsPromise,
      countExact('teachers'),
      countExact('parents'),
      countExact('children'),
      countExact('classes'),
      childrenDistPromise,
    ]);

    if (schoolsError) {
      toast({
        title: 'Error al cargar centros',
        description: schoolsError.message,
        variant: 'destructive',
      });
    } else {
      setSchools((schoolsData ?? []) as SchoolRow[]);
    }

    if (invitesError) {
      toast({
        title: 'Error al cargar invitaciones',
        description: invitesError.message,
        variant: 'destructive',
      });
      setDirectorInvites([]);
    } else {
      setDirectorInvites((invitesData ?? []) as DirectorInviteRow[]);
    }

    if (directorsError) {
      toast({
        title: 'Error al cargar directores',
        description: directorsError.message,
        variant: 'destructive',
      });
      setDirectors([]);
    } else {
      setDirectors((directorsData ?? []) as DirectorRow[]);
    }

    setTeachersTotal(teachersCount);
    setParentsTotal(parentsCount);
    setChildrenTotal(childrenCount);
    setClassesTotal(classesCount);

    if (childrenDistError) {
      setChildrenBySchoolId({});
    } else {
      const grouped: Record<string, number> = {};
      (childrenDist ?? []).forEach((row: { school_id: string | null }) => {
        if (!row.school_id) return;
        grouped[row.school_id] = (grouped[row.school_id] ?? 0) + 1;
      });
      setChildrenBySchoolId(grouped);
    }
    setListLoading(false);
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = schoolName.trim();
    if (!name) {
      toast({
        title: 'Nombre requerido',
        description: 'Escribe el nombre del centro.',
        variant: 'destructive',
      });
      return;
    }
    setLoadingSchool(true);
    const { data, error } = await supabase.rpc('admin_create_school', {
      p_name: name,
    });
    setLoadingSchool(false);
    if (error) {
      toast({
        title: 'No se pudo crear el centro',
        description: error.message,
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Centro creado',
      description: `ID: ${data as string}`,
    });
    setSchoolName('');
    loadData();
  };

  const handleCreateDirectorInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = directorEmail.trim().toLowerCase();
    if (!selectedSchoolId) {
      toast({
        title: 'Centro requerido',
        description: 'Selecciona un centro para la invitación.',
        variant: 'destructive',
      });
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      toast({
        title: 'Email inválido',
        description: 'Introduce un email válido para el director.',
        variant: 'destructive',
      });
      return;
    }

    setLoadingInvite(true);
    const { data, error } = await supabase.rpc('create_director_invite', {
      p_school_id: selectedSchoolId,
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

    const payload = data as { ok?: boolean; token?: string } | null;
    const token = payload?.token;
    if (payload?.ok !== true || !token) {
      toast({
        title: 'No se pudo crear la invitación',
        description: staffInviteRpcMessage(data, 'director'),
        variant: 'destructive',
      });
      return;
    }

    const link = `${window.location.origin}/brainifamily/invite/director?token=${encodeURIComponent(token)}`;
    setLastInviteLink(link);
    setDirectorEmail('');
    await loadData();
    toast({
      title: 'Invitación creada',
      description: 'Enlace generado correctamente. Puedes copiarlo con el botón.',
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/brainifamily/login');
  };

  const copyLink = async (link: string, okDescription: string) => {
    const copied = await copyToClipboard(link);
    toast(
      copied
        ? { title: 'Enlace copiado', description: okDescription }
        : {
            title: 'No se pudo copiar automáticamente',
            description: 'Copia el enlace manualmente desde el campo.',
            variant: 'destructive',
          },
    );
  };

  const activeSchools = schools.filter((s) => s.active).length;
  const schoolsWithDirector = new Set(directors.map((d) => d.school_id)).size;

  const schoolsByMonth = useMemo(() => {
    const buckets = new Map<string, number>();
    const now = new Date();
    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      buckets.set(key, 0);
    }
    schools.forEach((s) => {
      const d = new Date(s.created_at);
      if (Number.isNaN(d.getTime())) return;
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      if (buckets.has(key)) {
        buckets.set(key, (buckets.get(key) ?? 0) + 1);
      }
    });
    return [...buckets.entries()].map(([label, value]) => ({ label, value }));
  }, [schools]);

  const volume = useMemo(
    () => [
      { label: 'Centros', count: schools.length, color: '#7ea4df' },
      { label: 'Dirección', count: directors.length, color: '#35bdb1' },
      { label: 'Profes', count: teachersTotal, color: '#f8cd50' },
      { label: 'Familias', count: parentsTotal, color: '#f5827b' },
      { label: 'Niños', count: childrenTotal, color: '#5d7ba8' },
      { label: 'Clases', count: classesTotal, color: '#5dd1c7' },
    ],
    [schools.length, directors.length, teachersTotal, parentsTotal, childrenTotal, classesTotal],
  );

  const childrenBySchool = useMemo(
    () =>
      Object.entries(childrenBySchoolId)
        .map(([id, count]) => ({ name: schoolNameById(id), count }))
        .sort((a, b) => b.count - a.count),
    [childrenBySchoolId, schools],
  );

  return (
    <div className="min-h-screen font-montserrat bg-linear-to-br from-braini-blue/10 via-white to-braini-turquoise/10 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/logo/logoBraini.png"
              alt="BRAINI"
              className="h-12 w-auto object-contain"
            />
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontWeight: 900 }}>
                Super admin
              </h1>
              <p className="text-gray-600 text-sm">Gestión de centros (BRAINI)</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout} className="border-braini-blue/30">
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </header>

        <AdminKpiRow
          schoolsTotal={schools.length}
          schoolsActive={activeSchools}
          schoolsByMonth={schoolsByMonth}
          directorsTotal={directors.length}
          teachersTotal={teachersTotal}
          parentsTotal={parentsTotal}
          childrenTotal={childrenTotal}
          classesTotal={classesTotal}
        />

        <section className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <School className="w-5 h-5 text-braini-turquoise-dark" />
                  Nuevo colegio
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateSchool} className="space-y-3">
                  <div>
                    <Label htmlFor="school-name">Nombre del centro</Label>
                    <Input
                      id="school-name"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="Ej. CEIP San Francisco"
                      className="mt-1 bg-white"
                    />
                  </div>
                  <Button type="submit" disabled={loadingSchool} className="bg-braini-turquoise hover:bg-braini-turquoise-dark text-white">
                    {loadingSchool ? 'Creando...' : 'Crear centro'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <UserPlus className="w-5 h-5 text-braini-blue-dark" />
                  Invitar director
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateDirectorInvite} className="space-y-3">
                  <div>
                    <Label htmlFor="director-school">Centro</Label>
                    <select
                      id="director-school"
                      value={selectedSchoolId}
                      onChange={(e) => setSelectedSchoolId(e.target.value)}
                      className="mt-1 w-full rounded-md border border-input bg-white px-3 py-2 text-sm"
                    >
                      <option value="">Selecciona centro</option>
                      {schools.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="director-email">Email del director</Label>
                    <Input
                      id="director-email"
                      type="email"
                      value={directorEmail}
                      onChange={(e) => setDirectorEmail(e.target.value)}
                      placeholder="direccion@colegio.es"
                      className="mt-1 bg-white"
                    />
                  </div>
                  <Button type="submit" disabled={loadingInvite || schools.length === 0} className="bg-braini-blue hover:bg-braini-blue-dark text-white">
                    {loadingInvite ? 'Generando...' : 'Generar enlace'}
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
                        onClick={() => copyLink(lastInviteLink, 'Ya puedes compartirlo manualmente.')}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <AdminPlatformCharts
            volume={volume}
            schoolsWithDirector={schoolsWithDirector}
            schoolsTotal={schools.length}
            childrenBySchool={childrenBySchool}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-white/95 border-braini-blue/20 rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold">
                  <School className="w-5 h-5 text-braini-blue-dark" />
                Centros registrados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {listLoading ? (
                <p className="text-gray-500 text-sm">Cargando…</p>
              ) : schools.length === 0 ? (
                <p className="text-gray-500 text-sm">Aún no hay centros.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                        <th className="py-2 pr-3 font-medium">Nombre</th>
                        <th className="py-2 pr-3 font-medium">Estado</th>
                        <th className="py-2 pr-3 font-medium">Alta</th>
                        <th className="py-2 font-medium">Id</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schools.map((s) => (
                        <tr key={s.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-2.5 pr-3 font-medium text-gray-900">{s.name}</td>
                          <td className="py-2.5 pr-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                                s.active ? 'bg-braini-turquoise/20 text-braini-turquoise-dark' : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              {s.active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="py-2.5 pr-3 text-xs text-gray-600 whitespace-nowrap">{formatDate(s.created_at)}</td>
                          <td className="py-2.5 text-xs text-gray-500 font-mono">{s.id.slice(0, 8)}…</td>
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
                  <UserCog className="w-5 h-5 text-braini-turquoise-dark" />
                Directores registrados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {listLoading ? (
                <p className="text-gray-500 text-sm">Cargando...</p>
              ) : directors.length === 0 ? (
                <p className="text-gray-500 text-sm">Aún no hay directores registrados.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                        <th className="py-2 pr-3 font-medium">Nombre</th>
                        <th className="py-2 pr-3 font-medium">Email</th>
                        <th className="py-2 pr-3 font-medium">Centro</th>
                        <th className="py-2 font-medium">Alta</th>
                      </tr>
                    </thead>
                    <tbody>
                      {directors.map((d) => (
                        <tr key={d.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-2.5 pr-3 font-medium text-gray-900">{d.nombre}</td>
                          <td className="py-2.5 pr-3 text-xs text-gray-600">{d.email ?? '—'}</td>
                          <td className="py-2.5 pr-3 text-xs text-gray-600">{schoolNameById(d.school_id)}</td>
                          <td className="py-2.5 text-xs text-gray-500 whitespace-nowrap">{formatDate(d.created_at)}</td>
                        </tr>
                      ))}
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
              <Mail className="w-5 h-5 text-braini-pink-dark" />
              Invitaciones a directores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {listLoading ? (
              <p className="text-gray-500 text-sm">Cargando...</p>
            ) : directorInvites.length === 0 ? (
              <p className="text-gray-500 text-sm">Aún no hay invitaciones de directores.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-gray-500 border-b border-gray-100">
                      <th className="py-2 pr-3 font-medium">Email</th>
                      <th className="py-2 pr-3 font-medium">Centro</th>
                      <th className="py-2 pr-3 font-medium">Estado</th>
                      <th className="py-2 pr-3 font-medium">Caduca</th>
                      <th className="py-2 font-medium">Enlace</th>
                    </tr>
                  </thead>
                  <tbody>
                    {directorInvites.map((inv) => {
                      const inviteLink = `${window.location.origin}/brainifamily/invite/director?token=${encodeURIComponent(inv.token)}`;
                      return (
                        <tr key={inv.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-2.5 pr-3 font-medium text-gray-900">{inv.email}</td>
                          <td className="py-2.5 pr-3 text-xs text-gray-600">{schoolNameById(inv.school_id)}</td>
                          <td className="py-2.5 pr-3">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${STATUS_BADGE[inv.status] ?? 'bg-gray-200 text-gray-600'}`}
                            >
                              {INVITE_STATUS_LABELS[inv.status] ?? inv.status}
                            </span>
                          </td>
                          <td className="py-2.5 pr-3 text-xs text-gray-600 whitespace-nowrap">{formatDate(inv.expires_at)}</td>
                          <td className="py-2.5">
                            <div className="flex items-center gap-2 min-w-[220px]">
                              <Input value={inviteLink} readOnly className="bg-white text-xs h-8" />
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="border-braini-blue/30 text-gray-700 hover:bg-braini-blue/10 shrink-0"
                                onClick={() => copyLink(inviteLink, 'Enlace copiado al portapapeles.')}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
