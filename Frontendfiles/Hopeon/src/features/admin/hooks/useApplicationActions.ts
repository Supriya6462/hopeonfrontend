import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrganizerAPI } from "@/features/api";

export const useApplicationActions = () => {
  const queryClient = useQueryClient();

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminOrganizerAPI.approveApplication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizerApplications"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminOrganizerAPI.rejectApplication(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizerApplications"] });
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
