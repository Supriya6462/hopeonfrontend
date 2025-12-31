import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import type { Role } from "@/enums";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

/**
 * ProtectedRoute - Guards routes that require authentication
 * Optionally restricts access based on user roles
 * Note: Admin role has access to all protected routes
 */
export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  const userStr = localStorage.getItem("user");

  // Not authenticated - redirect to login
  if (!token || !userStr) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Parse user and check role
  try {
    const user = JSON.parse(userStr);
    const userRole: Role = user.role;

    // Admin has access to everything
    if (userRole === "admin") {
      return <>{children}</>;
    }

    // If allowedRoles specified, check if user has permission
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(userRole)) {
        // User doesn't have required role - redirect to their own dashboard
        switch (userRole) {
          case "organizer":
            return <Navigate to={ROUTES.ORGANIZER_DASHBOARD} replace />;
          case "donor":
          default:
            return <Navigate to={ROUTES.DONOR_DASHBOARD} replace />;
        }
      }
    }

    // Authenticated and authorized - render children
    return <>{children}</>;
  } catch {
    // Invalid user data - clear storage and redirect to login
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
}
