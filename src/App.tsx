import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import NotFound from "./pages/support/NotFound";
import ProtectedRoute from "./components/navigation/ProtectedRoute";
import UpdatePassword from "./pages/support/UpdatePassword";
import Home from "./pages/core/Home";
import VerifyEmail from './pages/support/VerifyEmail';
import EmailVerified from './pages/support/EmailVerified';
import LandingPage from './pages/LandingPage';
import ParentsProfile from './pages/onboarding/ParentsProfile';
import ChildProfile from './pages/onboarding/ChildProfile';
import Activities from './pages/core/Activities';
import Profile from './pages/auth/Profile';
import DiarioEmocional from './pages/core/DiarioEmocional';
import InteligenciaEmocional from './pages/intelligence/InteligenciaEmocional';
import TestTMMSPadres from './pages/intelligence/tests/TestTMMSPadres';
import TestEmocionalNinos from './pages/intelligence/tests/TestEmocionalNinos';
import ActivityDetail from './pages/core/ActivityDetail';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route path="/parents-profile" element={<ProtectedRoute><ParentsProfile /></ProtectedRoute>} />
          <Route path="/child-profile" element={<ProtectedRoute><ChildProfile /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/sesion/:id" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
          <Route path="/sesion/:levelId/actividad/:activityId" element={<ProtectedRoute><ActivityDetail /></ProtectedRoute>} />
          <Route path="/diario-emocional" element={<ProtectedRoute><DiarioEmocional /></ProtectedRoute>} />
          <Route path="/inteligencia-emocional" element={<ProtectedRoute><InteligenciaEmocional /></ProtectedRoute>} />
          <Route path="/test-tmms-padres" element={<ProtectedRoute><TestTMMSPadres /></ProtectedRoute>} />
          <Route path="/test-emocional-ninos" element={<ProtectedRoute><TestEmocionalNinos /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
