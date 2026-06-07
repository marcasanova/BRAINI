import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { CurrentChildProvider } from "./contexts/CurrentChildContext";
import NotFound from "./pages/support/NotFound";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import UpdatePassword from "./pages/support/UpdatePassword";
import LandingPage from './pages/LandingPage';
import BrainiKidsLanding from './pages/brainikids/BrainiKidsLanding';
import BrainiJuniorsLanding from './pages/brainijuniors/BrainiJuniorsLanding';
import BrainiFamilyLanding from './pages/brainifamily/BrainiFamilyLanding';
// BrainiFamily imports
import Login from "./pages/brainifamily/auth/Login";
import Home from "./pages/brainifamily/core/Home";
import ParentsProfile from './pages/brainifamily/onboarding/ParentsProfile';
import ChildProfile from './pages/brainifamily/onboarding/ChildProfile';
import Activities from './pages/brainifamily/core/Activities';
import Profile from './pages/brainifamily/auth/Profile';
import DiarioEmocional from './pages/brainifamily/core/DiarioEmocional';
import InteligenciaEmocional from './pages/brainifamily/intelligence/InteligenciaEmocional';
import TestTMMSPadres from './pages/brainifamily/intelligence/tests/TestTMMSPadres';
import TestEmocionalNinos from './pages/brainifamily/intelligence/tests/TestEmocionalNinos';
import ActivityDetail from './pages/brainifamily/core/ActivityDetail';
import TeacherRoute from './components/navigation/TeacherRoute';
import AdminRoute from './components/navigation/AdminRoute';
import DirectorRoute from './components/navigation/DirectorRoute';
import TeacherLayout from './pages/brainifamily/teacher/TeacherLayout';
import TeacherDashboard from './pages/brainifamily/teacher/TeacherDashboard';
import TeacherChildView from './pages/brainifamily/teacher/ChildView';
import AdminDashboard from './pages/brainifamily/admin/AdminDashboard';
import DirectorDashboard from './pages/brainifamily/director/DirectorDashboard';
import CompleteTeacherInvite from './pages/brainifamily/invite/CompleteTeacherInvite';
import CompleteParentInvite from './pages/brainifamily/invite/CompleteParentInvite';
import CompleteDirectorInvite from './pages/brainifamily/invite/CompleteDirectorInvite';

const queryClient = new QueryClient();

// Redirige rutas legacy /sesion/:id a /brainifamily/sesion/:id
const MissionRedirect = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/brainifamily/sesion/${id}`} replace />;
};

// Si Supabase redirige a la raíz con hash de recuperación, llevar a la página de cambiar contraseña
const RecoveryRedirectGuard = () => {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    if (pathname !== "/" || !hash) return;
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    if (params.get("type") === "recovery" && params.get("access_token")) {
      navigate(`/brainifamily/update-password${hash}`, { replace: true });
    }
  }, [pathname, hash, navigate]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RecoveryRedirectGuard />
        <Routes>
          {/* Hub Principal */}
          <Route path="/" element={<LandingPage />} />
          
          {/* BrainiKids - Landing */}
          <Route path="/brainikids" element={<BrainiKidsLanding />} />
          
          {/* Braini Juniors - Landing */}
          <Route path="/brainijuniors" element={<BrainiJuniorsLanding />} />
          
          {/* BrainiFamily - Landing */}
          <Route path="/brainifamily" element={<BrainiFamilyLanding />} />
          
          {/* BrainiFamily - Auth (acceso solo por invitación) */}
          <Route path="/brainifamily/login" element={<Login />} />
          <Route path="/brainifamily/update-password" element={<UpdatePassword />} />

          <Route path="/brainifamily/invite/director" element={<CompleteDirectorInvite />} />
          <Route path="/brainifamily/invite/teacher" element={<CompleteTeacherInvite />} />
          <Route path="/brainifamily/invite/parent" element={<CompleteParentInvite />} />

          <Route path="/brainifamily/admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
          </Route>
          <Route path="/brainifamily/director" element={<DirectorRoute />}>
            <Route index element={<DirectorDashboard />} />
          </Route>
          
          {/* BrainiFamily - Rutas de maestro (solo teachers) */}
          <Route path="/brainifamily/teacher" element={<TeacherRoute />}>
            <Route element={<TeacherLayout />}>
              <Route index element={<TeacherDashboard />} />
              <Route path="nino/:childId" element={<TeacherChildView />} />
            </Route>
          </Route>

          {/* BrainiFamily - Protegidas (con selector de hijo en contexto) */}
          <Route element={<ProtectedRoute><CurrentChildProvider><Outlet /></CurrentChildProvider></ProtectedRoute>}>
            <Route path="/brainifamily/home" element={<Home />} />
            <Route path="/brainifamily/parents-profile" element={<ParentsProfile />} />
            <Route path="/brainifamily/child-profile" element={<ChildProfile />} />
            <Route path="/brainifamily/profile" element={<Profile />} />
            <Route path="/brainifamily/sesion/:id" element={<Activities />} />
            <Route path="/brainifamily/sesion/:missionId/actividad/:activityId" element={<ActivityDetail />} />
            <Route path="/brainifamily/diario-emocional" element={<DiarioEmocional />} />
            <Route path="/brainifamily/inteligencia-emocional" element={<InteligenciaEmocional />} />
            <Route path="/brainifamily/test-tmms-padres" element={<TestTMMSPadres />} />
            <Route path="/brainifamily/test-emocional-ninos" element={<TestEmocionalNinos />} />
          </Route>
          
          {/* Redirects para compatibilidad con rutas antiguas */}
          <Route path="/signup" element={<Navigate to="/brainifamily/login" replace />} />
          <Route path="/login" element={<Navigate to="/brainifamily/login" replace />} />
          <Route path="/home" element={<Navigate to="/brainifamily/home" replace />} />
          <Route path="/parents-profile" element={<Navigate to="/brainifamily/parents-profile" replace />} />
          <Route path="/child-profile" element={<Navigate to="/brainifamily/child-profile" replace />} />
          <Route path="/profile" element={<Navigate to="/brainifamily/profile" replace />} />
          <Route path="/diario-emocional" element={<Navigate to="/brainifamily/diario-emocional" replace />} />
          <Route path="/inteligencia-emocional" element={<Navigate to="/brainifamily/inteligencia-emocional" replace />} />
          <Route path="/sesion/:id" element={<MissionRedirect />} />
          <Route path="/test-tmms-padres" element={<Navigate to="/brainifamily/test-tmms-padres" replace />} />
          <Route path="/test-emocional-ninos" element={<Navigate to="/brainifamily/test-emocional-ninos" replace />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
