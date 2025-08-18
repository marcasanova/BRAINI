import React, { useState } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/hooks/use-toast';

const Welcome = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Header con Logo y Título */}
        <header className="text-center mb-12 animate-fade-in">
          <div className="mb-6">
            <span className="text-8xl">🧠</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            <span className="text-braini-blue">BRAINI</span>
          </h1>
          
          {/* Botón CTA Principal */}
          <div className="mt-6">
            <Button
              className="bg-gradient-to-r from-braini-green to-braini-green-light hover:from-braini-green-dark hover:to-braini-green text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xl min-w-[250px]"
            >
              Juega y aprende
            </Button>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            
            {/* Primer párrafo */}
            <p className="text-lg leading-relaxed">
              <strong>Braini</strong> es un programa de inteligencia emocional, con base científica y enfoque lúdico.
            </p>
            
            {/* Segundo párrafo */}
            <p className="text-lg leading-relaxed">
              A través de actividades sencillas, divertidas y cotidianas, podrás <strong>acompañar el desarrollo emocional de tu hijo/a</strong>, mientras descubres el porqué de cada ejercicio y accedes a las <strong>fuentes e investigaciones</strong> que lo avalan.
            </p>
            
            {/* Tercer párrafo */}
            <p className="text-lg leading-relaxed">
              Junto a tu hijo/a recorreréis un <strong>panel de 25 casillas</strong>, lleno de <strong>retos, juegos y actividades</strong> diseñadas para desarrollar su inteligencia emocional mientras os <strong>divertís juntos</strong>.
            </p>
            
            {/* Slogan destacado */}
            <div className="text-center my-8">
              <blockquote className="text-xl italic text-braini-blue font-medium border-l-4 border-braini-blue pl-6 py-4 bg-blue-50/50 rounded-r-lg">
                "Acompañar sus emociones de hoy, es fortalecer su bienestar del mañana."
              </blockquote>
            </div>
          </div>
          
          {/* Botón de Continuar */}
          <div className="mt-10 text-center">
            <Button
              onClick={async () => {
                setIsUpdating(true);
                try {
                  const { data: { user } } = await supabase.auth.getUser();
                  if (!user) throw new Error('No se pudo obtener el usuario autenticado.');
                  
                  // Actualizar has_seen_welcome a true
                  const { error } = await supabase
                    .from('parents')
                    .update({ has_seen_welcome: true })
                    .eq('id', user.id);
                  
                  if (error) throw error;
                  
                  toast({
                    title: "¡Bienvenido a BRAINI!",
                    description: "Ya puedes comenzar a explorar tus niveles.",
                  });
                  
                  // Navegar a home
                  navigate('/home');
                } catch (error) {
                  console.error('Error al actualizar welcome:', error);
                  toast({
                    title: "Error",
                    description: "No se pudo completar la configuración. Inténtalo de nuevo.",
                    variant: "destructive"
                  });
                } finally {
                  setIsUpdating(false);
                }
              }}
              disabled={isUpdating}
              className="bg-gradient-to-r from-braini-blue to-braini-blue-light hover:from-braini-blue-dark hover:to-braini-blue text-white font-semibold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-lg"
            >
              {isUpdating ? 'Configurando...' : 'Continuar'}
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Welcome; 