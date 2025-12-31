import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, User, ArrowRight, Shield } from "lucide-react";
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
import { useRegister } from "@/hooks";
import { registerSchema } from "@/validations";
import { ROUTES } from "@/routes/routes";

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Register Page Component
 * Handles user registration with form validation and API integration
 */
export default function Register() {
  const registerMutation = useRegister();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormData) => {
    registerMutation.mutate({
      name: values.name,
      email: values.email,
      password: values.password,
      phoneNumber: values.phoneNumber,
    });
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <Card className="bg-white/80 backdrop-blur-sm shadow-2xl border-0">
          <CardHeader>
            <AuthFormHeader
              title="Create Account"
              subtitle="Join our community of changemakers"
              showMobileHeader={false}
            />
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Full Name
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            placeholder="Enter your full name"
                            className="pl-10 h-12 border-2 border-gray-200 focus:border-emerald-500 rounded-xl"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                            placeholder="Enter you email"
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
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
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
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <PasswordInput
                          {...field}
                          placeholder="Confirm your password"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Terms Notice */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                  <p className="text-sm text-emerald-800">
                    By creating an account, you agree to our{" "}
                    <Link
                      to="/terms"
                      className="font-medium underline hover:text-emerald-900"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="font-medium underline hover:text-emerald-900"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>

                {/* Submit Button */}
                <LoadingButton
                  loading={registerMutation.isPending}
                  loadingText="Creating account..."
                  className="group"
                >
                  <span>Create Account</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </LoadingButton>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Already have an account?
                    </span>
                  </div>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <Link
                    to={ROUTES.LOGIN}
                    className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Sign in to your account
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
