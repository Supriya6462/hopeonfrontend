import { Outlet } from "react-router-dom";
import { ScrollToTop } from "@/components/shared";
import { RoleProvider } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { RoleSidebarLayout } from "@/layouts/navigation";

/**
 * OrganizerLayout - Main layout wrapper for organizer pages
 * Uses the same NavigationBar with role switcher for consistent UX
 * Organizers can switch between donor and organizer views
 */
export default function OrganizerLayout() {
  const { user } = useAuth();

  return (
    <RoleProvider
      userRole={user?.role}
      isOrganizerRevoked={user?.isOrganizerRevoked}
    >
      <div className="min-h-screen bg-gray-50">
        <ScrollToTop />

        <RoleSidebarLayout role="organizer">
          <Outlet />
        </RoleSidebarLayout>
      </div>
    </RoleProvider>
  );
}
