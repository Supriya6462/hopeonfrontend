import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useEffect } from "react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Campaign, WithdrawalFilters, WithdrawalRequest } from "@/types";
import {
  createWithdrawalSchema,
  type CreateWithdrawalInput,
} from "@/validations/organizer.schema";
import { organizerResponseParsers } from "@/features/api";
import { toast } from "sonner";

import {
  useOrganizerCampaigns,
  useOrganizerWithdrawalById,
  useOrganizerWithdrawalActions,
  useOrganizerWithdrawals,
} from "../hooks";

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);

function getStatusVariant(
  status: string,
): "default" | "secondary" | "destructive" {
  if (status === "approved" || status === "paid") return "secondary";
  if (status === "rejected") return "destructive";
  return "default";
}

function getCampaignLabel(withdrawal: WithdrawalRequest) {
  if (typeof withdrawal.campaign === "string") return "Campaign";
  return withdrawal.campaign?.title || "Campaign";
}

export default function OrganizerWithdrawals() {
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "requested" | "approved" | "rejected" | "paid"
  >("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);

  const campaignsQuery = useOrganizerCampaigns({
    isClosed: false,
    page: 1,
    limit: 100,
  });

  const withdrawalFilters = useMemo<WithdrawalFilters>(
    () => ({
      status: statusFilter === "all" ? undefined : statusFilter,
      page,
      limit,
    }),
    [statusFilter, page, limit],
  );

  const withdrawalsQuery = useOrganizerWithdrawals(withdrawalFilters);
  const withdrawalByIdQuery = useOrganizerWithdrawalById(
    selectedWithdrawalId || undefined,
  );
  const { createWithdrawalAsync, isCreating } = useOrganizerWithdrawalActions();

  const campaigns = organizerResponseParsers
    .extractCampaignsFromResponse(campaignsQuery.data)
    .filter((campaign: Campaign) => !campaign.isClosed);
  const withdrawalList = useMemo(
    () =>
      organizerResponseParsers.extractWithdrawalListFromResponse(
        withdrawalsQuery.data,
        { page, limit },
      ),
    [withdrawalsQuery.data, page, limit],
  );

  const withdrawals = withdrawalList.withdrawals;
  const pagination = withdrawalList.pagination;
  const selectedWithdrawal =
    organizerResponseParsers.extractWithdrawalFromResponse(
      withdrawalByIdQuery.data,
    );

  const form = useForm<CreateWithdrawalInput>({
    resolver: zodResolver(createWithdrawalSchema),
    defaultValues: {
      campaign: "",
      amountRequested: 0,
      payoutMethod: "bank",
      reason: "",
      paypalEmail: "",
      bankDetails: {
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        branchName: "",
        swiftCode: "",
      },
      cryptoDetails: {
        walletAddress: "",
        network: "",
      },
    },
  });

  const payoutMethod = form.watch("payoutMethod");

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
    if (withdrawalsQuery.isError) {
      const message =
        (withdrawalsQuery.error as any)?.response?.data?.message ||
        (withdrawalsQuery.error as any)?.message ||
        "Failed to load withdrawals";
      toast.error(message);
    }
  }, [withdrawalsQuery.isError, withdrawalsQuery.error]);

  useEffect(() => {
    if (withdrawalByIdQuery.isError) {
      const message =
        (withdrawalByIdQuery.error as any)?.response?.data?.message ||
        (withdrawalByIdQuery.error as any)?.message ||
        "Failed to load withdrawal details";
      toast.error(message);
    }
  }, [withdrawalByIdQuery.isError, withdrawalByIdQuery.error]);

  const onSubmit = async (values: CreateWithdrawalInput) => {
    if (campaigns.length === 0) {
      toast.error(
        "Create at least one active campaign before requesting a withdrawal.",
      );
      return;
    }

    const payload = {
      campaign: values.campaign,
      amountRequested: Number(values.amountRequested),
      payoutMethod: values.payoutMethod,
      bankDetails:
        values.payoutMethod === "bank"
          ? {
              accountHolderName: values.bankDetails?.accountHolderName?.trim(),
              bankName: values.bankDetails?.bankName?.trim(),
              accountNumber: values.bankDetails?.accountNumber?.trim(),
              branchName: values.bankDetails?.branchName?.trim(),
              swiftCode: values.bankDetails?.swiftCode?.trim(),
            }
          : undefined,
      paypalEmail:
        values.payoutMethod === "paypal"
          ? values.paypalEmail?.trim() || undefined
          : undefined,
      cryptoDetails:
        values.payoutMethod === "crypto"
          ? {
              walletAddress: values.cryptoDetails?.walletAddress?.trim(),
              network: values.cryptoDetails?.network?.trim(),
            }
          : undefined,
      reason: values.reason?.trim() || undefined,
    };

    try {
      await createWithdrawalAsync(createWithdrawalSchema.parse(payload));
      form.reset({
        campaign: "",
        amountRequested: 0,
        payoutMethod: "bank",
        reason: "",
        paypalEmail: "",
        bankDetails: {
          accountHolderName: "",
          bankName: "",
          accountNumber: "",
          branchName: "",
          swiftCode: "",
        },
        cryptoDetails: {
          walletAddress: "",
          network: "",
        },
      });
    } catch {
      // Error toast is handled by mutation hook.
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Withdrawals</h1>
        <p className="mt-2 text-gray-600">
          Request payouts and track all withdrawal statuses in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Request Withdrawal</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="campaign"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Campaign</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select campaign" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {campaigns.map((campaign: Campaign) => (
                            <SelectItem key={campaign._id} value={campaign._id}>
                              {campaign.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="amountRequested"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0.01}
                          step="0.01"
                          value={field.value ?? ""}
                          onChange={(event) => {
                            const value = event.target.value;
                            field.onChange(value === "" ? 0 : Number(value));
                          }}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payoutMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payout Method</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="crypto">Crypto</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {payoutMethod === "bank" && (
                  <div className="space-y-3 rounded-md border border-gray-200 p-3">
                    <FormField
                      control={form.control}
                      name="bankDetails.accountHolderName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Holder Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankDetails.bankName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bank Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Bank name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bankDetails.accountNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Account Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Account number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {payoutMethod === "paypal" && (
                  <FormField
                    control={form.control}
                    name="paypalEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>PayPal Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {payoutMethod === "crypto" && (
                  <div className="space-y-3 rounded-md border border-gray-200 p-3">
                    <FormField
                      control={form.control}
                      name="cryptoDetails.walletAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wallet Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Wallet address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cryptoDetails.network"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Network</FormLabel>
                          <FormControl>
                            <Input placeholder="ETH, BSC, Polygon" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          className="min-h-24"
                          placeholder="Share the purpose of this withdrawal"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isCreating ||
                    campaignsQuery.isLoading ||
                    campaigns.length === 0
                  }
                >
                  {isCreating ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-lg">My Withdrawal Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-lg border border-gray-200 p-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-700">
                <Filter className="h-4 w-4" />
                <span>Status</span>
                <Select
                  value={statusFilter}
                  onValueChange={(
                    value:
                      | "all"
                      | "requested"
                      | "approved"
                      | "rejected"
                      | "paid",
                  ) => {
                    setStatusFilter(value);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[170px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="requested">Requested</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-700">
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
                    <SelectItem value="8">8</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="24">24</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedWithdrawalId ? (
              <div className="rounded-lg border border-blue-200 bg-blue-50/40 p-3 text-xs text-gray-700 space-y-1">
                <p className="font-semibold text-blue-900">
                  Selected Request Details
                </p>
                {withdrawalByIdQuery.isLoading ? (
                  <p>Loading detailed request info...</p>
                ) : selectedWithdrawal ? (
                  <>
                    <p>Status: {selectedWithdrawal.status.toUpperCase()}</p>
                    <p>
                      Requested Amount:{" "}
                      {formatCurrency(selectedWithdrawal.amountRequested)}
                    </p>
                    <p>
                      Net Paid:{" "}
                      {formatCurrency(
                        Number(selectedWithdrawal.netAmountPaid || 0),
                      )}
                    </p>
                    <p>
                      Payment Reference:{" "}
                      {selectedWithdrawal.paymentReference || "N/A"}
                    </p>
                  </>
                ) : (
                  <p>No detailed record found.</p>
                )}
              </div>
            ) : null}

            {withdrawalsQuery.isLoading ? (
              <p className="text-sm text-gray-500">Loading withdrawals...</p>
            ) : withdrawals.length === 0 ? (
              <p className="text-sm text-gray-500">
                No withdrawals yet. Your submitted requests will appear here.
              </p>
            ) : (
              <>
                {withdrawals.map((withdrawal: WithdrawalRequest) => (
                  <div
                    key={withdrawal._id}
                    className="rounded-lg border border-gray-200 p-4 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <p className="font-medium text-gray-900">
                        {getCampaignLabel(withdrawal)}
                      </p>
                      <Badge variant={getStatusVariant(withdrawal.status)}>
                        {withdrawal.status.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">
                      Requested {formatCurrency(withdrawal.amountRequested)} via{" "}
                      {withdrawal.payoutMethod.toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      Submitted on{" "}
                      {new Date(withdrawal.createdAt).toLocaleDateString()}
                    </p>
                    {withdrawal.adminMessage ? (
                      <p className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-700">
                        Admin note: {withdrawal.adminMessage}
                      </p>
                    ) : null}
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedWithdrawalId(withdrawal._id)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-sm text-gray-600">
                    Showing {withdrawals.length} of {pagination.total} requests
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((previous) => Math.max(1, previous - 1))
                      }
                      disabled={page <= 1 || withdrawalsQuery.isFetching}
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
                        withdrawalsQuery.isFetching
                      }
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
