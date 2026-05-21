import { z } from "zod";

const safeNumber = z
  .union([z.number(), z.string(), z.null(), z.undefined()])
  .transform((value) => {
    const parsed = Number(value ?? 0);
    return Number.isFinite(parsed) ? parsed : 0;
  });

export const adminDashboardStatsSchema = z.object({
  users: z.object({
    total: safeNumber.default(0),
    donors: safeNumber.default(0),
    organizers: safeNumber.default(0),
  }),
  donations: z.object({
    count: safeNumber.default(0),
    totalAmount: safeNumber.default(0),
  }),
  campaigns: z.object({
    total: safeNumber.default(0),
    active: safeNumber.default(0),
  }),
  withdrawals: z.object({
    pending: safeNumber.default(0),
    totalWithdrawn: safeNumber.default(0),
  }),
  applications: z.object({
    pending: safeNumber.default(0),
  }),
});

export type AdminDashboardStats = z.infer<typeof adminDashboardStatsSchema>;

const safeString = z
  .union([z.string(), z.number(), z.null(), z.undefined()])
  .transform((value) => String(value ?? ""));

export const adminCampaignListItemSchema = z.object({
  _id: safeString,
  title: safeString,
  description: safeString,
  target: safeNumber,
  raised: safeNumber.default(0),
  status: safeString.default("unknown"),
  createdAt: safeString.default(""),
  ownerName: safeString.default("N/A"),
  ownerEmail: safeString.default("N/A"),
});

export const adminDonationListItemSchema = z.object({
  _id: safeString,
  amount: safeNumber,
  status: safeString.default("unknown"),
  method: safeString.default("unknown"),
  transactionId: safeString.default("N/A"),
  createdAt: safeString.default(""),
  campaignTitle: safeString.default("Unknown Campaign"),
  donorName: safeString.default("N/A"),
  donorEmail: safeString.default("N/A"),
});

export const adminWithdrawalListItemSchema = z.object({
  _id: safeString,
  amountRequested: safeNumber.default(0),
  status: safeString.default("unknown"),
  payoutMethod: safeString.default("unknown"),
  createdAt: safeString.default(""),
  campaignTitle: safeString.default("Unknown Campaign"),
  organizerName: safeString.default("Unknown Organizer"),
  organizerEmail: safeString.default("N/A"),
});

export const adminUserListItemSchema = z.object({
  _id: safeString,
  name: safeString.default("N/A"),
  email: safeString.default("N/A"),
  role: safeString.default("donor"),
  isOrganizerApproved: z.boolean().default(false),
  isOrganizerRevoked: z.boolean().default(false),
  createdAt: safeString.default(""),
});

export type AdminCampaignListItem = z.infer<typeof adminCampaignListItemSchema>;
export type AdminDonationListItem = z.infer<typeof adminDonationListItemSchema>;
export type AdminWithdrawalListItem = z.infer<
  typeof adminWithdrawalListItemSchema
>;
export type AdminUserListItem = z.infer<typeof adminUserListItemSchema>;
