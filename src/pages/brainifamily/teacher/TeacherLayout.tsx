import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useTeacherContext } from '@/contexts/TeacherContext';

const TeacherLayout: React.FC = () => {
  const navigate = useNavigate();
  const { teacher } = useTeacherContext();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/brainifamily/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo/logoBraini.png" alt="BRAINI" className="h-8 w-auto" />
            <span className="font-semibold text-gray-700 hidden sm:inline">Dashboard Maestro</span>
            {teacher?.nombre && (
              <span className="text-sm text-gray-500 hidden md:inline">— {teacher.nombre}</span>
            )}
          </div>
          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/brainifamily/teacher')}
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </nav>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;
