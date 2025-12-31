import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, ArrowRight, ArrowLeft, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useEffect, useState } from "react";
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

type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;

/**
 * Verify OTP Page Component
 * Allows users to verify their email with OTP code
 */
export default function VerifyOtp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const verifyOtpMutation = useVerifyOtp();
  const resendOtpMutation = useResendOtp();

  const form = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  // Get email from session storage on mount
  useEffect(() => {
    try {
      const registrationData = sessionStorage.getItem("registrationData");
      if (registrationData) {
        const data = JSON.parse(registrationData);
        setEmail(data.email);
      } else {
        // No registration data found, redirect to register
        navigate(ROUTES.REGISTER, { replace: true });
      }
    } catch (error) {
      console.error("Failed to retrieve registration data:", error);
      navigate(ROUTES.REGISTER, { replace: true });
    }
  }, [navigate]);

  const onSubmit = (values: VerifyOtpFormData) => {
    if (!email) {
      return;
    }
    verifyOtpMutation.mutate({ email, otp: values.otp });
  };

  const handleResendOtp = () => {
    if (!email) {
      return;
    }
    resendOtpMutation.mutate(email);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <AuthFormHeader
          title="Verify Your Email"
          subtitle="Enter the code sent to your email"
        />

        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader>
            <AuthFormHeader
              title="Verify Your Email"
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
                      {resendOtpMutation.isPending ? "Sending..." : "Resend Code"}
                    </button>
                  </p>
                </div>

                {/* Submit Button */}
                <LoadingButton
                  loading={verifyOtpMutation.isPending}
                  loadingText="Verifying..."
                  className="group"
                >
                  <span>Verify Email</span>
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
