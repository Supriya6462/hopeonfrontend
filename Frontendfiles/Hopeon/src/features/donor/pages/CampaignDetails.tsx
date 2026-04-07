import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Heart, Target, TrendingUp } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { donorDonationAPI, publicCampaignAPI } from "@/features/api";
import { ROUTES } from "@/routes/routes";
import type { DonationMethod } from "@/enums";

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
  const queryClient = useQueryClient();
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [amount, setAmount] = useState("50");
  const [method, setMethod] = useState<DonationMethod>("paypal");
  const [donorEmail, setDonorEmail] = useState(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.email || "";
    } catch {
      return "";
    }
  });

  const campaignQuery = useQuery({
    queryKey: ["publicCampaign", id],
    queryFn: () => publicCampaignAPI.getCampaignById(id!),
    enabled: Boolean(id),
  });

  const donationMutation = useMutation({
    mutationFn: (payload: {
      campaign: string;
      amount: number;
      donorEmail: string;
      method: DonationMethod;
    }) => donorDonationAPI.createDonation(payload),
    onSuccess: () => {
      toast.success("Donation submitted successfully.");
      setIsDonateOpen(false);
      setAmount("50");
      queryClient.invalidateQueries({ queryKey: ["publicCampaign", id] });
      queryClient.invalidateQueries({ queryKey: ["publicCampaigns"] });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Donation failed. Please try again.";
      toast.error(message);
    },
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

  const handleDonate = () => {
    if (!id) {
      toast.error("Campaign is not available right now.");
      return;
    }

    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid donation amount.");
      return;
    }

    if (!donorEmail.trim()) {
      toast.error("Please enter your email address.");
      return;
    }

    donationMutation.mutate({
      campaign: id,
      amount: parsedAmount,
      donorEmail: donorEmail.trim(),
      method,
    });
  };

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

          <Dialog open={isDonateOpen} onOpenChange={setIsDonateOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Heart className="h-4 w-4" />
                Donate Now
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Donate to this campaign</DialogTitle>
                <DialogDescription>
                  Choose your amount and method. Your support helps this
                  campaign move forward.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="donation-email"
                  >
                    Email address
                  </label>
                  <Input
                    id="donation-email"
                    type="email"
                    value={donorEmail}
                    onChange={(event) => setDonorEmail(event.target.value)}
                    placeholder="you@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-gray-700"
                    htmlFor="donation-amount"
                  >
                    Amount (USD)
                  </label>
                  <Input
                    id="donation-amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Payment method
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant={method === "paypal" ? "default" : "outline"}
                      onClick={() => setMethod("paypal")}
                    >
                      PayPal
                    </Button>
                    <Button
                      type="button"
                      variant={method === "crypto" ? "default" : "outline"}
                      onClick={() => setMethod("crypto")}
                    >
                      Crypto
                    </Button>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  onClick={handleDonate}
                  disabled={donationMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {donationMutation.isPending
                    ? "Submitting..."
                    : "Confirm Donation"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
