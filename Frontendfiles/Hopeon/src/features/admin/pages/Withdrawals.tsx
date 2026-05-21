import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminWithdrawalAPI } from "@/features/api";
import { adminQueryKeys, getAdminWithdrawalList } from "@/features/admin/api";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowDownCircle, CheckCircle, XCircle, Wallet } from "lucide-react";
import { toast } from "sonner";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function AdminWithdrawals() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("all");

  const params = useMemo(
    () => ({ page, limit: 10, status: status === "all" ? undefined : status }),
    [page, status],
  );

  const { data, isLoading, isFetching } = useQuery({
    queryKey: adminQueryKeys.withdrawals(params),
    queryFn: () => getAdminWithdrawalList(params),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "withdrawals"] });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminWithdrawalAPI.approveWithdrawal(id),
    onSuccess: () => {
      invalidate();
      toast.success("Withdrawal approved");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to approve withdrawal",
      );
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, message }: { id: string; message: string }) =>
      adminWithdrawalAPI.rejectWithdrawal(id, message),
    onSuccess: () => {
      invalidate();
      toast.success("Withdrawal rejected");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to reject withdrawal",
      );
    },
  });

  const markPaidMutation = useMutation({
    mutationFn: ({ id, reference }: { id: string; reference?: string }) =>
      adminWithdrawalAPI.markWithdrawalAsPaid(id, reference),
    onSuccess: () => {
      invalidate();
      toast.success("Withdrawal marked as paid");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to mark paid",
      );
    },
  });

  const items = data?.items ?? [];
  const totalPages = Math.max(data?.totalPages ?? 1, 1);

  const onReject = (id: string) => {
    const reason = window.prompt("Rejection reason:");
    if (!reason?.trim()) return;
    rejectMutation.mutate({ id, message: reason.trim() });
  };

  const onMarkPaid = (id: string) => {
    const reference = window.prompt("Payment reference (optional):");
    markPaidMutation.mutate({ id, reference: reference?.trim() || undefined });
  };

  if (isLoading)
    return <AdminPageSkeleton statCount={0} listCount={5} variant="list" />;

  return (
    <div className="surface-page min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
        <PageHeader
          label="Admin · Withdrawals"
          title="Withdrawal Requests"
          description="Review and process payout requests from organizers."
          action={<RefreshButton disabled={isFetching} onClick={invalidate} />}
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
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FilterCard>

        <div className="space-y-2">
          {items.length === 0 ? (
            <EmptyState
              icon={ArrowDownCircle}
              title="No withdrawal requests"
              description={
                status === "all"
                  ? "There are no requests yet."
                  : "No requests for the selected status."
              }
            />
          ) : (
            items.map((withdrawal) => (
              <Card key={withdrawal._id} className="surface-card shadow-sm">
                <CardContent className="p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="space-y-1 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground truncate">
                          {withdrawal.campaignTitle}
                        </p>
                        <StatusBadge status={withdrawal.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {withdrawal.organizerName} ({withdrawal.organizerEmail})
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Method: {withdrawal.payoutMethod}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <p className="text-lg font-bold text-primary mr-1">
                        {currency.format(withdrawal.amountRequested)}
                      </p>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => approveMutation.mutate(withdrawal._id)}
                        disabled={approveMutation.isPending}
                      >
                        <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                        Approve
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onMarkPaid(withdrawal._id)}
                        disabled={markPaidMutation.isPending}
                      >
                        <Wallet className="h-3.5 w-3.5 mr-1.5" />
                        Mark Paid
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onReject(withdrawal._id)}
                        disabled={rejectMutation.isPending}
                      >
                        <XCircle className="h-3.5 w-3.5 mr-1.5" />
                        Reject
                      </Button>
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
