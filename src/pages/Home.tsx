import React, { useEffect, useState } from 'react';
import GeometricBackground from '@/components/GeometricBackground';
import { supabase } from '@/lib/supabaseClient';
import { useUserLevels } from '@/hooks/useUserLevels';
import LevelList from '@/components/LevelList';

const Home = () => {
  const [userId, setUserId] = useState<string | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id);
    });
  }, []);

  const { levels, loading, error } = useUserLevels(userId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 font-inter relative overflow-hidden">
      <GeometricBackground />
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-lg animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            <span className="text-braini-blue">Tus Niveles</span>
          </h1>
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