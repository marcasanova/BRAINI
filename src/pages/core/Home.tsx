import React, { useEffect, useState } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import { supabase } from '@/lib/supabaseClient';
import { useUserLevels } from '@/hooks/useUserLevels';
import LevelList from '@/components/levels/LevelList';
import Navbar from '@/components/navigation/Navbar';
import MapDownload from '@/components/MapDownload';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      setUserId(user?.id);
      if (user?.id) {
        // Buscar el nombre del usuario en la tabla parents
        const { data: parentData, error } = await supabase
          .from('parents')
          .select('nombre')
          .eq('id', user.id)
          .single();
        if (parentData && parentData.nombre) {
          setUserName(parentData.nombre);
        }
      }
    });
  }, []);

  const { levels, loading, error } = useUserLevels(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      <Navbar />
      <div className="container mx-auto px-4 py-12 md:pl-80 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              <span className="text-braini-blue">
                {userName ? `Estos son tus niveles, ${userName}` : 'Tus Niveles'}
              </span>
            </h1>
            <MapDownload />
          </div>
          {loading ? (
            <div className="text-center text-gray-500 py-8">Cargando niveles...</div>
          ) : error ? (
            <div className="text-center text-red-600 py-8">{error}</div>
          ) : (
            <LevelList levels={levels} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home; 