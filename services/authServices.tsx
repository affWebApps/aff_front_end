// ==================== INTERFACES ====================

import apiClient from "../lib/api/axios";

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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt?: string;
  updatedAt?: string;
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

// ==================== AUTH SERVICE ====================

export const authService = {
  /**
   * Register a new user
   * POST /auth/register
   */
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      console.log("📝 Registering user with data:", {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });

      const response = await apiClient.post<RegisterResponse>(
        "/auth/register",
        data
      );

      console.log("✅ Registration successful:", response.data);
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
   * Login user
   * POST /auth/login
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
   * Get current authenticated user
   * GET /users/me (FIXED - was /auth/me)
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
    } catch (error: any) {
      console.error("❌ Get current user failed:", {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
      });
      throw error;
    }
  },

  /**
   * Verify email with token
   * POST /auth/verify-email
   */
  verifyEmail: async (token: string): Promise<any> => {
    try {
      console.log("✉️ Verifying email with token...");

      const response = await apiClient.post("/auth/verify-email", { token });

      console.log("✅ Email verified successfully");
      return response.data;
    } catch (error: any) {
      console.error("❌ Email verification failed:", {
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  /**
   * Request password reset
   * POST /auth/forgot-password
   */
  forgotPassword: async (email: string): Promise<any> => {
    try {
      console.log("🔑 Requesting password reset for:", email);

      const response = await apiClient.post("/auth/forgot-password", { email });

      console.log("✅ Password reset email sent");
      return response.data;
    } catch (error: any) {
      console.error("❌ Forgot password failed:", {
        message: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },

  /**
   * Reset password with token
   * POST /auth/reset-password
   */
  resetPassword: async (token: string, newPassword: string): Promise<any> => {
    try {
      console.log("🔐 Resetting password...");

      const response = await apiClient.post("/auth/reset-password", {
        token,
        password: newPassword,
      });

      console.log("✅ Password reset successful");
      return response.data;
    } catch (error: any) {
      console.error("❌ Reset password failed:", {
        message: error.message,
        response: error.response?.data,
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
    } catch (error: any) {
      console.error("❌ Logout failed:", {
        message: error.message,
        response: error.response?.data,
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
    } catch (error: any) {
      console.error("❌ Token refresh failed:", error);
      throw error;
    }
  },
};
