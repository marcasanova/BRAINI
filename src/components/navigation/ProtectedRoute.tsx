import React, { useEffect, useRef, useState } from 'react';
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
  const latestResolveRunRef = useRef(0);
  const userRef = useRef<User | null>(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    let isMounted = true;

    function isStaleRun(runId: number) {
      return !isMounted || runId !== latestResolveRunRef.current;
    }

    async function resolveSession(
      session: {
      user: User;
      } | null,
      runId: number,
    ) {
      if (!session?.user) {
        if (isStaleRun(runId)) return;
        setUser(null);
        setUserExists(false);
        setStaffRedirect(null);
        setLoading(false);
        return;
      }

      const rolePayload = await fetchMyRole();

      if (isStaleRun(runId)) return;

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

      if (isStaleRun(runId)) return;

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

      // No forzamos signOut aquí para evitar cierres de sesión por validaciones lentas.
      setUser(null);
      setUserExists(false);
      setStaffRedirect(null);
      setLoading(false);
    }

    async function resolveSessionWithTimeout(
      session: { user: User } | null,
      timeoutMs = 10000,
    ) {
      const runId = ++latestResolveRunRef.current;
      try {
        const resolvePromise = resolveSession(session, runId);
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Resolve session timeout')), timeoutMs),
        );
        await Promise.race([resolvePromise, timeoutPromise]);
      } catch (error) {
        console.error('ProtectedRoute resolveSessionWithTimeout:', error);
        if (isStaleRun(runId)) return;
        // Fallback seguro: mantenemos sesión local y evitamos expulsar al usuario.
        if (session?.user) {
          setUser(session.user);
          setUserExists(true);
          setStaffRedirect(null);
        }
        setLoading(false);
      }
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
        await resolveSessionWithTimeout(session);
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
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setUserExists(false);
        setStaffRedirect(null);
        setLoading(false);
        return;
      }

      // No recalculamos acceso en cada refresh de token para evitar bloqueos
      // al volver de pestaña. Solo revalidamos en eventos de cambio real de sesión.
      if (event === 'TOKEN_REFRESHED') {
        if (!userRef.current) {
          setUser(session.user);
          setUserExists(true);
        }
        setLoading(false);
        return;
      }

      if (
        event === 'SIGNED_IN' ||
        event === 'INITIAL_SESSION' ||
        event === 'USER_UPDATED'
      ) {
        setLoading(true);
        window.setTimeout(() => {
          void resolveSessionWithTimeout(session, 8000);
        }, 0);
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
