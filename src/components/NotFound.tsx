import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import GeometricBackground from './GeometricBackground';
import { Home, ArrowRight, Clock } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  // Redirección automática después de 5 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Icon */}
          <div className="mb-8 animate-fade-in">
            <div className="w-32 h-32 bg-gradient-to-br from-braini-blue to-braini-pink rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <span className="text-6xl font-bold text-white">404</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              ¡Ups! Página no encontrada
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-6">
              La página que buscas no existe o ha sido movida.
            </p>
          </div>

          {/* Message Card */}
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl border-0 mb-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardContent className="p-8">
              <div className="w-16 h-16 bg-braini-blue/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <Clock className="w-8 h-8 text-braini-blue" />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                ¿Qué tal si exploras Braini?
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                Mientras tanto, únete a nuestra waitlist y sé el primero en descubrir cómo Braini puede transformar tu bienestar emocional y mental.
              </p>

              <div className="space-y-4">
                <Button 
                  onClick={handleGoHome}
                  className="w-full bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <Home size={20} className="mr-2" />
                  Ir a la Waitlist
                </Button>
                
                <p className="text-sm text-gray-500">
                  Redirección automática en <span className="font-semibold text-braini-blue">5 segundos</span>
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="border-braini-blue text-braini-blue hover:bg-braini-blue hover:text-white transition-all duration-200"
            >
              <ArrowRight size={18} className="mr-2 rotate-180" />
              Volver Atrás
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => window.location.reload()}
              className="border-gray-300 text-gray-700 hover:bg-gray-100 transition-all duration-200"
            >
              <ArrowRight size={18} className="mr-2" />
              Recargar
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-12 animate-fade-in" style={{ animationDelay: '0.9s' }}>
            <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 max-w-lg mx-auto">
              <h3 className="font-semibold text-gray-800 mb-3">¿Necesitas ayuda?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Si crees que esto es un error, por favor contacta con nuestro equipo de soporte.
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-500">
                <span>📧 support@braini.com</span>
                <span>💬 Chat en vivo</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
