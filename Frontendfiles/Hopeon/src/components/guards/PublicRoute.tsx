import type { Role } from "@/enums";
import { ROUTES } from "@/routes/routes";
import type React from "react";
import { Navigate } from "react-router-dom";
import { clearAuthStorage, isTokenExpired } from "@/lib/auth";

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - Redirects authenticated users away from auth pages
 * Use this to wrap login, register, forgot-password, etc.
 */

export default function PublicRoute({ children }: PublicRouteProps) {
  const token = localStorage.getItem("authToken");
  const userStr = localStorage.getItem("user");
  // If not authenticated, show the public page (login, register, etc.)

  if (!token || !userStr) {
    return <>{children}</>;
  }

  if (isTokenExpired(token, 5000)) {
    clearAuthStorage();
    window.dispatchEvent(new Event("auth-change"));
    return <>{children}</>;
  }

  // User is authenticated - redirect to their dashboard
  try {
    const user = JSON.parse(userStr);
    const role: Role = user.role;

    switch (role) {
      case "admin":
        return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;
      case "organizer":
        return <Navigate to={ROUTES.ORGANIZER_DASHBOARD} replace />;
      case "donor":
      default:
        return <Navigate to={ROUTES.HOME} replace />;
    }
  } catch {
    // Invalid user data, clear and show public page
    clearAuthStorage();
    window.dispatchEvent(new Event("auth-change"));
    return <>{children}</>;
  }
}
