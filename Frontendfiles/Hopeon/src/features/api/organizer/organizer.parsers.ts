import type { Campaign, WithdrawalRequest } from "@/types";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface OrganizerDonationStatsData {
  totalAmount?: number;
  avgDonation?: number;
  totalDonations?: number;
  totalDonors?: number;
}

function asRecord(value: unknown): Record<string, any> {
  return (value ?? {}) as Record<string, any>;
}

function getCandidates(data: unknown): Record<string, any>[] {
  const root = asRecord(data);
  return [root, root.data, root.result, root.data?.data].filter(Boolean);
}

export function extractCampaignsFromResponse(data: unknown): Campaign[] {
  const candidates = getCandidates(data);

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as Campaign[];
    if (Array.isArray(candidate.campaigns))
      return candidate.campaigns as Campaign[];
    if (Array.isArray(candidate.data?.campaigns))
      return candidate.data.campaigns as Campaign[];
  }

  return [];
}

export function extractCampaignListFromResponse(
  data: unknown,
  fallback: { page: number; limit: number },
): { campaigns: Campaign[]; pagination: PaginationMeta } {
  const candidates = getCandidates(data);

  let campaigns: Campaign[] = [];
  let pagination: PaginationMeta = {
    page: fallback.page,
    limit: fallback.limit,
    total: 0,
    pages: 1,
  };

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      campaigns = candidate as Campaign[];
      break;
    }
    if (Array.isArray(candidate.campaigns)) {
      campaigns = candidate.campaigns as Campaign[];
      break;
    }
    if (Array.isArray(candidate.data?.campaigns)) {
      campaigns = candidate.data.campaigns as Campaign[];
      break;
    }
  }

  for (const candidate of candidates) {
    const meta = candidate.pagination;
    if (meta && typeof meta === "object") {
      pagination = {
        page: Number(meta.page) || fallback.page,
        limit: Number(meta.limit) || fallback.limit,
        total: Number(meta.total) || campaigns.length,
        pages: Number(meta.pages) || 1,
      };
      break;
    }
  }

  if (pagination.total === 0 && campaigns.length > 0) {
    pagination = {
      ...pagination,
      total: campaigns.length,
      pages: Math.max(1, Math.ceil(campaigns.length / pagination.limit)),
    };
  }

  return { campaigns, pagination };
}

export function extractDonationStatsFromResponse(
  data: unknown,
): OrganizerDonationStatsData {
  const candidates = getCandidates(data);

  for (const candidate of candidates) {
    if (
      candidate &&
      typeof candidate === "object" &&
      ("totalAmount" in candidate ||
        "avgDonation" in candidate ||
        "totalDonations" in candidate)
    ) {
      return candidate as OrganizerDonationStatsData;
    }
  }

  return {};
}

export function extractWithdrawalsFromResponse(
  data: unknown,
): WithdrawalRequest[] {
  const candidates = getCandidates(data);

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as WithdrawalRequest[];
    if (Array.isArray(candidate.withdrawals))
      return candidate.withdrawals as WithdrawalRequest[];
    if (Array.isArray(candidate.data?.withdrawals))
      return candidate.data.withdrawals as WithdrawalRequest[];
  }

  return [];
}

export function extractWithdrawalFromResponse(
  data: unknown,
): WithdrawalRequest | null {
  const candidates = getCandidates(data);

  for (const candidate of candidates) {
    if (candidate && typeof candidate === "object") {
      if (candidate._id) return candidate as WithdrawalRequest;
      if (candidate.withdrawal && typeof candidate.withdrawal === "object") {
        return candidate.withdrawal as WithdrawalRequest;
      }
    }
  }

  return null;
}

export function extractWithdrawalListFromResponse(
  data: unknown,
  fallback: { page: number; limit: number },
): { withdrawals: WithdrawalRequest[]; pagination: PaginationMeta } {
  const candidates = getCandidates(data);
  const withdrawals = extractWithdrawalsFromResponse(data);

  let pagination: PaginationMeta = {
    page: fallback.page,
    limit: fallback.limit,
    total: 0,
    pages: 1,
  };

  for (const candidate of candidates) {
    const meta = candidate.pagination;
    if (meta && typeof meta === "object") {
      pagination = {
        page: Number(meta.page) || fallback.page,
        limit: Number(meta.limit) || fallback.limit,
        total: Number(meta.total) || withdrawals.length,
        pages: Number(meta.pages) || 1,
      };
      break;
    }
  }

  if (pagination.total === 0 && withdrawals.length > 0) {
    pagination = {
      ...pagination,
      total: withdrawals.length,
      pages: Math.max(1, Math.ceil(withdrawals.length / pagination.limit)),
    };
  }

  return { withdrawals, pagination };
}

export interface OrganizerProfileData {
  verificationStatus: "verified" | "pending" | "rejected" | null;
  profile: Record<string, any> | null;
  documentDefaults: Record<string, any>;
  documentReuseSummary: Record<string, any> | null;
}

export function extractOrganizerProfileFromResponse(
  data: unknown,
): OrganizerProfileData {
  const root = asRecord(data);
  const candidates = [root, root.data, root.result, root.data?.data].filter(
    Boolean,
  );

  for (const candidate of candidates) {
    const status =
      candidate.verificationStatus ??
      candidate.profile?.verificationStatus ??
      null;
    const profile = candidate.profile ?? (candidate._id ? candidate : null);

    if (
      status !== null ||
      profile ||
      candidate.documentDefaults ||
      candidate.documentReuseSummary
    ) {
      return {
        verificationStatus: status,
        profile,
        documentDefaults: asRecord(candidate.documentDefaults),
        documentReuseSummary: candidate.documentReuseSummary ?? null,
      };
    }
  }

  return {
    verificationStatus: null,
    profile: null,
    documentDefaults: {},
    documentReuseSummary: null,
  };
}
