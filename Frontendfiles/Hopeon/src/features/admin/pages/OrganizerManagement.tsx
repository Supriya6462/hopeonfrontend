import { useState } from "react";
import { useallorganizers } from "../hooks/useallorganizers";
import { useOrganizerActions } from "../hooks/useOrganizerActions";
import { useOrganizerFilters } from "../hooks/useOrganizerFilters";
import {
  OrganizerCard,
  OrganizerFilters,
  OrganizerDetailsModal,
  RevokeModal,
} from "../components";
import type { User } from "@/types";

export default function OrganizerManagement() {
  const { data, isLoading, isError, error } = useallorganizers();
  const { revokeOrganizer, reinstateOrganizer } = useOrganizerActions();

  // Modal states
  const [selectedOrganizer, setSelectedOrganizer] = useState<User | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [organizerToRevoke, setOrganizerToRevoke] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Get organizers from response
  const organizers = data?.data?.organizers || [];

  // Use filters hook
  const {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    stats,
    filteredOrganizers,
  } = useOrganizerFilters(organizers);

  // Handlers
  const handleViewDetails = (organizer: User) => {
    setSelectedOrganizer(organizer);
    setIsDetailsModalOpen(true);
  };

  const handleRevokeClick = (id: string, name: string) => {
    setOrganizerToRevoke({ id, name });
    setIsRevokeModalOpen(true);
  };

  const handleRevokeConfirm = (reason: string) => {
    if (organizerToRevoke) {
      revokeOrganizer({ id: organizerToRevoke.id, reason });
      setIsRevokeModalOpen(false);
      setOrganizerToRevoke(null);
    }
  };

  const handleReinstate = (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to reinstate organizer privileges for ${name}? This will restore their full access.`
      )
    ) {
      reinstateOrganizer(id);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading organizers...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-red-900 mb-2">
            Error Loading Organizers
          </h3>
          <p className="text-red-700">{error?.message || "Unknown error"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Organizer Management
        </h1>
        <p className="text-gray-600 mt-2">
          Manage organizer accounts, access privileges, and compliance
        </p>
      </div>

      {/* Filters */}
      <OrganizerFilters
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchQuery}
        stats={stats}
      />

      {/* Organizers List */}
      {filteredOrganizers.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Organizers Found
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "No organizers match the selected criteria"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredOrganizers.map((organizer) => (
            <OrganizerCard
              key={organizer._id}
              organizer={organizer}
              onRevoke={handleRevokeClick}
              onReinstate={handleReinstate}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <OrganizerDetailsModal
        organizer={selectedOrganizer}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedOrganizer(null);
        }}
      />

      <RevokeModal
        isOpen={isRevokeModalOpen}
        organizerName={organizerToRevoke?.name || ""}
        onConfirm={handleRevokeConfirm}
        onCancel={() => {
          setIsRevokeModalOpen(false);
          setOrganizerToRevoke(null);
        }}
      />
    </div>
  );
}