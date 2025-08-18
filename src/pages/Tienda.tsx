import React from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import Navbar from '@/components/Navbar';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Package, Star, Gift, Users, BookOpen } from 'lucide-react';

const Tienda = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      <Navbar />
      <div className="container mx-auto px-4 py-12 md:pl-80 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <ShoppingBag className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              <span className="text-orange-500">Tienda BRAINI</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Productos, servicios y recursos premium para potenciar el desarrollo emocional
            </p>
          </div>

          {/* Contenido Principal */}
          <Card className="bg-white/95 backdrop-blur-lg shadow-xl border-0 p-8 animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-orange-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                🚧 Tienda en Construcción 🚧
              </h2>
              
              <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                Estamos preparando una tienda completa con productos y servicios que complementarán 
                perfectamente tu experiencia en BRAINI.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
                  <BookOpen className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Libros y Materiales</h3>
                  <p className="text-sm text-gray-600">
                    Guías especializadas, libros de actividades y recursos educativos
                  </p>
                </div>
                
                <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
                  <Gift className="w-10 h-10 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Kits de Actividades</h3>
                  <p className="text-sm text-gray-600">
                    Cajas con materiales y juegos para desarrollar la IE
                  </p>
                </div>
                
                <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
                  <Users className="w-10 h-10 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Consultas Personalizadas</h3>
                  <p className="text-sm text-gray-600">
                    Sesiones con expertos en inteligencia emocional
                  </p>
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
                  <Star className="w-10 h-10 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-800 mb-2">Contenido Premium</h3>
                  <p className="text-sm text-gray-600">
                    Cursos avanzados y contenido exclusivo para miembros
                  </p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <h3 className="font-semibold text-gray-800 mb-3">¿Qué encontrarás en la tienda?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span>Productos físicos de alta calidad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span>Servicios de consultoría</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Contenido digital premium</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
                <p className="text-sm text-gray-600">
                  <strong>Próximamente:</strong> La tienda estará disponible en las próximas semanas. 
                  Mientras tanto, puedes explorar todos los recursos gratuitos de BRAINI.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tienda;
