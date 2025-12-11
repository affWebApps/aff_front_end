"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  authService,
  LoginCredentials,
  RegisterData,
} from "@/services/authServices";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setAuth, logout: storeLogout } = useAuthStore();

  /**
   * Register a new user
   */
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.register(data);

      // Store auth data
      setAuth(response.user, response.access_token);

      // Redirect to dashboard
      router.push("/dashboard");

      return response;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login with email and password
   */
  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);

      // Store auth data
      setAuth(response.user, response.access_token);

      // Redirect to dashboard
      router.push("/dashboard");

      return response;
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Login failed. Please check your credentials.";

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout user
   */
  const logout = async () => {
    setIsLoading(true);

    try {
      await storeLogout();
      router.push("/sign-in");
    } catch (err) {
      console.error("Logout error:", err);
      // Still redirect to sign-in even if there's an error
      router.push("/sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Request password reset
   */
  const requestPasswordReset = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.requestPasswordReset(email);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to request password reset.";

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset password with token
   */
  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword(token, newPassword);
      router.push("/sign-in");
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reset password.";

      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    register,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    isLoading,
    error,
    clearError,
  };
};
