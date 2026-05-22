import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminWithdrawalAPI } from "@/features/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";

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
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to approve withdrawal"));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, adminMessage }: RejectWithdrawalParams) =>
      adminWithdrawalAPI.rejectWithdrawal(id, adminMessage),
    onSuccess: () => {
      invalidate();
      toast.success("Withdrawal request rejected");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to reject withdrawal"));
    },
  });

  const markAsPaidMutation = useMutation({
    mutationFn: ({ id, paymentReference }: MarkAsPaidParams) =>
      adminWithdrawalAPI.markWithdrawalAsPaid(id, paymentReference),
    onSuccess: () => {
      invalidate();
      toast.success("Withdrawal marked as paid");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to mark withdrawal as paid"));
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
