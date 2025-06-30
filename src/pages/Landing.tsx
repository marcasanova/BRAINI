import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GeometricBackground from '@/components/GeometricBackground';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header */}
        <header className="text-center mb-16 animate-fade-in">
          <div className="mb-6">
            <span className="text-8xl animate-bounce-slow">🧠</span>
          </div>
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            <span className="text-braini-blue">BRAINI</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Tu compañero inteligente para el bienestar emocional y el crecimiento personal
          </p>
        </header>

        {/* Hero Section */}
        <main className="max-w-6xl mx-auto">
          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Autoconocimiento</h3>
              <p className="text-gray-600">
                Descubre y entiende tus emociones con herramientas científicas y ejercicios prácticos
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-4xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Crecimiento Personal</h3>
              <p className="text-gray-600">
                Desarrolla habilidades emocionales y construye una vida más equilibrada y plena
              </p>
            </div>
            
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg text-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
              <div className="text-4xl mb-4">💡</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Inteligencia Emocional</h3>
              <p className="text-gray-600">
                Aprende a gestionar tus emociones y mejorar tus relaciones personales
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white/90 backdrop-blur-sm p-12 rounded-2xl shadow-xl text-center animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              ¿Listo para comenzar tu viaje?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Únete a miles de personas que ya están transformando sus vidas con BRAINI. 
              Tu bienestar emocional está a solo un clic de distancia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg min-w-[200px]">
                  Crear cuenta
                </Button>
              </Link>
              
              <Link to="/login">
                <Button variant="outline" className="border-2 border-braini-blue text-braini-blue hover:bg-braini-blue hover:text-white font-semibold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg min-w-[200px]">
                  Iniciar sesión
                </Button>
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center text-gray-500">
            <p className="text-sm">
              ¿Ya tienes una cuenta? <Link to="/login" className="text-braini-blue hover:underline">Inicia sesión aquí</Link>
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Landing; 