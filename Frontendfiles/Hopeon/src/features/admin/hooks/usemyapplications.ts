import { adminOrganizerAPI } from "@/features/api"
import { useQuery } from "@tanstack/react-query"

export const usemyapplications=() => {
    return useQuery({
        queryKey: ["organizerApplications"],
        queryFn: () => adminOrganizerAPI.getAllApplications(),
    });

};