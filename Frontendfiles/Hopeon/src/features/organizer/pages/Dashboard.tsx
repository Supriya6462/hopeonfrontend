import {
  FolderKanban,
  DollarSign,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
} from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/routes/routes";
import type { Campaign } from "@/types";
import { toast } from "sonner";

import { useOrganizerCampaigns, useOrganizerDonationStats } from "../hooks";

type OrganizerStats = {
  totalAmount?: number;
  avgDonation?: number;
  totalDonations?: number;
  totalDonors?: number;
};

function extractCampaignsFromResponse(data: unknown): Campaign[] {
  const root = (data ?? {}) as Record<string, any>;
  const candidates = [
    root,
    root.data,
    root.result,
    root.data?.data,
    root.data?.result,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as Campaign[];
    if (Array.isArray(candidate?.campaigns)) {
      return candidate.campaigns as Campaign[];
    }
    if (Array.isArray(candidate?.data?.campaigns)) {
      return candidate.data.campaigns as Campaign[];
    }
  }

  return [];
}

function extractDonationStats(data: unknown): OrganizerStats {
  const root = (data ?? {}) as Record<string, any>;
  const candidates = [root, root.data, root.result, root.data?.data];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      if (
        "totalAmount" in candidate ||
        "avgDonation" in candidate ||
        "totalDonations" in candidate
      ) {
        return candidate as OrganizerStats;
      }
    }
  }

  return {};
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

/**
 * OrganizerDashboard - Main dashboard for campaign organizers
 */
export default function OrganizerDashboard() {
  const campaignsQuery = useOrganizerCampaigns();
  const donationStatsQuery = useOrganizerDonationStats();

  useEffect(() => {
    if (campaignsQuery.isError) {
      const message =
        (campaignsQuery.error as any)?.response?.data?.message ||
        (campaignsQuery.error as any)?.message ||
        "Failed to load campaigns";
      toast.error(message);
    }
  }, [campaignsQuery.isError, campaignsQuery.error]);

  useEffect(() => {
    if (donationStatsQuery.isError) {
      const message =
        (donationStatsQuery.error as any)?.response?.data?.message ||
        (donationStatsQuery.error as any)?.message ||
        "Failed to load donation stats";
      toast.error(message);
    }
  }, [donationStatsQuery.isError, donationStatsQuery.error]);

  const getUserName = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.name || "Organizer";
      }
    } catch {
      return "Organizer";
    }
    return "Organizer";
  };

  const campaigns = extractCampaignsFromResponse(campaignsQuery.data);
  const donationStats = extractDonationStats(donationStatsQuery.data);
  const activeCampaignCount = campaigns.filter(
    (campaign) => !campaign.isClosed,
  ).length;
  const recentCampaigns = [...campaigns]
    .sort(
      (first, second) =>
        new Date(second.createdAt).getTime() -
        new Date(first.createdAt).getTime(),
    )
    .slice(0, 5);

  const totalRaised = Number(donationStats.totalAmount ?? 0);
  const totalDonors = Number(
    donationStats.totalDonors ?? donationStats.totalDonations ?? 0,
  );
  const avgDonation = Number(donationStats.avgDonation ?? 0);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome, {getUserName()}!
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your campaigns and track donations
          </p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700">
          <Link to={ROUTES.ORGANIZER_CREATE_CAMPAIGN}>
            <Plus className="mr-2 h-4 w-4" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Active Campaigns
            </CardTitle>
            <FolderKanban className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {campaignsQuery.isLoading ? "..." : activeCampaignCount}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Raised
            </CardTitle>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {donationStatsQuery.isLoading
                ? "..."
                : formatCurrency(totalRaised)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Donors
            </CardTitle>
            <Users className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {donationStatsQuery.isLoading ? "..." : totalDonors}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Avg. Donation
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {donationStatsQuery.isLoading
                ? "..."
                : formatCurrency(avgDonation)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Your Campaigns</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to={ROUTES.ORGANIZER_CAMPAIGNS}>
                Manage Campaigns
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {campaignsQuery.isLoading ? (
            <div className="py-8 text-sm text-gray-500">
              Loading campaigns...
            </div>
          ) : recentCampaigns.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FolderKanban className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No campaigns yet
              </h3>
              <p className="text-sm mb-4">
                Create your first campaign to start raising funds
              </p>
              <Button asChild variant="outline">
                <Link to={ROUTES.ORGANIZER_CREATE_CAMPAIGN}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div
                  key={campaign._id}
                  className="rounded-lg border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-gray-900">
                      {campaign.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      Created on{" "}
                      {new Date(campaign.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          campaign.isClosed ? "destructive" : "secondary"
                        }
                      >
                        {campaign.isClosed ? "Closed" : "Active"}
                      </Badge>
                      <span className="text-xs text-gray-600">
                        Raised {formatCurrency(getRaisedAmount(campaign))} /{" "}
                        {formatCurrency(campaign.target)}
                      </span>
                    </div>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    <Link to={ROUTES.ORGANIZER_CAMPAIGNS}>Open</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
