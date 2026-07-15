import React, { useEffect, useMemo, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/shared/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/shared/hooks/use-toast';
import { inviteErrorDescription, inviteErrorTitle } from '@/integrations/supabase/lib/inviteErrors';
import { navigateParentAfterLogin } from '@/products/brainifamily/lib/parentPostLogin';
import { Eye, EyeOff, Heart, Info, LogOut, AlertCircle, CheckCircle2 } from 'lucide-react';

type ParentPreview = {
  email: string;
  schoolName: string | null;
  schoolId: string | null;
  childName: string | null;
  expiresAt: string | null;
  existingParentExists: boolean;
  existingParentName: string | null;
  existingChildrenNames: string[];
};

const PASSWORD_RECOVERY_REDIRECT = '/brainifamily/update-password';

const CompleteParentInvite: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<ParentPreview | null>(null);
  const [previewBlocked, setPreviewBlocked] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const refreshSession = React.useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const em = session?.user?.email?.trim().toLowerCase() ?? null;
    setSessionEmail(em);
  }, []);

  useEffect(() => {
    void refreshSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void refreshSession();
    });
    return () => subscription.unsubscribe();
  }, [refreshSession]);

  useEffect(() => {
    if (!token) {
      setInviteInfo(null);
      setPreviewBlocked(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setPreviewLoading(true);
      setPreviewBlocked(false);
      setInviteInfo(null);
      const { data, error } = await supabase.functions.invoke('complete-parent-invite', {
        body: { token, action: 'preview' },
      });
      setPreviewLoading(false);
      if (cancelled) return;

      if (error) {
        const msg =
          inviteErrorDescription(data, 'parent') ||
          error.message ||
          'No se ha podido cargar la invitación.';
        toast({
          title: inviteErrorTitle(data),
          description: msg,
          variant: 'destructive',
        });
        setPreviewBlocked(true);
        return;
      }

      const body = data as {
        ok?: boolean;
        email?: string;
        school_name?: string | null;
        school_id?: string | null;
        child_name?: string | null;
        expires_at?: string | null;
        existing_parent_exists?: boolean;
        existing_parent_name?: string | null;
        existing_children_names?: string[];
        error?: string;
      } | null;

      if (!body || body.ok !== true || !body.email) {
        const msg = inviteErrorDescription(body, 'parent') ?? 'No se ha podido validar el enlace.';
        toast({
          title: inviteErrorTitle(body),
          description: msg,
          variant: 'destructive',
        });
        setPreviewBlocked(true);
        return;
      }

      setInviteInfo({
        email: body.email.trim().toLowerCase(),
        schoolName: body.school_name ?? null,
        schoolId: body.school_id ?? null,
        childName: body.child_name ?? null,
        expiresAt: body.expires_at ?? null,
        existingParentExists: body.existing_parent_exists === true,
        existingParentName:
          typeof body.existing_parent_name === 'string'
            ? body.existing_parent_name
            : null,
        existingChildrenNames: Array.isArray(body.existing_children_names)
          ? body.existing_children_names.filter(
              (v): v is string => typeof v === 'string' && v.trim().length > 0,
            )
          : [],
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  const inviteEmailLower = inviteInfo?.email ?? '';
  const isExistingParent = inviteInfo?.existingParentExists === true;
  const existingParentDisplayName = inviteInfo?.existingParentName?.trim() || 'familia';
  const existingChildrenText =
    inviteInfo?.existingChildrenNames.length
      ? inviteInfo.existingChildrenNames.join(', ')
      : null;
  const childToLink = inviteInfo?.childName ?? 'este alumno/a';
  const sessionMatchesInvite = useMemo(() => {
    if (!sessionEmail || !inviteEmailLower) return false;
    return sessionEmail === inviteEmailLower;
  }, [sessionEmail, inviteEmailLower]);
  const sessionConflictsInvite = useMemo(() => {
    if (!sessionEmail || !inviteEmailLower) return false;
    return sessionEmail !== inviteEmailLower;
  }, [sessionEmail, inviteEmailLower]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Sesión cerrada',
      description:
        'Ahora puedes continuar con el correo correcto de la invitación. Si ya tenías cuenta, introduce tu contraseña para confirmar el vínculo.',
    });
    void refreshSession();
  };

  const handlePasswordReset = async () => {
    const email = resetEmail.trim().toLowerCase();
    if (!email) {
      toast({
        title: 'Correo requerido',
        description:
          'Introduce tu correo para enviarte el enlace de recuperación de contraseña.',
        variant: 'destructive',
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Correo inválido',
        description: 'Revisa el formato del correo (ejemplo: tu@email.com).',
        variant: 'destructive',
      });
      return;
    }

    setIsResetting(true);
    try {
      const redirectTo = `${window.location.origin}${PASSWORD_RECOVERY_REDIRECT}`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) throw error;
      toast({
        title: 'Enlace enviado',
        description: `Si existe una cuenta para ${email}, recibirás un email con instrucciones para restablecer la contraseña.`,
      });
      setIsResetDialogOpen(false);
      setResetEmail('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'No se pudo enviar el enlace.';
      toast({
        title: 'No se pudo enviar el enlace',
        description: msg,
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast({
        title: 'Enlace incompleto',
        description:
          'Falta información en el enlace. Abre la invitación desde el correo o copia la URL completa.',
        variant: 'destructive',
      });
      return;
    }

    if (previewBlocked || !inviteInfo) {
      toast({
        title: 'Invitación no disponible',
        description:
          'No pudimos validar esta invitación. Recarga la página y, si persiste, solicita al centro un enlace nuevo.',
        variant: 'destructive',
      });
      return;
    }

    if (sessionConflictsInvite) {
      toast({
        title: 'Correo distinto al de la invitación',
        description:
          'Estás conectado/a con otro correo. Cierra sesión abajo o usa el navegador en modo privado con el correo de la invitación.',
        variant: 'destructive',
      });
      return;
    }

    const {
      data: { session },
    } = await supabase.auth.getSession();
    const hasSession = !!session?.user;

    const body: { token: string; password?: string; nombre: string | null } = {
      token,
      nombre: nombre.trim() ? nombre.trim() : null,
    };

    if (!hasSession) {
      if (password.length < 6) {
        toast({
          title: 'Contraseña necesaria',
          description:
          'Necesitamos tu contraseña para confirmar esta invitación. Si es tu primera vez, crea una de al menos 6 caracteres; si ya tienes cuenta, usa tu contraseña actual.',
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
      toast({
        title: inviteErrorTitle(data),
        description: inviteErrorDescription(data, 'parent') ?? error.message,
        variant: 'destructive',
      });
      return;
    }

    const res = data as {
      ok?: boolean;
      error?: string;
      used_existing_session?: boolean;
      school_name?: string | null;
    } | null;

    if (!res || res.ok !== true) {
      toast({
        title: inviteErrorTitle(res),
        description: inviteErrorDescription(res, 'parent') ?? 'Respuesta inesperada del servidor.',
        variant: 'destructive',
      });
      return;
    }

    const childLabel = inviteInfo.childName ?? 'tu hijo o hija';
    const schoolLabel = res.school_name ?? inviteInfo.schoolName ?? 'el centro';

    if (res.used_existing_session) {
      toast({
        title: 'Familia vinculada',
        description: `${childLabel} queda enlazado/a a tu cuenta en ${schoolLabel}. Entrando…`,
      });
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.id) {
        await navigateParentAfterLogin(navigate, user.id, toast);
      } else {
        navigate('/brainifamily/login');
      }
      return;
    }

    toast({
      title: 'Cuenta lista',
      description: `Te hemos vinculado con ${childLabel} en ${schoolLabel}. Entrando…`,
    });

    const loginEmail = inviteInfo.email;
    if (body.password && loginEmail) {
      const { error: signErr } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: body.password,
      });
      if (!signErr) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (user?.id) {
          await navigateParentAfterLogin(navigate, user.id, toast);
        } else {
          navigate('/brainifamily/login');
        }
        return;
      }
      toast({
        title: 'Vinculación correcta',
        description:
          signErr.message ||
          'La vinculación se completó, pero no pudimos iniciar sesión automáticamente. Vuelve a intentar el acceso desde la pantalla de login.',
        variant: 'destructive',
      });
    }

    navigate('/brainifamily/login');
  };

  const showForm = token && !previewLoading && !previewBlocked && inviteInfo;

  return (
    <div className="min-h-screen bg-linear-to-br from-braini-blue/10 via-white to-braini-pink/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-braini-blue/20">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-braini-pink/15 flex items-center justify-center mb-2">
            <Heart className="w-7 h-7 text-braini-pink-dark" />
          </div>
          <CardTitle>Invitación familia — Braini</CardTitle>
          <p className="text-sm text-muted-foreground font-normal">
            Vincula esta invitación para continuar en la app.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!token && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Enlace incompleto</AlertTitle>
              <AlertDescription>
                Este enlace no incluye el código de invitación. Abre el mensaje que te envió el centro y usa el botón o enlace completo.
              </AlertDescription>
            </Alert>
          )}

          {token && previewLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
              <span className="inline-block h-4 w-4 border-2 border-braini-pink border-t-transparent rounded-full animate-spin" />
              Comprobando invitación…
            </div>
          )}

          {token && previewBlocked && !previewLoading && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>No podemos mostrar esta invitación</AlertTitle>
              <AlertDescription>
                El enlace puede haber caducado o no ser válido. Pide al centro educativo que te envíe una nueva invitación.
              </AlertDescription>
            </Alert>
          )}

          {inviteInfo && (
            <Alert className="border-braini-blue/30 bg-braini-blue/5">
              <CheckCircle2 className="h-4 w-4 text-braini-blue" />
              <AlertTitle className="text-braini-blue">Resumen de la invitación</AlertTitle>
              <AlertDescription className="text-left space-y-1 text-sm mt-2">
                <p>
                  <span className="font-semibold text-foreground">Correo:</span>{' '}
                  {inviteInfo.email}
                </p>
                {inviteInfo.childName && (
                  <p>
                    <span className="font-semibold text-foreground">Alumno/a:</span> {inviteInfo.childName}
                  </p>
                )}
                <p>
                  <span className="font-semibold text-foreground">Centro:</span>{' '}
                  {inviteInfo.schoolName ?? inviteInfo.schoolId ?? '—'}
                </p>
                {inviteInfo.expiresAt && (
                  <p className="text-muted-foreground text-xs">
                    Invitación válida hasta:{' '}
                    {new Date(inviteInfo.expiresAt).toLocaleString('es', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                )}
              </AlertDescription>
            </Alert>
          )}

          {sessionConflictsInvite && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Sesión con otro correo</AlertTitle>
              <AlertDescription className="space-y-3">
                <p>
                  Estás conectado/a como <strong>{sessionEmail}</strong>, pero esta invitación es para{' '}
                  <strong>{inviteEmailLower}</strong>.
                </p>
                <Button type="button" variant="outline" size="sm" className="gap-2" onClick={() => void handleLogout()}>
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión y continuar
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {sessionMatchesInvite && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Sesión correcta</AlertTitle>
              <AlertDescription>
                Ya estás identificado/a con el mismo correo que la invitación. Puedes completar el vínculo sin contraseña. Si quieres cambiar la contraseña de tu cuenta, puedes hacerlo después en tu perfil.
              </AlertDescription>
            </Alert>
          )}

          {inviteInfo && isExistingParent && (
            <Alert className="border-braini-pink/30 bg-braini-pink/5">
              <Info className="h-4 w-4 text-braini-pink-dark" />
              <AlertTitle className="text-braini-pink-dark">Cuenta existente</AlertTitle>
              <AlertDescription className="space-y-1">
                <p>
                  <strong>{existingParentDisplayName}</strong>, ya tienes cuenta en Braini.
                </p>
                {existingChildrenText ? (
                  <p>
                    Hijos vinculados: <strong>{existingChildrenText}</strong>.
                  </p>
                ) : (
                  <p>No hay hijos vinculados actualmente en tu perfil.</p>
                )}
                <p>
                  Acción: añadir a <strong>{childToLink}</strong>.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {!sessionEmail && inviteInfo && (
            <Alert variant="default" className="border-muted bg-muted/40">
              <Info className="h-4 w-4" />
              <AlertTitle className="text-sm">Qué debes hacer ahora</AlertTitle>
              <AlertDescription className="text-sm">
                {isExistingParent ? (
                  <>
                    Introduce la contraseña de <strong>{inviteInfo.email}</strong> para confirmar el vínculo.
                  </>
                ) : (
                  <>
                    Crea tu contraseña (mínimo 6 caracteres) para activar tu cuenta con <strong>{inviteInfo.email}</strong>.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isExistingParent && (
                <div>
                  <Label htmlFor="nombre-p">Tu nombre (opcional)</Label>
                  <Input
                    id="nombre-p"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    autoComplete="name"
                    placeholder="Cómo quieres que te llamemos"
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Si lo dejas vacío, usaremos una forma corta derivada de tu correo para tu perfil.
                  </p>
                </div>
              )}
              <div>
                <Label htmlFor="password-p">
                  Contraseña{' '}
                  {!sessionMatchesInvite
                    ? isExistingParent
                      ? '(de tu cuenta actual)'
                      : '(obligatoria sin sesión)'
                    : '(solo si quieres usarla en esta petición)'}
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password-p"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete={sessionMatchesInvite ? 'current-password' : 'new-password'}
                    minLength={6}
                    placeholder={
                      sessionMatchesInvite
                        ? 'Opcional al tener sesión'
                        : isExistingParent
                          ? 'Contraseña de tu cuenta'
                          : 'Mínimo 6 caracteres'
                    }
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <div className="mt-2 text-right">
                  <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto p-0 text-xs text-braini-blue underline"
                        onClick={() => setResetEmail(inviteInfo?.email ?? '')}
                      >
                        ¿Has olvidado tu contraseña?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle>Recuperar contraseña</DialogTitle>
                        <DialogDescription>
                          Te enviaremos un enlace para restablecer tu contraseña.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-2 py-2">
                        <Label htmlFor="reset-email-parent">Correo electrónico</Label>
                        <Input
                          id="reset-email-parent"
                          type="email"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          placeholder="tu@email.com"
                        />
                      </div>
                      <DialogFooter>
                        <Button type="button" onClick={handlePasswordReset} disabled={isResetting}>
                          {isResetting ? 'Enviando…' : 'Enviar enlace'}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-braini-pink hover:bg-braini-pink-dark text-white"
                disabled={submitting || sessionConflictsInvite}
              >
                {submitting ? 'Procesando…' : isExistingParent ? 'Añadir hijo/a' : 'Completar invitación'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompleteParentInvite;
