import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizerWithdrawalAPI } from "@/features/api";
import { toast } from "sonner";
import type { CreateWithdrawalDTO } from "@/types";

export const useOrganizerWithdrawalActions = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (data: CreateWithdrawalDTO) =>
      organizerWithdrawalAPI.createWithdrawal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizerWithdrawals"] });
      toast.success("Withdrawal request submitted successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to submit withdrawal request";
      toast.error(message);
    },
  });

  return {
    createWithdrawal: createMutation.mutate,
    createWithdrawalAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
  };
};
