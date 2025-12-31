import { Heart, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/routes/routes";

/**
 * DonorDashboard - Main dashboard for donors
 * Shows donation stats and quick actions
 */
export default function DonorDashboard() {
  const getUserName = () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        return user.name || "there";
      }
    } catch {
      return "there";
    }
    return "there";
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {getUserName()}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your donation activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total Donated
            </CardTitle>
            <Heart className="h-5 w-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">$0.00</div>
            <p className="text-xs text-gray-500 mt-1">Lifetime contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Campaigns Supported
            </CardTitle>
            <TrendingUp className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">0</div>
            <p className="text-xs text-gray-500 mt-1">Unique campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              Last Donation
            </CardTitle>
            <Calendar className="h-5 w-5 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">-</div>
            <p className="text-xs text-gray-500 mt-1">No donations yet</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link to={ROUTES.CAMPAIGNS}>
              Browse Campaigns
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.DONOR_DONATIONS}>View My Donations</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to={ROUTES.DONOR_PROFILE}>Edit Profile</Link>
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No recent donations</p>
            <p className="text-sm mt-1">
              Start making a difference by supporting a campaign
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
