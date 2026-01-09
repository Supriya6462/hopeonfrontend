import { useState } from "react";

interface RevokeModalProps {
  isOpen: boolean;
  organizerName: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function RevokeModal({
  isOpen,
  organizerName,
  onConfirm,
  onCancel,
}: RevokeModalProps) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (reason.trim()) {
      onConfirm(reason);
      setReason("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onCancel}
        />

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-6 py-4">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-rose-100">
                <svg
                  className="h-6 w-6 text-rose-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-bold text-gray-900">
                Revoke Organizer Access
              </h3>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                You are about to revoke organizer privileges for{" "}
                <span className="font-semibold text-gray-900">
                  {organizerName}
                </span>
                .
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-amber-800">
                  <strong>Warning:</strong> This will:
                </p>
                <ul className="text-sm text-amber-700 mt-2 ml-4 list-disc space-y-1">
                  <li>Suspend their ability to create campaigns</li>
                  <li>Prevent withdrawals from existing campaigns</li>
                  <li>Maintain all historical data for audit purposes</li>
                  <li>Can be reversed with reinstatement</li>
                </ul>
              </div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for revocation (required):
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Fraudulent activity detected, Terms of service violation, Suspicious campaign behavior..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                This reason will be logged for compliance and audit purposes.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!reason.trim()}
              className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Revoke Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
