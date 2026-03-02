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

              {/* Uploaded Documents */}
              {application.documents && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">
                    Uploaded Documents
                  </h4>
                  <div className="space-y-4">
                    {/* Identity Documents */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h5 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Identity Verification
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {application.documents.governmentId && (
                          <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                              Government ID
                            </label>
                            <a
                              href={application.documents.governmentId.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Document
                            </a>
                            <img 
                              src={application.documents.governmentId.url} 
                              alt="Government ID" 
                              className="mt-2 w-full h-32 object-cover rounded border border-gray-200"
                              loading="lazy"
                            />
                          </div>
                        )}
                        {application.documents.selfieWithId && (
                          <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <label className="text-sm font-medium text-gray-700 block mb-2">
                              Selfie with ID
                            </label>
                            <a
                              href={application.documents.selfieWithId.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              View Document
                            </a>
                            <img 
                              src={application.documents.selfieWithId.url} 
                              alt="Selfie with ID" 
                              className="mt-2 w-full h-32 object-cover rounded border border-gray-200"
                              loading="lazy"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Organization Documents */}
                    {(application.documents.registrationCertificate || 
                      application.documents.taxId || 
                      application.documents.addressProof) && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h5 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Organization Documents
                        </h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {application.documents.registrationCertificate && (
                            <div className="bg-white rounded-lg p-3 border border-green-100">
                              <label className="text-sm font-medium text-gray-700 block mb-2">
                                Registration Certificate
                              </label>
                              <a
                                href={application.documents.registrationCertificate.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Document
                              </a>
                              <img 
                                src={application.documents.registrationCertificate.url} 
                                alt="Registration Certificate" 
                                className="mt-2 w-full h-32 object-cover rounded border border-gray-200"
                                loading="lazy"
                              />
                            </div>
                          )}
                          {application.documents.taxId && (
                            <div className="bg-white rounded-lg p-3 border border-green-100">
                              <label className="text-sm font-medium text-gray-700 block mb-2">
                                Tax ID / EIN
                              </label>
                              <a
                                href={application.documents.taxId.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Document
                              </a>
                              <img 
                                src={application.documents.taxId.url} 
                                alt="Tax ID" 
                                className="mt-2 w-full h-32 object-cover rounded border border-gray-200"
                                loading="lazy"
                              />
                            </div>
                          )}
                          {application.documents.addressProof && (
                            <div className="bg-white rounded-lg p-3 border border-green-100">
                              <label className="text-sm font-medium text-gray-700 block mb-2">
                                Address Proof
                              </label>
                              <a
                                href={application.documents.addressProof.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-green-600 hover:text-green-800 text-sm font-medium"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                View Document
                              </a>
                              <img 
                                src={application.documents.addressProof.url} 
                                alt="Address Proof" 
                                className="mt-2 w-full h-32 object-cover rounded border border-gray-200"
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Additional Documents */}
                    {application.documents.additionalDocuments && 
                     application.documents.additionalDocuments.length > 0 && (
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h5 className="font-semibold text-purple-900 mb-3 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          Additional Documents
                        </h5>
                        <div className="space-y-2">
                          {application.documents.additionalDocuments.map((doc, index) => (
                            <div key={index} className="bg-white rounded-lg p-3 border border-purple-100">
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 text-sm font-medium"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {doc.name}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

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
