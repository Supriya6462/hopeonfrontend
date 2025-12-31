import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(2, {message: "Name must be at least 2 characters"}),
    email: z.string().email({message: "Invalid email address"}),
    phoneNumber: z.string().optional(),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
    confirmPassword: z.string().min(8, {message: "Please confirm your password"}),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});

export const loginSchema = z.object({
    email: z.string().email({message: "Please enter a valid email address"}),
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
});

export const forgotPasswordSchema = z.object({
    email: z.string().email({message: "Please enter a valid email address"}),
});

export const verifyOtpSchema = z.object({
    otp: z.string().length(6, {message: "OTP must be 6 digits"}),
});

export const resetPasswordSchema = z.object({
    password: z.string().min(8, {message: "Password must be at least 8 characters"}),
    confirmPassword: z.string().min(8, {message: "Please confirm your password"}),
}).refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
});