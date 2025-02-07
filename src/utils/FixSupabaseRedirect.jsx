import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const FixSupabaseRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash; 
    if (hash.includes("access_token")) {
      const params = new URLSearchParams(hash.replace("#", "?")); 
      const accessToken = params.get("access_token");

      if (accessToken) {
        navigate(`/resetpassword?access_token=${accessToken}`); 
      }
    }

  }, [navigate]);

  return null;
};

export default FixSupabaseRedirect;
