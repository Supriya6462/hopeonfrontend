import { useState, useMemo } from "react";
import type { OrganizerApplication } from "@/types";
import type { ApplicationStatus } from "@/enums";

export const useApplicationFilters = (applications: OrganizerApplication[]) => {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: applications.length,
      pending: applications.filter((app) => app.status === "pending").length,
      approved: applications.filter((app) => app.status === "approved").length,
      rejected: applications.filter((app) => app.status === "rejected").length,
    };
  }, [applications]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (app) =>
          app.organizationName.toLowerCase().includes(query) ||
          app.contactEmail?.toLowerCase().includes(query) ||
          app.phoneNumber?.toLowerCase().includes(query) ||
          app.description.toLowerCase().includes(query)
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
