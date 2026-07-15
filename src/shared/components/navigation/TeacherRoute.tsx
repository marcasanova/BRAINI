import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useTeacherContext } from '@/products/brainifamily/contexts/TeacherContext';

/**
 * Protege las rutas de maestro. Solo permite acceso si el usuario está en la tabla teachers.
 * Si está autenticado pero no es maestro, redirige al home de padre.
 */
const TeacherRoute: React.FC = () => {
  const { user, isTeacher, loading, teacher } = useTeacherContext();

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

  if (!user) {
    return <Navigate to="/brainifamily/login" replace />;
  }

  if (!teacher || !isTeacher) {
    return <Navigate to="/brainifamily/home" replace />;
  }

  return <Outlet />;
};

export default TeacherRoute;
