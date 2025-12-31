import { z } from "zod";

export const createDonationSchema = z.object({
    campaign: z.string().min(1, {message: "Campaign ID is required"}),
    amount: z.number().positive({message: "Amount must be positive"}),
    method: z.enum(["paypal", "crypto"], {message: "Invalid donation method"}),
    donorEmail: z.string().email({message: "Invalid email address"}),
    transactionId: z.string().optional(),
    payerEmail: z.string().email({message: "Invalid payer email"}).optional(),
    payerName: z.string().optional(),
    payerCountry: z.string().optional(),
    cryptoCurrency: z.enum(["ETH", "USDT", "BTC"]).optional(),
    transactionHash: z.string().optional(),
    network: z.string().optional(),
});

export const updateDonationPaymentSchema = z.object({
    transactionId: z.string().optional(),
    payerEmail: z.string().email({message: "Invalid payer email"}).optional(),
    payerName: z.string().optional(),
    payerCountry: z.string().optional(),
    captureDetails: z.any().optional(),
    transactionHash: z.string().optional(),
});
