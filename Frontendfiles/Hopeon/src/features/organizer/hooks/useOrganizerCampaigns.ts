import { useQuery } from "@tanstack/react-query";
import { organizerCampaignAPI } from "@/features/api";
import type { CampaignFilters } from "@/types";

export const useOrganizerCampaigns = (filters?: CampaignFilters) => {
  return useQuery({
    queryKey: ["organizerCampaigns", filters],
    queryFn: () => organizerCampaignAPI.getMyCampaigns(filters),
  });
};

export const useOrganizerCampaignById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["organizerCampaign", id],
    queryFn: () => organizerCampaignAPI.getCampaignById(id!),
    enabled: !!id,
  });
};
