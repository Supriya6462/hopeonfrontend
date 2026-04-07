import { z } from "zod";
import api from "@/features/api/axios";

const campaignSchema = z.object({
  _id: z.string(),
  title: z.string(),
  imageURL: z.string().optional(),
  images: z.array(z.string()).optional(),
  target: z.number().nonnegative(),
  raised: z.number().nonnegative().optional(),
  totalRaised: z.number().nonnegative().optional(),
  currentAmount: z.number().nonnegative().optional(),
});

export type FeaturedCampaign = z.infer<typeof campaignSchema>;

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Record<string, unknown>;
};

const extractCampaignArray = (payload: unknown): unknown[] => {
  if (Array.isArray(payload)) return payload;

  const root = asRecord(payload);
  if (!root) return [];

  const candidates: unknown[] = [
    root.campaigns,
    root.data,
    root.result,
    asRecord(root.data)?.campaigns,
    asRecord(root.result)?.campaigns,
    asRecord(asRecord(root.data)?.data)?.campaigns,
    asRecord(asRecord(root.data)?.result)?.campaigns,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
};

export const homepageAPI = {
  getFeaturedCampaigns: async (limit = 6): Promise<FeaturedCampaign[]> => {
    const response = await api.get("/api/campaigns", {
      params: { isClosed: false, limit },
    });

    return z.array(campaignSchema).parse(extractCampaignArray(response.data));
  },
};
