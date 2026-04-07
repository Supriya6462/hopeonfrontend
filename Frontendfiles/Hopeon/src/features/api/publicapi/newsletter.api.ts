import { z } from "zod";
import api from "../axios";

const newsletterInputSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
});

const newsletterResponseSchema = z
  .object({
    success: z.boolean().optional(),
    message: z.string().optional(),
  })
  .passthrough();

export type NewsletterInput = z.infer<typeof newsletterInputSchema>;

export const newsletterAPI = {
  subscribe: async (input: NewsletterInput) => {
    const payload = newsletterInputSchema.parse(input);
    const response = await api.post("/api/newsletter/subscribe", payload);
    return newsletterResponseSchema.parse(response.data);
  },
};

export { newsletterInputSchema };
