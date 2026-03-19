import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminWithdrawalAPI } from "@/features/api";
import { toast } from "sonner";

interface RejectWithdrawalParams {
  id: string;
  adminMessage: string;
}

interface MarkAsPaidParams {
  id: string;
  paymentReference?: string;
}

export const useAdminWithdrawalActions = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["adminWithdrawals"] });
  };

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminWithdrawalAPI.approveWithdrawal(id),
    onSuccess: () => {
      invalidate();
      toast.success("Withdrawal request approved");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to approve withdrawal";
      toast.error(message);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, adminMessage }: RejectWithdrawalParams) =>
      adminWithdrawalAPI.rejectWithdrawal(id, adminMessage),
    onSuccess: () => {
      invalidate();
      toast.success("Withdrawal request rejected");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reject withdrawal";
      toast.error(message);
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: ({ id, paymentReference }: MarkAsPaidParams) =>
      adminWithdrawalAPI.markWithdrawalAsPaid(id, paymentReference),
    onSuccess: () => {
      invalidate();
      toast.success("Withdrawal marked as paid");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to mark withdrawal as paid";
      toast.error(message);
    },
  });

  return {
    approveWithdrawal: approveMutation.mutate,
    rejectWithdrawal: rejectMutation.mutate,
    markAsPaid: markAsPaidMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isMarkingPaid: markAsPaidMutation.isPending,
    approveError: approveMutation.error,
    rejectError: rejectMutation.error,
    markPaidError: markAsPaidMutation.error,
  };
};
