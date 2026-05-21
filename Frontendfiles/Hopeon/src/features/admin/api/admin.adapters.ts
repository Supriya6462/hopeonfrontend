import {
  adminCampaignAPI,
  adminDonationAPI,
  adminOrganizerAPI,
  adminWithdrawalAPI,
  api,
} from "@/features/api";
import {
  adminCampaignListItemSchema,
  adminDonationListItemSchema,
  adminDashboardStatsSchema,
  adminUserListItemSchema,
  adminWithdrawalListItemSchema,
  type AdminCampaignListItem,
  type AdminDonationListItem,
  type AdminDashboardStats,
  type AdminUserListItem,
  type AdminWithdrawalListItem,
} from "./admin.schemas";

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord => {
  if (value && typeof value === "object") return value as UnknownRecord;
  return {};
};

const asArray = (value: unknown): UnknownRecord[] => {
  if (Array.isArray(value))
    return value.filter(
      (item): item is UnknownRecord => !!item && typeof item === "object",
    );
  return [];
};

const candidates = (root: unknown): UnknownRecord[] => {
  const top = asRecord(root);
  const first = asRecord(top.data);
  const second = asRecord(first.data);
  const result = asRecord(top.result);
  const nestedResult = asRecord(first.result);

  return [top, first, second, result, nestedResult];
};

const readPath = (obj: UnknownRecord, key: string): unknown => {
  if (!key.includes(".")) return obj[key];

  return key.split(".").reduce<unknown>((acc, part) => {
    if (!acc || typeof acc !== "object") return undefined;
    return (acc as UnknownRecord)[part];
  }, obj);
};

