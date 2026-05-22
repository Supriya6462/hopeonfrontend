import { adminOrganizerAPI } from "@/features/api";
import { useQuery } from "@tanstack/react-query";

export const useAllOrganizers = () => {
  return useQuery({
    queryKey: ["organizerlist"],
    queryFn: () => adminOrganizerAPI.getAllOrganizers(),
  });
};
