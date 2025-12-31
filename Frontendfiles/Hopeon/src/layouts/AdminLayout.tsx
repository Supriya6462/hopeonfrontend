import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Users, FolderKanban, Building2, Heart, Wallet, LogOut, Menu, X, Shield } from "lucide-react";
import { useState } from "react";
import { ROUTES } from "@/routes/routes";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard, label: "Dashboard" },
  { to: ROUTES.ADMIN_USERS, icon: Users, label: "Users" },
  { to: ROUTES.ADMIN_CAMPAIGNS, icon: FolderKanban, label: "Campaigns" },
  { to: ROUTES.ADMIN_ORGANIZERS, icon: Building2, label: "Organizers" },
  { to: ROUTES.ADMIN_DONATIONS, icon: Heart, label: "Donations" },
  { to: ROUTES.ADMIN_WITHDRAWALS, icon: Wallet, label: "Withdrawals" },
];

/**
 * AdminLayout - Main layout wrapper for admin pages
 */
export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const getUserName = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.name || "Admin";
      }
    } catch {
      return "Admin";
    }
    return "Admin";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <span className="font-semibold text-indigo-600">HopeOn Admin</span>
        <div className="w-10" />
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-50
            w-64 bg-white border-r border-gray-200
            transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          `}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-indigo-600">HopeOn</h1>
              <p className="text-sm text-gray-500 mt-1">Admin Portal</p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`
                  }
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-3 px-4 py-2 mb-2">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {getUserName()}
                  </p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
