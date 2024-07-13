import { useLogout } from "@/hooks/useLogout";
import * as React from "react";
import { useNavigate } from "react-router-dom";

export default function PageLogout() {
  const logout = useLogout();
  const navigate = useNavigate();

  React.useEffect(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  return <div className="p-4">Logging out...</div>;
}
