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
    let isMounted = true; // ✅ Prevenir race conditions
    
    const checkUser = async () => {
      try {
        // 1. Verificar sesión con timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 10000)
        );
        
        const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]) as any;
        
        if (!isMounted) return; // ✅ Componente desmontado
        
        if (!session?.user) {
          setUser(null);
          setUserExists(false);
          setLoading(false);
          return;
        }

        // 2. Verificar que el usuario existe en la BD (con timeout)
        const dbCheckPromise = supabase
          .from('parents')
          .select('id')
          .eq('id', session.user.id)
          .single();
          
        const dbTimeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('BD Timeout')), 8000)
        );

        const { data: parentData, error } = await Promise.race([dbCheckPromise, dbTimeoutPromise]) as any;

        if (!isMounted) return; // ✅ Componente desmontado

        if (error || !parentData) {
          console.log('Usuario no encontrado en BD, cerrando sesión...', error?.message);
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
      } catch (error: any) {
        console.error('Error verificando usuario:', error.message);
        if (isMounted) {
          setUser(null);
          setUserExists(false);
          setLoading(false);
        }
      }
    };

    checkUser();
    
    return () => {
      isMounted = false; // ✅ Cleanup
    };

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.id);
        
        if (!isMounted) return; // ✅ Prevenir updates en componente desmontado
        
        if (event === 'SIGNED_OUT' || !session) {
          setUser(null);
          setUserExists(false);
          setLoading(false);
          return;
        }

        // Solo verificar BD en eventos específicos para evitar loops
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          try {
            const { data: parentData, error } = await supabase
              .from('parents')
              .select('id')
              .eq('id', session.user.id)
              .single();

            if (!isMounted) return; // ✅ Check again after async operation

            if (error || !parentData) {
              console.log('Usuario eliminado detectado, cerrando sesión...', error?.message);
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
            if (isMounted) {
              setUser(null);
              setUserExists(false);
              setLoading(false);
            }
          }
        } else {
          // Para otros eventos, solo actualizar el usuario sin verificar BD
          setUser(session.user);
          setUserExists(true);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
      isMounted = false;
    };
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