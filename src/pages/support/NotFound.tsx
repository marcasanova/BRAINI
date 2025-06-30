import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import GeometricBackground from '@/components/GeometricBackground';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden flex items-center justify-center">
      <GeometricBackground />
      <div className="relative z-10 text-center p-8 bg-white/90 rounded-2xl shadow-2xl max-w-lg mx-auto animate-fade-in">
        <h1 className="text-7xl font-extrabold text-braini-blue mb-4 drop-shadow">404</h1>
        <p className="text-2xl md:text-3xl font-semibold text-gray-700 mb-2">¡Ups! Página no encontrada</p>
        <p className="text-md text-gray-500 mb-6">La ruta <span className="font-mono bg-gray-200 px-2 py-1 rounded">{location.pathname}</span> no existe.</p>
        <Button asChild className="bg-braini-blue hover:bg-braini-blue-dark text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition-all">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
