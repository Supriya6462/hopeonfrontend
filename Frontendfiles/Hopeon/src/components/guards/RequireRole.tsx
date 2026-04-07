import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Role } from "@/enums";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/routes/routes";

interface RequireRoleProps {
  role: Role | Role[];
  children: ReactNode;
}

export default function RequireRole({ role, children }: RequireRoleProps) {
  const { user } = useAuth();
  const location = useLocation();
  const allowedRoles = Array.isArray(role) ? role : [role];

  if (!user) {
    return (
      <Navigate
        to={`${ROUTES.LOGIN}?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
