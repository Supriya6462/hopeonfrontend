import { ArrowLeft, BarChart3, HandCoins, Users } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/routes/routes";
import type { Donation } from "@/types";

import {
  useOrganizerCampaignById,
  useOrganizerCampaignDonationStats,
  useOrganizerCampaignDonations,
} from "../hooks";

function extractCampaign(data: unknown): Record<string, any> | null {
  const root = (data ?? {}) as Record<string, any>;
  const candidates = [root, root.data, root.result, root.data?.data];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      if (candidate._id || candidate.id || candidate.title) return candidate;
      if (candidate.campaign && typeof candidate.campaign === "object") {
        return candidate.campaign;
      }
    }
  }

  return null;
}

function extractStats(data: unknown): Record<string, any> {
  const root = (data ?? {}) as Record<string, any>;
  const candidates = [root, root.data, root.result, root.data?.data];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      if (
        "totalAmount" in candidate ||
        "totalDonations" in candidate ||
        "avgDonation" in candidate
      ) {
        return candidate;
      }
    }
  }

  return {};
}

function extractDonations(data: unknown): Donation[] {
  const root = (data ?? {}) as Record<string, any>;
  const candidates = [root, root.data, root.result, root.data?.data];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as Donation[];
    if (Array.isArray(candidate?.donations))
      return candidate.donations as Donation[];
    if (Array.isArray(candidate?.data?.donations)) {
      return candidate.data.donations as Donation[];
    }
  }

  return [];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function CampaignInsights() {
  const { id } = useParams();

  const campaignQuery = useOrganizerCampaignById(id);
  const statsQuery = useOrganizerCampaignDonationStats(id);
  const donationsQuery = useOrganizerCampaignDonations(id, {
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    const queries = [campaignQuery, statsQuery, donationsQuery];

    queries.forEach((query) => {
      if (query.isError) {
        const message =
          (query.error as any)?.response?.data?.message ||
          (query.error as any)?.message ||
          "Failed to load campaign insights";
        toast.error(message);
      }
    });
  }, [campaignQuery, statsQuery, donationsQuery]);

  const campaign = extractCampaign(campaignQuery.data);
  const stats = extractStats(statsQuery.data);
  const donations = extractDonations(donationsQuery.data);

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Campaign Insights
          </h1>
          <p className="text-gray-600 mt-1">{campaign?.title || "Campaign"}</p>
        </div>
        <Button asChild variant="outline">
          <Link to={ROUTES.ORGANIZER_CAMPAIGNS}>
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">
              Total Raised
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(Number(stats.totalAmount ?? 0))}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {Number(stats.totalDonations ?? 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">
              Average Donation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(Number(stats.avgDonation ?? 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Recent Donations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {donationsQuery.isLoading ? (
            <p className="text-sm text-gray-500">Loading donations...</p>
          ) : donations.length === 0 ? (
            <p className="text-sm text-gray-500">
              No donations yet for this campaign.
            </p>
          ) : (
            donations.map((donation) => (
              <div
                key={donation._id}
                className="rounded-lg border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {donation.donorEmail || "Donor"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(donation.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-gray-700 text-xs">
                    <Users className="h-3.5 w-3.5" />
                    {donation.status}
                  </div>
                  <div className="flex items-center gap-1 font-semibold text-emerald-700">
                    <HandCoins className="h-4 w-4" />
                    {formatCurrency(Number(donation.amount))}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
