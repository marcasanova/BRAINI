import React from 'react';
import GeometricBackground from '@/components/GeometricBackground';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            <span className="text-braini-blue">Home</span>
          </h1>
          <p className="text-gray-600">
            Esta página está en construcción. Próximamente tendrás contenido aquí.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 