import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/auth" />;

  // If role required but doesn't match, block access
  if (role && userRole !== role) return <Navigate to="/not-authorized" />;

  return children;
}
