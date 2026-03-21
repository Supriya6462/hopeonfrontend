import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import type { Role } from "@/enums";
import { clearAuthStorage, isTokenExpired } from "@/lib/auth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

/**
 * ProtectedRoute - Guards routes that require authentication
 * Optionally restricts access based on user roles
 * Note: Admin role has access to all protected routes
 * Note: Organizers can access both donor and organizer routes
 * SECURITY: Revoked organizers are blocked from organizer routes
 */
export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem("authToken");
  const userStr = localStorage.getItem("user");

  // Not authenticated - redirect to login
  if (!token || !userStr) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Token exists but has already expired
  if (isTokenExpired(token, 5000)) {
    clearAuthStorage();
    window.dispatchEvent(new Event("auth-change"));
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Parse user and check role
  try {
    const user = JSON.parse(userStr);
    const userRole: Role = user.role;
    const isOrganizerRevoked = user.isOrganizerRevoked || false;

    // Admin has access to everything
    if (userRole === "admin") {
      return <>{children}</>;
    }

    // SECURITY CHECK: Block revoked organizers from organizer routes
    if (userRole === "organizer" && isOrganizerRevoked) {
      // Check if trying to access organizer routes
      if (location.pathname.startsWith("/organizer")) {
        // Redirect to donor homepage with error message
        return (
          <Navigate
            to={ROUTES.HOME}
            state={{
              error:
                "Your organizer access has been revoked. Please contact support.",
            }}
            replace
          />
        );
      }
      // Allow access to donor routes
      if (allowedRoles && allowedRoles.includes("donor")) {
        return <>{children}</>;
      }
    }

    // Organizers can access both donor and organizer routes (if not revoked)
    if (userRole === "organizer" && !isOrganizerRevoked) {
      if (
        allowedRoles &&
        (allowedRoles.includes("donor") || allowedRoles.includes("organizer"))
      ) {
        return <>{children}</>;
      }
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
            return <Navigate to={ROUTES.HOME} replace />;
        }
      }
    }

    // Authenticated and authorized - render children
    return <>{children}</>;
  } catch {
    // Invalid user data - clear storage and redirect to login
    clearAuthStorage();
    window.dispatchEvent(new Event("auth-change"));
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
}
