import React, { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Building2, Copy, LogOut, School, Shield, UserPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { copyToClipboard } from '@/lib/clipboard';
import { staffInviteRpcMessage } from '@/lib/teacherInviteRpcMessages';

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

  const formatDate = (value: string | null) => {
    if (!value) return '-';
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

    const [{ data: schoolsData, error: schoolsError }, { data: invitesData, error: invitesError }, { data: directorsData, error: directorsError }] =
      await Promise.all([schoolsPromise, invitesPromise, directorsPromise]);

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

  const pendingInvites = directorInvites.filter((i) => i.status === 'pending').length;
  const completedInvites = directorInvites.filter((i) => i.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-braini-blue/10 via-white to-braini-turquoise/10 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-10 h-10 text-braini-blue" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Super admin</h1>
              <p className="text-gray-600 text-sm">Gestión de centros (BRAINI)</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar sesión
          </Button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/90 border-braini-blue/20">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-500">Centros</p>
              <p className="text-2xl font-semibold text-gray-900">{schools.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 border-braini-blue/20">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-500">Directores</p>
              <p className="text-2xl font-semibold text-gray-900">{directors.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 border-braini-blue/20">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-500">Invitaciones pendientes</p>
              <p className="text-2xl font-semibold text-gray-900">{pendingInvites}</p>
            </CardContent>
          </Card>
          <Card className="bg-white/90 border-braini-blue/20">
            <CardContent className="pt-6">
              <p className="text-xs text-gray-500">Invitaciones completadas</p>
              <p className="text-2xl font-semibold text-gray-900">{completedInvites}</p>
            </CardContent>
          </Card>
        </section>

        <Card className="bg-white/90 border-braini-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <School className="w-5 h-5" />
              Nuevo colegio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateSchool} className="space-y-4 max-w-md">
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
                {loadingSchool ? 'Creando...' : 'Crear con RPC admin_create_school'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-braini-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserPlus className="w-5 h-5" />
              Invitar director (enlace manual)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateDirectorInvite} className="space-y-4 max-w-md">
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
                {loadingInvite ? 'Generando...' : 'Generar enlace de invitación'}
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
                    onClick={async () => {
                      const copied = await copyToClipboard(lastInviteLink);
                      toast(
                        copied
                          ? {
                              title: 'Enlace copiado',
                              description: 'Ya puedes compartirlo manualmente.',
                            }
                          : {
                              title: 'No se pudo copiar automáticamente',
                              description: 'Copia el enlace manualmente desde el campo.',
                              variant: 'destructive',
                            },
                      );
                    }}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-braini-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5" />
              Directores registrados
            </CardTitle>
          </CardHeader>
          <CardContent>
            {listLoading ? (
              <p className="text-gray-500">Cargando...</p>
            ) : directors.length === 0 ? (
              <p className="text-gray-500">Aún no hay directores registrados.</p>
            ) : (
              <ul className="space-y-2">
                {directors.map((d) => (
                  <li key={d.id} className="border-b border-gray-100 py-2 last:border-0">
                    <p className="text-sm font-medium text-gray-900">{d.nombre}</p>
                    <p className="text-xs text-gray-600">{d.email ?? '-'}</p>
                    <p className="text-xs text-gray-500">
                      Centro: {schoolNameById(d.school_id)} | Alta: {formatDate(d.created_at)}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/90 border-braini-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Building2 className="w-5 h-5" />
              Invitaciones a directores
            </CardTitle>
          </CardHeader>
          <CardContent>
            {listLoading ? (
              <p className="text-gray-500">Cargando...</p>
            ) : directorInvites.length === 0 ? (
              <p className="text-gray-500">Aún no hay invitaciones de directores.</p>
            ) : (
              <ul className="space-y-3">
                {directorInvites.map((inv) => {
                  const inviteLink = `${window.location.origin}/brainifamily/invite/director?token=${encodeURIComponent(inv.token)}`;
                  return (
                    <li key={inv.id} className="border border-braini-blue/20 rounded-md p-3 bg-white">
                      <p className="text-sm font-medium text-gray-900">{inv.email}</p>
                      <p className="text-xs text-gray-600">Centro: {schoolNameById(inv.school_id)}</p>
                      <p className="text-xs text-gray-600">
                        Estado: <span className="font-medium">{inv.status}</span> | Caduca: {formatDate(inv.expires_at)}
                      </p>
                      <p className="text-xs text-gray-500">Creada: {formatDate(inv.created_at)}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Input value={inviteLink} readOnly className="bg-white text-xs" />
                        <Button
                          type="button"
                          variant="outline"
                          className="border-braini-blue/30 text-gray-700 hover:bg-braini-blue/10"
                          onClick={async () => {
                            const copied = await copyToClipboard(inviteLink);
                            toast(
                              copied
                                ? { title: 'Enlace copiado', description: 'Enlace copiado al portapapeles.' }
                                : {
                                    title: 'No se pudo copiar automáticamente',
                                    description: 'Copia el enlace manualmente desde el campo.',
                                    variant: 'destructive',
                                  },
                            );
                          }}
                        >
                          <Copy className="w-4 h-4" />
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
            <CardTitle className="text-lg">Centros registrados</CardTitle>
          </CardHeader>
          <CardContent>
            {listLoading ? (
              <p className="text-gray-500">Cargando…</p>
            ) : schools.length === 0 ? (
              <p className="text-gray-500">Aún no hay centros.</p>
            ) : (
              <ul className="space-y-2">
                {schools.map((s) => (
                  <li
                    key={s.id}
                    className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0"
                  >
                    <span className="text-gray-900">{s.name}</span>
                    <span className="text-xs text-gray-500 font-mono">{s.id.slice(0, 8)}…</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
