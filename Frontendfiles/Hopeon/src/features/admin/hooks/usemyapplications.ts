import { adminOrganizerAPI } from "@/features/api";
import { useQuery } from "@tanstack/react-query";

export const useMyApplications = () => {
  return useQuery({
    queryKey: ["organizerApplications"],
    queryFn: () => adminOrganizerAPI.getAllApplications(),
  });
};
