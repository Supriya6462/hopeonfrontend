import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrganizerAPI } from "@/features/api";

export const useOrganizerActions = () => {
  const queryClient = useQueryClient();

  const revokeMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminOrganizerAPI.revokeOrganizer(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizerlist"] });
    },
  });

  const reinstateMutation = useMutation({
    mutationFn: (id: string) => adminOrganizerAPI.reinstateOrganizer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizerlist"] });
    },
  });

  return {
    revokeOrganizer: revokeMutation.mutate,
    reinstateOrganizer: reinstateMutation.mutate,
    isRevoking: revokeMutation.isPending,
    isReinstating: reinstateMutation.isPending,
    revokeError: revokeMutation.error,
    reinstateError: reinstateMutation.error,
  };
};
