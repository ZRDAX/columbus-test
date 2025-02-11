import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Signin from "../pages/auth/Signin";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword.jsx";
import Signup from "../pages/auth/Signup";
import Dashboard from "../pages/Dashboard";
import FixSupabaseRedirect from "../utils/FixSupabaseRedirect";

// Função para proteger rotas privadas
// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Carregando...</div>;
  return user ? children : <Navigate to="/signin" />;
};

const AppRouter = () => {
  return (
    <Router>
      <FixSupabaseRedirect />
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        
        {/* Rota Protegida para o Dashboard */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        
        {/* Redirecionamento padrão */}
        <Route path="*" element={<Navigate to={window.location.pathname.includes("resetpassword") ? window.location.pathname : "/signin"} />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
