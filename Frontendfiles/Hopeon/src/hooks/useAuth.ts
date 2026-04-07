import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { authAPI } from "@/features/api/publicapi/public.api";
import type {
  RegisterInput,
  LoginInput,
  AuthResponse,
  OtpResponse,
} from "@/types";
import { OtpPurpose, type OtpPurposeType } from "@/enums";
import { ROUTES } from "@/routes/routes";

const getErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return fallback;
};

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
      let savedToSession = true;

      // Store registration data in session storage for OTP verification
      try {
        sessionStorage.setItem(
          "registrationData",
          JSON.stringify({
            name: variables.name,
            email: variables.email,
            password: variables.password,
            phoneNumber: variables.phoneNumber,
          }),
        );
      } catch (error) {
        console.error("Failed to store registration data:", error);
        savedToSession = false;
      }

      if (!savedToSession) {
        toast.error(
          "Could not save verification session. Continue now before refreshing the page.",
        );
      }

      // Navigate to OTP verification page
      navigate(ROUTES.OTP_VERIFICATION, {
        replace: true,
        state: { email: variables.email },
      });
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Registration failed. Please try again."),
      );
    },
  });
};

/**
 * Custom hook for OTP verification
 * Handles OTP verification and navigation to login
 */
export const useVerifyOtp = () => {
  const navigate = useNavigate();

  return useMutation<
    OtpResponse,
    Error,
    {
      email: string;
      otp: string;
      purpose?: OtpPurposeType;
      onSuccess?: () => void;
    }
  >({
    mutationFn: async ({ email, otp, purpose = OtpPurpose.REGISTER }) => {
      return authAPI.verifyOtp(email, otp, purpose);
    },
    onSuccess: (_data, variables) => {
      if (variables.onSuccess) {
        variables.onSuccess();
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
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "OTP verification failed. Please try again."),
      );
    },
  });
};

/**
 * Custom hook for resending OTP
 * Handles OTP resend logic
 */
export const useResendOtp = () => {
  return useMutation<
    OtpResponse,
    Error,
    { email: string; purpose?: OtpPurposeType; onSuccess?: () => void }
  >({
    mutationFn: async ({ email, purpose = OtpPurpose.REGISTER }) => {
      return authAPI.requestOtp(email, purpose);
    },
    onSuccess: (_data, variables) => {
      if (variables.onSuccess) {
        variables.onSuccess();
        return;
      }

      toast.success("OTP resent to your email");
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Failed to resend OTP. Please try again."),
      );
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
        localStorage.setItem("authToken", data.data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.data.result));
        // Dispatch custom event to notify AuthContext of the change
        window.dispatchEvent(new Event("auth-change"));
      } catch (error) {
        console.error("Failed to store auth data:", error);
      }

      // Navigate based on user role
      const userRole = data.data.result.role;

      switch (userRole) {
        case "admin":
          navigate(ROUTES.ADMIN_DASHBOARD, { replace: true });
          break;
        case "organizer":
          navigate(ROUTES.ORGANIZER_DASHBOARD, { replace: true });
          break;
        case "donor":
        default:
          navigate(ROUTES.HOME, { replace: true });
          break;
      }
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(error, "Login failed. Please check your credentials."),
      );
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.dispatchEvent(new Event("auth-change"));
      navigate(ROUTES.LOGIN, { replace: true });
    }
  };

  return { logout };
};
