import { useState, useMemo } from "react";
import type { OrganizerApplication } from "@/types";
import type { ApplicationStatus } from "@/enums";
import { getApplicationStatus } from "@/lib/organizerApplication";

export const useApplicationFilters = (applications: OrganizerApplication[]) => {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter(
        (app) => getApplicationStatus(app) === "pending",
      ).length,
      approved: applications.filter(
        (app) => getApplicationStatus(app) === "approved",
      ).length,
      rejected: applications.filter(
        (app) => getApplicationStatus(app) === "rejected",
      ).length,
    };
  }, [applications]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (app) => getApplicationStatus(app) === statusFilter,
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.organizationName.toLowerCase().includes(query) ||
          app.contactEmail?.toLowerCase().includes(query) ||
          app.phoneNumber?.toLowerCase().includes(query) ||
          app.description?.toLowerCase().includes(query),
      );
    }

    return filtered;
  }, [applications, statusFilter, searchQuery]);

  return {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    stats,
    filteredApplications,
  };
};
