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
  ABOUT: "/about",
  ABOUTUS: "/aboutus",
  DONATE: "/donate",
  CAMPAIGNS: "/campaigns",
  DONATE_DETAIL: "/donate/:id",
  CAMPAIGN_DETAILS: "/campaigns/:id",

  // Donor Routes (Protected)
  DASHBOARD: "/dashboard",
  DONOR_DASHBOARD: "/donor/dashboard",
  MY_DONATIONS: "/my-donations",
  DONOR_DONATIONS: "/donor/donations",
  APPLY_ORGANIZER: "/apply-organizer",
  DONOR_APPLY_ORGANIZER: "/donor/apply-organizer",
  APPLICATION_STATUS: "/application-status",
  DONOR_PROFILE: "/donor/profile",
  DonorHomepage: "/donor/homepage",
  DonorAboutus: "/donor/aboutus",

  // Organizer Routes
  MY_CAMPAIGNS: "/my-campaigns",
  ORGANIZER_DASHBOARD: "/organizer/dashboard",
  ORGANIZER_CAMPAIGNS: "/organizer/campaigns",
  ORGANIZER_CREATE_CAMPAIGN: "/organizer/campaigns/create",
  ORGANIZER_EDIT_CAMPAIGN: "/organizer/campaigns/:id/edit",
  ORGANIZER_CAMPAIGN_INSIGHTS: "/organizer/campaigns/:id/insights",
  ORGANIZER_WITHDRAWALS: "/organizer/withdrawals",
  ORGANIZER_PROFILE: "/organizer/profile",
  WITHDRAWAL_REQUEST: "/withdrawal-request",

  // Legacy utility pages
  NOTIFICATIONS: "/notifications",
  PAYMENT_SUCCESS: "/payment-success",
  PAYMENT_FAILURE: "/payment-failure",
  IMAGE_UPLOAD_DEMO: "/image-upload-demo",

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
