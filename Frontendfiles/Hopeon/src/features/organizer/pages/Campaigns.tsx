import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Edit,
  FolderKanban,
  LineChart,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROUTES } from "@/routes/routes";
import type { Campaign, CampaignFilters } from "@/types";

import { useOrganizerCampaignActions, useOrganizerCampaigns } from "../hooks";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

function extractCampaignListFromResponse(
  data: unknown,
  fallback: { page: number; limit: number },
): { campaigns: Campaign[]; pagination: PaginationMeta } {
  const root = (data ?? {}) as Record<string, any>;
  const candidates = [
    root,
    root.data,
    root.result,
    root.data?.data,
    root.data?.result,
  ];

  let campaigns: Campaign[] = [];
  let pagination: PaginationMeta = {
    page: fallback.page,
    limit: fallback.limit,
    total: 0,
    pages: 1,
  };

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      campaigns = candidate as Campaign[];
      break;
    }
    if (Array.isArray(candidate?.campaigns)) {
      campaigns = candidate.campaigns as Campaign[];
      break;
    }
    if (Array.isArray(candidate?.data?.campaigns)) {
      campaigns = candidate.data.campaigns as Campaign[];
      break;
    }
  }

  for (const candidate of candidates) {
    const meta = candidate?.pagination;
    if (meta && typeof meta === "object") {
      pagination = {
        page: Number(meta.page) || fallback.page,
        limit: Number(meta.limit) || fallback.limit,
        total: Number(meta.total) || campaigns.length,
        pages: Number(meta.pages) || 1,
      };
      break;
    }
  }

  if (pagination.total === 0 && campaigns.length > 0) {
    pagination = {
      ...pagination,
      total: campaigns.length,
      pages: Math.max(1, Math.ceil(campaigns.length / pagination.limit)),
    };
  }

  return { campaigns, pagination };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);

const getRaisedAmount = (campaign: Campaign) => {
  const source = campaign as Campaign & {
    raised?: number;
    totalRaised?: number;
    currentAmount?: number;
  };

  return source.raised ?? source.totalRaised ?? source.currentAmount ?? 0;
};

