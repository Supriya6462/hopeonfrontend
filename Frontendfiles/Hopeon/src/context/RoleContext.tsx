import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

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
}

/**
 * RoleProvider - Manages the active view context for users who can switch roles
 * Organizers can switch between donor and organizer views
 */
export function RoleProvider({ children, userRole }: RoleProviderProps) {
  const canSwitchRole = userRole === "organizer";
  
  const [activeView, setActiveView] = useState<ViewContext>(() => {
    // Initialize from localStorage if available
    if (canSwitchRole) {
      const stored = localStorage.getItem("activeView");
      if (stored === "donor" || stored === "organizer") {
        return stored;
      }
    }
    // Default to organizer view for organizers, donor for others
    return userRole === "organizer" ? "organizer" : "donor";
  });

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
