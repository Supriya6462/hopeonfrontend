import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizerCampaignAPI } from "@/features/api";
import type { CreateCampaignDTO, UpdateCampaignDTO } from "@/types";
import { toast } from "sonner";

type CampaignRecord = {
  _id: string;
  isApproved?: boolean;
  isClosed?: boolean;
  closedReason?: string;
  [key: string]: any;
};

interface UpdateCampaignParams {
  id: string;
  data: UpdateCampaignDTO;
}

interface CloseCampaignParams {
  id: string;
  closedReason?: string;
}

function extractCreatedCampaign(data: unknown): CampaignRecord | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const root = data as Record<string, any>;
  const candidates = [
    root,
    root.data,
    root.result,
    root.campaign,
    root.data?.campaign,
    root.data?.data,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object" && "_id" in candidate) {
      return candidate as CampaignRecord;
    }
  }

  return null;
}

function prependCampaignInCache(
  data: unknown,
  campaign: CampaignRecord,
): unknown {
  if (Array.isArray(data)) {
    const existing = data as any[];
    if (existing.some((item) => item?._id === campaign._id)) {
      return data;
    }
    return [campaign, ...existing];
  }

  if (!data || typeof data !== "object") {
    return data;
  }

  const source = data as Record<string, any>;

  if (Array.isArray(source.campaigns)) {
    return {
      ...source,
      campaigns: prependCampaignInCache(source.campaigns, campaign),
    };
  }

  if (Array.isArray(source.data?.campaigns)) {
    return {
      ...source,
      data: {
        ...source.data,
        campaigns: prependCampaignInCache(source.data.campaigns, campaign),
      },
    };
  }

  if (Array.isArray(source.result?.campaigns)) {
    return {
      ...source,
      result: {
        ...source.result,
        campaigns: prependCampaignInCache(source.result.campaigns, campaign),
      },
    };
  }

  if (Array.isArray(source.data)) {
    return {
      ...source,
      data: prependCampaignInCache(source.data, campaign),
    };
  }

  return data;
}

function updateCampaignsInCache(
  data: unknown,
  transform: (campaign: CampaignRecord) => CampaignRecord | null,
): unknown {
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (!item || typeof item !== "object" || !("_id" in (item as any))) {
          return item;
        }

        return transform(item as CampaignRecord);
      })
      .filter((item) => item !== null);
  }

  if (!data || typeof data !== "object") {
    return data;
  }

  const source = data as Record<string, any>;

  if (Array.isArray(source.campaigns)) {
    return {
      ...source,
      campaigns: updateCampaignsInCache(source.campaigns, transform),
    };
  }

  if (Array.isArray(source.data)) {
    return {
      ...source,
      data: updateCampaignsInCache(source.data, transform),
    };
  }

  if (source.data && Array.isArray(source.data.campaigns)) {
    return {
      ...source,
      data: {
        ...source.data,
        campaigns: updateCampaignsInCache(source.data.campaigns, transform),
      },
    };
  }

  if (source.result && Array.isArray(source.result.campaigns)) {
    return {
      ...source,
      result: {
        ...source.result,
        campaigns: updateCampaignsInCache(source.result.campaigns, transform),
      },
    };
  }

  if (source.data?.data && Array.isArray(source.data.data.campaigns)) {
    return {
      ...source,
      data: {
        ...source.data,
        data: {
          ...source.data.data,
          campaigns: updateCampaignsInCache(
            source.data.data.campaigns,
            transform,
          ),
        },
      },
    };
  }

  return data;
}

