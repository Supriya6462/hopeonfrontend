import { z } from "zod";

export const createCampaignSchema = z.object({
    title: z.string().min(3, {message: "Title must be at least 3 characters"}),
    description: z.string().min(10, {message: "Description must be at least 10 characters"}).optional(),
    images: z.array(z.string().url({message: "Invalid image URL"})).optional(),
    target: z.number().positive({message: "Target must be a positive number"}),
});

export const updateCampaignSchema = z.object({
    title: z.string().min(3, {message: "Title must be at least 3 characters"}).optional(),
    description: z.string().min(10, {message: "Description must be at least 10 characters"}).optional(),
    images: z.array(z.string().url({message: "Invalid image URL"})).optional(),
    target: z.number().positive({message: "Target must be a positive number"}).optional(),
});