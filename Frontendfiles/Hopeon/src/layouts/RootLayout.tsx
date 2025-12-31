import { Outlet } from "react-router-dom";

/**
 * RootLayout - Base layout wrapper
 * Can be used for shared elements across all pages
 */
export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Outlet />
    </div>
  );
}