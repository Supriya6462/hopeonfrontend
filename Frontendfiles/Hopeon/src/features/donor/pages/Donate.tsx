import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Heart, Search, RefreshCw, CircleAlert } from "lucide-react";

import CampaignCard from "@/components/CampaignCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { publicCampaignAPI } from "@/features/api";

type PublicCampaign = {
  _id: string;
  title: string;
  target: number;
  images?: string[];
  imageURL?: string;
  raised?: number;
  totalRaised?: number;
  currentAmount?: number;
  isClosed?: boolean;
  isApproved?: boolean;
};

function extractCampaigns(data: unknown): PublicCampaign[] {
  const root = (data ?? {}) as Record<string, any>;
  const candidates = [
    root,
    root.data,
    root.result,
    root.data?.data,
    root.data?.result,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as PublicCampaign[];
    }

    if (Array.isArray(candidate?.campaigns)) {
      return candidate.campaigns as PublicCampaign[];
    }

    if (Array.isArray(candidate?.data?.campaigns)) {
      return candidate.data.campaigns as PublicCampaign[];
    }
  }

  return [];
}

const getRaisedAmount = (campaign: PublicCampaign) =>
  campaign.raised ?? campaign.totalRaised ?? campaign.currentAmount ?? 0;

export default function Donate() {
  const [searchInput, setSearchInput] = useState("");

  const campaignsQuery = useQuery({
    queryKey: ["publicCampaigns", "browse"],
    queryFn: () =>
      publicCampaignAPI.getAllCampaigns({
        isClosed: false,
        limit: 100,
      }),
  });

  const campaigns = useMemo(
    () => extractCampaigns(campaignsQuery.data),
    [campaignsQuery.data],
  );

  const normalizedSearch = searchInput.trim().toLowerCase();
  const filteredCampaigns = useMemo(
    () =>
      campaigns.filter((campaign) => {
        if (!campaign.title) return false;
        if (!normalizedSearch) return true;
        return campaign.title.toLowerCase().includes(normalizedSearch);
      }),
    [campaigns, normalizedSearch],
  );

  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-emerald-50 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge className="bg-blue-600 text-white hover:bg-blue-700">
              Donate
            </Badge>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Discover Verified Campaigns
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-600 sm:text-base">
              Support trusted organizers and track impact with transparent
              campaign updates.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => void campaignsQuery.refetch()}
            disabled={campaignsQuery.isFetching}
            className="shrink-0"
          >
            <RefreshCw
              className={`h-4 w-4 ${campaignsQuery.isFetching ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </section>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          placeholder="Search campaigns by title"
          className="pl-9"
        />
      </div>

      {campaignsQuery.isLoading ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-2xl border bg-white p-4">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="mt-4 h-6 w-3/4" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-2 h-3 w-2/3" />
              <Skeleton className="mt-5 h-11 w-full" />
            </div>
          ))}
        </div>
      ) : campaignsQuery.isError ? (
        <Alert variant="destructive" className="max-w-2xl">
          <CircleAlert className="h-4 w-4" />
          <AlertTitle>Could not load campaigns</AlertTitle>
          <AlertDescription>
            {(campaignsQuery.error as any)?.response?.data?.message ||
              (campaignsQuery.error as any)?.message ||
              "Something went wrong while loading campaigns. Please try again."}
          </AlertDescription>
        </Alert>
      ) : filteredCampaigns.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
          <Heart className="mx-auto h-10 w-10 text-gray-400" />
          <h2 className="mt-3 text-lg font-semibold text-gray-900">
            No campaigns matched your search
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Try a different keyword or clear your search to see all campaigns.
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={() => setSearchInput("")}
          >
            Clear Search
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign._id}
              id={campaign._id}
              title={campaign.title}
              imageSrc={
                campaign.images?.[0] || campaign.imageURL || "/placeholder.svg"
              }
              target={Number(campaign.target) || 0}
              raised={Number(getRaisedAmount(campaign)) || 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
