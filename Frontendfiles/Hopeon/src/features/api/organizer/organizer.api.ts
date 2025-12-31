import api from "../axios";
import type {
  CreateCampaignDTO,
  UpdateCampaignDTO,
  CampaignFilters,
  CreateWithdrawalDTO,
  WithdrawalFilters,
} from "../../../types";

// ==================== Campaign APIs (Organizer) ====================

export const organizerCampaignAPI = {
  // Create a new campaign
  createCampaign: async (data: CreateCampaignDTO) => {
    const response = await api.post("/api/campaigns", data);
    return response.data;
  },

  // Update own campaign
  updateCampaign: async (id: string, data: UpdateCampaignDTO) => {
    const response = await api.put(`/api/campaigns/${id}`, data);
    return response.data;
  },

  // Close own campaign
  closeCampaign: async (id: string, closedReason?: string) => {
    const response = await api.patch(`/api/campaigns/${id}/close`, {
      closedReason,
    });
    return response.data;
  },

  // Delete own campaign (only if no donations)
  deleteCampaign: async (id: string) => {
    const response = await api.delete(`/api/campaigns/${id}`);
    return response.data;
  },

  // Get own campaigns
  getMyCampaigns: async (params?: CampaignFilters) => {
    const response = await api.get("/api/campaigns", { params });
    return response.data;
  },

  // Get single campaign details
  getCampaignById: async (id: string) => {
    const response = await api.get(`/api/campaigns/${id}`);
    return response.data;
  },
};

// ==================== Withdrawal APIs (Organizer) ====================

export const organizerWithdrawalAPI = {
  // Create withdrawal request
  createWithdrawal: async (data: CreateWithdrawalDTO) => {
    const response = await api.post("/api/withdrawals", data);
    return response.data;
  },

  // Get own withdrawal requests
  getMyWithdrawals: async (params?: WithdrawalFilters) => {
    const response = await api.get("/api/withdrawals/my-withdrawals", { params });
    return response.data;
  },

  // Get single withdrawal details
  getWithdrawalById: async (id: string) => {
    const response = await api.get(`/api/withdrawals/${id}`);
    return response.data;
  },
};

// ==================== Donation APIs (Organizer) ====================

export const organizerDonationAPI = {
  // Get donations for organizer's campaigns
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

  // Get overall donation stats
  getDonationStats: async () => {
    const response = await api.get("/api/donations/stats");
    return response.data;
  },
};
