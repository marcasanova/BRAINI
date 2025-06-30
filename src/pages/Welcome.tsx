import React from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-800">
            <span className="text-braini-blue">BRAINI</span>
          </h1>
        </header>

        <main className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bienvenido a tu espacio</h2>
            <p>
              Aquí encontrarás una guía y herramientas para entender y gestionar tus emociones. A continuación, te presentamos los puntos clave que exploraremos juntos:
            </p>
            <ul>
              <li>
                <strong>Punto 1:</strong> (Texto de marcador de posición) Descripción breve del primer concepto o herramienta que el usuario aprenderá.
              </li>
              <li>
                <strong>Punto 2:</strong> (Texto de marcador de posición) Descripción breve del segundo concepto o herramienta.
              </li>
              <li>
                <strong>Punto 3:</strong> (Texto de marcador de posición) Descripción breve del tercer concepto o herramienta.
              </li>
              <li>
                <strong>Punto 4:</strong> (Texto de marcador de posición) Descripción breve de un cuarto punto importante.
              </li>
            </ul>
            <p className="mt-6">
              ¡Estamos emocionados de acompañarte en este viaje de autodescubrimiento y crecimiento!
            </p>
          </div>
          <div className="mt-10 text-center">
            <Button
              onClick={() => navigate('/home')}
              className="bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
            >
              Continuar
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Welcome; 