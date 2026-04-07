import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

// Auth Pages
import Login from "@/Auth/Login";
import Register from "@/Auth/Register";
import VerifyOtp from "@/Auth/VerifyOtp";
import ForgetPassword from "@/Auth/ForgetPassword";
import ResetPassword from "@/Auth/ResetPassword";

// Guards
import { PublicRoute, ProtectedRoute } from "@/components/guards";

// Layouts
import DonorLayout from "@/layouts/DonorLayout";
import OrganizerLayout from "@/layouts/OrganizerLayout";
import AdminLayout from "@/layouts/AdminLayout";

// Donor Pages
import DonorDashboard from "@/features/donor/pages/Dashboard";
import DonorDonations from "@/features/donor/pages/Donations";
import DonorProfile from "@/features/donor/pages/Profile";

// Organizer Pages
import OrganizerDashboard from "@/features/organizer/pages/Dashboard";
import CreateCampaign from "@/features/organizer/pages/CreateCampaign";
import OrganizerCampaigns from "@/features/organizer/pages/Campaigns";
import EditCampaign from "@/features/organizer/pages/EditCampaign";
import CampaignInsights from "@/features/organizer/pages/CampaignInsights";
import OrganizerWithdrawals from "@/features/organizer/pages/Withdrawals";

// Admin Pages
import AdminDashboard from "@/features/admin/pages/Dashboard";
import {
  AdminKycVerification,
  AdminOrganizerManagement,
} from "@/features/admin/pages";

import { ROUTES } from "./routes";
import {
  DonorCampaignDetails,
  ApplyOrganizer,
  DonorAboutus,
  DonorDonate,
  DonorHomepage,
} from "@/features/donor/pages";
import { PublicLayout } from "@/layouts";

/**
 * Application Routes Configuration
 * Organized by: Public routes, Protected routes (by role), and Fallback
 */
const routesConfig: RouteObject[] = [
  // ==================== Public Routes (with layout) ====================
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <DonorHomepage />,
      },
      {
        path: "homepage",
        element: <DonorHomepage />,
      },
      {
        path: "aboutus",
        element: <DonorAboutus />,
      },
      {
        path: "campaigns",
        element: <DonorDonate />,
      },
      {
        path: "campaigns/:id",
        element: <DonorCampaignDetails />,
      },
      // Auth pages inside PublicLayout
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <PublicRoute>
            <ForgetPassword />
          </PublicRoute>
        ),
      },
      {
        path: "verify-otp",
        element: <VerifyOtp />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
    ],
  },

  // ==================== Donor Routes ====================
  {
    path: "/donor",
    element: (
      <ProtectedRoute allowedRoles={["donor", "organizer"]}>
        <DonorLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.DonorHomepage} replace />,
      },
      {
        path: "homepage",
        element: <DonorHomepage />,
      },
      {
        path: "aboutus",
        element: <DonorAboutus />,
      },
      {
        path: "dashboard",
        element: <DonorDashboard />,
      },
      {
        path: "donations",
        element: <DonorDonations />,
      },
      {
        path: "profile",
        element: <DonorProfile />,
      },
      {
        path: "apply-organizer",
        element: <ApplyOrganizer />,
      },
    ],
  },

  // ==================== Organizer Routes ====================
  {
    path: "/organizer",
    element: (
      <ProtectedRoute allowedRoles={["organizer"]}>
        <OrganizerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.ORGANIZER_DASHBOARD} replace />,
      },
      {
        path: "dashboard",
        element: <OrganizerDashboard />,
      },
      {
        path: "campaigns",
        element: <OrganizerCampaigns />,
      },
      {
        path: "campaigns/create",
        element: <CreateCampaign />,
      },
      {
        path: "campaigns/:id/edit",
        element: <EditCampaign />,
      },
      {
        path: "campaigns/:id/insights",
        element: <CampaignInsights />,
      },
      {
        path: "withdrawals",
        element: <OrganizerWithdrawals />,
      },
      {
        path: "profile",
        element: <div className="p-4">Organizer Profile - Coming soon</div>,
      },
    ],
  },

  // ==================== Admin Routes ====================
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />,
      },
      {
        path: "dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "users",
        element: <div className="p-4">Users Management - Coming soon</div>,
      },
      {
        path: "campaigns",
        element: <div className="p-4">Campaigns Management - Coming soon</div>,
      },
      {
        path: "organizers",
        element: <AdminOrganizerManagement />,
      },
      {
        path: "donations",
        element: <div className="p-4">Donations Management - Coming soon</div>,
      },
      {
        path: "withdrawals",
        element: (
          <div className="p-4">Withdrawals Management - Coming soon</div>
        ),
      },
      {
        path: "applications",
        element: <AdminKycVerification />,
      },
    ],
  },

  // ==================== 404 Not Found ====================
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Page not found</p>
          <a
            href={ROUTES.LOGIN}
            className="inline-block px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go to Login
          </a>
        </div>
      </div>
    ),
  },
];

export default routesConfig;
