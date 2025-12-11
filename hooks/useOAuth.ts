// hooks/useOAuth.ts
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { googleAuthService } from "@/services/googleAuthService";
import { facebookAuthService } from "@/services/facebookAuthService";
import { authService } from "@/services/authServices";
import { useAuthStore } from "@/store/authStore";

type OAuthProvider = "google" | "facebook";

export const useOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);
  const router = useRouter();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (hasProcessed) return;

    const handleCallback = async () => {
      // Determine which provider is being used
      const provider = (
        typeof window !== "undefined"
          ? sessionStorage.getItem("oauth_provider")
          : null
      ) as OAuthProvider | null;

      if (!provider) {
        setHasProcessed(true);
        return;
      }

      const { code, error: oauthError } =
        provider === "facebook"
          ? facebookAuthService.handleFacebookCallback()
          : googleAuthService.handleGoogleCallback();

      if (oauthError) {
        if (oauthError === "redirect_uri_mismatch") {
          setError(
            "Configuration error: The redirect URI is not properly configured. Please contact support."
          );
        } else if (oauthError === "access_denied") {
          setError(
            `${
              provider.charAt(0).toUpperCase() + provider.slice(1)
            } login was cancelled. Please try again.`
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
          console.log(`🔄 Starting ${provider} OAuth exchange...`);

          // Step 1: Exchange OAuth code for access token
          const authData =
            provider === "facebook"
              ? await facebookAuthService.exchangeOAuthCode(code, "facebook")
              : await googleAuthService.exchangeOAuthCode(code, "google");

          console.log(`✅ ${provider} OAuth exchange successful:`, authData);

          // Step 2: Fetch full user details using the access token
          console.log("🔄 Fetching user details from /auth/users/me...");
          const fullUserData = await authService.getCurrentUser(
            authData.access_token
          );

          console.log("✅ User details fetched:", fullUserData);

          // Step 3: Store auth data in Zustand store (which persists to localStorage)
          setAuth(fullUserData, authData.access_token);
          setError(null);

          // Small delay to ensure state is persisted
          await new Promise((resolve) => setTimeout(resolve, 100));

          // Step 4: Clean up and redirect
          const redirectUrl =
            provider === "facebook"
              ? facebookAuthService.getRedirectUrl()
              : googleAuthService.getRedirectUrl();

          console.log("✅ Redirecting to:", redirectUrl);
          router.push(redirectUrl);
        } catch (error) {
          console.error(`❌ Failed to complete ${provider} OAuth:`, error);

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
                  `Failed to complete ${provider} sign in. Please try again.`
              );
            }
          } else {
            setError(
              errorMessage ||
                `Failed to complete ${provider} sign in. Please try again.`
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
    } catch {
      setError("Failed to initiate Google login. Please try again.");
      setIsLoading(false);
    }
  };

  const loginWithFacebook = () => {
    setError(null);
    setIsLoading(true);
    try {
      facebookAuthService.initiateFacebookLogin();
    } catch {
      setError("Failed to initiate Facebook login. Please try again.");
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return {
    loginWithGoogle,
    loginWithFacebook,
    isLoading,
    error,
    clearError,
  };
};
