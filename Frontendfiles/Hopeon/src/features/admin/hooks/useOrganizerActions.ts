import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminOrganizerAPI } from "@/features/api";
import { toast } from "sonner";

export const useOrganizerActions = () => {
  const queryClient = useQueryClient();

  const revokeMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminOrganizerAPI.revokeOrganizer(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizerlist"] });
      toast.success("Organizer privileges revoked successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to revoke organizer";
      toast.error(message);
      console.error("Revoke error:", error);
    },
  });

  const reinstateMutation = useMutation({
    mutationFn: (id: string) => adminOrganizerAPI.reinstateOrganizer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizerlist"] });
      toast.success("Organizer privileges reinstated successfully");
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to reinstate organizer";
      toast.error(message);
      console.error("Reinstate error:", error);
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
