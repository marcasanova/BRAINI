import React, { useEffect, useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, Heart } from 'lucide-react';

function describeInviteError(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const o = data as Record<string, unknown>;
  if (typeof o.message === 'string') return o.message;
  const code = o.error;
  if (code === 'email_already_registered') {
    return o.message != null && typeof o.message === 'string'
      ? o.message
      : 'Este correo ya está registrado. Inicia sesión y vuelve a abrir el enlace, o contacta con el centro.';
  }
  if (code === 'invite_not_valid_or_expired') {
    return 'La invitación no es válida o ha caducado.';
  }
  if (code === 'invalid_invite') {
    return 'Enlace de invitación no válido.';
  }
  if (typeof code === 'string') return code;
  return null;
}

const CompleteParentInvite: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';
  const [nombre, setNombre] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hasSession, setHasSession] = useState<boolean | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) setHasSession(!!session?.user);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({
        title: 'Enlace incompleto',
        description: 'Falta el token en la URL.',
        variant: 'destructive',
      });
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const body: { token: string; password?: string; nombre: string | null } = {
      token,
      nombre: nombre.trim() || null,
    };
    if (!session?.user) {
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail.trim());
      if (!emailOk) {
        toast({
          title: 'Correo requerido',
          description: 'Introduce el correo al que te llegó la invitación (mismo que usarás para entrar).',
          variant: 'destructive',
        });
        return;
      }
      if (password.length < 6) {
        toast({
          title: 'Contraseña requerida',
          description: 'Usa al menos 6 caracteres o inicia sesión primero si ya tienes cuenta con el mismo email.',
          variant: 'destructive',
        });
        return;
      }
      body.password = password;
    } else if (password.length >= 6) {
      body.password = password;
    }

    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke('complete-parent-invite', {
      body,
    });
    setSubmitting(false);

    if (error) {
      const msg = describeInviteError(data) ?? error.message;
      toast({
        title: 'No se pudo completar la invitación',
        description: msg,
        variant: 'destructive',
      });
      return;
    }

    const res = data as {
      ok?: boolean;
      error?: string;
      used_existing_session?: boolean;
    } | null;

    if (!res || res.ok !== true) {
      toast({
        title: 'No se pudo completar la invitación',
        description: describeInviteError(res) ?? 'Respuesta inesperada del servidor.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Invitación completada',
      description: res.used_existing_session
        ? 'Tu familia ya está enlazada. Te llevamos al inicio.'
        : 'Cuenta creada. Entrando…',
    });

    if (res.used_existing_session) {
      navigate('/brainifamily/home');
      return;
    }

    if (body.password) {
      const email = inviteEmail.trim().toLowerCase();
      if (email) {
        const { error: signErr } = await supabase.auth.signInWithPassword({
          email,
          password: body.password,
        });
        if (!signErr) {
          navigate('/brainifamily/home');
          return;
        }
        toast({
          title: 'Cuenta creada',
          description: signErr.message || 'No se pudo iniciar sesión automáticamente. Entra manualmente.',
          variant: 'destructive',
        });
      }
    }

    navigate('/brainifamily/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-2">
            <Heart className="w-7 h-7 text-rose-600" />
          </div>
          <CardTitle>Completar invitación — familia</CardTitle>
          <p className="text-sm text-muted-foreground font-normal">
            Si ya tienes sesión con el mismo email de la invitación, puedes dejar la contraseña en blanco y enviar el
            formulario.
          </p>
        </CardHeader>
        <CardContent>
          {!token && (
            <p className="text-sm text-destructive mb-4">Este enlace no incluye token.</p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            {hasSession === false && (
              <div>
                <Label htmlFor="invite-email">Correo de la invitación</Label>
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  autoComplete="email"
                  placeholder="mismo correo que recibió el enlace"
                  className="mt-1"
                />
              </div>
            )}
            <div>
              <Label htmlFor="nombre-p">Nombre (opcional)</Label>
              <Input
                id="nombre-p"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password-p">Contraseña (nueva cuenta)</Label>
              <div className="relative mt-1">
                <Input
                  id="password-p"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
                  placeholder="Solo si aún no tienes cuenta Braini"
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
            <Button type="submit" className="w-full" disabled={submitting || !token}>
              {submitting ? 'Procesando…' : 'Completar invitación'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            <Link to="/brainifamily/login" className="text-rose-700 hover:underline">
              Ir a inicio de sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteParentInvite;
