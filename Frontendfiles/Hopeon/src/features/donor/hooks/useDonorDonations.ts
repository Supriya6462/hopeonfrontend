import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { donorDonationAPI } from "@/features/api";
import { toast } from "sonner";
import type { CreateDonationDTO } from "@/types";

export const useDonorDonations = (params?: {
  page?: number;
  limit?: number;
}) => {
  return useQuery({
    queryKey: ["myDonations", params],
    queryFn: () => donorDonationAPI.getMyDonations(params),
  });
};

export const useDonorDonationStats = () => {
  return useQuery({
    queryKey: ["donorDonationStats"],
    queryFn: () => donorDonationAPI.getDonationStats(),
  });
};

export const useCreateDonation = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateDonationDTO) =>
      donorDonationAPI.createDonation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myDonations"] });
      toast.success("Donation initiated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create donation";
      toast.error(message);
    },
  });

  return {
    createDonation: createMutation.mutate,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    createdDonation: createMutation.data,
  };
};
