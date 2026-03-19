import { useQuery } from "@tanstack/react-query";
import { donorOrganizerAPI } from "@/features/api";

/**
 * Hook to fetch all of the current user's organizer applications.
 * Useful for showing application history/status to the donor.
 */
export const useMyApplications = () => {
  return useQuery({
    queryKey: ["myOrganizerApplications"],
    queryFn: () => donorOrganizerAPI.getMyApplications(),
  });
};

/**
 * Hook to fetch the current user's draft organizer application.
 * Used to allow the donor to resume an in-progress application (Step 2 - documents).
 */
export const useGetDraftApplication = () => {
  return useQuery({
    queryKey: ["myOrganizerDraft"],
    queryFn: () => donorOrganizerAPI.getDraftApplication(),
    // Don't throw on 404 — a null draft is expected for new applicants
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 404) return false;
      return failureCount < 2;
    },
  });
};
