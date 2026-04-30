import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';

function describeInviteError(data: unknown): string | null {
  if (!data || typeof data !== 'object') return null;
  const o = data as Record<string, unknown>;
  if (typeof o.message === 'string') return o.message;
  const code = o.error;
  if (code === 'email_already_registered') {
    return 'Este correo ya tiene cuenta. Inicia sesión o contacta con el centro.';
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

const CompleteTeacherInvite: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({
        title: 'Enlace incompleto',
        description: 'Falta el token en la URL. Usa el enlace que te envió el centro.',
        variant: 'destructive',
      });
      return;
    }
    if (password.length < 6) {
      toast({
        title: 'Contraseña demasiado corta',
        description: 'Usa al menos 6 caracteres.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke('complete-teacher-invite', {
      body: {
        token,
        password,
        nombre: nombre.trim() || null,
      },
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

    const body = data as { ok?: boolean; error?: string } | null;
    if (body && body.ok !== true) {
      toast({
        title: 'No se pudo completar la invitación',
        description: describeInviteError(body) ?? 'Respuesta inesperada del servidor.',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Cuenta de docente activada',
      description: 'Inicia sesión con el email de la invitación y la contraseña que acabas de crear.',
    });
    navigate('/brainifamily/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <GraduationCap className="w-7 h-7 text-blue-600" />
          </div>
          <CardTitle>Completar invitación — docente</CardTitle>
          <p className="text-sm text-muted-foreground font-normal">
            Establece tu contraseña para acceder al panel de maestro.
          </p>
        </CardHeader>
        <CardContent>
          {!token && (
            <p className="text-sm text-destructive mb-4">
              Este enlace no incluye token. Solicita un nuevo enlace al centro.
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="nombre">Nombre (opcional)</Label>
              <Input
                id="nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                autoComplete="name"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  minLength={6}
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
              {submitting ? 'Activando…' : 'Activar cuenta'}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            <Link to="/brainifamily/login" className="text-blue-600 hover:underline">
              Volver al inicio de sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteTeacherInvite;
