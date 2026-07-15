import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';
import { inviteErrorDescription, inviteErrorTitle } from '@/integrations/supabase/lib/inviteErrors';

const CompleteTeacherInvite: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingInvite, setLoadingInvite] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<{
    email: string;
    schoolName: string | null;
    schoolId: string | null;
    expiresAt: string | null;
  } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      setLoadingInvite(true);
      const { data, error } = await supabase.functions.invoke('complete-teacher-invite', {
        body: { token, action: 'preview' },
      });
      setLoadingInvite(false);
      if (cancelled) return;

      if (error) {
        toast({
          title: inviteErrorTitle(data),
          description: inviteErrorDescription(data, 'teacher') ?? error.message,
          variant: 'destructive',
        });
        return;
      }
      const body = data as {
        ok?: boolean;
        email?: string;
        school_name?: string | null;
        school_id?: string | null;
        expires_at?: string | null;
      } | null;
      if (body?.ok !== true || !body.email) {
        toast({
          title: inviteErrorTitle(body),
          description: inviteErrorDescription(body, 'teacher'),
          variant: 'destructive',
        });
        return;
      }
      setInviteInfo({
        email: body.email,
        schoolName: body.school_name ?? null,
        schoolId: body.school_id ?? null,
        expiresAt: body.expires_at ?? null,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({
        title: 'Enlace incompleto',
        description:
          'Este enlace no trae el código de invitación. Abre de nuevo el email del centro y pulsa el botón original.',
        variant: 'destructive',
      });
      return;
    }
    if (nombre.trim().length < 2) {
      toast({
        title: 'Nombre requerido',
        description:
          'Escribe tu nombre con al menos 2 caracteres para poder crear correctamente tu perfil de docente.',
        variant: 'destructive',
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: 'Contraseña demasiado corta',
        description:
          'La contraseña debe tener 6 o más caracteres. Te recomendamos usar letras y números para mayor seguridad.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke('complete-teacher-invite', {
      body: {
        token,
        password,
        nombre: nombre.trim(),
      },
    });
    setSubmitting(false);

    if (error) {
      toast({
        title: inviteErrorTitle(data),
        description: inviteErrorDescription(data, 'teacher') ?? error.message,
        variant: 'destructive',
      });
      return;
    }

    const body = data as { ok?: boolean; error?: string } | null;
    if (body && body.ok !== true) {
      toast({
        title: inviteErrorTitle(body),
        description: inviteErrorDescription(body, 'teacher'),
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Cuenta de docente activada',
      description:
        'Tu cuenta ya está lista. Entra con el correo de la invitación y la contraseña que acabas de definir.',
    });
    navigate('/brainifamily/login');
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-braini-blue/10 via-white to-braini-turquoise/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-braini-blue/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-braini-turquoise/10 flex items-center justify-center mb-2">
            <GraduationCap className="w-7 h-7 text-braini-turquoise-dark" />
          </div>
          <CardTitle>Completar invitación — docente</CardTitle>
          <p className="text-sm text-muted-foreground font-normal">
            Establece tu nombre y contraseña para acceder al panel de maestro.
          </p>
        </CardHeader>
        <CardContent>
          {!token && (
            <p className="text-sm text-destructive mb-4">
              Este enlace no incluye token. Solicita un nuevo enlace al centro.
            </p>
          )}
          {loadingInvite && (
            <p className="text-sm text-muted-foreground mb-4">Cargando datos de la invitación...</p>
          )}
          {inviteInfo && (
            <div className="rounded-md border border-braini-blue/20 bg-braini-blue/5 p-3 mb-4 space-y-1 text-sm">
              <p>
                <span className="font-semibold">Correo invitado:</span>{' '}
                <span>{inviteInfo.email}</span>
              </p>
              <p>
                <span className="font-semibold">Centro:</span>{' '}
                <span>{inviteInfo.schoolName ?? inviteInfo.schoolId ?? 'No disponible'}</span>
              </p>
              {inviteInfo.expiresAt && (
                <p>
                  <span className="font-semibold">Caduca:</span>{' '}
                  <span>{new Date(inviteInfo.expiresAt).toLocaleString()}</span>
                </p>
              )}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="invite-email">Correo de la invitación</Label>
              <Input
                id="invite-email"
                value={inviteInfo?.email ?? '—'}
                readOnly
                disabled
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="name"
                minLength={2}
                required
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña *</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full bg-braini-turquoise hover:bg-braini-turquoise-dark text-white" disabled={submitting || !token}>
              {submitting ? 'Activando…' : 'Activar cuenta'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteTeacherInvite;
