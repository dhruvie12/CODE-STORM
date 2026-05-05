import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, activeRole, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && activeRole !== allowedRole) {
    if (activeRole === "admin") {
      return <Navigate to="/dashboard/admin" replace />;
    } else if (activeRole === "photographer") {
      return <Navigate to="/dashboard/photographer" replace />;
    } else {
      return <Navigate to="/dashboard/client" replace />;
    }
  }

  return children;
}