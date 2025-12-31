import api from "../axios";
import type {
  CampaignFilters,
  DonationFilters,
  ApplicationFilters,
  WithdrawalFilters,
  UpdateCampaignDTO,
  UpdateDonationPaymentDetails,
} from "../../../types";
import type { DonationStatus } from "../../../enums";

// ==================== Campaign APIs (Admin) ====================

export const adminCampaignAPI = {
  // Get all campaigns (including unapproved)
  getAllCampaigns: async (params?: CampaignFilters) => {
    const response = await api.get("/api/campaigns", { params });
    return response.data;
  },

  // Get single campaign details
  getCampaignById: async (id: string) => {
    const response = await api.get(`/api/campaigns/${id}`);
    return response.data;
  },

  // Approve campaign
  approveCampaign: async (id: string) => {
    const response = await api.patch(`/api/campaigns/${id}/approve`);
    return response.data;
  },

  // Update any campaign
  updateCampaign: async (id: string, data: UpdateCampaignDTO) => {
    const response = await api.put(`/api/campaigns/${id}`, data);
    return response.data;
  },

  // Close any campaign
  closeCampaign: async (id: string, closedReason?: string) => {
    const response = await api.patch(`/api/campaigns/${id}/close`, {
      closedReason,
    });
    return response.data;
  },

  // Delete any campaign (only if no donations)
  deleteCampaign: async (id: string) => {
    const response = await api.delete(`/api/campaigns/${id}`);
    return response.data;
  },
};

// ==================== Donation APIs (Admin) ====================

export const adminDonationAPI = {
  // Get all donations with filters
  getAllDonations: async (params?: DonationFilters) => {
    const response = await api.get("/api/donations", { params });
    return response.data;
  },

  // Update donation status
  updateDonationStatus: async (
    id: string,
    status: DonationStatus,
    paymentDetails?: UpdateDonationPaymentDetails
  ) => {
    const response = await api.patch(`/api/donations/${id}/status`, {
      status,
      paymentDetails,
    });
    return response.data;
  },

  // Get campaign donations
  getCampaignDonations: async (
    campaignId: string,
    params?: { page?: number; limit?: number }
  ) => {
    const response = await api.get(`/api/donations/campaign/${campaignId}`, {
      params,
    });
    return response.data;
  },

  // Get donation stats
  getDonationStats: async () => {
    const response = await api.get("/api/donations/stats");
    return response.data;
  },

  // Get campaign donation stats
  getCampaignStats: async (campaignId: string) => {
    const response = await api.get(`/api/donations/stats/${campaignId}`);
    return response.data;
  },
};

// ==================== Organizer Application APIs (Admin) ====================

export const adminOrganizerAPI = {
  // Get all organizer applications
  getAllApplications: async (params?: ApplicationFilters) => {
    const response = await api.get("/api/organizer/applications", { params });
    return response.data;
  },

  // Get single application details
  getApplicationById: async (id: string) => {
    const response = await api.get(`/api/organizer/applications/${id}`);
    return response.data;
  },

  // Approve organizer application
  approveApplication: async (id: string) => {
    const response = await api.patch(`/api/organizer/applications/${id}/approve`);
    return response.data;
  },

  // Reject organizer application
  rejectApplication: async (id: string, rejectionReason: string) => {
    const response = await api.patch(`/api/organizer/applications/${id}/reject`, {
      rejectionReason,
    });
    return response.data;
  },

  // Get all organizers
  getAllOrganizers: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get("/api/organizer", { params });
    return response.data;
  },

  // Revoke organizer privileges
  revokeOrganizer: async (id: string, revocationReason: string) => {
    const response = await api.patch(`/api/organizer/${id}/revoke`, {
      revocationReason,
    });
    return response.data;
  },

  // Reinstate organizer privileges
  reinstateOrganizer: async (id: string) => {
    const response = await api.patch(`/api/organizer/${id}/reinstate`);
    return response.data;
  },
};

// ==================== Withdrawal APIs (Admin) ====================

export const adminWithdrawalAPI = {
  // Get all withdrawal requests
  getAllWithdrawals: async (params?: WithdrawalFilters) => {
    const response = await api.get("/api/withdrawals", { params });
    return response.data;
  },

  // Get single withdrawal details
  getWithdrawalById: async (id: string) => {
    const response = await api.get(`/api/withdrawals/${id}`);
    return response.data;
  },

  // Approve withdrawal request
  approveWithdrawal: async (id: string, adminMessage?: string) => {
    const response = await api.patch(`/api/withdrawals/${id}/approve`, {
      adminMessage,
    });
    return response.data;
  },

  // Reject withdrawal request
  rejectWithdrawal: async (id: string, adminMessage: string) => {
    const response = await api.patch(`/api/withdrawals/${id}/reject`, {
      adminMessage,
    });
    return response.data;
  },

  // Mark withdrawal as paid
  markWithdrawalAsPaid: async (id: string, paymentReference?: string) => {
    const response = await api.patch(`/api/withdrawals/${id}/mark-paid`, {
      paymentReference,
    });
    return response.data;
  },
};
