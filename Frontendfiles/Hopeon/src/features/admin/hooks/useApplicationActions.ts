import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrganizerAPI } from "@/features/api";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";

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
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to approve application"));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason, adminNotes }: RejectApplicationParams) =>
      adminOrganizerAPI.rejectApplication(id, reason, adminNotes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizerApplications"] });
      toast.success("Application rejected successfully");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to reject application"));
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
