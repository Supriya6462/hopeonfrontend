import { useQuery } from "@tanstack/react-query";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowRight, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { FundraisingButton } from "@/components/ui/fundraising-button";
import CampaignCard from "@/components/CampaignCard";
import HeroSection from "@/features/donor/components/HeroSection";
import { homepageAPI } from "@/features/donor/api/homepage.api";
import { ROUTES } from "@/routes/routes";

const getRaisedAmount = (campaign: {
  raised?: number;
  totalRaised?: number;
  currentAmount?: number;
}) => campaign.raised ?? campaign.totalRaised ?? campaign.currentAmount ?? 0;

export default function Homepage() {
  const campaignsQuery = useQuery({
    queryKey: ["publicCampaigns", "homepage-featured"],
    queryFn: () => homepageAPI.getFeaturedCampaigns(6),
    staleTime: 30_000,
  });

  const error = campaignsQuery.isError
    ? campaignsQuery.error instanceof Error
      ? campaignsQuery.error.message
      : "Unable to load campaigns"
    : null;

  return (
    <div className="relative w-full">
      <HeroSection />

      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mb-12 text-center">
            <Badge className="mb-4 bg-linear-to-r from-orange-500 to-amber-500 px-6 py-2 text-sm font-medium text-white">
              <Heart className="mr-2 h-4 w-4" />
              Featured Campaigns
            </Badge>
            <h2 className="mb-4 text-3xl font-bold text-gray-900">
              Urgent Causes Need Your Help
            </h2>
            <p className="mx-auto max-w-2xl text-gray-600">
              These campaigns are making immediate impact in communities that
              need it most.
            </p>
          </div>

          {campaignsQuery.isLoading ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="rounded-2xl bg-white p-6 shadow-lg">
                  <Skeleton className="mb-4 h-48 w-full rounded-xl" />
                  <Skeleton className="mb-2 h-6 w-3/4" />
                  <Skeleton className="mb-4 h-4 w-full" />
                  <Skeleton className="mb-2 h-3 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : error ? (
            <Alert
              variant="destructive"
              className="mx-auto max-w-xl border-red-200 bg-red-50 text-center"
            >
              <AlertDescription className="text-red-800">
                Error loading campaigns: {error}
              </AlertDescription>
            </Alert>
          ) : campaignsQuery.data && campaignsQuery.data.length > 0 ? (
            <>
              <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {campaignsQuery.data.map((campaign) => (
                  <CampaignCard
                    key={campaign._id}
                    id={campaign._id}
                    title={campaign.title}
                    imageSrc={
                      campaign.images?.[0] ||
                      campaign.imageURL ||
                      "/placeholder.svg"
                    }
                    target={campaign.target}
                    raised={getRaisedAmount(campaign)}
                  />
                ))}
              </div>

              <div className="text-center">
                <Link to={ROUTES.CAMPAIGNS}>
                  <FundraisingButton variant="outline-donate" size="lg">
                    View All Campaigns
                    <ArrowRight className="h-5 w-5" />
                  </FundraisingButton>
                </Link>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <p className="text-lg text-gray-500">
                No campaigns available at the moment.
              </p>
              <p className="text-gray-400">
                Check back soon for new opportunities to make a difference.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
