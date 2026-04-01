import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Target, TrendingUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { publicCampaignAPI } from "@/features/api";
import { ROUTES } from "@/routes/routes";

type CampaignDetailsRecord = {
  _id: string;
  title: string;
  description?: string;
  target?: number;
  raised?: number;
  totalRaised?: number;
  currentAmount?: number;
  images?: string[];
  imageURL?: string;
};

function extractCampaign(data: unknown): CampaignDetailsRecord | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const root = data as Record<string, any>;
  const candidates = [
    root,
    root.data,
    root.result,
    root.campaign,
    root.data?.campaign,
    root.data?.data,
  ];

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object" && "_id" in candidate) {
      return candidate as CampaignDetailsRecord;
    }
  }

  return null;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);

export default function CampaignDetails() {
  const { id } = useParams<{ id: string }>();

  const campaignQuery = useQuery({
    queryKey: ["publicCampaign", id],
    queryFn: () => publicCampaignAPI.getCampaignById(id!),
    enabled: Boolean(id),
  });

  const campaign = useMemo(
    () => extractCampaign(campaignQuery.data),
    [campaignQuery.data],
  );

  if (campaignQuery.isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-72 w-full rounded-3xl" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (campaignQuery.isError || !campaign) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
        <Alert variant="destructive">
          <AlertTitle>Campaign unavailable</AlertTitle>
          <AlertDescription>
            {(campaignQuery.error as any)?.response?.data?.message ||
              (campaignQuery.error as any)?.message ||
              "This campaign could not be loaded right now."}
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline" className="mt-4">
          <Link to={ROUTES.CAMPAIGNS}>
            <ArrowLeft className="h-4 w-4" />
            Back to Campaigns
          </Link>
        </Button>
      </div>
    );
  }

  const raised = Number(
    campaign.raised ?? campaign.totalRaised ?? campaign.currentAmount ?? 0,
  );
  const target = Number(campaign.target ?? 0);
  const progress = target > 0 ? Math.min((raised / target) * 100, 100) : 0;
  const image = campaign.images?.[0] || campaign.imageURL || "/placeholder.svg";

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
      <Button asChild variant="outline">
        <Link to={ROUTES.CAMPAIGNS}>
          <ArrowLeft className="h-4 w-4" />
          Back to Campaigns
        </Link>
      </Button>

      <Card className="overflow-hidden rounded-3xl border-blue-100">
        <img
          src={image}
          alt={campaign.title}
          className="h-80 w-full object-cover"
        />
        <CardContent className="space-y-5 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-blue-600 text-white">Campaign</Badge>
            <Badge variant="secondary">{Math.round(progress)}% funded</Badge>
          </div>

          <h1 className="text-3xl font-bold text-gray-900">{campaign.title}</h1>

          <p className="text-gray-600">
            {campaign.description ||
              "No detailed description is available for this campaign yet."}
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="inline-flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                Raised {formatCurrency(raised)}
              </span>
              <span className="inline-flex items-center gap-1">
                <Target className="h-4 w-4" />
                Goal {formatCurrency(target)}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <Button className="w-full sm:w-auto">
            <Heart className="h-4 w-4" />
            Donate (Coming Soon)
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
