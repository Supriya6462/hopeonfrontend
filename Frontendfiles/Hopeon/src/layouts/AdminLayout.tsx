import { Outlet } from "react-router-dom";
import { ScrollToTop } from "@/components/shared";
import { RoleSidebarLayout } from "@/layouts/navigation";

/**
 * AdminLayout - Shared role sidebar layout for admin pages
 */
export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <ScrollToTop />

      <RoleSidebarLayout role="admin">
        <Outlet />
      </RoleSidebarLayout>
    </div>
  );
}
