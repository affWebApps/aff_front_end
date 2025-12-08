/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/useGoogleAuth.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { googleAuthService } from "@/services/googleAuthService";
import { useAuthStore } from "@/store/authStore";

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  // Handle OAuth callback on component mount
  useEffect(() => {
    const handleCallback = async () => {
      const { code, error: oauthError } =
        googleAuthService.handleGoogleCallback();

      if (oauthError) {
        // Handle specific OAuth errors
        if (oauthError === "redirect_uri_mismatch") {
          setError(
            "Configuration error: The redirect URI is not properly configured. Please contact support."
          );
        } else {
          setError(`Authentication failed: ${oauthError}`);
        }
        return;
      }

      if (code) {
        setIsLoading(true);
        try {
          // Exchange code for token and user data
          const authData = await googleAuthService.exchangeOAuthCode(
            code,
            "google"
          );

          console.log("✅ OAuth exchange successful:", authData);

          // Store auth data
          setAuth(authData.user, authData.access_token);

          // Redirect to intended page or dashboard
          const redirectUrl = googleAuthService.getRedirectUrl();
          router.push(redirectUrl);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (err: any) {
          console.error("Failed to exchange OAuth code:", err);

          // Handle specific error cases
          const errorMessage = err.response?.data?.message || err.message;

          if (err.response?.status === 400) {
            setError(
              "Invalid authentication code. Please try signing in again."
            );
          } else if (err.response?.status === 401) {
            setError("Authentication failed. Please try again.");
          } else {
            setError(
              errorMessage ||
                "Failed to complete Google sign in. Please try again."
            );
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    handleCallback();
  }, [router, setAuth]);

  // Function to initiate Google login
  const loginWithGoogle = () => {
    setError(null);
    setIsLoading(true);
    try {
      googleAuthService.initiateGoogleLogin();
    } catch (err) {
      setError("Failed to initiate Google login. Please try again.");
      setIsLoading(false);
    }
  };

  // Function to clear error
  const clearError = () => setError(null);

  return {
    loginWithGoogle,
    isLoading,
    error,
    clearError,
  };
};
