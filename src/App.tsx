import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useParams } from "react-router-dom";
import NotFound from "./pages/support/NotFound";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import UpdatePassword from "./pages/support/UpdatePassword";
import VerifyEmail from './pages/support/VerifyEmail';
import EmailVerified from './pages/support/EmailVerified';
import HubPage from './pages/HubPage';
import BrainiKidsLanding from './pages/brainikids/BrainiKidsLanding';
import BrainiJuniorsLanding from './pages/brainijuniors/BrainiJuniorsLanding';
import BrainiFamilyLanding from './pages/brainifamily/BrainiFamilyLanding';
import Conferencia from './pages/Conferencia';
import TestGenius from './pages/TestGenius';
// BrainiFamily imports
import Login from "./pages/brainifamily/auth/Login";
import SignUp from "./pages/brainifamily/auth/SignUp";
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

const queryClient = new QueryClient();

// Componente para redirigir rutas de sesión dinámicas
const SessionRedirect = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/brainifamily/sesion/${id}`} replace />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Hub Principal */}
          <Route path="/" element={<HubPage />} />
          
          {/* BrainiKids - Landing */}
          <Route path="/brainikids" element={<BrainiKidsLanding />} />
          
          {/* Braini Juniors - Landing */}
          <Route path="/brainijuniors" element={<BrainiJuniorsLanding />} />
          
          {/* BrainiFamily - Landing */}
          <Route path="/brainifamily" element={<BrainiFamilyLanding />} />
          
          {/* BrainiFamily - Auth */}
          <Route path="/brainifamily/login" element={<Login />} />
          <Route path="/brainifamily/signup" element={<SignUp />} />
          <Route path="/brainifamily/update-password" element={<UpdatePassword />} />
          
          {/* BrainiFamily - Soporte */}
          <Route path="/brainifamily/verify-email" element={<VerifyEmail />} />
          <Route path="/brainifamily/email-verified" element={<EmailVerified />} />
          
          {/* BrainiFamily - Protegidas */}
          <Route path="/brainifamily/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/brainifamily/parents-profile" element={<ProtectedRoute><ParentsProfile /></ProtectedRoute>} />
          <Route path="/brainifamily/child-profile" element={<ProtectedRoute><ChildProfile /></ProtectedRoute>} />
          <Route path="/brainifamily/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/brainifamily/sesion/:id" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
          <Route path="/brainifamily/sesion/:levelId/actividad/:activityId" element={<ProtectedRoute><ActivityDetail /></ProtectedRoute>} />
          <Route path="/brainifamily/diario-emocional" element={<ProtectedRoute><DiarioEmocional /></ProtectedRoute>} />
          <Route path="/brainifamily/inteligencia-emocional" element={<ProtectedRoute><InteligenciaEmocional /></ProtectedRoute>} />
          <Route path="/brainifamily/test-tmms-padres" element={<ProtectedRoute><TestTMMSPadres /></ProtectedRoute>} />
          <Route path="/brainifamily/test-emocional-ninos" element={<ProtectedRoute><TestEmocionalNinos /></ProtectedRoute>} />
          
          {/* Páginas públicas especiales (mantener) */}
          <Route path="/conferencia" element={<Conferencia />} />
          <Route path="/test-genius" element={<TestGenius />} />
          
          {/* Redirects para compatibilidad con rutas antiguas */}
          <Route path="/signup" element={<Navigate to="/brainifamily/signup" replace />} />
          <Route path="/login" element={<Navigate to="/brainifamily/login" replace />} />
          <Route path="/home" element={<Navigate to="/brainifamily/home" replace />} />
          <Route path="/parents-profile" element={<Navigate to="/brainifamily/parents-profile" replace />} />
          <Route path="/child-profile" element={<Navigate to="/brainifamily/child-profile" replace />} />
          <Route path="/profile" element={<Navigate to="/brainifamily/profile" replace />} />
          <Route path="/diario-emocional" element={<Navigate to="/brainifamily/diario-emocional" replace />} />
          <Route path="/inteligencia-emocional" element={<Navigate to="/brainifamily/inteligencia-emocional" replace />} />
          <Route path="/sesion/:id" element={<SessionRedirect />} />
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
