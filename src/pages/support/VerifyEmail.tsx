import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Backgrounds from '@/components/Backgrounds';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

const VerifyEmail: React.FC = () => {
  const [isResending, setIsResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  // Al cargar la página, lee el email de localStorage
  useEffect(() => {
    const storedEmail = localStorage.getItem('pendingVerificationEmail') || '';
    setEmail(storedEmail);
  }, []);

  // Reenvía el email de verificación usando el email almacenado
  const handleResend = async () => {
    setIsResending(true);
    setResent(false);
    try {
      if (!email) throw new Error('No se encontró el correo a verificar.');
      const { error } = await supabase.auth.resend({ type: 'signup', email });
      if (error) throw error;
      setResent(true);
      toast({
        title: 'Correo reenviado',
        description: 'Te hemos enviado un nuevo correo de verificación.',
      });
    } catch (err) {
      toast({
        title: 'Error al reenviar',
        description: err instanceof Error ? err.message : 'No se pudo reenviar el correo.',
        variant: 'destructive',
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-montserrat relative overflow-hidden">
      <Backgrounds />
      <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-12 max-w-2xl w-full text-center animate-fade-in">
          <div className="mb-8 flex flex-col items-center">
            <span className="text-6xl mb-4">📧</span>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-3" style={{ fontWeight: 900 }}>¡Verifica tu correo electrónico!</h1>
            <p className="text-gray-700 mb-2 text-lg font-medium">
              Te hemos enviado un correo de verificación a:
            </p>
            <p className="text-braini-blue font-semibold text-lg mb-4">{email}</p>
            <ul className="text-gray-500 text-base mb-6 list-disc list-inside text-left max-w-lg mx-auto">
              <li>Si no ves el correo, revisa tu carpeta de spam o promociones.</li>
              <li>El enlace de verificación caduca en unas horas.</li>
            </ul>
          </div>
          <Button
            onClick={handleResend}
            disabled={isResending}
            className="w-full mb-4 py-4 text-lg"
            variant="outline"
          >
            {isResending ? 'Reenviando...' : 'Reenviar correo de verificación'}
          </Button>
          {resent && <p className="text-green-600 text-base mb-4">¡Correo reenviado!</p>}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 