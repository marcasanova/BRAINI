import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { fetchMyRole } from '@/integrations/supabase/rpc/roles';

/**
 * Solo usuarios con rol `super_admin` (RPC `get_my_role` / tabla `admin_emails`).
 */
const AdminRoute: React.FC = () => {
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user) {
        if (mounted) setAllowed(false);
        return;
      }
      const role = await fetchMyRole();
      if (mounted) setAllowed(role?.role === 'super_admin');
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (allowed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <p className="text-gray-600">Cargando...</p>
      </div>
    );
  }

  if (!allowed) {
    return <Navigate to="/brainifamily/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
