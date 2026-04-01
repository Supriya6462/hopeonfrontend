import { useQuery } from "@tanstack/react-query";
import { organizerDonationAPI } from "@/features/api";

export const useOrganizerDonationStats = () => {
  return useQuery({
    queryKey: ["organizerDonationStats"],
    queryFn: () => organizerDonationAPI.getDonationStats(),
  });
};

export const useOrganizerCampaignDonationStats = (
  campaignId: string | undefined,
) => {
  return useQuery({
    queryKey: ["organizerCampaignDonationStats", campaignId],
    queryFn: () => organizerDonationAPI.getCampaignStats(campaignId!),
    enabled: !!campaignId,
  });
};

export const useOrganizerCampaignDonations = (
  campaignId: string | undefined,
  params?: { page?: number; limit?: number },
) => {
  return useQuery({
    queryKey: ["organizerCampaignDonations", campaignId, params],
    queryFn: () =>
      organizerDonationAPI.getCampaignDonations(campaignId!, params),
    enabled: !!campaignId,
  });
};