const pickNumber = (root: unknown, keys: string[]): number => {
  for (const item of candidates(root)) {
    for (const key of keys) {
      const parsed = Number(readPath(item, key));
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return 0;
};

const pickList = (root: unknown, keys: string[]): UnknownRecord[] => {
  for (const item of candidates(root)) {
    for (const key of keys) {
      const arr = asArray(item[key]);
      if (arr.length > 0) return arr;
    }
  }
  return [];
};

const countByStatus = (list: UnknownRecord[], statuses: string[]): number => {
  const allowed = new Set(statuses.map((status) => status.toLowerCase()));
  return list.filter((item) => {
    const status = String(
      item.status ?? item.verificationStatus ?? "",
    ).toLowerCase();
    return allowed.has(status);
  }).length;
};

const sumAmounts = (list: UnknownRecord[], amountKey: string): number => {
  return list.reduce((sum, item) => {
    const parsed = Number(item[amountKey] ?? 0);
    return Number.isFinite(parsed) ? sum + parsed : sum;
  }, 0);
};

const parseUsers = (
  usersResponse: unknown,
): { total: number; donors: number; organizers: number } => {
  const users = pickList(usersResponse, ["users", "items", "data"]);

  if (users.length > 0) {
    return {
      total:
        pickNumber(usersResponse, ["total", "totalUsers", "totalCount"]) ||
        users.length,
      donors: countByStatus(users, ["donor"]),
      organizers: countByStatus(users, ["organizer"]),
    };
  }

  return {
    total: pickNumber(usersResponse, ["total", "totalUsers", "totalCount"]),
    donors: pickNumber(usersResponse, ["donors", "donorCount"]),
    organizers: pickNumber(usersResponse, ["organizers", "organizerCount"]),
  };
};

const parseCampaigns = (campaignsResponse: unknown) => {
  const campaigns = pickList(campaignsResponse, ["campaigns", "items", "data"]);
  return {
    total:
      pickNumber(campaignsResponse, [
        "total",
        "totalCampaigns",
        "totalCount",
      ]) || campaigns.length,
    active: countByStatus(campaigns, ["active"]),
  };
};

const parseDonations = (
  donationStatsResponse: unknown,
  donationsListResponse: unknown,
) => {
  const donationCount =
    pickNumber(donationStatsResponse, ["totalDonations", "count", "total"]) ||
    pickNumber(donationsListResponse, ["total", "totalCount"]) ||
    pickList(donationsListResponse, ["donations", "items", "data"]).length;

  const totalAmount =
    pickNumber(donationStatsResponse, ["totalAmount", "amount"]) ||
    pickNumber(donationsListResponse, ["totalAmount"]) ||
    sumAmounts(
      pickList(donationsListResponse, ["donations", "items", "data"]),
      "amount",
    );

  return {
    count: donationCount,
    totalAmount,
  };
};

const parseWithdrawals = (withdrawalsResponse: unknown) => {
  const withdrawals = pickList(withdrawalsResponse, [
    "withdrawalRequests",
    "withdrawals",
    "items",
    "data",
  ]);
  return {
    pending: countByStatus(withdrawals, [
      "pending",
      "under_review",
      "requested",
    ]),
    totalWithdrawn:
      pickNumber(withdrawalsResponse, [
        "totalWithdrawn",
        "paidAmount",
        "paidTotal",
      ]) ||
      sumAmounts(
        withdrawals.filter((item) => {
          const status = String(item.status ?? "").toLowerCase();
          return status === "completed" || status === "paid";
        }),
        "amount",
      ),
  };
};

const parseApplications = (applicationsResponse: unknown) => {
  const applications = pickList(applicationsResponse, [
    "applications",
    "organizerApplications",
    "items",
    "data",
  ]);
  return {
    pending:
      pickNumber(applicationsResponse, ["pending", "pendingApplications"]) ||
      countByStatus(applications, ["pending"]),
  };
};

async function fetchUsersStats() {
  try {
    const response = await api.get("/api/users", {
      params: { page: 1, limit: 1 },
    });
    return response.data;
  } catch {
    return {};
  }
}

export const adminQueryKeys = {
  dashboardStats: ["admin", "dashboard", "stats"] as const,
  campaigns: (params?: unknown) => ["admin", "campaigns", params] as const,
  donations: (params?: unknown) => ["admin", "donations", params] as const,
  withdrawals: (params?: unknown) => ["admin", "withdrawals", params] as const,
  users: (params?: unknown) => ["admin", "users", params] as const,
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [
    usersData,
    campaignsData,
    donationStatsData,
    donationsData,
    withdrawalsData,
    applicationsData,
  ] = await Promise.all([
    fetchUsersStats(),
    adminCampaignAPI.getAllCampaigns({ page: 1, limit: 1 }),
    adminDonationAPI.getDonationStats(),
    adminDonationAPI.getAllDonations({ page: 1, limit: 100 }),
    adminWithdrawalAPI.getAllWithdrawals(),
    adminOrganizerAPI.getAllApplications({ status: "pending" }),
  ]);

  const parsed = adminDashboardStatsSchema.parse({
    users: parseUsers(usersData),
    donations: parseDonations(donationStatsData, donationsData),
    campaigns: parseCampaigns(campaignsData),
    withdrawals: parseWithdrawals(withdrawalsData),
    applications: parseApplications(applicationsData),
  });

  return parsed;
}

const normalizeCampaignStatus = (raw: UnknownRecord): string => {
  if (typeof raw.status === "string" && raw.status.trim()) return raw.status;
  if (raw.isClosed === true) return "closed";
  if (raw.isApproved === true) return "active";
  return "pending";
};

const normalizeCampaignList = (payload: unknown): AdminCampaignListItem[] => {
  const campaigns = pickList(payload, ["campaigns", "items", "data"]);
  return campaigns.map((item) =>
    adminCampaignListItemSchema.parse({
      _id: item._id,
      title: item.title,
      description: item.description,
      target: item.target,
      raised: item.raised,
      status: normalizeCampaignStatus(item),
      createdAt: item.createdAt,
      ownerName: asRecord(item.owner).name,
      ownerEmail: asRecord(item.owner).email,
    }),
  );
};

const normalizeDonationList = (payload: unknown): AdminDonationListItem[] => {
  const donations = pickList(payload, ["donations", "items", "data"]);
  return donations.map((item) => {
    const donor = asRecord(item.donor);
    const campaign = asRecord(item.campaign);
    return adminDonationListItemSchema.parse({
      _id: item._id,
      amount: item.amount,
      status: item.status,
      method: item.method,
      transactionId: item.transactionId,
      createdAt: item.createdAt,
      campaignTitle: campaign.title,
      donorName: donor.name,
      donorEmail: donor.email ?? item.donorEmail,
    });
  });
};

const normalizeWithdrawalList = (
  payload: unknown,
): AdminWithdrawalListItem[] => {
  const withdrawals = pickList(payload, [
    "withdrawalRequests",
    "withdrawals",
    "items",
    "data",
  ]);
  return withdrawals.map((item) => {
    const organizer = asRecord(item.organizer);
    const campaign = asRecord(item.campaign);
    return adminWithdrawalListItemSchema.parse({
      _id: item._id,
      amountRequested: item.amountRequested ?? item.amount,
      status: item.status,
      payoutMethod: item.payoutMethod,
      createdAt: item.createdAt,
      campaignTitle: campaign.title,
      organizerName: organizer.name,
      organizerEmail: organizer.email,
    });
  });
};

const normalizeUserList = (payload: unknown): AdminUserListItem[] => {
  const users = pickList(payload, ["users", "items", "data"]);
  return users.map((item) =>
    adminUserListItemSchema.parse({
      _id: item._id,
      name: item.name,
      email: item.email,
      role: item.role,
      isOrganizerApproved: Boolean(item.isOrganizerApproved),
      isOrganizerRevoked: Boolean(item.isOrganizerRevoked),
      createdAt: item.createdAt,
    }),
  );
};

export async function getAdminCampaignList(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const payload = await adminCampaignAPI.getAllCampaigns(params);
  return {
    items: normalizeCampaignList(payload),
    totalPages:
      pickNumber(payload, ["totalPages", "pages", "pagination.pages"]) || 1,
    total: pickNumber(payload, ["total", "totalCount", "pagination.total"]),
  };
}

export async function getAdminDonationList(params?: {
  page?: number;
  limit?: number;
  status?: string;
}) {
  const payload = await adminDonationAPI.getAllDonations(
    params as {
      page?: number;
      limit?: number;
      status?: "COMPLETED" | "PENDING" | "FAILED";
    },
  );
  return {
    items: normalizeDonationList(payload),
    totalPages:
      pickNumber(payload, ["totalPages", "pages", "pagination.pages"]) || 1,
    total: pickNumber(payload, ["total", "totalCount", "pagination.total"]),
  };
}

export async function getAdminWithdrawalList(params?: {
  status?: string;
  page?: number;
  limit?: number;
}) {
  const payload = await adminWithdrawalAPI.getAllWithdrawals(
    params as {
      status?: "requested" | "approved" | "rejected" | "paid";
      page?: number;
      limit?: number;
    },
  );
  return {
    items: normalizeWithdrawalList(payload),
    totalPages:
      pickNumber(payload, ["totalPages", "pages", "pagination.pages"]) || 1,
    total: pickNumber(payload, ["total", "totalCount", "pagination.total"]),
  };
}

export async function getAdminUserList(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
}) {
  const response = await api.get("/api/users", { params });
  const payload = response.data;
  return {
    items: normalizeUserList(payload),
    totalPages:
      pickNumber(payload, ["totalPages", "pages", "pagination.pages"]) || 1,
    total: pickNumber(payload, ["total", "totalCount", "pagination.total"]),
  };
}
