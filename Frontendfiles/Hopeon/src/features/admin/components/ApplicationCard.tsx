import type { OrganizerApplication } from "@/types";
import type { ApplicationStatus } from "@/enums";
import { getApplicationStatus } from "@/lib/organizerApplication";

interface ApplicationCardProps {
  application: OrganizerApplication;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (application: OrganizerApplication) => void;
}

export default function ApplicationCard({
  application,
  onApprove,
  onReject,
  onViewDetails,
}: ApplicationCardProps) {
  const normalizedStatus = getApplicationStatus(application);

  const getStatusBadge = (status: ApplicationStatus) => {
    const styles = {
      pending: "bg-amber-50 border-amber-200 text-amber-700",
      approved: "bg-emerald-50 border-emerald-200 text-emerald-700",
      rejected: "bg-rose-50 border-rose-200 text-rose-700",
    };
    return styles[status] || styles.pending;
  };

  const getOrgTypeLabel = (type?: string) => {
    const labels: Record<string, string> = {
      nonprofit: "Non-Profit",
      charity: "Charity",
      individual: "Individual",
      business: "Business",
      other: "Other",
    };
    return type ? labels[type] || type : "Not specified";
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">
            {application.organizationName}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {getOrgTypeLabel(application.organizationType)}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
            normalizedStatus,
          )}`}
        >
          {normalizedStatus.toUpperCase()}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {application.description}
      </p>

      <div className="space-y-2 mb-4">
        {application.contactEmail && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Email:</span>
            {application.contactEmail}
          </div>
        )}
        {application.phoneNumber && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Phone:</span>
            {application.phoneNumber}
          </div>
        )}
        {application.website && (
          <div className="flex items-center text-sm text-gray-600">
            <span className="font-medium mr-2">Website:</span>
            <a
              href={application.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {application.website}
            </a>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          <div>Submitted: {formatDate(application.createdAt)}</div>
          {application.documentsVerified && (
            <div className="text-green-600 mt-1">✓ Documents Verified</div>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onViewDetails(application)}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
          >
            View Details
          </button>
          {normalizedStatus === "pending" && (
            <>
              <button
                onClick={() => onApprove(application._id)}
                className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors"
              >
                Approve
              </button>
              <button
                onClick={() => onReject(application._id)}
                className="px-3 py-1.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors"
              >
                Reject
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
