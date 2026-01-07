import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Heart,
  Wallet,
  Plus,
  User,
  LogOut,
  LogIn,
  UserPlus2,
  X,
  Menu,
  Settings,
  LayoutDashboard,
  FolderHeart,
  User2,
  UserCheck,
  CheckCircle2,
} from "lucide-react";
import { ROUTES } from "@/routes/routes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import RoleSwitcher from "./RoleSwitcher";
import { useRoleContext } from "@/context/RoleContext";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "donor" | "organizer" | "admin";
  isOrganizerApproved?: boolean;
}

interface NavigationBarProps {
  user: User | null;
  onLogout: () => void;
}

interface NavLink {
  name: string;
  path: string;
  icon: typeof Home;
}

/**
 * NavigationBar - Main navigation component with role-based menu items
 * Supports context switching for organizers between donor and organizer views
 */
export default function NavigationBar({ user, onLogout }: NavigationBarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get active view context (donor or organizer)
  const { activeView } = useRoleContext();

  const confirmLogout = () => {
    onLogout();
    navigate(ROUTES.HOME);
    toast.success("Logged out successfully");
    setLogoutDialogOpen(false);
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  // Build navigation links based on user role and active view
  const getNavLinks = (): NavLink[] => {
    const baseLinks: NavLink[] = [
      { name: "Home", path: ROUTES.HOME, icon: Home },
      { name: "About us", path: ROUTES.ABOUTUS, icon: User2},
      { name: "Campaigns", path: ROUTES.CAMPAIGNS, icon: Heart },
    ];

    if (!user) return baseLinks;

    // Admin navigation
    if (user.role === "admin") {
      return [
        ...baseLinks,
        { name: "Dashboard", path: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
        { name: "Users", path: ROUTES.ADMIN_USERS, icon: User },
        { name: "Manage Campaigns", path: ROUTES.ADMIN_CAMPAIGNS, icon: Settings },
      ];
    }

    // Organizer with organizer view active
    if (user.role === "organizer" && activeView === "organizer") {
      return [
        ...baseLinks,
        { name: "Dashboard", path: ROUTES.ORGANIZER_DASHBOARD, icon: LayoutDashboard },
        { name: "My Campaigns", path: ROUTES.ORGANIZER_CAMPAIGNS, icon: FolderHeart },
        { name: "Withdrawals", path: ROUTES.ORGANIZER_WITHDRAWALS, icon: Wallet },
      ];
    }

    // Donor view (default for donors and organizers in donor mode)
    const donorLinks: NavLink[] = [
      ...baseLinks,
      { name: "My Donations", path: ROUTES.DONOR_DONATIONS, icon: Wallet },
    ];

    return donorLinks;
  };

  const navLinks = getNavLinks();
  const isActivePath = (path: string) => location.pathname === path;

  return (
    <>
      <nav className="bg-gradient-to-r from-indigo-900 via-blue-800 to-purple-900 text-white shadow-xl sticky top-0 w-full z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link
              to={ROUTES.HOME}
              className="text-xl font-bold text-white hover:text-amber-300 transition-colors duration-300 flex items-center gap-2"
            >
              <Heart className="h-6 w-6 text-amber-300" />
              <span>HopeOn</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-1">
              {navLinks.map(({ name, path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium",
                    isActivePath(path)
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{name}</span>
                </Link>
              ))}

              {/* Become Organizer Button - Only for donors who haven't applied */}
              {user?.role === "donor" && !user?.isOrganizerApproved && (
                <Link
                  to={ROUTES.APPLY_ORGANIZER}
                  className="inline-flex items-center gap-2 px-4 py-2 ml-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg text-sm font-medium"
                >
                  <UserCheck className="h-4 w-4" />
                  Become Organizer
                </Link>
              )}

              {/* Organizer Approved Badge - For approved organizers */}
              {user?.role === "donor" && user?.isOrganizerApproved && (
                <div className="inline-flex items-center gap-2 px-4 py-2 ml-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  <CheckCircle2 className="h-4 w-4" />
                  Organizer Approved
                </div>
              )}

              {/* Create Campaign Button (Organizer only in organizer view) */}
              {user?.role === "organizer" && activeView === "organizer" && (
                <Link to={ROUTES.ORGANIZER_CREATE_CAMPAIGN}>
                  <Button
                    size="sm"
                    className="ml-2 bg-amber-500 hover:bg-amber-600 text-white gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Create Campaign
                  </Button>
                </Link>
              )}

              {/* Role Switcher / Admin Badge */}
              <div className="flex items-center ml-4 pl-4 border-l border-white/20">
                {user?.role === "admin" ? (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium px-3 py-1">
                    Admin
                  </Badge>
                ) : (
                  <RoleSwitcher />
                )}
              </div>

              {/* Auth Section */}
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-white/20">
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleNavigation(ROUTES.DONOR_PROFILE)}
                      className="text-white hover:bg-white/10 gap-2"
                    >
                      <User className="h-4 w-4" />
                      {user.name}
                    </Button>
                    <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-red-500/20 hover:text-red-200 gap-2"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Logout</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to log out of your account?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2">
                          <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant="destructive" onClick={confirmLogout}>
                            Yes, log out
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </>
                ) : (
                  <>
                    <Link to={ROUTES.LOGIN}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:bg-white/10 gap-2"
                      >
                        <LogIn className="h-4 w-4" />
                        Login
                      </Button>
                    </Link>
                    <Link to={ROUTES.REGISTER}>
                      <Button
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-white gap-2"
                      >
                        <UserPlus2 className="h-4 w-4" />
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-amber-300" />
              ) : (
                <Menu className="h-6 w-6 text-amber-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-gradient-to-r from-indigo-900 via-blue-800 to-purple-900 backdrop-blur-md border-t border-white/10 animate-in slide-in-from-top-2">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(({ name, path, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-sm font-medium",
                    isActivePath(path)
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{name}</span>
                </Link>
              ))}

              {/* Become Organizer Button (Mobile) - Only for donors who haven't applied */}
              {user?.role === "donor" && !user?.isOrganizerApproved && (
                <Link
                  to={ROUTES.APPLY_ORGANIZER}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 mt-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md text-sm font-medium"
                >
                  <UserCheck className="h-5 w-5" />
                  Become Organizer
                </Link>
              )}

              {/* Organizer Approved Badge (Mobile) - For approved organizers */}
              {user?.role === "donor" && user?.isOrganizerApproved && (
                <div className="flex items-center gap-3 px-4 py-3 mt-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                  <CheckCircle2 className="h-5 w-5" />
                  Organizer Approved
                </div>
              )}

              {/* Create Campaign (Mobile) */}
              {user?.role === "organizer" && activeView === "organizer" && (
                <Button
                  onClick={() => handleNavigation(ROUTES.ORGANIZER_CREATE_CAMPAIGN)}
                  className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create Campaign
                </Button>
              )}

              {/* Role Switcher (Mobile) */}
              <div className="py-2 border-t border-white/10 mt-2">
                {user?.role === "admin" ? (
                  <div className="px-4 py-2">
                    <Badge className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium px-3 py-1">
                      Admin
                    </Badge>
                  </div>
                ) : (
                  <RoleSwitcher mobile />
                )}
              </div>

              {/* Auth Section (Mobile) */}
              <div className="border-t border-white/10 pt-4 mt-2 space-y-2">
                {user ? (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => handleNavigation(ROUTES.DONOR_PROFILE)}
                      className="w-full justify-start text-white hover:bg-white/10 gap-3"
                    >
                      <User className="h-5 w-5" />
                      {user.name}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setLogoutDialogOpen(true)}
                      className="w-full justify-start text-white hover:bg-red-500/20 hover:text-red-200 gap-3"
                    >
                      <LogOut className="h-5 w-5" />
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to={ROUTES.LOGIN} onClick={() => setMobileMenuOpen(false)}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10 gap-3"
                      >
                        <LogIn className="h-5 w-5" />
                        Login
                      </Button>
                    </Link>
                    <Link to={ROUTES.REGISTER} onClick={() => setMobileMenuOpen(false)}>
                      <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white gap-3">
                        <UserPlus2 className="h-5 w-5" />
                        Register
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
