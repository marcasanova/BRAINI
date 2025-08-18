import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/support/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import UpdatePassword from "./pages/support/UpdatePassword";
import Welcome from "./pages/Welcome";
import Home from "./pages/Home";
import VerifyEmail from './pages/support/VerifyEmail';
import EmailVerified from './pages/support/EmailVerified';
import Landing from './pages/Landing';
import ParentsProfile from './pages/ParentsProfile';
import ChildProfile from './pages/ChildProfile';
import Activities from './pages/Activities';
import Profile from './pages/Profile';
import Recursos from './pages/Recursos';
import DiarioEmocional from './pages/DiarioEmocional';
import Tienda from './pages/Tienda';
import InteligenciaEmocionalPadre from './pages/InteligenciaEmocionalPadre';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/update-password" element={<UpdatePassword />} />
          <Route path="/welcome" element={<ProtectedRoute><Welcome /></ProtectedRoute>} />
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/email-verified" element={<EmailVerified />} />
          <Route path="/parents-profile" element={<ProtectedRoute><ParentsProfile /></ProtectedRoute>} />
          <Route path="/child-profile" element={<ProtectedRoute><ChildProfile /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/nivel/:id" element={<ProtectedRoute><Activities /></ProtectedRoute>} />
                         <Route path="/recursos" element={<ProtectedRoute><Recursos /></ProtectedRoute>} />
               <Route path="/diario-emocional" element={<ProtectedRoute><DiarioEmocional /></ProtectedRoute>} />
               <Route path="/tienda" element={<ProtectedRoute><Tienda /></ProtectedRoute>} />
               <Route path="/inteligencia-emocional-padre" element={<ProtectedRoute><InteligenciaEmocionalPadre /></ProtectedRoute>} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
