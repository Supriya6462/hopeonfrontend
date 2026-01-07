import { Outlet, useNavigate } from "react-router-dom";
import { NavigationBar, Footer } from "@/components/shared";
import { RoleProvider } from "@/context/RoleContext";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/routes/routes";

/**
 * PublicLayout - Layout for public pages (accessible without login)
 * Features: NavigationBar (top) + Content (middle) + Footer (bottom)
 * Shows login/register buttons when not logged in, profile/logout when logged in
 */
export default function PublicLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME, { replace: true });
  };

  return (
    <RoleProvider userRole={user?.role}>
      <div className="min-h-screen flex flex-col bg-gray-50">
        {/* Navigation Bar */}
        <NavigationBar user={user} onLogout={handleLogout} />

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
