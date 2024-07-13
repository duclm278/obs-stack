import { useAuthContext } from "@/hooks/useAuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { token } = useAuthContext();
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}
