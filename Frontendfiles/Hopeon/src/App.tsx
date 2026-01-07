import AppRouter from "@/app/router/AppRouter";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";

/**
 * Main App Component
 * Entry point for the application with routing
 */
const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster />
    </AuthProvider>
  );
};

export default App;
