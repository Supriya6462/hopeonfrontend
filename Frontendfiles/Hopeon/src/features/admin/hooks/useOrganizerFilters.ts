import { useState, useMemo } from "react";
import type { User } from "@/types";

export const useOrganizerFilters = (organizers: User[]) => {
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "revoked" | "pending"
  >("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate stats
  const stats = useMemo(() => {
    return {
      total: organizers.length,
      active: organizers.filter(
        (org) => org.isOrganizerApproved && !org.isOrganizerRevoked
      ).length,
      revoked: organizers.filter((org) => org.isOrganizerRevoked).length,
      pending: organizers.filter((org) => !org.isOrganizerApproved).length,
    };
  }, [organizers]);

  // Filter organizers
  const filteredOrganizers = useMemo(() => {
    let filtered = organizers;

    // Filter by status
    if (statusFilter === "active") {
      filtered = filtered.filter(
        (org) => org.isOrganizerApproved && !org.isOrganizerRevoked
      );
    } else if (statusFilter === "revoked") {
      filtered = filtered.filter((org) => org.isOrganizerRevoked);
    } else if (statusFilter === "pending") {
      filtered = filtered.filter((org) => !org.isOrganizerApproved);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (org) =>
          org.name.toLowerCase().includes(query) ||
          org.email.toLowerCase().includes(query) ||
          org.phoneNumber?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [organizers, statusFilter, searchQuery]);

  return {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    stats,
    filteredOrganizers,
  };
};
