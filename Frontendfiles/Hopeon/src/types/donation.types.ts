import type { DonationMethod, DonationStatus } from "../enums";

export interface CreateDonationDTO {
  campaign: string;
  amount: number;
  method: DonationMethod;
  donorEmail: string;
  transactionId?: string;
  payerEmail?: string;
  payerName?: string;
  payerCountry?: string;
  cryptoCurrency?: "ETH" | "USDT" | "BTC";
  transactionHash?: string;
  network?: string;
}

export interface UpdateDonationPaymentDetails {
  transactionId?: string;
  payerEmail?: string;
  payerName?: string;
  payerCountry?: string;
  captureDetails?: any;
  transactionHash?: string;
}

export interface DonationFilters {
  status?: DonationStatus;
  method?: DonationMethod;
  campaign?: string;
  page?: number;
  limit?: number;
}

export interface CampaignDonationFilters {
  page?: number;
  limit?: number;
}

export interface Donation {
  _id: string;
  campaign: string;
  donor: string;
  donorEmail: string;
  amount: number;
  method: DonationMethod;
  transactionId?: string;
  payerEmail?: string;
  payerName?: string;
  payerCountry?: string;
  captureDetails?: any;
  cryptoCurrency?: "ETH" | "USDT" | "BTC";
  transactionHash?: string;
  network?: string;
  status: DonationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DonationResponse {
  success: boolean;
  message: string;
  data: Donation;
}

export interface DonationsListResponse {
  success: boolean;
  donations: Donation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface DonationStats {
  totalAmount: number;
  totalDonations: number;
  avgDonation: number;
  maxDonation: number;
  minDonation: number;
}

export interface DonationStatsResponse {
  success: boolean;
  data: DonationStats;
}