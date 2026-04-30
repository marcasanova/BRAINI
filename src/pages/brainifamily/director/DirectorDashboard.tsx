import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { fetchMyRole } from '@/lib/myRole';
import { useToast } from '@/hooks/use-toast';
import { Building2, LogOut, Users } from 'lucide-react';

interface TeacherRow {
  id: string;
  email: string | null;
  nombre: string;
}

const DirectorDashboard: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<TeacherRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    const role = await fetchMyRole();
    const sid = role?.school_id ?? null;
    setSchoolId(sid);
    if (!sid) {
      setSchoolName(null);
      setTeachers([]);
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

    const { data: trows, error: tErr } = await supabase
      .from('teachers')
      .select('id, email, nombre')
      .eq('school_id', sid)
      .order('nombre', { ascending: true });

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
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/brainifamily/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Building2 className="w-10 h-10 text-indigo-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Panel de dirección</h1>
              <p className="text-gray-600 text-sm">
                Vista del centro y docentes (altas manuales; invitaciones por email desactivadas).
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
            <p className="text-sm text-gray-700">
              Centro: <strong>{schoolName ?? schoolId}</strong>
            </p>
            <p className="text-sm text-gray-600">
              Docentes registrados: <strong>{teachers.length}</strong>
            </p>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5" />
                  Docentes del centro
                </CardTitle>
              </CardHeader>
              <CardContent>
                {teachers.length === 0 ? (
                  <p className="text-gray-500 text-sm">
                    Aún no hay filas en <code className="text-xs">teachers</code> para este centro.
                    Créalas manualmente en la base de datos o vía flujo que tengáis preparado.
                  </p>
                ) : (
                  <ul className="divide-y rounded-md border bg-white">
                    {teachers.map((t) => (
                      <li key={t.id} className="px-3 py-2 text-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <span className="font-medium">{t.nombre}</span>
                        <span className="text-gray-600">{t.email ?? '—'}</span>
                      </li>
                    ))}
                  </ul>
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
