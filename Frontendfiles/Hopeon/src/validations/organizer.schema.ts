import { z } from "zod";

export const submitApplicationSchema = z.object({
    organizationName: z.string().min(2, {message: "Organization name must be at least 2 characters"}),
    description: z.string().min(20, {message: "Description must be at least 20 characters"}),
    contactEmail: z.string().email({message: "Invalid email address"}).optional(),
    phoneNumber: z.string().optional(),
    website: z.string().url({message: "Invalid website URL"}).optional(),
    organizationType: z.enum(["nonprofit", "charity", "individual", "business", "other"]).optional(),
    documents: z.any().optional(),
});

export const createWithdrawalSchema = z.object({
    campaign: z.string().min(1, {message: "Campaign ID is required"}),
    amountRequested: z.number().positive({message: "Amount must be positive"}),
    payoutMethod: z.enum(["bank", "paypal", "crypto"], {message: "Invalid payout method"}),
    bankDetails: z.object({
        accountHolderName: z.string().optional(),
        bankName: z.string().optional(),
        accountNumber: z.string().optional(),
        branchName: z.string().optional(),
        swiftCode: z.string().optional(),
    }).optional(),
    paypalEmail: z.string().email({message: "Invalid PayPal email"}).optional(),
    cryptoDetails: z.object({
        walletAddress: z.string().optional(),
        network: z.string().optional(),
    }).optional(),
    reason: z.string().optional(),
});
