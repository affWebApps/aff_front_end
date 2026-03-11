// hooks/useGoogleAuth.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { googleAuthService } from "@/services/googleAuthService";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/services/authServices";

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (hasProcessed) return;

    const handleCallback = async () => {
      const { code, error: oauthError } =
        googleAuthService.handleGoogleCallback();

      if (oauthError) {
        if (oauthError === "redirect_uri_mismatch") {
          setError(
            "Configuration error: The redirect URI is not properly configured. Please contact support."
          );
        } else {
          setError(`Authentication failed: ${oauthError}`);
        }
        setHasProcessed(true);
        return;
      }

      if (code) {
        setIsLoading(true);
        try {
          const authData = await googleAuthService.exchangeOAuthCode(
            code,
            "google"
          );

          console.log("✅ OAuth exchange successful:", authData);

          const user: User = {
            id: authData.user.id,
            email: authData.user.email,
            first_name: authData.user.firstName,
            last_name: authData.user.lastName,
            bio: null,
            display_name: `${authData.user.firstName} ${authData.user.lastName}`,
            avatar_url: null,
            is_verified: true,
            is_active: true,
            role: "user",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            reviews_received: [],
            portfolios: [],
            projects: [],
            bids: [],
          };

          setAuth(user, authData.access_token);
          setError(null);

          await new Promise((resolve) => setTimeout(resolve, 100));

          const redirectUrl = googleAuthService.getRedirectUrl();
          router.push(redirectUrl);
        } catch (error) {
          console.error("Failed to exchange OAuth code:", error);

          const errorMessage =
            error instanceof Error
              ? error.message
              : "An unexpected error occurred";

          if (
            typeof error === "object" &&
            error !== null &&
            "response" in error
          ) {
            const axiosError = error as {
              response?: { status?: number; data?: { message?: string } };
            };

            if (axiosError.response?.status === 400) {
              setError(
                "Invalid authentication code. Please try signing in again."
              );
            } else if (axiosError.response?.status === 401) {
              setError("Authentication failed. Please try again.");
            } else {
              setError(
                axiosError.response?.data?.message ||
                  errorMessage ||
                  "Failed to complete Google sign in. Please try again."
              );
            }
          } else {
            setError(
              errorMessage ||
                "Failed to complete Google sign in. Please try again."
            );
          }
        } finally {
          setIsLoading(false);
          setHasProcessed(true);
        }
      }
    };

    handleCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const loginWithGoogle = () => {
    setError(null);
    setIsLoading(true);
    try {
      googleAuthService.initiateGoogleLogin();
      // Note: isLoading remains true during redirect - this is intentional
    } catch {
      setError("Failed to initiate Google login. Please try again.");
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loginWithGoogle,
    isLoading,
    error,
    clearError,
  };
};
