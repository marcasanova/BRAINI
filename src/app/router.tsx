import { lazy, Suspense } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useEffect } from "react";
import RouteLoading from "./RouteLoading";
import { CurrentChildProvider } from "@/products/brainifamily/contexts/CurrentChildContext";
import { TeacherProvider } from "@/products/brainifamily/contexts/TeacherContext";
import ProtectedRoute from "@/shared/components/navigation/ProtectedRoute";
import TeacherRoute from "@/shared/components/navigation/TeacherRoute";
import AdminRoute from "@/shared/components/navigation/AdminRoute";
import DirectorRoute from "@/shared/components/navigation/DirectorRoute";

const NotFound = lazy(() => import("@/shared/pages/support/NotFound"));
const UpdatePassword = lazy(() => import("@/shared/pages/support/UpdatePassword"));
const LandingPage = lazy(() => import("@/products/hub/LandingPage"));
const BrainiKidsLanding = lazy(() => import("@/products/brainikids/BrainiKidsLanding"));
const BrainiJuniorsLanding = lazy(() => import("@/products/brainijuniors/BrainiJuniorsLanding"));
const BrainiFamilyLanding = lazy(() => import("@/products/brainifamily/pages/BrainiFamilyLanding"));
const Login = lazy(() => import("@/products/brainifamily/pages/auth/Login"));
const Home = lazy(() => import("@/products/brainifamily/pages/core/Home"));
const ParentsProfile = lazy(() => import("@/products/brainifamily/pages/onboarding/ParentsProfile"));
const ChildProfile = lazy(() => import("@/products/brainifamily/pages/onboarding/ChildProfile"));
const Activities = lazy(() => import("@/products/brainifamily/pages/core/Activities"));
const Profile = lazy(() => import("@/products/brainifamily/pages/auth/Profile"));
const DiarioEmocional = lazy(() => import("@/products/brainifamily/pages/core/DiarioEmocional"));
const InteligenciaEmocional = lazy(() => import("@/products/brainifamily/pages/intelligence/InteligenciaEmocional"));
const TestTMMSPadres = lazy(() => import("@/products/brainifamily/pages/intelligence/tests/TestTMMSPadres"));
const TestEmocionalNinos = lazy(() => import("@/products/brainifamily/pages/intelligence/tests/TestEmocionalNinos"));
const ActivityDetail = lazy(() => import("@/products/brainifamily/pages/core/ActivityDetail"));
const TeacherLayout = lazy(() => import("@/products/brainifamily/pages/teacher/TeacherLayout"));
const TeacherDashboard = lazy(() => import("@/products/brainifamily/pages/teacher/Dashboard"));
const TeacherChildView = lazy(() => import("@/products/brainifamily/pages/teacher/ChildView"));
const AdminDashboard = lazy(() => import("@/products/brainifamily/pages/admin/AdminDashboard"));
const DirectorDashboard = lazy(() => import("@/products/brainifamily/pages/director/DirectorDashboard"));
const CompleteTeacherInvite = lazy(() => import("@/products/brainifamily/pages/invite/CompleteTeacherInvite"));
const CompleteParentInvite = lazy(() => import("@/products/brainifamily/pages/invite/CompleteParentInvite"));
const CompleteDirectorInvite = lazy(() => import("@/products/brainifamily/pages/invite/CompleteDirectorInvite"));

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<RouteLoading />}>{element}</Suspense>
);

const MissionRedirect = () => {
  const { id } = useParams<{ id: string }>();
  return <Navigate to={`/brainifamily/sesion/${id}`} replace />;
};

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

export function AppRouter() {
  return (
    <BrowserRouter>
      <RecoveryRedirectGuard />
      <Routes>
        <Route path="/" element={withSuspense(<LandingPage />)} />
        <Route path="/brainikids" element={withSuspense(<BrainiKidsLanding />)} />
        <Route path="/brainijuniors" element={withSuspense(<BrainiJuniorsLanding />)} />
        <Route path="/brainifamily" element={withSuspense(<BrainiFamilyLanding />)} />
        <Route path="/brainifamily/login" element={withSuspense(<Login />)} />
        <Route path="/brainifamily/update-password" element={withSuspense(<UpdatePassword />)} />
        <Route path="/brainifamily/invite/director" element={withSuspense(<CompleteDirectorInvite />)} />
        <Route path="/brainifamily/invite/teacher" element={withSuspense(<CompleteTeacherInvite />)} />
        <Route path="/brainifamily/invite/parent" element={withSuspense(<CompleteParentInvite />)} />
        <Route path="/brainifamily/admin" element={<AdminRoute />}>
          <Route index element={withSuspense(<AdminDashboard />)} />
        </Route>
        <Route path="/brainifamily/director" element={<DirectorRoute />}>
          <Route index element={withSuspense(<DirectorDashboard />)} />
        </Route>
        <Route
          path="/brainifamily/teacher"
          element={
            <TeacherProvider>
              <TeacherRoute />
            </TeacherProvider>
          }
        >
          <Route element={withSuspense(<TeacherLayout />)}>
            <Route index element={withSuspense(<TeacherDashboard />)} />
            <Route path="nino/:childId" element={withSuspense(<TeacherChildView />)} />
          </Route>
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <CurrentChildProvider>
                <Outlet />
              </CurrentChildProvider>
            </ProtectedRoute>
          }
        >
          <Route path="/brainifamily/home" element={withSuspense(<Home />)} />
          <Route path="/brainifamily/parents-profile" element={withSuspense(<ParentsProfile />)} />
          <Route path="/brainifamily/child-profile" element={withSuspense(<ChildProfile />)} />
          <Route path="/brainifamily/profile" element={withSuspense(<Profile />)} />
          <Route path="/brainifamily/sesion/:id" element={withSuspense(<Activities />)} />
          <Route
            path="/brainifamily/sesion/:missionId/actividad/:activityId"
            element={withSuspense(<ActivityDetail />)}
          />
          <Route path="/brainifamily/diario-emocional" element={withSuspense(<DiarioEmocional />)} />
          <Route
            path="/brainifamily/inteligencia-emocional"
            element={withSuspense(<InteligenciaEmocional />)}
          />
          <Route path="/brainifamily/test-tmms-padres" element={withSuspense(<TestTMMSPadres />)} />
          <Route path="/brainifamily/test-emocional-ninos" element={withSuspense(<TestEmocionalNinos />)} />
        </Route>
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
        <Route path="*" element={withSuspense(<NotFound />)} />
      </Routes>
    </BrowserRouter>
  );
}
