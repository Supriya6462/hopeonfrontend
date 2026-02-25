import { useState, useEffect } from "react";

interface RejectModalProps {
  isOpen: boolean;
  organizationName: string;
  onConfirm: (reason: string) => void;
  onCancel: () => void;
}

export default function RejectModal({
  isOpen,
  organizationName,
  onConfirm,
  onCancel,
}: RejectModalProps) {
  const [reason, setReason] = useState("");

  // Reset reason when modal closes
  useEffect(() => {
    if (!isOpen) {
      setReason("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
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
          className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg mx-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-6 py-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Reject Application
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                You are about to reject the application from{" "}
                <span className="font-semibold">{organizationName}</span>. Please
                provide a reason:
              </p>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={4}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>

            <div className="bg-gray-50 px-6 py-4 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!reason.trim()}
                className="flex-1 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Reject Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
