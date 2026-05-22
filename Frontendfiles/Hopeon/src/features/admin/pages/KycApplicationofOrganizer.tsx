import { useState } from "react";
import { useMyApplications } from "../hooks/usemyapplications";
import { useApplicationActions } from "../hooks/useApplicationActions";
import { useApplicationFilters } from "../hooks/useApplicationFilters";
import {
  ApplicationCard,
  ApplicationFilters,
  ApplicationDetailsModal,
  RejectModal,
  AdminPageSkeleton,
  EmptyState,
  PageHeader,
} from "../components";
import type { RejectPayload } from "../components/RejectModal";
import type { OrganizerApplication } from "@/types";
import {
  extractApplicationsFromResponse,
  normalizeOrganizerApplication,
} from "@/lib/organizerApplication";
import { Button } from "@/components/ui/button";
import { FileSearch, AlertTriangle } from "lucide-react";

export default function KycApplicationofOrganizer() {
  const { data, isLoading, isError, error } = useMyApplications();
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
  const applications = extractApplicationsFromResponse(data).map(
    (application) => normalizeOrganizerApplication(application),
  ) as OrganizerApplication[];

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
      approveApplication({ id });
    }
  };

  const handleRejectClick = (id: string, name: string) => {
    setApplicationToReject({ id, name });
    setIsRejectModalOpen(true);
  };

  const handleRejectConfirm = ({ reason, adminNotes }: RejectPayload) => {
    if (applicationToReject) {
      rejectApplication({ id: applicationToReject.id, reason, adminNotes });
      setIsRejectModalOpen(false);
      setApplicationToReject(null);
    }
  };

  // Loading state
  if (isLoading)
    return <AdminPageSkeleton statCount={3} listCount={4} variant="list" />;

  // Error state
  if (isError) {
    return (
      <div className="surface-page min-h-screen flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-lg shadow-sm max-w-md w-full p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Error Loading Applications
          </h3>
          <p className="text-sm text-muted-foreground">
            {error?.message || "Unknown error"}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-page min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
        <PageHeader
          label="Admin · Verification"
          title="Organizer KYC Applications"
          description="Review and manage organizer verification applications."
        />

        <ApplicationFilters
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          onStatusChange={setStatusFilter}
          onSearchChange={setSearchQuery}
          stats={stats}
        />

        {filteredApplications.length === 0 ? (
          <EmptyState
            icon={FileSearch}
            title="No applications found"
            description={
              searchQuery
                ? "Try adjusting your search or filters"
                : "No applications match the selected criteria"
            }
          />
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
    </div>
  );
}
