import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
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
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AuthLayout, AuthFormHeader, LoadingButton } from "@/components/auth";
import { forgotPasswordSchema } from "@/validations";
import { ROUTES } from "@/routes/routes";
import { authAPI } from "@/features/api";
import { OtpPurpose } from "@/enums";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot Password Page Component
 * Allows users to request a password reset OTP
 */
export default function ForgetPassword() {
  const navigate = useNavigate();

  const requestOtpMutation = useMutation({
    mutationFn: (email: string) =>
      authAPI.requestOtp(email, OtpPurpose.FORGET_PASSWORD),
    onSuccess: (_data, email) => {
      toast.success("Reset code sent to your email");
      let savedToSession = true;

      try {
        sessionStorage.setItem(
          "resetPasswordData",
          JSON.stringify({
            email,
            purpose: OtpPurpose.FORGET_PASSWORD,
          }),
        );
      } catch (error) {
        console.error("Failed to store reset password data:", error);
        savedToSession = false;
      }

      if (!savedToSession) {
        toast.error(
          "Could not save reset session. Continue now before refreshing this page.",
        );
      }

      navigate(
        `${ROUTES.OTP_VERIFICATION}?purpose=${OtpPurpose.FORGET_PASSWORD}`,
        {
          replace: true,
          state: { email },
        },
      );
    },
    onError: (error: unknown) => {
      const maybeHttpError = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const message =
        maybeHttpError.response?.data?.message ||
        (error instanceof Error ? error.message : undefined) ||
        "Failed to send reset code. Please try again.";
      toast.error(message);
    },
  });

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormData) => {
    requestOtpMutation.mutate(values.email);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader>
            <AuthFormHeader
              title="Forgot Password"
              subtitle="Enter your email to receive a reset code"
              showMobileHeader={false}
            />
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            type="email"
                            placeholder="you@example.com"
                            className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Info Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p className="text-sm text-blue-800">
                    We'll send a verification code to your email address to
                    reset your password.
                  </p>
                </div>

                {/* Submit Button */}
                <LoadingButton
                  loading={requestOtpMutation.isPending}
                  loadingText="Sending code..."
                >
                  <span>Send Reset Code</span>
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
