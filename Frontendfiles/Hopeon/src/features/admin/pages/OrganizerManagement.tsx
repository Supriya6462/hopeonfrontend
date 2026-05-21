import { useState } from "react";
import { useallorganizers } from "../hooks/useallorganizers";
import { useOrganizerActions } from "../hooks/useOrganizerActions";
import { useOrganizerFilters } from "../hooks/useOrganizerFilters";
import {
  OrganizerCard,
  OrganizerFilters,
  OrganizerDetailsModal,
  RevokeModal,
  AdminPageSkeleton,
  EmptyState,
  PageHeader,
} from "../components";
import type { User } from "@/types";
import { Button } from "@/components/ui/button";
import { AlertTriangle, UserSearch } from "lucide-react";

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
        `Are you sure you want to reinstate organizer privileges for ${name}? This will restore their full access.`,
      )
    ) {
      reinstateOrganizer(id);
    }
  };

  // Loading state
  if (isLoading)
    return <AdminPageSkeleton statCount={4} listCount={4} variant="list" />;

  // Error state
  if (isError) {
    return (
      <div className="surface-page min-h-screen flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-lg shadow-sm max-w-md w-full p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            Error Loading Organizers
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
          label="Admin · Organizers"
          title="Organizer Management"
          description="Manage organizer accounts, access privileges, and compliance."
        />

        <OrganizerFilters
          statusFilter={statusFilter}
          searchQuery={searchQuery}
          onStatusChange={setStatusFilter}
          onSearchChange={setSearchQuery}
          stats={stats}
        />

        {filteredOrganizers.length === 0 ? (
          <EmptyState
            icon={UserSearch}
            title="No organizers found"
            description={
              searchQuery
                ? "Try adjusting your search or filters"
                : "No organizers match the selected criteria"
            }
          />
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
    </div>
  );
}
