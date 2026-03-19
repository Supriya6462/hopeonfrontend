import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrganizerAPI } from "@/features/api";
import { toast } from "sonner";

interface ApproveApplicationParams {
  id: string;
  adminNotes?: string;
}

interface RejectApplicationParams {
  id: string;
  reason: string;
  adminNotes?: string;
}

export const useApplicationActions = () => {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: ({ id, adminNotes }: ApproveApplicationParams) =>
      adminOrganizerAPI.approveApplication(id, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizerApplications"] });
      queryClient.invalidateQueries({ queryKey: ["organizerlist"] });
      toast.success("Application approved successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to approve application";
      toast.error(message);
      console.error("Approve error:", error);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason, adminNotes }: RejectApplicationParams) =>
      adminOrganizerAPI.rejectApplication(id, reason, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizerApplications"] });
      toast.success("Application rejected successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reject application";
      toast.error(message);
      console.error("Reject error:", error);
    },
  });

  return {
    approveApplication: approveMutation.mutate,
    rejectApplication: rejectMutation.mutate,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    approveError: approveMutation.error,
    rejectError: rejectMutation.error,
  };
};
