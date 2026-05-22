import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminCampaignAPI } from "@/features/api";
import { adminQueryKeys, getAdminCampaignList } from "@/features/admin/api";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FolderKanban,
  Search,
  Trash2,
  CheckCircle,
  CircleOff,
} from "lucide-react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export default function AdminCampaigns() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const params = useMemo(() => ({ page, limit: 10, search }), [page, search]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: adminQueryKeys.campaigns(params),
    queryFn: () => getAdminCampaignList(params),
  });

  const approveMutation = useMutation({
    mutationFn: (campaignId: string) =>
      adminCampaignAPI.approveCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "campaigns"] });
      toast.success("Campaign approved");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to approve campaign"));
    },
  });

  const closeMutation = useMutation({
    mutationFn: ({
      campaignId,
      reason,
    }: {
      campaignId: string;
      reason?: string;
    }) => adminCampaignAPI.closeCampaign(campaignId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "campaigns"] });
      toast.success("Campaign closed");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to close campaign"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (campaignId: string) =>
      adminCampaignAPI.deleteCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "campaigns"] });
      toast.success("Campaign deleted");
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete campaign"));
    },
  });

  const items = data?.items ?? [];
  const totalPages = Math.max(data?.totalPages ?? 1, 1);

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const onCloseCampaign = (campaignId: string) => {
    const reason = window.prompt("Optional close reason:");
    closeMutation.mutate({ campaignId, reason: reason?.trim() || undefined });
  };

  const onDeleteCampaign = (campaignId: string, title: string) => {
    const accepted = window.confirm(
      `Delete campaign \"${title}\" permanently?`,
    );
    if (!accepted) return;
    deleteMutation.mutate(campaignId);
  };

  if (isLoading)
    return <AdminPageSkeleton statCount={0} listCount={5} variant="list" />;

  return (
    <div className="surface-page min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
        <PageHeader
          label="Admin · Campaigns"
          title="Campaign Moderation"
          description="Review, approve, close, or delete campaigns with normalized API data."
          action={
            <RefreshButton
              disabled={isFetching}
              onClick={() =>
                queryClient.invalidateQueries({
                  queryKey: ["admin", "campaigns"],
                })
              }
            />
          }
        />

        <FilterCard>
          <form
            className="grid md:grid-cols-[1fr_auto] gap-3"
            onSubmit={onSearch}
          >
            <div>
              <Label
                htmlFor="search-campaigns"
                className="text-xs font-medium text-muted-foreground"
              >
                Search campaigns
              </Label>
              <div className="relative mt-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search-campaigns"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 h-9"
                  placeholder="Search by title"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button type="submit" size="sm">
                Apply
              </Button>
            </div>
          </form>
        </FilterCard>

        <div className="space-y-2">
          {items.length === 0 ? (
            <EmptyState
              icon={FolderKanban}
              title="No campaigns found"
              description={
                search
                  ? "Try a different search term."
                  : "No campaigns are currently available."
              }
            />
          ) : (
            items.map((campaign) => {
              const raised = Number(campaign.raised ?? 0);
              const target = Number(campaign.target ?? 0);
              return (
                <Card key={campaign._id} className="surface-card shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-foreground truncate">
                            {campaign.title}
                          </p>
                          <StatusBadge status={campaign.status} />
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {campaign.description || "No description"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Owner: {campaign.ownerName} ({campaign.ownerEmail})
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {currency.format(raised)} raised of{" "}
                          {currency.format(target)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 flex-wrap">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => approveMutation.mutate(campaign._id)}
                          disabled={approveMutation.isPending}
                        >
                          <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onCloseCampaign(campaign._id)}
                          disabled={closeMutation.isPending}
                        >
                          <CircleOff className="h-3.5 w-3.5 mr-1.5" />
                          Close
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            onDeleteCampaign(campaign._id, campaign.title)
                          }
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
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
