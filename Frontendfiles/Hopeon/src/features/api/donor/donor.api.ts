import api from "../axios";
import type { CreateDonationDTO } from "../../../types";

// ==================== Donation APIs (Donor) ====================

export const donorDonationAPI = {
  // Create a new donation
  createDonation: async (data: CreateDonationDTO) => {
    const response = await api.post("/api/donations", data);
    return response.data;
  },

  // Get user's donation history
  getMyDonations: async (params?: { page?: number; limit?: number }) => {
    const response = await api.get("/api/donations/my-donations", { params });
    return response.data;
  },

  // Get overall donation stats
  getDonationStats: async () => {
    const response = await api.get("/api/donations/stats");
    return response.data;
  },
};

// ==================== Organizer Application APIs (Donor) ====================

export const donorOrganizerAPI = {
  // Submit organizer application (deprecated - use draft flow instead)
  applyAsOrganizer: async (data: FormData) => {
    const response = await api.post("/api/organizer/apply", data);
    return response.data;
  },

  // Create/Update draft application (Step 1: Basic Info)
  OrganizerApplicationDraft: async (data: Record<string, any>) => {
    const response = await api.post("/api/organizer/apply/draft", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  },

  // Upload documents and submit (Step 2: Documents)
  OrganizerDocument: async (applicationId: string, data: FormData) => {
    const response = await api.post(
      `/api/organizer/apply/${applicationId}/documents`,
      data,
    );
    return response.data;
  },

  // Get draft application (to resume Step 2)
  getDraftApplication: async () => {
    const response = await api.get("/api/organizer/apply/draft");
    return response.data;
  },

  // Get user's organizer applications
  getMyApplications: async () => {
    const response = await api.get("/api/organizer/my-applications");
    return response.data;
  },
};
