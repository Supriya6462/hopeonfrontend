import { z } from "zod";

/**
 * Organizer Application Schema
 * Validates the basic information form for organizer applications
 */
export const submitApplicationSchema = z.object({
  organizationName: z
    .string()
    .min(2, { message: "Organization name must be at least 2 characters" })
    .max(100, {
      message: "Organization name must be less than 100 characters",
    }),

  description: z
    .string()
    .min(20, { message: "Description must be at least 20 characters" })
    .max(1000, { message: "Description must be less than 1000 characters" }),

  contactEmail: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),

  phoneNumber: z.string().optional().or(z.literal("")),

  website: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || val === "" || z.string().url().safeParse(val).success,
      { message: "Invalid website URL" },
    ),

  organizationType: z
    .enum(["nonprofit", "charity", "individual", "business", "other"])
    .optional(),

  documents: z.any().optional(),
});

export const createWithdrawalSchema = z.object({
  campaign: z.string().min(1, { message: "Campaign ID is required" }),
  amountRequested: z.number().positive({ message: "Amount must be positive" }),
  payoutMethod: z.enum(["bank", "paypal", "crypto"], {
    message: "Invalid payout method",
  }),
  bankDetails: z
    .object({
      accountHolderName: z.string().optional(),
      bankName: z.string().optional(),
      accountNumber: z.string().optional(),
      branchName: z.string().optional(),
      swiftCode: z.string().optional(),
    })
    .optional(),
  paypalEmail: z.string().email({ message: "Invalid PayPal email" }).optional(),
  cryptoDetails: z
    .object({
      walletAddress: z.string().optional(),
      network: z.string().optional(),
    })
    .optional(),
  reason: z.string().optional(),
});

export const organizerDocumentSchema = z.object({
  url: z.string().min(1, { message: "Document URL is required" }),
  type: z.string().min(1, { message: "Document type is required" }),
  key: z.string().optional(),
  source: z.string().optional(),
});

export const organizerProfileSchema = z.object({
  accountHolderName: z
    .string()
    .min(2, { message: "Account holder name is required" }),
  bankName: z.string().min(2, { message: "Bank name is required" }),
  accountNumber: z.string().min(4, { message: "Account number is required" }),
  routingNumber: z.string().optional(),
  swiftCode: z.string().optional(),
  iban: z.string().optional(),
  accountType: z.enum(["savings", "checking", "business"]),
  bankAddress: z.string().optional(),
  bankCountry: z.string().min(2, { message: "Bank country is required" }),
  fullLegalName: z.string().min(2, { message: "Full legal name is required" }),
  dateOfBirth: z.string().min(1, { message: "Date of birth is required" }),
  nationality: z.string().min(2, { message: "Nationality is required" }),
  street: z.string().min(2, { message: "Street is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().optional(),
  postalCode: z.string().min(2, { message: "Postal code is required" }),
  country: z.string().min(2, { message: "Country is required" }),
  phoneNumber: z.string().min(5, { message: "Phone number is required" }),
  taxId: z.string().optional(),
});

export const organizerProfileDocumentsSchema = z.object({
  governmentId: organizerDocumentSchema,
  bankProof: organizerDocumentSchema,
  addressProof: organizerDocumentSchema,
  taxDocument: organizerDocumentSchema.partial().optional(),
});

export type CreateWithdrawalInput = z.infer<typeof createWithdrawalSchema>;
export type OrganizerProfileInput = z.infer<typeof organizerProfileSchema>;
export type OrganizerProfileDocumentsInput = z.infer<
  typeof organizerProfileDocumentsSchema
>;
