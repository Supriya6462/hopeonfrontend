import AppRouter from "@/app/router/AppRouter";
import { Toaster } from "@/components/ui/sonner";

/**
 * Main App Component
 * Entry point for the application with routing
 */
const App = () => {
  return (
    <>
      <AppRouter />
      <Toaster />
    </>
  );
};

export default App;
