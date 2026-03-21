import { useQuery } from "@tanstack/react-query";
import { donorOrganizerAPI } from "@/features/api";
import { useMemo } from "react";
import type { OrganizerApplication } from "@/types";
import {
  extractApplicationsFromResponse,
  normalizeOrganizerApplication,
} from "@/lib/organizerApplication";

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
 * Hook to get the most recent organizer application with normalized response parsing.
 * This provides a single source of truth for status-driven UI across donor pages.
 */
export const useLatestOrganizerApplication = () => {
  const query = useMyApplications();

  const applications = useMemo<OrganizerApplication[]>(() => {
    return extractApplicationsFromResponse(query.data).map((application) =>
      normalizeOrganizerApplication(application),
    ) as OrganizerApplication[];
  }, [query.data]);

  const latestApplication = useMemo<OrganizerApplication | null>(() => {
    if (applications.length === 0) return null;

    return [...applications].sort((a, b) => {
      const aTime = new Date(a.updatedAt || a.createdAt).getTime();
      const bTime = new Date(b.updatedAt || b.createdAt).getTime();
      return bTime - aTime;
    })[0];
  }, [applications]);

  return {
    ...query,
    applications,
    latestApplication,
  };
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
