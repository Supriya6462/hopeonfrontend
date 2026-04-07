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
  HOMEPAGE: "/homepage",
  ABOUTUS: "/aboutus",
  CAMPAIGNS: "/campaigns",
  CAMPAIGN_DETAILS: "/campaigns/:id",
  ABOUT: "/aboutus",
  DONATE: "/campaigns",

  // Donor Routes (Protected)
  DonorHomepage: "/donor/homepage",
  DonorAboutus: "/donor/aboutus",
  DONOR_DASHBOARD: "/donor/dashboard",
  DONOR_DONATIONS: "/donor/donations",
  DONOR_PROFILE: "/donor/profile",
  APPLY_ORGANIZER: "/donor/apply-organizer",
  DASHBOARD: "/donor/dashboard",
  MY_DONATIONS: "/donor/donations",

  // Organizer Routes
  ORGANIZER_DASHBOARD: "/organizer/dashboard",
  ORGANIZER_CAMPAIGNS: "/organizer/campaigns",
  ORGANIZER_CREATE_CAMPAIGN: "/organizer/campaigns/create",
  ORGANIZER_EDIT_CAMPAIGN: "/organizer/campaigns/:id/edit",
  ORGANIZER_CAMPAIGN_INSIGHTS: "/organizer/campaigns/:id/insights",
  ORGANIZER_WITHDRAWALS: "/organizer/withdrawals",
  ORGANIZER_PROFILE: "/organizer/profile",

  // Admin Routes
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_USERS: "/admin/users",
  ADMIN_CAMPAIGNS: "/admin/campaigns",
  ADMIN_ORGANIZERS: "/admin/organizers",
  ADMIN_DONATIONS: "/admin/donations",
  ADMIN_WITHDRAWALS: "/admin/withdrawals",
  ADMIN_APPLICATIONS: "/admin/applications",
  ADMIN_ORGANIZER_MANAGEMENT: "/admin/organizermanagement",
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
