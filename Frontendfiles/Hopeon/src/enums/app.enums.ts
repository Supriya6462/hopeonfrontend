
export type Role = "donor" | "organizer" | "admin";

export type DonationMethod = "paypal" | "crypto";

export type DonationStatus = "COMPLETED" | "PENDING" | "FAILED";

export type CryptoNetwork = "ethereum" | "polygon" | "bsc";

export type ApplicationStatus = "pending" | "approved" | "rejected";

export const OtpPurpose = {
  REGISTER: "register",
  FORGET_PASSWORD: "forget-password",
} as const;

export type OtpPurposeType = "register" | "forget-password";

export type WithdrawalStatus = "pending" | "approved" | "rejected" | "paid";

export type OrganizationType =
  | "nonprofit"
  | "charity"
  | "individual"
  | "business"
  | "other";

export type PayoutMethod = "bank" | "paypal" | "crypto";