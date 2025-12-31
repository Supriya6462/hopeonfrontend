import { DonorAboutus, DonorHomepage } from "@/features/donor/pages";

/**
 * Application Routes Configuration
 * Centralized route paths for the application
 */
export const ROUTES = {
  // Auth Routes
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  OTP_VERIFICATION: "/verify-otp",
  RESET_PASSWORD: "/reset-password",

  // Public Routes
  HOME: "/",
  CAMPAIGNS: "/campaigns",
  CAMPAIGN_DETAILS: "/campaigns/:id",

  // Donor Routes
  DonorHomepage:"/donor/homepage",
  DonorAboutus:"/donor/aboutus",
  DONOR_DASHBOARD: "/donor/dashboard",
  DONOR_DONATIONS: "/donor/donations",
  DONOR_PROFILE: "/donor/profile",

  // Organizer Routes
  ORGANIZER_DASHBOARD: "/organizer/dashboard",
  ORGANIZER_CAMPAIGNS: "/organizer/campaigns",
  ORGANIZER_CREATE_CAMPAIGN: "/organizer/campaigns/create",
  ORGANIZER_EDIT_CAMPAIGN: "/organizer/campaigns/:id/edit",
  ORGANIZER_WITHDRAWALS: "/organizer/withdrawals",
  ORGANIZER_PROFILE: "/organizer/profile",

  // Admin Routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_CAMPAIGNS: "/admin/campaigns",
  ADMIN_ORGANIZERS: "/admin/organizers",
  ADMIN_DONATIONS: "/admin/donations",
  ADMIN_WITHDRAWALS: "/admin/withdrawals",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
