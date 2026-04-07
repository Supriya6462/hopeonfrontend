import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useEffect, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import {
  AuthLayout,
  AuthFormHeader,
  PasswordInput,
  LoadingButton,
} from "@/components/auth";
import { resetPasswordSchema } from "@/validations";
import { ROUTES } from "@/routes/routes";
import { authAPI } from "@/features/api";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Reset Password Page Component
 * Allows users to set a new password after OTP verification
 */
export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState =
    (location.state as { email?: string; otpCode?: string } | null) ?? null;

  const flowData = useMemo(() => {
    try {
      const resetData = sessionStorage.getItem("resetPasswordData");
      if (resetData) {
        const parsed = JSON.parse(resetData) as {
          email?: string;
          otpCode?: string;
        };

        if (parsed.email && parsed.otpCode) {
          return {
            email: parsed.email,
            otpCode: parsed.otpCode,
            hasValidData: true,
          };
        }
      }
    } catch (error) {
      console.error("Failed to read reset password data:", error);
    }

    if (locationState?.email && locationState?.otpCode) {
      return {
        email: locationState.email,
        otpCode: locationState.otpCode,
        hasValidData: true,
      };
    }

    return { email: "", otpCode: "", hasValidData: false };
  }, [locationState]);

  useEffect(() => {
    if (!flowData.hasValidData) {
      toast.error("Reset session expired. Please request a new reset code.");
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true });
    }
  }, [flowData.hasValidData, navigate]);

  const resetPasswordMutation = useMutation({
    mutationFn: (payload: {
      email: string;
      password: string;
      otpCode: string;
    }) =>
      authAPI.resetPassword(payload.email, payload.password, payload.otpCode),
    onSuccess: () => {
      toast.success(
        "Password reset successful. Please login with your new password.",
      );
      try {
        sessionStorage.removeItem("resetPasswordData");
      } catch (error) {
        console.error("Failed to clear reset password data:", error);
      }
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: (error: unknown) => {
      const maybeHttpError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        maybeHttpError.response?.data?.message ||
        (error instanceof Error ? error.message : undefined) ||
        "Failed to reset password. Please try again.";
      toast.error(message);
    },
  });

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormData) => {
    if (!flowData.email || !flowData.otpCode) {
      toast.error("Reset session expired. Please request a new reset code.");
      navigate(ROUTES.FORGOT_PASSWORD, { replace: true });
      return;
    }

    resetPasswordMutation.mutate({
      email: flowData.email,
      password: values.password,
      otpCode: flowData.otpCode,
    });
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <AuthFormHeader
          title="Reset Password"
          subtitle="Create a new password for your account"
        />

        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader>
            <AuthFormHeader
              title="Reset Password"
              subtitle="Create a new password for your account"
              showMobileHeader={false}
            />
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {flowData.email ? (
              <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <p className="text-sm text-emerald-800">
                  Resetting password for {flowData.email}
                </p>
              </div>
            ) : null}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          placeholder="Enter new password"
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          placeholder="Confirm new password"
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Info Notice */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-sm text-emerald-800">
                    Password must be at least 8 characters long and include a
                    mix of letters, numbers, and symbols.
                  </p>
                </div>

                {/* Submit Button */}
                <LoadingButton
                  loading={resetPasswordMutation.isPending}
                  loadingText="Resetting password..."
                >
                  <span>Reset Password</span>
                  <ArrowRight className="h-5 w-5" />
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
