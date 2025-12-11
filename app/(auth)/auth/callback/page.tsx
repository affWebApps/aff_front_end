"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authServices";
import { googleAuthService } from "@/services/googleAuthService";
import { facebookAuthService } from "@/services/facebookAuthService";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get OAuth parameters from URL
        const code = searchParams.get("code");
        const oauthError = searchParams.get("error");

        // Get provider from session storage (set by the service before redirect)
        const provider =
          (typeof window !== "undefined"
            ? sessionStorage.getItem("oauth_provider")
            : null) || "google";

        console.log("🔍 Callback URL parameters:", {
          hasCode: !!code,
          error: oauthError,
          provider,
        });

        // Check for OAuth errors
        if (oauthError) {
          console.error("❌ OAuth error from URL:", oauthError);

          let errorMessage = "Authentication was cancelled or failed.";
          if (oauthError === "access_denied") {
            errorMessage = "You cancelled the login process.";
          } else if (oauthError === "redirect_uri_mismatch") {
            errorMessage = "Configuration error. Please contact support.";
          }

          setError(errorMessage);
          setIsProcessing(false);
          setTimeout(() => router.push("/sign-in"), 3000);
          return;
        }

        // Validate code exists
        if (!code) {
          console.error("❌ No authorization code in URL");
          setError("Invalid authentication response. No code provided.");
          setIsProcessing(false);
          setTimeout(() => router.push("/sign-in"), 3000);
          return;
        }

        console.log(`🔄 Processing ${provider} OAuth callback...`);

        // Step 1: Exchange code for access token
        const authServiceToUse =
          provider === "facebook" ? facebookAuthService : googleAuthService;

        const authData = await authServiceToUse.exchangeOAuthCode(
          code,
          provider
        );

        if (!authData.access_token) {
          throw new Error("No access token received from oauth-exchange");
        }

        console.log("✅ OAuth exchange successful");

        // Step 2: Fetch full user data
        console.log("🔄 Fetching user details...");
        const userData = await authService.getCurrentUser(
          authData.access_token
        );

        if (!userData) {
          throw new Error("Failed to fetch user data");
        }

        console.log("✅ User data fetched:", {
          userId: userData.id,
          email: userData.email,
        });

        // Step 3: Store in Zustand (persists to localStorage)
        setAuth(userData, authData.access_token);

        console.log("✅ Auth stored successfully");

        // Small delay to ensure persistence
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Step 4: Clean up and redirect
        const redirectUrl = authServiceToUse.getRedirectUrl();

        console.log("🔄 Redirecting to:", redirectUrl);
        router.push(redirectUrl);
      } catch (err: any) {
        console.error("❌ Callback error:", err);

        // Handle specific error cases
        let errorMessage = "An error occurred during authentication.";

        if (err.response?.status === 400) {
          errorMessage =
            "Invalid authentication code. Please try signing in again.";
        } else if (err.response?.status === 401) {
          errorMessage = "Authentication failed. Please try again.";
        } else if (err.response?.status === 409) {
          errorMessage = "An account with this email already exists.";
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        } else if (err.message) {
          errorMessage = err.message;
        }

        setError(errorMessage);
        setIsProcessing(false);

        // Redirect after showing error
        setTimeout(() => router.push("/sign-in"), 3000);
      }
    };

    handleCallback();
  }, [searchParams, router, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8ef]">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {isProcessing && !error ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5C4033]"></div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Completing Sign In...
              </h2>
              <p className="text-gray-600">
                Please wait while we set up your account.
              </p>
            </>
          ) : error ? (
            <>
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-4">
                  <svg
                    className="h-12 w-12 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <p className="text-sm text-gray-500">
                Redirecting to sign in page...
              </p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fff8ef]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#5C4033]"></div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
