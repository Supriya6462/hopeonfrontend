import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "donor" | "organizer" | "admin";
  isOrganizerApproved?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const loadUser = useCallback(() => {
    try {
      const userStr = localStorage.getItem("user");
      const token = localStorage.getItem("authToken");
      if (userStr && token) {
        setUser(JSON.parse(userStr));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      setUser(null);
    }
  }, []);

  // Load user on mount
  useEffect(() => {
    loadUser();

    // Listen for storage changes (other tabs)
    window.addEventListener("storage", loadUser);
    
    // Listen for custom auth events (same tab)
    window.addEventListener("auth-change", loadUser);
    
    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("auth-change", loadUser);
    };
  }, [loadUser]);

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("activeView");
    setUser(null);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  const refreshUser = useCallback(() => {
    loadUser();
  }, [loadUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
