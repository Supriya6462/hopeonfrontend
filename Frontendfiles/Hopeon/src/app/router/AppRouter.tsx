import { createBrowserRouter, RouterProvider } from "react-router-dom";
import routesConfig from "@/routes/routesConfig";

/**
 * Create browser router with all routes
 */
const router = createBrowserRouter(routesConfig);

/**
 * Main App Router Component
 * Provides routing functionality to the entire application
 */
export const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