export const useOrganizerCampaignActions = () => {
  const queryClient = useQueryClient();

  const invalidateCampaignQueries = (id?: string) => {
    queryClient.invalidateQueries({ queryKey: ["organizerCampaigns"] });
    if (id) {
      queryClient.invalidateQueries({ queryKey: ["organizerCampaign", id] });
    }
    queryClient.invalidateQueries({ queryKey: ["organizerDonationStats"] });
  };

  const createMutation = useMutation({
    mutationFn: (data: CreateCampaignDTO) =>
      organizerCampaignAPI.createCampaign(data),
    onSuccess: (response) => {
      const createdCampaign = extractCreatedCampaign(response);

      if (createdCampaign) {
        const previousCampaignQueries = queryClient.getQueriesData({
          queryKey: ["organizerCampaigns"],
        });

        for (const [key, value] of previousCampaignQueries) {
          queryClient.setQueryData(
            key,
            prependCampaignInCache(value, createdCampaign),
          );
        }

        queryClient.setQueryData(
          ["organizerCampaign", createdCampaign._id],
          createdCampaign,
        );
      }

      invalidateCampaignQueries(createdCampaign?._id);

      if (createdCampaign?.isApproved === false) {
        toast.success("Campaign created and submitted for admin approval");
      } else {
        toast.success("Campaign created successfully");
      }
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create campaign";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: UpdateCampaignParams) =>
      organizerCampaignAPI.updateCampaign(id, data),
    onSuccess: (_, variables) => {
      invalidateCampaignQueries(variables.id);
      toast.success("Campaign updated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update campaign";
      toast.error(message);
    },
  });

  const closeMutation = useMutation({
    mutationFn: ({ id, closedReason }: CloseCampaignParams) =>
      organizerCampaignAPI.closeCampaign(id, closedReason),
    onMutate: async ({ id, closedReason }) => {
      await queryClient.cancelQueries({ queryKey: ["organizerCampaigns"] });
      await queryClient.cancelQueries({ queryKey: ["organizerCampaign", id] });

      const previousCampaignQueries = queryClient.getQueriesData({
        queryKey: ["organizerCampaigns"],
      });
      const previousCampaignById = queryClient.getQueryData([
        "organizerCampaign",
        id,
      ]);

      for (const [key, value] of previousCampaignQueries) {
        queryClient.setQueryData(
          key,
          updateCampaignsInCache(value, (campaign) => {
            if (campaign._id !== id) return campaign;
            return {
              ...campaign,
              isClosed: true,
              closedReason: closedReason || campaign.closedReason,
            };
          }),
        );
      }

      queryClient.setQueryData(["organizerCampaign", id], (current: any) => {
        if (!current || typeof current !== "object") {
          return current;
        }

        if (current._id) {
          return {
            ...current,
            isClosed: true,
            closedReason: closedReason || current.closedReason,
          };
        }

        if (current.data && typeof current.data === "object") {
          return {
            ...current,
            data: {
              ...current.data,
              isClosed: true,
              closedReason: closedReason || current.data.closedReason,
            },
          };
        }

        return current;
      });

      return { previousCampaignQueries, previousCampaignById, id };
    },
    onSuccess: (_, variables) => {
      invalidateCampaignQueries(variables.id);
      toast.success("Campaign closed successfully");
    },
    onError: (error: any, variables, context) => {
      context?.previousCampaignQueries?.forEach(([key, value]: any) => {
        queryClient.setQueryData(key, value);
      });

      if (context?.previousCampaignById !== undefined) {
        queryClient.setQueryData(
          ["organizerCampaign", variables.id],
          context.previousCampaignById,
        );
      }

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to close campaign";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => organizerCampaignAPI.deleteCampaign(id),
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: ["organizerCampaigns"] });

      const previousCampaignQueries = queryClient.getQueriesData({
        queryKey: ["organizerCampaigns"],
      });

      for (const [key, value] of previousCampaignQueries) {
        queryClient.setQueryData(
          key,
          updateCampaignsInCache(value, (campaign) => {
            if (campaign._id === id) return null;
            return campaign;
          }),
        );
      }

      return { previousCampaignQueries };
    },
    onSuccess: () => {
      invalidateCampaignQueries();
      toast.success("Campaign deleted successfully");
    },
    onError: (error: any, _variables, context) => {
      context?.previousCampaignQueries?.forEach(([key, value]: any) => {
        queryClient.setQueryData(key, value);
      });

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to delete campaign";
      toast.error(message);
    },
  });

  return {
    createCampaign: createMutation.mutate,
    createCampaignAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateCampaign: updateMutation.mutate,
    updateCampaignAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    closeCampaign: closeMutation.mutate,
    closeCampaignAsync: closeMutation.mutateAsync,
    isClosing: closeMutation.isPending,
    closeError: closeMutation.error,
    deleteCampaign: deleteMutation.mutate,
    deleteCampaignAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
};
