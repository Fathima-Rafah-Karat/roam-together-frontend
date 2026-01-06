import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowed }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role")?.toLowerCase();

  // No token → force login
  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  // If this route has role restrictions
  if (allowed && !allowed.includes(role)) {
    // redirect based on their correct role
    if (role?.includes("admin")) return <Navigate to="/admin/dashboard" replace />;
    if (role?.includes("organizer")) return <Navigate to="/organizer/dashboard" replace />;

    // default for traveler
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
