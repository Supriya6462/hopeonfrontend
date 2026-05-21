import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminQueryKeys, getAdminDonationList } from "@/features/admin/api";
import {
  AdminPageSkeleton,
  EmptyState,
  FilterCard,
  PageHeader,
  Pagination,
  RefreshButton,
  StatusBadge,
} from "@/features/admin/components";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HandCoins } from "lucide-react";

export default function AdminDonations() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");

  const params = useMemo(
    () => ({ page, limit: 10, status: status === "all" ? undefined : status }),
    [page, status],
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: adminQueryKeys.donations(params),
    queryFn: () => getAdminDonationList(params),
  });

  const items = data?.items ?? [];
  const totalPages = Math.max(data?.totalPages ?? 1, 1);

  if (isLoading)
    return <AdminPageSkeleton statCount={3} listCount={5} variant="list" />;

  return (
    <div className="surface-page min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
        <PageHeader
          label="Admin · Donations"
          title="Donation Tracking"
          description="Monitor donation transactions across campaigns."
          action={
            <RefreshButton
              disabled={isFetching}
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["admin", "donations"],
                })
              }
            />
          }
        />

        <FilterCard>
          <div className="w-full max-w-xs space-y-1.5">
            <Label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Status
            </Label>
            <Select
              value={status}
              onValueChange={(value) => {
                setPage(1);
                setStatus(value);
              }}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FilterCard>

        <div className="space-y-2">
          {items.length === 0 ? (
            <EmptyState
              icon={HandCoins}
              title="No donations found"
              description="No donation records match this filter."
            />
          ) : (
            items.map((donation) => (
              <Card key={donation._id} className="surface-card shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="space-y-1 min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {donation.campaignTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {donation.donorName} ({donation.donorEmail})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Method: {donation.method} · TXN:{" "}
                        {donation.transactionId || "N/A"}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <p className="text-lg font-bold text-primary">
                        ${Number(donation.amount).toFixed(2)}
                      </p>
                      <StatusBadge status={donation.status} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          isFetching={isFetching}
          onPrev={() => setPage((prev) => Math.max(prev - 1, 1))}
          onNext={() => setPage((prev) => prev + 1)}
        />
      </div>
    </div>
  );
}
