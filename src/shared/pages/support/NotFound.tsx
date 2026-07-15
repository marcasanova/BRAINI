import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Backgrounds from '@/shared/components/Backgrounds';
import { Button } from '@/shared/ui/button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white font-montserrat relative overflow-hidden flex items-center justify-center">
      <Backgrounds />
      <div className="relative z-10 text-center p-8 bg-white/95 backdrop-blur-lg rounded-2xl shadow-xl border-0 max-w-lg mx-auto animate-fade-in md:ml-80">
        <h1 className="text-7xl sm:text-8xl font-black text-braini-blue mb-4 drop-shadow-sm" style={{ fontWeight: 900 }}>404</h1>
        <p className="text-2xl md:text-3xl font-black text-gray-700 mb-2" style={{ fontWeight: 900 }}>¡Ups! Página no encontrada</p>
        <p className="text-md sm:text-lg text-gray-600 mb-6 font-medium">La ruta <span className="font-mono bg-gray-200 px-2 py-1 rounded">{location.pathname}</span> no existe.</p>
        <Button asChild className="bg-braini-blue hover:bg-braini-blue-dark text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg transition-all">
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
