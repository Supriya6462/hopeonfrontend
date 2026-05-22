import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminDonationAPI } from "@/features/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";
import type { DonationStatus } from "@/enums";

interface UpdateStatusParams {
  id: string;
  status: DonationStatus;
}

export const useAdminDonationActions = () => {
  const queryClient = useQueryClient();

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: UpdateStatusParams) =>
      adminDonationAPI.updateDonationStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminDonations"] });
      toast.success("Donation status updated");
    },
    onError: (error: unknown) => {
      toast.error(
        getErrorMessage(error, "Failed to mark donation as refunded"),
      );
    },
  });

  return {
    updateDonationStatus: updateStatusMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
    updateError: updateStatusMutation.error,
  };
};
