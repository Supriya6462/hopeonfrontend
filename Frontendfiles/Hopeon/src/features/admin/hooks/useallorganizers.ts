import { adminOrganizerAPI } from "@/features/api"
import { useQuery } from "@tanstack/react-query"

export const useallorganizers=() => {
    return useQuery({
        queryKey: ["organizerlist"],
        queryFn: () =>adminOrganizerAPI.getAllOrganizers(),
    });
}