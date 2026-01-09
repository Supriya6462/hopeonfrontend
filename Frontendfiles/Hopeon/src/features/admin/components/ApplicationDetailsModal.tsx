import type { OrganizerApplication } from "@/types";

interface ApplicationDetailsModalProps {
  application: OrganizerApplication | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ApplicationDetailsModal({
  application,
  isOpen,
  onClose,
}: ApplicationDetailsModalProps) {
  if (!isOpen || !application) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">
                Application Details
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
              {/* Organization Info */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Organization Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Organization Name
                    </label>
                    <p className="text-gray-900 mt-1">
                      {application.organizationName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Type
                    </label>
                    <p className="text-gray-900 mt-1">
                      {application.organizationType || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Contact Email
                    </label>
                    <p className="text-gray-900 mt-1">
                      {application.contactEmail || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone Number
                    </label>
                    <p className="text-gray-900 mt-1">
                      {application.phoneNumber || "Not provided"}
                    </p>
                  </div>
                  {application.website && (
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">
                        Website
                      </label>
                      <p className="text-gray-900 mt-1">
                        <a
                          href={application.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {application.website}
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Description
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {application.description}
                </p>
              </div>

              {/* Status & Documents */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Status & Verification
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Application Status
                    </label>
                    <p className="text-gray-900 mt-1 capitalize">
                      {application.status}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Documents Verified
                    </label>
                    <p className="text-gray-900 mt-1">
                      {application.documentsVerified ? "✓ Yes" : "✗ No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Review Info */}
              {(application.reviewedAt || application.rejectionReason) && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Review Information
                  </h4>
                  <div className="space-y-3">
                    {application.reviewedAt && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Reviewed At
                        </label>
                        <p className="text-gray-900 mt-1">
                          {formatDate(application.reviewedAt)}
                        </p>
                      </div>
                    )}
                    {application.rejectionReason && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Rejection Reason
                        </label>
                        <p className="text-gray-900 mt-1">
                          {application.rejectionReason}
                        </p>
                      </div>
                    )}
                    {application.adminNotes && (
                      <div>
                        <label className="text-sm font-medium text-gray-500">
                          Admin Notes
                        </label>
                        <p className="text-gray-900 mt-1">
                          {application.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  Timeline
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Submitted:</span>
                    <span className="text-gray-900">
                      {formatDate(application.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="text-gray-900">
                      {formatDate(application.updatedAt)}
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
