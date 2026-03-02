import type { ApplicationStatus, OrganizationType, WithdrawalStatus, PayoutMethod } from "../enums";

export interface SubmitApplicationDTO {
  organizationName: string;
  description: string;
  contactEmail?: string;
  phoneNumber?: string;
  website?: string;
  organizationType?: OrganizationType;
  documents?: any;
}

export interface OrganizerDocuments {
  governmentId: File | null;
  selfieWithId: File | null;
  registrationCertificate?: File | null;
  taxId?: File | null;
  addressProof?: File | null;
  additionalDocuments?: File[];
}

export interface ApplicationFilters {
  status?: ApplicationStatus;
  page?: number;
  limit?: number;
}

export interface CreateWithdrawalDTO {
  campaign: string;
  amountRequested: number;
  payoutMethod: PayoutMethod;
  bankDetails?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    branchName?: string;
    swiftCode?: string;
  };
  paypalEmail?: string;
  cryptoDetails?: {
    walletAddress?: string;
    network?: string;
  };
  reason?: string;
}

export interface WithdrawalFilters {
  status?: WithdrawalStatus;
  page?: number;
  limit?: number;
}

export interface DocumentFile {
  url: string;
  publicId: string;
  uploadedAt: string;
}

export interface AdditionalDocument extends DocumentFile {
  name: string;
}

export interface ApplicationDocuments {
  governmentId?: DocumentFile;
  selfieWithId?: DocumentFile;
  registrationCertificate?: DocumentFile;
  taxId?: DocumentFile;
  addressProof?: DocumentFile;
  additionalDocuments?: AdditionalDocument[];
}

export interface OrganizerApplication {
  _id: string;
  user: string | {
    _id: string;
    name: string;
    email: string;
    phoneNumber?: string;
  };
  organizationName: string;
  description: string;
  contactEmail?: string;
  phoneNumber?: string;
  website?: string;
  organizationType?: OrganizationType;
  documents?: ApplicationDocuments;
  documentsVerified: boolean;
  status: ApplicationStatus;
  reviewedBy?: string | {
    _id: string;
    name: string;
    email: string;
  };
  reviewedAt?: string;
  rejectionReason?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationResponse {
  success: boolean;
  message: string;
  data: OrganizerApplication;
}

export interface ApplicationsListResponse {
  success: boolean;
  applications: OrganizerApplication[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface WithdrawalRequest {
  _id: string;
  organizer: string;
  campaign: string;
  amountRequested: number;
  payoutMethod: PayoutMethod;
  bankDetails?: {
    accountHolderName?: string;
    bankName?: string;
    accountNumber?: string;
    branchName?: string;
    swiftCode?: string;
  };
  paypalEmail?: string;
  cryptoDetails?: {
    walletAddress?: string;
    network?: string;
  };
  reason?: string;
  status: WithdrawalStatus;
  adminMessage?: string;
  paidAt?: string;
  paymentReference?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WithdrawalResponse {
  success: boolean;
  message: string;
  data: WithdrawalRequest;
}

export interface WithdrawalsListResponse {
  success: boolean;
  withdrawals: WithdrawalRequest[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}