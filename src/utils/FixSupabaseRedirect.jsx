import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const FixSupabaseRedirect = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.hash.replace("#", "?")); // Supabase usa `#` em vez de `?`
    if (params.get("access_token")) {
      const newPath = `/resetpassword?${params.toString()}`;
      navigate(newPath, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default FixSupabaseRedirect;
