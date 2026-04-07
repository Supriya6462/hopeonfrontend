import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ArrowLeft, Mail } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AuthLayout, AuthFormHeader, LoadingButton } from "@/components/auth";
import { useVerifyOtp, useResendOtp } from "@/hooks";
import { verifyOtpSchema } from "@/validations";
import { ROUTES } from "@/routes/routes";
import { OtpPurpose, type OtpPurposeType } from "@/enums";

type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

/**
 * Verify OTP Page Component
 * Allows users to verify their email with OTP code
 */
export default function VerifyOtp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState<string>("");
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();
  const purposeParam = searchParams.get("purpose");
  const purpose: OtpPurposeType =
    purposeParam === OtpPurpose.FORGET_PASSWORD
      ? OtpPurpose.FORGET_PASSWORD
      : OtpPurpose.REGISTER;

  const form = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Get flow data from session storage on mount
  useEffect(() => {
    try {
      const storageKey =
        purpose === OtpPurpose.FORGET_PASSWORD
          ? "resetPasswordData"
          : "registrationData";
      const rawData = sessionStorage.getItem(storageKey);

      if (rawData) {
        const data = JSON.parse(rawData);
        setEmail(data.email);
      } else {
        navigate(
          purpose === OtpPurpose.FORGET_PASSWORD
            ? ROUTES.FORGOT_PASSWORD
            : ROUTES.REGISTER,
          { replace: true },
        );
      }
    } catch (error) {
      console.error("Failed to retrieve OTP flow data:", error);
      navigate(
        purpose === OtpPurpose.FORGET_PASSWORD
          ? ROUTES.FORGOT_PASSWORD
          : ROUTES.REGISTER,
        { replace: true },
      );
    }
  }, [navigate, purpose]);

  const onSubmit = (values: VerifyOtpFormData) => {
    if (!email) {
      return;
    }

    verifyOtpMutation.mutate({
      email,
      otp: values.otp,
      purpose,
      onSuccess: () => {
        if (purpose === OtpPurpose.FORGET_PASSWORD) {
          try {
            sessionStorage.setItem(
              "resetPasswordData",
              JSON.stringify({
                email,
                purpose,
                otpCode: values.otp,
              }),
            );
          } catch (error) {
            console.error("Failed to store reset verification data:", error);
          }

          toast.success("Code verified. You can now reset your password.");
          navigate(ROUTES.RESET_PASSWORD, { replace: true });
          return;
        }

        toast.success("Email verified successfully! Please login.");
        try {
          sessionStorage.removeItem("registrationData");
        } catch (error) {
          console.error("Failed to clear registration data:", error);
        }
        navigate(ROUTES.LOGIN, { replace: true });
      },
    });
  };

  const handleResendOtp = () => {
    if (!email) {
      return;
    }
    resendOtpMutation.mutate({
      email,
      purpose,
      onSuccess: () => {
        toast.success("Verification code resent");
      },
    });
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <AuthFormHeader
          title={
            purpose === OtpPurpose.FORGET_PASSWORD
              ? "Verify Reset Code"
              : "Verify Your Email"
          }
          subtitle="Enter the code sent to your email"
        />

        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader>
            <AuthFormHeader
              title={
                purpose === OtpPurpose.FORGET_PASSWORD
                  ? "Verify Reset Code"
                  : "Verify Your Email"
              }
              subtitle="Enter the code sent to your email"
              showMobileHeader={false}
            />
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* Display Email */}
            {email && (
              <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-emerald-800">
                  <Mail className="h-4 w-4" />
                  <span>
                    Code sent to: <strong>{email}</strong>
                  </span>
                </div>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* OTP Field */}
                <FormField
                  control={form.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Verification Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter 6-digit code"
                          maxLength={6}
                          className="h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl text-center text-2xl tracking-widest"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Info Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    Didn't receive the code?{" "}
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={resendOtpMutation.isPending}
                      className="font-medium underline hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendOtpMutation.isPending
                        ? "Sending..."
                        : "Resend Code"}
                    </button>
                  </p>
                </div>

                {/* Submit Button */}
                <LoadingButton
                  loading={verifyOtpMutation.isPending}
                  loadingText="Verifying..."
                  className="group"
                >
                  <span>
                    {purpose === OtpPurpose.FORGET_PASSWORD
                      ? "Verify Code"
                      : "Verify Email"}
                  </span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </LoadingButton>

                {/* Back to Login */}
                <div className="text-center">
                  <Link
                    to={ROUTES.LOGIN}
                    className="inline-flex items-center gap-2 font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AuthLayout>
  );
}