export default function OrganizerCampaigns() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "closed">(
    "all",
  );
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [closeDialogCampaign, setCloseDialogCampaign] =
    useState<Campaign | null>(null);
  const [deleteDialogCampaign, setDeleteDialogCampaign] =
    useState<Campaign | null>(null);
  const [closedReason, setClosedReason] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const queryFilters = useMemo<CampaignFilters>(
    () => ({
      search: searchTerm || undefined,
      isClosed: statusFilter === "all" ? undefined : statusFilter === "closed",
      page,
      limit,
    }),
    [searchTerm, statusFilter, page, limit],
  );

  const campaignsQuery = useOrganizerCampaigns(queryFilters);
  const { closeCampaignAsync, deleteCampaignAsync, isClosing, isDeleting } =
    useOrganizerCampaignActions();

  useEffect(() => {
    if (campaignsQuery.isError) {
      const message =
        (campaignsQuery.error as any)?.response?.data?.message ||
        (campaignsQuery.error as any)?.message ||
        "Failed to load campaigns";
      toast.error(message);
    }
  }, [campaignsQuery.isError, campaignsQuery.error]);

  const campaignList = useMemo(
    () => extractCampaignListFromResponse(campaignsQuery.data, { page, limit }),
    [campaignsQuery.data, page, limit],
  );

  const campaigns = campaignList.campaigns;
  const pagination = campaignList.pagination;

  const activeCampaigns = useMemo(
    () => campaigns.filter((campaign) => !campaign.isClosed),
    [campaigns],
  );

  const closedCampaigns = useMemo(
    () => campaigns.filter((campaign) => campaign.isClosed),
    [campaigns],
  );

  const onCloseCampaign = async (campaign: Campaign) => {
    setCloseDialogCampaign(campaign);
    setClosedReason("");
  };

  const confirmCloseCampaign = async () => {
    if (!closeDialogCampaign) return;

    try {
      await closeCampaignAsync({
        id: closeDialogCampaign._id,
        closedReason: closedReason.trim() || undefined,
      });
      setCloseDialogCampaign(null);
      setClosedReason("");
    } catch {
      // Error toast is handled by mutation hook.
    }
  };

  const onDeleteCampaign = async (campaign: Campaign) => {
    setDeleteDialogCampaign(campaign);
  };

  const confirmDeleteCampaign = async () => {
    if (!deleteDialogCampaign) return;

    try {
      await deleteCampaignAsync(deleteDialogCampaign._id);
      setDeleteDialogCampaign(null);
    } catch {
      // Error toast is handled by mutation hook.
    }
  };

  const renderCampaignCard = (campaign: Campaign) => {
    const raisedAmount = getRaisedAmount(campaign);
    const progress =
      campaign.target > 0
        ? Math.min((raisedAmount / campaign.target) * 100, 100)
        : 0;

    return (
      <Card key={campaign._id}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">{campaign.title}</CardTitle>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {campaign.description || "No description provided"}
              </p>
            </div>
            <Badge variant={campaign.isClosed ? "destructive" : "secondary"}>
              {campaign.isClosed ? "Closed" : "Active"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-1 flex items-center justify-between text-sm text-gray-600">
              <span>Raised</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-gray-700">
              {formatCurrency(raisedAmount)} / {formatCurrency(campaign.target)}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Calendar className="h-4 w-4" />
            Created on {new Date(campaign.createdAt).toLocaleDateString()}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <Button asChild variant="outline" size="sm">
              <Link
                to={ROUTES.ORGANIZER_EDIT_CAMPAIGN.replace(":id", campaign._id)}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            </Button>

            <Button asChild variant="outline" size="sm">
              <Link
                to={ROUTES.ORGANIZER_CAMPAIGN_INSIGHTS.replace(
                  ":id",
                  campaign._id,
                )}
              >
                <LineChart className="h-4 w-4" />
                Insights
              </Link>
            </Button>

            {!campaign.isClosed ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => void onCloseCampaign(campaign)}
                disabled={isClosing || isDeleting}
              >
                <XCircle className="h-4 w-4" />
                Close
              </Button>
            ) : (
              <Button variant="outline" size="sm" disabled>
                <CheckCircle2 className="h-4 w-4" />
                Closed
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => void onDeleteCampaign(campaign)}
              disabled={isClosing || isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Campaigns</h1>
          <p className="mt-2 text-gray-600">
            Manage, update, and monitor your fundraising campaigns.
          </p>
        </div>
        <Button asChild>
          <Link to={ROUTES.ORGANIZER_CREATE_CAMPAIGN}>
            <Plus className="h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Total Campaigns</p>
            <p className="text-2xl font-bold text-gray-900">
              {pagination.total}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-emerald-600">
              {activeCampaigns.length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500">Closed</p>
            <p className="text-2xl font-bold text-red-600">
              {closedCampaigns.length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by title"
              className="pl-10"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={(value: "all" | "active" | "closed") => {
              setStatusFilter(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <div className="sm:col-span-3 flex items-center gap-2 text-sm text-gray-600">
            <span>Rows per page</span>
            <Select
              value={String(limit)}
              onValueChange={(value) => {
                setLimit(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6</SelectItem>
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="24">24</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {campaignsQuery.isLoading ? (
        <Card>
          <CardContent className="py-10 text-center text-gray-500">
            Loading campaigns...
          </CardContent>
        </Card>
      ) : campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderKanban className="mx-auto mb-4 h-14 w-14 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900">
              No campaigns yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Start your first campaign and begin collecting donations.
            </p>
            <Button asChild className="mt-4">
              <Link to={ROUTES.ORGANIZER_CREATE_CAMPAIGN}>Create Campaign</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {campaigns.map(renderCampaignCard)}
          </div>

          <Card>
            <CardContent className="py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-sm text-gray-600">
                Showing {campaigns.length} of {pagination.total} campaigns
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((previous) => Math.max(1, previous - 1))
                  }
                  disabled={page <= 1 || campaignsQuery.isFetching}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {Math.max(1, pagination.pages)}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPage((previous) =>
                      Math.min(Math.max(1, pagination.pages), previous + 1),
                    )
                  }
                  disabled={
                    page >= Math.max(1, pagination.pages) ||
                    campaignsQuery.isFetching
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      <Dialog
        open={!!closeDialogCampaign}
        onOpenChange={(open) => {
          if (!open) {
            setCloseDialogCampaign(null);
            setClosedReason("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Campaign</DialogTitle>
            <DialogDescription>
              This will stop receiving donations for this campaign.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              {closeDialogCampaign?.title}
            </p>
            <Input
              value={closedReason}
              onChange={(event) => setClosedReason(event.target.value)}
              placeholder="Optional close reason"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCloseDialogCampaign(null);
                setClosedReason("");
              }}
              disabled={isClosing}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void confirmCloseCampaign()}
              disabled={isClosing}
            >
              {isClosing ? "Closing..." : "Close Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteDialogCampaign}
        onOpenChange={(open) => {
          if (!open) setDeleteDialogCampaign(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Campaign</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>

          <p className="text-sm text-gray-700">
            Delete campaign &quot;{deleteDialogCampaign?.title}&quot;?
          </p>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogCampaign(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void confirmDeleteCampaign()}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
