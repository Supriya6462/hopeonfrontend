import axios from "axios";
import api from "../axios";
import {
  extractCampaignListFromResponse,
  extractCampaignsFromResponse,
  extractDonationStatsFromResponse,
  extractOrganizerProfileFromResponse,
  extractWithdrawalFromResponse,
  extractWithdrawalListFromResponse,
  extractWithdrawalsFromResponse,
} from "./organizer.parsers";
import type {
  CampaignFilters,
  CreateCampaignDTO,
  UpdateCampaignDTO,
  WithdrawalFilters,
  CreateWithdrawalDTO,
} from "../../../types";

async function getWithFallback<T>(
  paths: string[],
  params?: unknown,
): Promise<T> {
  let lastError: unknown;

  for (const path of paths) {
    try {
      const response = await api.get(path, { params });
      return response.data as T;
    } catch (error) {
      lastError = error;
      if (!axios.isAxiosError(error) || error.response?.status !== 404) {
        throw error;
      }
    }
  }

  throw lastError;
}

export const organizerCampaignAPI = {
  getMyCampaigns: async (params?: CampaignFilters) =>
    getWithFallback(
      [
        "/api/campaigns/my-campaigns",
        "/api/organizer/campaigns",
        "/api/campaigns",
      ],
      params,
    ),

  getCampaignById: async (id: string) => {
    const response = await api.get(`/api/campaigns/${id}`);
    return response.data;
  },

  createCampaign: async (data: CreateCampaignDTO) => {
    const response = await api.post("/api/campaigns", data);
    return response.data;
  },

  updateCampaign: async (id: string, data: UpdateCampaignDTO) => {
    const response = await api.put(`/api/campaigns/${id}`, data);
    return response.data;
  },

  closeCampaign: async (id: string, closedReason?: string) => {
    const response = await api.patch(`/api/campaigns/${id}/close`, {
      closedReason,
    });
    return response.data;
  },

  deleteCampaign: async (id: string) => {
    const response = await api.delete(`/api/campaigns/${id}`);
    return response.data;
  },
};

export const organizerWithdrawalAPI = {
  createWithdrawal: async (data: CreateWithdrawalDTO) => {
    const response = await api.post("/api/withdrawals", data);
    return response.data;
  },

  getMyWithdrawals: async (params?: WithdrawalFilters) =>
    getWithFallback(
      [
        "/api/withdrawals/my-withdrawals",
        "/api/organizer/withdrawals",
        "/api/withdrawals",
      ],
      params,
    ),

  getWithdrawalById: async (id: string) => {
    const response = await api.get(`/api/withdrawals/${id}`);
    return response.data;
  },
};

export const organizerDonationAPI = {
  getDonationStats: async () =>
    getWithFallback([
      "/api/donations/my-stats",
      "/api/organizer/donations/stats",
      "/api/donations/stats",
    ]),

  getCampaignStats: async (campaignId: string) => {
    const response = await api.get(`/api/donations/stats/${campaignId}`);
    return response.data;
  },

  getCampaignDonations: async (
    campaignId: string,
    params?: { page?: number; limit?: number },
  ) => {
    const response = await api.get(`/api/donations/campaign/${campaignId}`, {
      params,
    });
    return response.data;
  },
};

export const organizerProfileAPI = {
  getProfile: async () => {
    const response = await api.get("/api/organizer/profile");
    return response.data;
  },

  upsertProfile: async (data: unknown) => {
    const response = await api.post("/api/organizer/profile", data);
    return response.data;
  },

  uploadProfileDocument: async (data: FormData) => {
    const response = await api.post(
      "/api/organizer/profile/upload-document",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },
};

export const organizerResponseParsers = {
  extractCampaignsFromResponse,
  extractCampaignListFromResponse,
  extractDonationStatsFromResponse,
  extractWithdrawalsFromResponse,
  extractWithdrawalListFromResponse,
  extractWithdrawalFromResponse,
  extractOrganizerProfileFromResponse,
};
