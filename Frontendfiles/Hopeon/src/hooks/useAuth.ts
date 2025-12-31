import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authAPI } from "@/features/api/publicapi/public.api";
import type { RegisterInput, LoginInput, AuthResponse } from "@/types";
import { OtpPurpose } from "@/enums";
import { ROUTES } from "@/routes/routes";

/**
 * Custom hook for user registration
 * Handles registration logic, OTP sending, and navigation
 */
export const useRegister = () => {
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, RegisterInput>({
    mutationFn: authAPI.register,
    onSuccess: (_data, variables) => {
      toast.success("OTP sent to your email");
      
      // Store registration data in session storage for OTP verification
      try {
        sessionStorage.setItem(
          "registrationData",
          JSON.stringify({
            name: variables.name,
            email: variables.email,
            password: variables.password,
          })
        );
      } catch (error) {
        console.error("Failed to store registration data:", error);
      }
      
      // Navigate to OTP verification page
      navigate(ROUTES.OTP_VERIFICATION, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed. Please try again.");
    },
  });
};

/**
 * Custom hook for OTP verification
 * Handles OTP verification and navigation to login
 */
export const useVerifyOtp = () => {
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, { email: string; otp: string }>({
    mutationFn: async ({ email, otp }) => {
      return authAPI.verifyOtp(email, otp, OtpPurpose.REGISTER);
    },
    onSuccess: () => {
      toast.success("Email verified successfully! Please login.");
      
      // Clear registration data from session storage
      try {
        sessionStorage.removeItem("registrationData");
      } catch (error) {
        console.error("Failed to clear registration data:", error);
      }
      
      // Navigate to login page
      navigate(ROUTES.LOGIN, { replace: true });
    },
    onError: (error) => {
      toast.error(error.message || "OTP verification failed. Please try again.");
    },
  });
};

/**
 * Custom hook for resending OTP
 * Handles OTP resend logic
 */
export const useResendOtp = () => {
  return useMutation<any, Error, string>({
    mutationFn: async (email: string) => {
      return authAPI.requestOtp(email, OtpPurpose.REGISTER);
    },
    onSuccess: () => {
      toast.success("OTP resent to your email");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to resend OTP. Please try again.");
    },
  });
};

/**
 * Custom hook for user login
 * Handles login logic, token storage, and navigation
 */
export const useLogin = () => {
  const navigate = useNavigate();

  return useMutation<AuthResponse, Error, LoginInput>({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      toast.success("Login successful!");
      
      // Store authentication token
      try {
        localStorage.setItem("authToken", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data.user));
      } catch (error) {
        console.error("Failed to store auth data:", error);
      }
      
      // Navigate based on user role
      const userRole = data.data.user.role;
      
      switch (userRole) {
        case "admin":
          navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
          break;
        case "organizer":
          navigate(ROUTES.ORGANIZER_DASHBOARD, { replace: true });
          break;
        case "donor":
        default:
          navigate(ROUTES.DonorHomepage, { replace: true });
          break;
      }
    },
    onError: (error) => {
      toast.error(error.message || "Login failed. Please check your credentials.");
    },
  });
};
