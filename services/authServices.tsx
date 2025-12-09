// ==================== INTERFACES ====================

import apiClient from "../lib/api/axios";
import { AxiosError } from "axios";

// Request body for registration (API expects camelCase)
export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface RegisterResponse {
  status: string; // "verification_email_sent"
}

// API Error Response Type
export interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  [key: string]: unknown;
}

// Review Type
export interface Review {
  id: string;
  rating: number;
  comment?: string;
  review_text?: string;
  reviewer_name?: string;
  created_at?: string;
}

// Portfolio Type
export interface Portfolio {
  id: string;
  title: string;
  description?: string;
  [key: string]: unknown;
}

// Project Type
export interface Project {
  id: string;
  title: string;
  [key: string]: unknown;
}

// Bid Type
export interface Bid {
  id: string;
  amount: number;
  [key: string]: unknown;
}

// User Type - API returns snake_case
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string | null;
  avatar_url: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  reviews_received: Review[];
  portfolios: Portfolio[];
  projects: Project[];
  bids: Bid[];
  created_at: string;
  updated_at: string;
}

export interface VerifyEmailData {
  token: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface VerifyEmailResponse {
  message: string;
  status: string;
}

export interface ForgotPasswordResponse {
  message: string;
  status: string;
}

export interface ResetPasswordResponse {
  message: string;
  status: string;
}

// ==================== AUTH SERVICE ====================

export const authService = {
  /**
   * Register a new user
   * POST /auth/register
   * Expects: { email, password, firstName, lastName } (camelCase)
   */
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      console.log("📝 Registering user with data:", {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      // Send data as-is (camelCase as API expects)
      const response = await apiClient.post<RegisterResponse>(
        "/auth/register",
        data
      );

      console.log("✅ Registration successful:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Registration failed:", {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });
      throw error;
    }
  },

  /**
   * Login user
   * POST /auth/login
   * Expects: { email, password }
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      console.log("🔐 Logging in user:", credentials.email);

      const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        credentials
      );

      console.log("✅ Login successful");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Login failed:", {
        message: axiosError.message,
        response: axiosError.response?.data,
        status: axiosError.response?.status,
      });
      throw error;
    }
  },

  /**
   * Get current authenticated user
   * GET /users/me
   * Returns: User object with snake_case fields
   */
  getCurrentUser: async (token?: string): Promise<User> => {
    try {
      console.log("👤 Fetching current user...");

      // If token is provided, use it directly in this request
      const config = token
        ? {
            headers: { Authorization: `Bearer ${token}` },
          }
        : {};

      const response = await apiClient.get<User>("/users/me", config);

      console.log("✅ Current user fetched:", response.data.email);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Get current user failed:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        url: axiosError.config?.url,
      });
      throw error;
    }
  },

  /**
   * Verify email with token
   * POST /auth/verify-email
   */
  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    try {
      console.log("✉️ Verifying email with token...");

      const response = await apiClient.post<VerifyEmailResponse>(
        "/auth/verify-email",
        { token }
      );

      console.log("✅ Email verified successfully");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Email verification failed:", {
        message: axiosError.message,
        response: axiosError.response?.data,
      });
      throw error;
    }
  },

  /**
   * Request password reset
   * POST /auth/forgot-password
   */
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    try {
      console.log("🔑 Requesting password reset for:", email);

      const response = await apiClient.post<ForgotPasswordResponse>(
        "/auth/forgot-password",
        { email }
      );

      console.log("✅ Password reset email sent");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Forgot password failed:", {
        message: axiosError.message,
        response: axiosError.response?.data,
      });
      throw error;
    }
  },

  /**
   * Reset password with token
   * POST /auth/reset-password
   */
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ResetPasswordResponse> => {
    try {
      console.log("🔐 Resetting password...");

      const response = await apiClient.post<ResetPasswordResponse>(
        "/auth/reset-password",
        {
          token,
          password: newPassword,
        }
      );

      console.log("✅ Password reset successful");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Reset password failed:", {
        message: axiosError.message,
        response: axiosError.response?.data,
      });
      throw error;
    }
  },

  /**
   * Logout user (if you have a backend logout endpoint)
   * POST /auth/logout
   */
  logout: async (): Promise<void> => {
    try {
      console.log("🚪 Logging out...");

      await apiClient.post("/auth/logout");

      console.log("✅ Logout successful");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Logout failed:", {
        message: axiosError.message,
        response: axiosError.response?.data,
      });
      // Don't throw - we still want to clear local state even if API fails
    }
  },

  /**
   * Refresh access token (if you have this endpoint)
   * POST /auth/refresh
   */
  refreshToken: async (refreshToken: string): Promise<LoginResponse> => {
    try {
      console.log("🔄 Refreshing token...");

      const response = await apiClient.post<LoginResponse>("/auth/refresh", {
        refresh_token: refreshToken,
      });

      console.log("✅ Token refreshed");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Token refresh failed:", axiosError);
      throw error;
    }
  },
};
