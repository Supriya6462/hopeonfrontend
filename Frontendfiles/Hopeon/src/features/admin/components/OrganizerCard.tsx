import type { User } from "@/types";

interface OrganizerCardProps {
  organizer: User;
  onRevoke: (id: string, name: string) => void;
  onReinstate: (id: string, name: string) => void;
  onViewDetails: (organizer: User) => void;
}

export default function OrganizerCard({
  organizer,
  onRevoke,
  onReinstate,
  onViewDetails,
}: OrganizerCardProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = () => {
    if (organizer.isOrganizerRevoked) {
      return "bg-rose-50 border-rose-200 text-rose-700";
    }
    if (organizer.isOrganizerApproved) {
      return "bg-emerald-50 border-emerald-200 text-emerald-700";
    }
    return "bg-amber-50 border-amber-200 text-amber-700";
  };

  const getStatusText = () => {
    if (organizer.isOrganizerRevoked) return "REVOKED";
    if (organizer.isOrganizerApproved) return "ACTIVE";
    return "PENDING";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900">{organizer.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{organizer.email}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge()}`}
        >
          {getStatusText()}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Phone:</span>
          {organizer.phoneNumber || "Not provided"}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Role:</span>
          <span className="capitalize">{organizer.role}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium mr-2">Member since:</span>
          {formatDate(organizer.createdAt)}
        </div>
      </div>

      {/* Revocation Warning */}
      {organizer.isOrganizerRevoked && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-rose-600 mr-2 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-rose-900">
                Access Revoked
              </p>
              <p className="text-xs text-rose-700 mt-1">
                This organizer's privileges have been suspended
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <button
          onClick={() => onViewDetails(organizer)}
          className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors"
        >
          View Details
        </button>

        <div className="flex gap-2">
          {organizer.isOrganizerRevoked ? (
            <button
              onClick={() => onReinstate(organizer._id, organizer.name)}
              className="px-3 py-1.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors flex items-center gap-1"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              Reinstate
            </button>
          ) : (
            organizer.isOrganizerApproved && (
              <button
                onClick={() => onRevoke(organizer._id, organizer.name)}
                className="px-3 py-1.5 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded transition-colors flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                  />
                </svg>
                Revoke Access
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
