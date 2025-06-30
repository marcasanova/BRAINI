import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import GeometricBackground from '@/components/GeometricBackground';
import { supabase } from '@/lib/supabaseClient';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validaciones básicas de campos vacíos, formato, etc.
    if (!email.trim() || !password.trim()) {
      toast({ title: "Información faltante", description: "Por favor, rellena todos los campos.", variant: "destructive" });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ title: "Email no válido", description: "Por favor, introduce una dirección de correo electrónico válida.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {  
      toast({ title: "Contraseña demasiado corta", description: "La contraseña debe tener al menos 6 caracteres.", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // 1. PRIMERO, verificamos si el email ya existe llamando a la Edge Function.
      const { data: checkData, error: checkError } = await supabase.functions.invoke('check-email-exists', {
        body: { email },
      });

      if (checkError) {
        // Si la función de verificación falla, lanzamos el error.
        throw checkError;
      }

      // 2. SI EL EMAIL EXISTE, mostramos error y detenemos el proceso.
      if (checkData.exists) {
        toast({
          title: "Registro fallido",
          description: "Este correo electrónico ya está registrado. Por favor, inicia sesión.",
          variant: "destructive"
        });
        // No necesitamos un `return` aquí porque la lógica del `else` no se ejecutará.
      } else {
        // 3. SI EL EMAIL NO EXISTE, procedemos con el registro.
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password
        });

        if (signUpError) {
          // Si el registro falla por otra razón (ej. error de Supabase), lanzamos el error.
          throw signUpError;
        }

        toast({
          title: "¡Registro pendiente!",
          description: "Revisa tu correo para verificar tu cuenta.",
        });

        setEmail('');
        setPassword('');
        localStorage.setItem('pendingVerificationEmail', email);
        navigate('/verify-email');
      }
    } catch (error) {
      const err = error as Error;
      toast({
        title: "Algo salió mal",
        description: err.message || "No se pudo completar el registro. Inténtalo de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              <span className="text-braini-blue">Braini</span>
            </h1>
          </div>
          <Card className="w-full bg-white/95 backdrop-blur-sm shadow-xl border-0 relative z-10 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Crear cuenta</h2>
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
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Contraseña *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Crea una contraseña (mín. 6 caracteres)"
                    className="border-2 border-gray-200 focus:border-braini-blue transition-colors"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>
              </form>
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  ¿Ya tienes una cuenta?{' '}
                  <Link 
                    to="/login" 
                    className="text-braini-blue hover:text-braini-blue-dark font-medium hover:underline transition-colors"
                  >
                    Inicia sesión
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

export default SignUp; 