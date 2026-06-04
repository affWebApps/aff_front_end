/* eslint-disable @typescript-eslint/no-explicit-any */
// services/authServices.ts
import apiClient from "../lib/api/axios";

// ============================================
// TYPES & INTERFACES
// ============================================

import { Project, Bid } from "@/services/projectService";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  phone_number: string | null;
  country: string | null;
  city: string | null;
  role: string;
  is_active: boolean;
  is_verified: boolean;
  last_logout_at: string | null;
  auth_provider: string;
  reviews_received: Review[];
  portfolios: Portfolio[];
  projects: Project[];
  bids: Bid[];
  created_at: string;
  updated_at: string;
  customer_id: string | null;
  vendor_id: string | null;
}

export interface Review {
  id: string;
  reviewer_id: string;
  target_user_id: string;
  target_project_id: string | null;
  target_product_id: string | null;
  target_type: string;
  rating: number;
  comment: string;
}

export interface PortfolioImage {
  id: string;
  portfolio_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface Portfolio {
  id: string;
  user_id: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  Image: PortfolioImage[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  status: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  phoneNumber?: string;
  bio?: string;
  avatarUrl?: string;
  country?: string;
  city?: string;
}

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  /**
   * Register a new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    try {
      console.log("🔄 Registering new user...");

      const response = await apiClient.post<AuthResponse>(
        "/auth/register",
        data
      );

      console.log("✅ Registration successful");
      return response.data;
    } catch (error: any) {
      console.error("❌ Registration failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      console.log("🔄 Logging in user...");

      const response = await apiClient.post<AuthResponse>(
        "/auth/login",
        credentials
      );

      console.log("✅ Login successful");
      return response.data;
    } catch (error: any) {
      console.error("❌ Login failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  /**
   * Fetch current user details using access token
   */
  getCurrentUser: async (token: string): Promise<User> => {
    try {
      console.log("🔄 Fetching current user from /auth/users/me");

      const response = await apiClient.get<User>("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ User details fetched successfully");
      return response.data;
    } catch (error: any) {
      console.error("❌ Failed to fetch user details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  /**
   * Logout user (call backend logout endpoint if needed)
   */
  logout: async (token: string): Promise<void> => {
    try {
      await apiClient.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Backend logout successful");
    } catch (error) {
      console.error("Backend logout error:", error);
      // Still allow local logout even if API call fails
    }
  },

  /**
   * Change user password
   */
  changePassword: async (
    data: ChangePasswordData,
    token: string
  ): Promise<ChangePasswordResponse> => {
    try {
      console.log("🔄 Changing password...");

      const response = await apiClient.post<ChangePasswordResponse>(
        "/auth/change-password",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("✅ Password changed successfully");
      return response.data;
    } catch (error: any) {
      console.error("❌ Password change failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  /**
   * Request password reset
   */
  requestPasswordReset: async (email: string): Promise<void> => {
    try {
      console.log("🔄 Requesting password reset...");

      await apiClient.post("/auth/forgot-password", { email });

      console.log("✅ Password reset email sent");
    } catch (error: any) {
      console.error("❌ Password reset request failed:", error);
      throw error;
    }
  },

  /**
   * Reset password with token
   */
  resetPassword: async (token: string, newPassword: string): Promise<void> => {
    try {
      console.log("🔄 Resetting password...");

      await apiClient.post("/auth/reset-password", {
        token,
        password: newPassword,
      });

      console.log("✅ Password reset successful");
    } catch (error: any) {
      console.error("❌ Password reset failed:", error);
      throw error;
    }
  },

  /**
   * Verify email with token — returns access_token (and optionally user) from the backend
   */
  verifyEmail: async (token: string): Promise<{ access_token: string; user?: User }> => {
    try {
      console.log("🔄 Verifying email...");

      const response = await apiClient.post<{ access_token: string; user?: User }>(
        "/auth/verify-email",
        { token }
      );

      console.log("✅ Email verified successfully");
      return response.data;
    } catch (error: any) {
      console.error("❌ Email verification failed:", error);
      throw error;
    }
  },

  resendVerification: async (email: string): Promise<void> => {
    await apiClient.post("/auth/resend-verification", { email });
  },

  /**
   * Update user profile
   */
  updateProfile: async (
    data: UpdateProfileData,
    token: string
  ): Promise<User> => {
    try {
      console.log("🔄 Updating user profile...");

      const response = await apiClient.patch<User>("/users/me", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("✅ Profile updated successfully");
      return response.data;
    } catch (error: any) {
      console.error("❌ Profile update failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },
};
