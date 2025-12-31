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
  // Submit organizer application
  applyAsOrganizer: async (data: FormData) => {
    const response = await api.post("/api/organizer/apply", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Get user's organizer applications
  getMyApplications: async () => {
    const response = await api.get("/api/organizer/my-applications");
    return response.data;
  },
};
