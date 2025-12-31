export interface CreateCampaignDTO {
  title: string;
  description?: string;
  images?: string[];
  target: number;
}

export interface UpdateCampaignDTO {
  title?: string;
  description?: string;
  images?: string[];
  target?: number;
}

export interface CampaignFilters {
  owner?: string;
  isApproved?: boolean;
  isClosed?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export interface Campaign {
  _id: string;
  title: string;
  description?: string;
  images: string[];
  target: number;
  raised: number;
  owner: string;
  isApproved: boolean;
  isClosed: boolean;
  closedReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignResponse {
  success: boolean;
  message: string;
  data: Campaign;
}

export interface CampaignsListResponse {
  success: boolean;
  campaigns: Campaign[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}