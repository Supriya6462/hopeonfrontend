import { createElement, useMemo, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ROUTES } from "@/routes/routes";
import {
  getRoleHomePath,
  getSidebarItems,
  getSidebarSections,
} from "./roleNavConfig";
import RoleModeSwitcher from "./RoleModeSwitcher";

function itemClass({ isActive }: { isActive: boolean }) {
  return [
    "group relative flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
  ].join(" ");
}

function RoleBadge({ role }: { role: "admin" | "organizer" }) {
  const map = {
    admin: "bg-chart-2/15 text-chart-2",
    organizer: "bg-primary/15 text-primary",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${map[role]}`}
    >
      {role}
    </span>
  );
}

interface RoleSidebarLayoutProps {
  role: "admin" | "organizer";
  children: React.ReactNode;
}

export default function RoleSidebarLayout({
  role,
  children,
}: RoleSidebarLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const navItems = useMemo(() => getSidebarItems(role), [role]);
  const navSections = useMemo(() => getSidebarSections(role), [role]);

  const pageTitle = useMemo(() => {
    const matched = navItems.find((item) =>
      location.pathname.startsWith(item.to),
    );
    return matched?.label ?? "Workspace";
  }, [location.pathname, navItems]);

  const executeLogout = () => {
    logout();
    navigate(ROUTES.HOME);
    setMobileOpen(false);
    setLogoutDialogOpen(false);
    toast.success("Logged out successfully");
  };

  const SidebarContent = (
    <div className="flex h-full flex-col border-r border-sidebar-border bg-sidebar">
      <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-sidebar-border px-3">
        <Link
          to={getRoleHomePath(role)}
          className="min-w-0 text-lg font-black text-sidebar-foreground"
          onClick={() => setMobileOpen(false)}
          aria-label="HopeOn home"
        >
          {collapsed ? "H" : "HopeOn"}
        </Link>

        <button
          type="button"
          className="shrink-0 rounded-md p-1.5 text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <nav
        className="flex-1 space-y-5 overflow-y-auto px-2 py-4"
        aria-label={`${role} navigation`}
      >
        {navSections.map((section) => (
          <div key={section.title}>
            <p
              className={[
                "mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-widest text-sidebar-foreground/40",
                collapsed ? "sr-only" : "block",
              ].join(" ")}
            >
              {section.title}
            </p>

            <div className="space-y-0.5">
              {section.items.map(({ label, to, icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={itemClass}
                  onClick={() => setMobileOpen(false)}
                  aria-label={label}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={[
                          "absolute left-0 top-1/2 h-4 w-[3px] -translate-y-1/2 rounded-r-full transition-all duration-200",
                          isActive ? "bg-sidebar-primary" : "bg-transparent",
                        ].join(" ")}
                        aria-hidden="true"
                      />

                      {createElement(icon, {
                        className: [
                          "h-4 w-4 shrink-0 transition-colors",
                          isActive
                            ? "text-sidebar-primary"
                            : "text-sidebar-foreground/60",
                        ].join(" "),
                        "aria-hidden": true,
                      })}

                      <span
                        className={[
                          "flex-1 truncate text-sm",
                          collapsed ? "sr-only" : "inline",
                        ].join(" ")}
                      >
                        {label}
                      </span>

                      {!collapsed ? (
                        <ChevronRight
                          className={[
                            "ml-auto h-3.5 w-3.5 shrink-0 transition-all duration-200",
                            isActive
                              ? "text-sidebar-primary opacity-100"
                              : "text-sidebar-foreground/30 opacity-0 group-hover:opacity-100",
                          ].join(" ")}
                          aria-hidden="true"
                        />
                      ) : null}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 space-y-1.5 border-t border-sidebar-border p-3">
        {role === "organizer" ? <RoleModeSwitcher compact={collapsed} /> : null}

        <div
          className={[
            "flex items-center gap-2.5 rounded-lg border border-sidebar-border/50 bg-sidebar-accent/30 px-2.5 py-2",
            collapsed ? "justify-center" : "",
          ].join(" ")}
        >
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sidebar-primary text-sm font-bold uppercase text-sidebar-primary-foreground ring-2 ring-sidebar-primary/25">
            {(user?.name ?? user?.email ?? "U").charAt(0)}
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-sidebar bg-primary"
              aria-hidden="true"
            />
          </div>
          {!collapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold leading-tight text-sidebar-foreground">
                {user?.name ?? "User"}
              </p>
              <div className="mt-0.5">
                <RoleBadge role={role} />
              </div>
            </div>
          ) : null}
        </div>

        <button
          type="button"
          className={[
            "group flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium transition-colors duration-150",
            "text-sidebar-foreground/60 hover:bg-destructive/10 hover:text-destructive",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
            collapsed ? "justify-center" : "",
          ].join(" ")}
          onClick={() => setLogoutDialogOpen(true)}
        >
          <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className={collapsed ? "sr-only" : "inline"}>Sign out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-background">
      <div className="flex h-full overflow-hidden">
        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 flex h-full shrink-0 flex-col transition-[width,transform] duration-300 ease-out",
            "lg:static lg:translate-x-0",
            collapsed ? "w-[60px] lg:w-[60px]" : "w-64 lg:w-64",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
        >
          {SidebarContent}
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-foreground/30 backdrop-blur-[2px] lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close navigation overlay"
          />
        ) : null}

        <div className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto">
          <header className="sticky top-0 z-20 flex h-[60px] shrink-0 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open sidebar"
              >
                <Menu className="h-5 w-5" />
              </button>

              <button
                type="button"
                className="hidden rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground lg:inline-flex"
                onClick={() => setCollapsed((prev) => !prev)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {collapsed ? (
                  <PanelLeftOpen className="h-4 w-4" />
                ) : (
                  <PanelLeftClose className="h-4 w-4" />
                )}
              </button>

              <span className="text-sm font-semibold text-foreground">
                {pageTitle}
              </span>
            </div>
          </header>

          <main className="min-h-0 flex-1">{children}</main>
        </div>
      </div>

      <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign out of {role} portal?</DialogTitle>
            <DialogDescription>
              You will be returned to the home page and need to sign in again to
              access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLogoutDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" size="sm" onClick={executeLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
