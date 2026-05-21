import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminDashboardStats, adminQueryKeys } from "@/features/admin/api";
import {
  AdminPageSkeleton,
  EmptyState,
  PageHeader,
  RefreshButton,
  StatusBadge,
} from "@/features/admin/components";
import {
  Activity,
  AlertTriangle,
  ArrowDownCircle,
  ChevronRight,
  ClipboardList,
  FolderKanban,
  HandCoins,
  LayoutDashboard,
  Users,
  UserCheck,
} from "lucide-react";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat("en-US");

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof Users;
}) {
  return (
    <Card className="surface-card shadow-sm border-border/60">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {title}
            </p>
            <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {subtitle}
            </p>
          </div>
          <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <Icon className="h-4.5 w-4.5 text-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboard() {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: adminQueryKeys.dashboardStats,
    queryFn: getAdminDashboardStats,
  });

  if (isLoading) {
    return <AdminPageSkeleton statCount={5} variant="dashboard" />;
  }

  if (isError) {
    return (
      <div className="surface-page min-h-screen flex items-center justify-center px-4">
        <div className="bg-card border border-border rounded-lg shadow-sm max-w-md w-full p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold text-foreground">
              Unable to load dashboard
            </h2>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Something went wrong. Please try again."}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const totalUsers = data?.users.total ?? 0;
  const totalDonors = data?.users.donors ?? 0;
  const totalOrganizers = data?.users.organizers ?? 0;
  const donationCount = data?.donations.count ?? 0;
  const donationAmount = data?.donations.totalAmount ?? 0;
  const totalCampaigns = data?.campaigns.total ?? 0;
  const activeCampaigns = data?.campaigns.active ?? 0;
  const pendingWithdrawals = data?.withdrawals.pending ?? 0;
  const totalWithdrawn = data?.withdrawals.totalWithdrawn ?? 0;
  const pendingApplications = data?.applications.pending ?? 0;

  return (
    <div className="surface-page min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn">
        <PageHeader
          label="Admin · Platform"
          title="Operations Dashboard"
          description="Live admin overview powered by current API endpoints with normalized response parsing."
          action={
            <RefreshButton onClick={() => refetch()} disabled={isFetching} />
          }
        />

        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          <StatCard
            title="Total Users"
            value={number.format(totalUsers)}
            subtitle={`${number.format(totalDonors)} donors · ${number.format(totalOrganizers)} organizers`}
            icon={Users}
          />
          <StatCard
            title="Donations"
            value={number.format(donationCount)}
            subtitle={`${currency.format(donationAmount)} collected`}
            icon={HandCoins}
          />
          <StatCard
            title="Campaigns"
            value={number.format(totalCampaigns)}
            subtitle={`${number.format(activeCampaigns)} active campaigns`}
            icon={FolderKanban}
          />
          <StatCard
            title="Pending Withdrawals"
            value={number.format(pendingWithdrawals)}
            subtitle={`${currency.format(totalWithdrawn)} disbursed`}
            icon={ArrowDownCircle}
          />
          <StatCard
            title="Pending Applications"
            value={number.format(pendingApplications)}
            subtitle="Organizer approvals waiting"
            icon={UserCheck}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Card className="surface-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
                Review Queue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link
                to={ROUTES.ADMIN_APPLICATIONS}
                className="block rounded-lg border border-border px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Organizer Applications
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Application review pipeline
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={pendingApplications > 0 ? "pending" : "approved"}
                    />
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>

              <Link
                to={ROUTES.ADMIN_WITHDRAWALS}
                className="block rounded-lg border border-border px-4 py-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Withdrawal Requests
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Payout approvals and processing
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge
                      status={pendingWithdrawals > 0 ? "pending" : "completed"}
                    />
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            </CardContent>
          </Card>

          <Card className="surface-card shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                Quick Navigation
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              {[
                { to: ROUTES.ADMIN_USERS, label: "Users", icon: Users },
                {
                  to: ROUTES.ADMIN_CAMPAIGNS,
                  label: "Campaigns",
                  icon: FolderKanban,
                },
                {
                  to: ROUTES.ADMIN_DONATIONS,
                  label: "Donations",
                  icon: HandCoins,
                },
                {
                  to: ROUTES.ADMIN_WITHDRAWALS,
                  label: "Withdrawals",
                  icon: ArrowDownCircle,
                },
                {
                  to: ROUTES.ADMIN_APPLICATIONS,
                  label: "Applications",
                  icon: ClipboardList,
                },
                {
                  to: ROUTES.ADMIN_ORGANIZERS,
                  label: "Organizers",
                  icon: Activity,
                },
              ].map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  className="rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {label}
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </section>

        {totalCampaigns === 0 && donationCount === 0 ? (
          <EmptyState
            icon={Activity}
            title="No platform activity yet"
            description="Once campaigns and donations are created, this dashboard will surface live operational metrics."
          />
        ) : null}
      </div>
    </div>
  );
}
