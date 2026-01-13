import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { User } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        // 1. Verificar sesión
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          setUser(null);
          setUserExists(false);
          setLoading(false);
          return;
        }

        // 2. Verificar que el usuario existe en la BD
        const { data: parentData, error } = await supabase
          .from('parents')
          .select('id')
          .eq('id', session.user.id)
          .single();

        if (error || !parentData) {
          // Usuario eliminado o no existe - cerrar sesión y redirigir
          console.log('Usuario no encontrado en BD, cerrando sesión...');
          await supabase.auth.signOut();
          setUser(null);
          setUserExists(false);
          setLoading(false);
          return;
        }

        // Usuario existe y tiene sesión válida
        setUser(session.user);
        setUserExists(true);
        setLoading(false);
      } catch (error) {
        console.error('Error verificando usuario:', error);
        setUser(null);
        setUserExists(false);
        setLoading(false);
      }
    };

    checkUser();

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setUserExists(false);
          setLoading(false);
          return;
        }

        // Verificar existencia cuando hay cambio de sesión
        try {
          const { data: parentData, error } = await supabase
            .from('parents')
            .select('id')
            .eq('id', session.user.id)
            .single();

          if (error || !parentData) {
            // Usuario eliminado - cerrar sesión
            console.log('Usuario eliminado detectado, cerrando sesión...');
            await supabase.auth.signOut();
            setUser(null);
            setUserExists(false);
          } else {
            setUser(session.user);
            setUserExists(true);
          }
          setLoading(false);
        } catch (error) {
          console.error('Error verificando usuario en auth change:', error);
          setUser(null);
          setUserExists(false);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-braini-blue rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-white text-xl">🧠</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !userExists) {
    return <Navigate to="/brainifamily/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;