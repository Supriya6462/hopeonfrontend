import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, ArrowRight, Shield } from "lucide-react";
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
import { AuthLayout, AuthFormHeader, PasswordInput, LoadingButton } from "@/components/auth";
import { useLogin } from "@/hooks";
import { loginSchema } from "@/validations";
import { ROUTES } from "@/routes/routes";

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login Page Component
 * Handles user authentication with form validation and API integration
 */
export default function Login() {
  const loginMutation = useLogin();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormData) => {
    loginMutation.mutate(values);
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">

        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader>
            <AuthFormHeader
              title="Welcome Back"
              subtitle="Sign in to continue making a difference"
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

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between mb-2">
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Password
                        </FormLabel>
                      </div>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                      <Link
                          to={ROUTES.FORGOT_PASSWORD}
                          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors text-right"
                        >
                          Forgot password?
                        </Link>
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <LoadingButton
                  loading={loginMutation.isPending}
                  loadingText="Signing in..."
                  className="group"
                >
                  <span>Sign In</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </LoadingButton>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Don't have an account?
                    </span>
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <Link
                    to={ROUTES.REGISTER}
                    className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Create a new account
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
