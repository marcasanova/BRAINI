import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import GeometricBackground from '@/components/GeometricBackground';
import { User, LogOut, Lock, CheckCircle2, Circle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

// Estructura base para los niveles
type Level = {
  id: number;
  title: string;
  description: string;
  status: 'locked' | 'current' | 'completed';
};

const INITIAL_LEVELS: Level[] = [
  {
    id: 1,
    title: "Autoconocimiento Emocional",
    description: "Descubre y comprende tus emociones básicas",
    status: "current"
  },
  {
    id: 2,
    title: "Gestión del Estrés",
    description: "Aprende técnicas para manejar el estrés diario",
    status: "locked"
  },
  {
    id: 3,
    title: "Mindfulness Básico",
    description: "Introducción a la atención plena",
    status: "locked"
  },
  {
    id: 4,
    title: "Relaciones Interpersonales",
    description: "Mejora tus habilidades sociales y empatía",
    status: "locked"
  },
  {
    id: 5,
    title: "Resiliencia Emocional",
    description: "Desarrolla tu capacidad de recuperación",
    status: "locked"
  },
  {
    id: 6,
    title: "Inteligencia Emocional Avanzada",
    description: "Profundiza en el manejo emocional",
    status: "locked"
  },
  {
    id: 7,
    title: "Comunicación Asertiva",
    description: "Expresa tus necesidades de manera efectiva",
    status: "locked"
  },
  {
    id: 8,
    title: "Gestión del Cambio",
    description: "Adapta y evoluciona ante los cambios",
    status: "locked"
  },
  {
    id: 9,
    title: "Liderazgo Emocional",
    description: "Influye positivamente en otros",
    status: "locked"
  },
  {
    id: 10,
    title: "Maestría Emocional",
    description: "Integra todas las habilidades aprendidas",
    status: "locked"
  }
];

const Home = () => {
  const { toast } = useToast();
  const [levels, setLevels] = useState<Level[]>(INITIAL_LEVELS);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('mockUser');
      toast({
        title: "Sesión cerrada correctamente",
        description: "Has cerrado sesión en tu cuenta.",
      });
      window.location.href = '/';
    } catch (error) {
      toast({
        title: "Error al cerrar sesión",
        description: "Por favor, inténtalo de nuevo.",
        variant: "destructive"
      });
    }
  };

  const handleStartLevel = async (levelId: number) => {
    // Aquí iría la lógica para iniciar el nivel
    // Por ahora solo navegaremos a la página de evaluación
    window.location.href = `/assessment/${levelId}`;
  };

  const getLevelStatusIcon = (status: Level['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-8 h-8 text-green-500" />;
      case 'current':
        return <Circle className="w-8 h-8 text-braini-blue" />;
      case 'locked':
        return <Lock className="w-8 h-8 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      
      {/* Navigation Bar */}
      <nav className="relative z-10 p-4 bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/fa0ca160-fc3a-4e28-b976-371888549499.png" 
              alt="Braini Logo" 
              className="w-10 h-10 object-contain"
            />
            <h1 className="text-xl font-bold text-braini-blue">Braini</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              to="/profile" 
              className="flex items-center space-x-2 text-gray-700 hover:text-braini-blue transition-colors px-3 py-2 rounded-lg hover:bg-white/50"
            >
              <User size={18} />
              <span className="hidden md:inline">Perfil</span>
            </Link>
            
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2 border-braini-blue text-braini-blue hover:bg-braini-blue hover:text-white"
            >
              <LogOut size={16} />
              <span className="hidden md:inline">Cerrar Sesión</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Tu Viaje de <span className="text-braini-blue">Desarrollo Emocional</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Completa cada nivel secuencialmente para desbloquear nuevos desafíos y habilidades.
          </p>
        </div>

        {/* Levels Grid */}
        <div className="max-w-4xl mx-auto space-y-4">
          {levels.map((level) => (
            <Card 
              key={level.id}
              className={`transform transition-all duration-300 hover:shadow-lg ${
                level.status === 'locked' 
                  ? 'opacity-50 cursor-not-allowed bg-gray-50' 
                  : level.status === 'completed'
                  ? 'bg-green-50/50'
                  : 'bg-white hover:scale-[1.02] cursor-pointer'
              }`}
            >
              <div className="p-6 flex items-center space-x-6">
                {/* Level Number and Status */}
                <div className="flex-shrink-0 w-16 h-16 rounded-full bg-white shadow-inner flex items-center justify-center">
                  {getLevelStatusIcon(level.status)}
                </div>

                {/* Level Info */}
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    Nivel {level.id}: {level.title}
                  </h3>
                  <p className="text-gray-600">{level.description}</p>
                </div>

                {/* Action Button */}
                <div className="flex-shrink-0">
                  <Button
                    onClick={() => level.status === 'current' && handleStartLevel(level.id)}
                    disabled={level.status === 'locked'}
                    variant={level.status === 'completed' ? 'outline' : 'default'}
                    className={
                      level.status === 'completed'
                        ? 'border-green-500 text-green-500 hover:bg-green-50'
                        : level.status === 'current'
                        ? 'bg-braini-blue hover:bg-braini-blue-dark'
                        : 'bg-gray-300'
                    }
                  >
                    {level.status === 'completed' 
                      ? 'Completado' 
                      : level.status === 'current' 
                      ? 'Comenzar' 
                      : 'Bloqueado'}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
