import { useQuery } from "@tanstack/react-query";
import { adminOrganizerAPI } from "@/features/api";

export const useGetApplicationById = (id: string | undefined) => {
  return useQuery({
    queryKey: ["organizerApplication", id],
    queryFn: () => adminOrganizerAPI.getApplicationById(id!),
    enabled: !!id,
  });
};
