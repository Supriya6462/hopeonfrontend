import { Outlet } from "react-router-dom";
import { Footer, ScrollToTop } from "@/components/shared";
import { RoleProvider } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
// import { ROUTES } from "@/routes/routes";
import { TopNav } from "@/layouts/navigation";

/**
 * DonorLayout - Main layout wrapper for donor/public pages
 * Features: NavigationBar (top) + Content (middle) + Footer (bottom)
 * Includes RoleProvider for context switching (organizers can switch views)
 */
export default function DonorLayout() {
  // const navigate = useNavigate();
  const { user } = useAuth();

  // const handleLogout = () => {
  //   logout();
  //   navigate(ROUTES.HOME, { replace: true });
  // };

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
