import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ModuleListPage from "./pages/ModuleListPage";
import RecordDetailPage from "./pages/RecordDetailPage";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";

const RequireAuth = () => {
  const { contact, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner label="Loading session" />
      </div>
    );
  }

  if (!contact) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route element={<RequireAuth />}>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/modules/Cases" replace />} />
        <Route path="/modules/:moduleKey" element={<ModuleListPage />} />
        <Route path="/modules/:moduleKey/:id" element={<RecordDetailPage />} />
      </Route>
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
