import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NavigationBar, Footer } from "@/components/shared";
import { RoleProvider } from "@/context/RoleContext";
import { ROUTES } from "@/routes/routes";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "donor" | "organizer" | "admin";
  isOrganizerApproved?: boolean;
}

/**
 * OrganizerLayout - Main layout wrapper for organizer pages
 * Uses the same NavigationBar with role switcher for consistent UX
 * Organizers can switch between donor and organizer views
 */
export default function OrganizerLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const userData = JSON.parse(userStr);
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to load user:", error);
        setUser(null);
      }
    };

    loadUser();

    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("activeView");
    setUser(null);
    navigate(ROUTES.LOGIN, { replace: true });
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
