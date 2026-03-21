import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  clearAuthStorage,
  getMsUntilTokenExpiry,
  isTokenExpired,
} from "@/lib/auth";

interface User {
  _id: string;
  name: string;
  email: string;
  role: "donor" | "organizer" | "admin";
  isOrganizerApproved?: boolean;
  isOrganizerRevoked?: boolean;
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
        if (isTokenExpired(token, 5000)) {
          clearAuthStorage();
          setUser(null);
          return;
        }

        setUser(JSON.parse(userStr));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      clearAuthStorage();
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
    if (isTokenExpired(token, 5000)) {
      clearAuthStorage();
      setUser(null);
      window.dispatchEvent(new Event("auth-change"));
      return;
    }

    localStorage.setItem("authToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  // Auto-logout when token expires, regardless of role
  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("authToken");
    if (!token) {
      setUser(null);
      return;
    }

    const timeoutMs = getMsUntilTokenExpiry(token);
    if (timeoutMs <= 0) {
      logout();
      return;
    }

    const timeoutId = window.setTimeout(() => {
      logout();
    }, timeoutMs);

    return () => window.clearTimeout(timeoutId);
  }, [user, logout]);

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
