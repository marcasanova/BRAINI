import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { fetchMyRole } from '@/lib/myRole';
import type { User } from '@supabase/supabase-js';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

type StaffRedirect = 'admin' | 'director' | 'teacher' | null;

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userExists, setUserExists] = useState<boolean | null>(null);
  const [staffRedirect, setStaffRedirect] = useState<StaffRedirect>(null);

  useEffect(() => {
    let isMounted = true;

    async function resolveSession(session: {
      user: User;
    } | null) {
      if (!session?.user) {
        if (!isMounted) return;
        setUser(null);
        setUserExists(false);
        setStaffRedirect(null);
        setLoading(false);
        return;
      }

      const rolePayload = await fetchMyRole();

      if (!isMounted) return;

      if (rolePayload?.role === 'super_admin') {
        setStaffRedirect('admin');
        setUser(null);
        setUserExists(false);
        setLoading(false);
        return;
      }
      if (rolePayload?.role === 'director') {
        setStaffRedirect('director');
        setUser(null);
        setUserExists(false);
        setLoading(false);
        return;
      }
      if (rolePayload?.role === 'teacher') {
        setStaffRedirect('teacher');
        setUser(null);
        setUserExists(false);
        setLoading(false);
        return;
      }

      const { data: parentRow } = await supabase
        .from('parents')
        .select('id')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!isMounted) return;

      if (parentRow) {
        setUser(session.user);
        setUserExists(true);
        setStaffRedirect(null);
        setLoading(false);
        return;
      }

      if (rolePayload?.role === 'parent') {
        console.warn('Rol parent en user_roles sin fila en parents');
      }

      await supabase.auth.signOut();
      setUser(null);
      setUserExists(false);
      setStaffRedirect(null);
      setLoading(false);
    }

    (async () => {
      try {
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Timeout')), 10000),
        );
        const {
          data: { session },
        } = (await Promise.race([sessionPromise, timeoutPromise])) as {
          data: { session: { user: User } | null };
        };
        await resolveSession(session);
      } catch (e) {
        console.error('ProtectedRoute:', e);
        if (isMounted) {
          setUser(null);
          setUserExists(false);
          setStaffRedirect(null);
          setLoading(false);
        }
      }
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setUserExists(false);
        setStaffRedirect(null);
        setLoading(false);
        return;
      }

      if (event === 'SIGNED_IN') {
        setLoading(true);
        await resolveSession(session);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-braini-blue rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
            <span className="text-white text-xl">🧠</span>
          </div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (staffRedirect === 'admin') {
    return <Navigate to="/brainifamily/admin" replace />;
  }
  if (staffRedirect === 'director') {
    return <Navigate to="/brainifamily/director" replace />;
  }
  if (staffRedirect === 'teacher') {
    return <Navigate to="/brainifamily/teacher" replace />;
  }

  if (!user || !userExists) {
    return <Navigate to="/brainifamily/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
