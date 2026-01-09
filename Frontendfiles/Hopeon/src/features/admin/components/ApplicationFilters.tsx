import type { ApplicationStatus } from "@/enums";

interface ApplicationFiltersProps {
  statusFilter: ApplicationStatus | "all";
  searchQuery: string;
  onStatusChange: (status: ApplicationStatus | "all") => void;
  onSearchChange: (query: string) => void;
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
}

export default function ApplicationFilters({
  statusFilter,
  searchQuery,
  onStatusChange,
  onSearchChange,
  stats,
}: ApplicationFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            statusFilter === "all"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onStatusChange("all")}
        >
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </div>

        <div
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            statusFilter === "pending"
              ? "border-amber-500 bg-amber-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onStatusChange("pending")}
        >
          <div className="text-2xl font-bold text-amber-700">
            {stats.pending}
          </div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </div>

        <div
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            statusFilter === "approved"
              ? "border-emerald-500 bg-emerald-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onStatusChange("approved")}
        >
          <div className="text-2xl font-bold text-emerald-700">
            {stats.approved}
          </div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>

        <div
          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
            statusFilter === "rejected"
              ? "border-rose-500 bg-rose-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => onStatusChange("rejected")}
        >
          <div className="text-2xl font-bold text-rose-700">
            {stats.rejected}
          </div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by organization name, email, or phone..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
}
