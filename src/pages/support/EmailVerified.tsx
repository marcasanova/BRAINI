import React from 'react';
import { useNavigate } from 'react-router-dom';
import GeometricBackground from '@/components/GeometricBackground';
import { Button } from '@/components/ui/button';

const EmailVerified: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-12 max-w-2xl w-full text-center animate-fade-in">
          <div className="mb-8 flex flex-col items-center">
            <span className="text-6xl mb-4">✅</span>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">¡Correo verificado con éxito!</h1>
            <p className="text-gray-600 mb-2 text-lg">
              Tu correo electrónico ha sido verificado correctamente. Ya puedes acceder a tu cuenta y disfrutar de todas las funcionalidades de BRAINI.
            </p>
          </div>
          <Button
            onClick={() => navigate('/login')}
            className="w-full py-4 text-lg mt-4"
          >
            Ir a iniciar sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerified; 