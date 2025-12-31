import api from "../axios";
import type { LoginInput, RegisterInput } from "../../../types";
import type { OtpPurposeType } from "../../../enums";

// ==================== Authentication APIs ====================

export const authAPI = {
  // Register new user
  register: async (data: RegisterInput) => {
    const response = await api.post("/api/auth/register", data);
    return response.data;
  },

  // Login user
  login: async (data: LoginInput) => {
    const response = await api.post("/api/auth/login", data);
    return response.data;
  },

  // Request OTP
  requestOtp: async (email: string, purpose: OtpPurposeType) => {
    const response = await api.post("/api/auth/request-otp", { email, purpose });
    return response.data;
  },

  // Verify OTP
  verifyOtp: async (email: string, otpCode: string, purpose: OtpPurposeType) => {
    const response = await api.post("/api/auth/verify-otp", {
      email,
      otpCode,
      purpose,
    });
    return response.data;
  },

  // Reset password
  resetPassword: async (email: string, newPassword: string, otpCode: string) => {
    const response = await api.post("/api/auth/reset-password", {
      email,
      newPassword,
      otpCode,
    });
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get("/api/auth/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<RegisterInput>) => {
    const response = await api.put("/api/auth/profile", data);
    return response.data;
  },
};

// ==================== Campaign APIs (Public) ====================

export const publicCampaignAPI = {
  // Get all approved campaigns
  getAllCampaigns: async (params?: {
    search?: string;
    page?: number;
    limit?: number;
    isClosed?: boolean;
  }) => {
    const response = await api.get("/api/campaigns", { params });
    return response.data;
  },

  // Get single campaign details
  getCampaignById: async (id: string) => {
    const response = await api.get(`/api/campaigns/${id}`);
    return response.data;
  },
};

// ==================== Donation APIs (Public) ====================

export const publicDonationAPI = {
  // Get donations for a specific campaign
  getCampaignDonations: async (
    campaignId: string,
    params?: { page?: number; limit?: number }
  ) => {
    const response = await api.get(`/api/donations/campaign/${campaignId}`, {
      params,
    });
    return response.data;
  },

  // Get campaign donation stats
  getCampaignStats: async (campaignId: string) => {
    const response = await api.get(`/api/donations/stats/${campaignId}`);
    return response.data;
  },
};
