"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { googleAuthService } from "@/services/googleAuthService";
import { facebookAuthService } from "@/services/facebookAuthService";
import { useAuthStore } from "@/store/authStore";
import { User } from "@/services/authServices";

type OAuthProvider = "google" | "facebook";

export const useOAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasProcessed, setHasProcessed] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  useEffect(() => {
    if (hasProcessed) return;

    const handleCallback = async () => {
      // Check if we have OAuth parameters in URL
      const code = searchParams.get("code");
      const provider = searchParams.get("provider") as OAuthProvider | null;
      const oauthError = searchParams.get("error");

      // No OAuth callback in URL, nothing to process
      if (!code && !oauthError) {
        setHasProcessed(true);
        return;
      }

      // Handle OAuth errors
      if (oauthError) {
        if (oauthError === "redirect_uri_mismatch") {
          setError(
            "Configuration error: The redirect URI is not properly configured. Please contact support."
          );
        } else if (oauthError === "access_denied") {
          setError(
            `${
              provider
                ? provider.charAt(0).toUpperCase() + provider.slice(1)
                : "OAuth"
            } login was cancelled. Please try again.`
          );
        } else {
          setError(`Authentication failed: ${oauthError}`);
        }
        setHasProcessed(true);
        // Clean URL
        router.replace("/sign-in");
        return;
      }

      // Process OAuth code
      if (code && provider) {
        setIsLoading(true);
        try {
          console.log(`🔐 Processing ${provider} OAuth callback with code`);

          // Exchange code for tokens using the appropriate service
          const authData =
            provider === "facebook"
              ? await facebookAuthService.exchangeOAuthCode(code, "facebook")
              : await googleAuthService.exchangeOAuthCode(code, "google");

          console.log(`✅ ${provider} OAuth exchange successful`);

          // Create user object from auth data
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

          // Save auth state
          setAuth(user, authData.access_token);
          setError(null);

          // Small delay to ensure state is saved
          await new Promise((resolve) => setTimeout(resolve, 100));

          console.log("✅ Redirecting to dashboard");
          // Redirect to dashboard
          router.push("/dashboard");
        } catch (error) {
          console.error(`❌ Failed to exchange ${provider} OAuth code:`, error);

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

          // Redirect back to sign-in on error
          router.replace("/sign-in");
        } finally {
          setIsLoading(false);
          setHasProcessed(true);
        }
      }
    };

    handleCallback();
  }, [hasProcessed, searchParams, router, setAuth]);

  const loginWithGoogle = () => {
    setError(null);
    setIsLoading(true);
    try {
      console.log("🔐 Initiating Google login");
      googleAuthService.initiateGoogleLogin();
    } catch (err) {
      console.error("❌ Failed to initiate Google login:", err);
      setError("Failed to initiate Google login. Please try again.");
      setIsLoading(false);
    }
  };

  const loginWithFacebook = () => {
    setError(null);
    setIsLoading(true);
    try {
      console.log("🔐 Initiating Facebook login");
      facebookAuthService.initiateFacebookLogin();
    } catch (err) {
      console.error("❌ Failed to initiate Facebook login:", err);
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
