import { useState } from "react";
import { usemyapplications } from "../hooks/usemyapplications";
import { useApplicationActions } from "../hooks/useApplicationActions";
import { useApplicationFilters } from "../hooks/useApplicationFilters";
import {
  ApplicationCard,
  ApplicationFilters,
  ApplicationDetailsModal,
  RejectModal,
} from "../components";
import type { OrganizerApplication } from "@/types";

export default function KycApplicationofOrganizer() {
  const { data, isLoading, isError, error } = usemyapplications();
  const { approveApplication, rejectApplication } = useApplicationActions();

  // Modal states
  const [selectedApplication, setSelectedApplication] =
    useState<OrganizerApplication | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [applicationToReject, setApplicationToReject] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Get applications from response
  const applications = data?.data?.applications || data?.applications || [];

  // Use filters hook
  const {
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    stats,
    filteredApplications,
  } = useApplicationFilters(applications);

  // Handlers
  const handleViewDetails = (application: OrganizerApplication) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };

  const handleApprove = (id: string) => {
    if (confirm("Are you sure you want to approve this application?")) {
      approveApplication(id);
    }
  };

  const handleRejectClick = (id: string, name: string) => {
    setApplicationToReject({ id, name });
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = (reason: string) => {
    if (applicationToReject) {
      rejectApplication({ id: applicationToReject.id, reason });
      setIsRejectModalOpen(false);
      setApplicationToReject(null);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading applications...</p>
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
            Error Loading Applications
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
          Organizer KYC Applications
        </h1>
        <p className="text-gray-600 mt-2">
          Review and manage organizer verification applications
        </p>
      </div>

      {/* Filters */}
      <ApplicationFilters
        statusFilter={statusFilter}
        searchQuery={searchQuery}
        onStatusChange={setStatusFilter}
        onSearchChange={setSearchQuery}
        stats={stats}
      />

      {/* Applications List */}
      {filteredApplications.length === 0 ? (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Applications Found
          </h3>
          <p className="text-gray-600">
            {searchQuery
              ? "Try adjusting your search or filters"
              : "No applications match the selected criteria"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredApplications.map((application) => (
            <ApplicationCard
              key={application._id}
              application={application}
              onApprove={handleApprove}
              onReject={(id) =>
                handleRejectClick(id, application.organizationName)
              }
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <ApplicationDetailsModal
        application={selectedApplication}
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedApplication(null);
        }}
      />

      <RejectModal
        isOpen={isRejectModalOpen}
        organizationName={applicationToReject?.name || ""}
        onConfirm={handleRejectConfirm}
        onCancel={() => {
          setIsRejectModalOpen(false);
          setApplicationToReject(null);
        }}
      />
    </div>
  );
}