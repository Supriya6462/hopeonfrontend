import { Outlet } from "react-router-dom";
import { Footer, ScrollToTop } from "@/components/shared";
import { RoleProvider } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { TopNav } from "@/layouts/navigation";

/**
 * PublicLayout - Layout for public pages (accessible without login)
 * Features: NavigationBar (top) + Content (middle) + Footer (bottom)
 * Shows login/register buttons when not logged in, profile/logout when logged in
 */
export default function PublicLayout() {
  const { user } = useAuth();

  return (
    <RoleProvider
      userRole={user?.role}
      isOrganizerRevoked={user?.isOrganizerRevoked}
    >
      <div className="min-h-screen flex flex-col bg-gray-50">
        <ScrollToTop />

        {/* Navigation Bar */}
        <TopNav />

        {/* Main Content */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </RoleProvider>
  );
}
