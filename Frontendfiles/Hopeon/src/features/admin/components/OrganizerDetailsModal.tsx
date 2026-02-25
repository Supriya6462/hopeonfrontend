import type { User } from "@/types";

interface OrganizerDetailsModalProps {
  organizer: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrganizerDetailsModal({
  organizer,
  isOpen,
  onClose,
}: OrganizerDetailsModalProps) {
  if (!isOpen || !organizer) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

        {/* Modal panel */}
        <div 
          className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-3xl mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Organizer Details
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Basic Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Full Name
                    </label>
                    <p className="text-gray-900 mt-1">{organizer.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900 mt-1">{organizer.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone Number
                    </label>
                    <p className="text-gray-900 mt-1">
                      {organizer.phoneNumber || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Role
                    </label>
                    <p className="text-gray-900 mt-1 capitalize">
                      {organizer.role}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      User ID
                    </label>
                    <p className="text-gray-900 mt-1 font-mono text-sm">
                      {organizer._id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email Verified
                    </label>
                    <p className="text-gray-900 mt-1">
                      {organizer.isEmailVerified ? "✓ Yes" : "✗ No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Organizer Status
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Approval Status
                    </label>
                    <p className="text-gray-900 mt-1">
                      {organizer.isOrganizerApproved ? (
                        <span className="text-emerald-600 font-medium">
                          ✓ Approved
                        </span>
                      ) : (
                        <span className="text-amber-600 font-medium">
                          ⏳ Pending
                        </span>
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Access Status
                    </label>
                    <p className="text-gray-900 mt-1">
                      {organizer.isOrganizerRevoked ? (
                        <span className="text-rose-600 font-medium">
                          ✗ Revoked
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium">
                          ✓ Active
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Revocation Info */}
              {organizer.isOrganizerRevoked && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Revocation Information
                  </h4>
                  <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                    <div className="space-y-3">
                      {organizer.revokedAt && (
                        <div>
                          <label className="text-sm font-medium text-rose-900">
                            Revoked At
                          </label>
                          <p className="text-rose-700 mt-1">
                            {formatDate(organizer.revokedAt)}
                          </p>
                        </div>
                      )}
                      {organizer.revocationReason && (
                        <div>
                          <label className="text-sm font-medium text-rose-900">
                            Reason
                          </label>
                          <p className="text-rose-700 mt-1">
                            {organizer.revocationReason}
                          </p>
                        </div>
                      )}
                      {organizer.revokedBy && (
                        <div>
                          <label className="text-sm font-medium text-rose-900">
                            Revoked By (Admin ID)
                          </label>
                          <p className="text-rose-700 mt-1 font-mono text-sm">
                            {organizer.revokedBy}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Account Timeline
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Account Created:</span>
                    <span className="text-gray-900">
                      {formatDate(organizer.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="text-gray-900">
                      {formatDate(organizer.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
