export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  phoneNumber?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "donor" | "organizer" | "admin";
  phoneNumber?: string;
  image?: string;
  isOrganizerApproved: boolean;
  isOrganizerRevoked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ProfileResponse {
  success: boolean;
  data: User;
}

export interface OtpResponse {
  success: boolean;
  data: {
    message: string;
    otpCode?: string;
  };
}
