import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

export type UserRole = "donor" | "organizer" | "admin";
export type ViewContext = "donor" | "organizer";

interface RoleContextType {
  activeView: ViewContext;
  setActiveView: (view: ViewContext) => void;
  canSwitchRole: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

interface RoleProviderProps {
  children: ReactNode;
  userRole: UserRole | undefined;
  isOrganizerRevoked?: boolean;
}

/**
 * RoleProvider - Manages the active view context for users who can switch roles
 * Organizers can switch between donor and organizer views
 * Syncs activeView with URL path to maintain consistency on refresh
 * SECURITY: Revoked organizers cannot switch to organizer view
 */
export function RoleProvider({ children, userRole, isOrganizerRevoked = false }: RoleProviderProps) {
  const location = useLocation();
  
  // SECURITY CHECK: Revoked organizers cannot switch roles
  const canSwitchRole = userRole === "organizer" && !isOrganizerRevoked;
  
  const [activeView, setActiveView] = useState<ViewContext>(() => {
    // Determine initial view from URL path
    if (location.pathname.startsWith("/organizer")) {
      return "organizer";
    }
    if (location.pathname.startsWith("/donor")) {
      return "donor";
    }
    
    // Fallback to localStorage if available
    if (canSwitchRole) {
      const stored = localStorage.getItem("activeView");
      if (stored === "donor" || stored === "organizer") {
        return stored;
      }
    }
    
    // Default to organizer view for organizers, donor for others
    return userRole === "organizer" ? "organizer" : "donor";
  });

  // Sync activeView with URL changes (handles browser back/forward)
  useEffect(() => {
    if (location.pathname.startsWith("/organizer")) {
      setActiveView("organizer");
    } else if (location.pathname.startsWith("/donor") || location.pathname === "/" || location.pathname === "/homepage" || location.pathname === "/aboutus") {
      setActiveView("donor");
    }
  }, [location.pathname]);

  // Persist view preference
  useEffect(() => {
    if (canSwitchRole) {
      localStorage.setItem("activeView", activeView);
    }
  }, [activeView, canSwitchRole]);

  // Reset to appropriate view when user role changes
  useEffect(() => {
    if (!canSwitchRole) {
      setActiveView("donor");
    }
  }, [canSwitchRole]);

  return (
    <RoleContext.Provider value={{ activeView, setActiveView, canSwitchRole }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoleContext() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRoleContext must be used within a RoleProvider");
  }
  return context;
}
