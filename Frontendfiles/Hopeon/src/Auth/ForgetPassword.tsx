import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, Shield, ArrowLeft } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { AuthLayout, AuthFormHeader, LoadingButton } from "@/components/auth";
import { forgotPasswordSchema } from "@/validations";
import { ROUTES } from "@/routes/routes";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Forgot Password Page Component
 * Allows users to request a password reset OTP
 */
export default function ForgetPassword() {
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: ForgotPasswordFormData) => {
    // TODO: Implement forgot password logic
    console.log("Forgot password:", values);
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
                <LoadingButton loading={false} loadingText="Sending code...">
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
