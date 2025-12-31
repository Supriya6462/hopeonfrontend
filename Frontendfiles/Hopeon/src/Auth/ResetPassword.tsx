import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AuthLayout, AuthFormHeader, PasswordInput, LoadingButton } from "@/components/auth";
import { resetPasswordSchema } from "@/validations";
import { ROUTES } from "@/routes/routes";

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Reset Password Page Component
 * Allows users to set a new password after OTP verification
 */
export default function ResetPassword() {
  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: ResetPasswordFormData) => {
    // TODO: Implement reset password logic
    console.log("Reset password:", values);
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
                        <PasswordInput {...field} placeholder="Enter new password" />
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
                <LoadingButton loading={false} loadingText="Resetting password...">
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
