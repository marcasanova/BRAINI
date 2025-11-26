import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Backgrounds from '@/components/Backgrounds';
import { supabase } from '@/lib/supabaseClient';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // State for password reset
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  const handlePasswordReset = async () => {
    if (!resetEmail.trim()) {
      toast({
        title: "Correo electrónico requerido",
        description: "Por favor, introduce tu correo electrónico.",
        variant: "destructive",
      });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resetEmail)) {
      toast({
        title: "Email no válido",
        description: "Por favor, introduce una dirección de correo electrónico válida.",
        variant: "destructive",
      });
      return;
    }

    setIsResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) throw error;

      toast({
        title: "Enlace enviado",
        description: "Si existe una cuenta con este correo, te hemos enviado un enlace para restablecer tu contraseña.",
      });
      setIsResetDialogOpen(false);
      setResetEmail('');
    } catch (error) {
      toast({
        title: "Error al enviar el enlace",
        description: "No se pudo enviar el enlace de recuperación. Por favor, inténtalo de nuevo más tarde.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Información faltante",
        description: "Por favor, rellena todos los campos.",
        variant: "destructive"
      });
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email no válido",
        description: "Por favor, introduce una dirección de correo electrónico válida.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message || "Email o contraseña no válidos");
      }

      toast({
        title: "¡Bienvenido/a de vuelta! 🎉",
        description: "Has iniciado sesión correctamente en Braini.",
      });

      // Reset form
      setEmail('');
      setPassword('');

      // Comprobar si el perfil está completo
      const userId = data.user?.id;
      if (!userId) throw new Error('No se pudo obtener el usuario autenticado.');
      
      // Obtener datos del padre
      const { data: parentData, error: parentError } = await supabase
        .from('parents')
        .select('profile_completed, is_trial_user')
        .eq('id', userId)
        .single();
      if (parentError) throw parentError;
      if (!parentData) throw new Error('No se encontró el perfil del usuario.');
      
      // Verificar si el perfil del padre está completo
      if (parentData.profile_completed === false) {
        navigate('/parents-profile');
        return;
      }
      
      // Verificar si es usuario de prueba (saltar todo el onboarding)
      if (parentData.is_trial_user === true) {
        navigate('/home');
        return;
      }
      
      // Verificar si el perfil del hijo está completo
      const { data: childData, error: childError } = await supabase
        .from('children')
        .select('id')
        .eq('parent_id', userId)
        .single();
      
      if (childError && childError.code !== 'PGRST116') {
        // Error real, no solo "no encontrado"
        throw childError;
      }
      
      if (!childData) {
        // No hay hijo registrado, ir a ChildProfile
        navigate('/child-profile');
        return;
      }
      
      // Perfil completo, ir directamente a Home
      navigate('/home');
    } catch (error) {
      toast({
        title: "Inicio de sesión fallido",
        description: error instanceof Error ? error.message : "Email o contraseña no válidos. Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-montserrat relative overflow-hidden">
      <Backgrounds />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-md mx-auto">
          {/* Logo and Title Section */}
          <div className="text-center mb-8 animate-fade-in">
            
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              <span className="text-braini-blue">Braini</span>
            </h1>
          </div>

          {/* Login Form */}
          <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl border-0 relative z-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Iniciar sesión</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Correo electrónico *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Introduce correo electrónico"
                    className="border-2 border-gray-200 focus:border-braini-blue transition-colors"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="password" className="text-gray-700 font-medium">
                      Contraseña *
                    </Label>
                    <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="link" className="text-sm px-0 font-normal h-auto py-1">
                          ¿Has olvidado tu contraseña?
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Recuperar contraseña</DialogTitle>
                          <DialogDescription>
                            Introduce tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="reset-email">
                              Email
                            </Label>
                            <Input
                              id="reset-email"
                              type="email"
                              value={resetEmail}
                              onChange={(e) => setResetEmail(e.target.value)}
                              placeholder="tu@email.com"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handlePasswordReset} disabled={isResetting}>
                            {isResetting ? 'Enviando...' : 'Enviar enlace'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Introduce contraseña"
                    className="border-2 border-gray-200 focus:border-braini-blue transition-colors"
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  ¿No tienes una cuenta?{' '}
                  <Link 
                    to="/signup" 
                    className="text-braini-blue hover:text-braini-blue-dark font-medium hover:underline transition-colors"
                  >
                    Regístrate
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;