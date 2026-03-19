import { useQuery } from "@tanstack/react-query";
import { adminDonationAPI } from "@/features/api";
import type { DonationFilters } from "@/types";

export const useAdminDonations = (filters?: DonationFilters) => {
  return useQuery({
    queryKey: ["adminDonations", filters],
    queryFn: () => adminDonationAPI.getAllDonations(filters),
  });
};

export const useAdminDonationsByCampaign = (
  campaignId: string | undefined,
  params?: { page?: number; limit?: number },
) => {
  return useQuery({
    queryKey: ["adminCampaignDonations", campaignId, params],
    queryFn: () => adminDonationAPI.getCampaignDonations(campaignId!, params),
    enabled: !!campaignId,
  });
};

export const useAdminDonationStats = () => {
  return useQuery({
    queryKey: ["adminDonationStats"],
    queryFn: () => adminDonationAPI.getDonationStats(),
  });
};

export const useAdminCampaignDonationStats = (
  campaignId: string | undefined,
) => {
  return useQuery({
    queryKey: ["adminCampaignDonationStats", campaignId],
    queryFn: () => adminDonationAPI.getCampaignStats(campaignId!),
    enabled: !!campaignId,
  });
};
