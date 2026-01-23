"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authServices";
import { facebookAuthService } from "@/services/facebookAuthService";
import { googleAuthService } from "@/services/googleAuthService";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const errorParam = params.get("error");

        const provider =
          sessionStorage.getItem("oauth_provider") || params.get("provider");

        console.log("🔄 OAuth callback received", {
          code: !!code,
          errorParam,
          provider,
        });

        if (errorParam) {
          const errorDescription =
            params.get("error_description") ||
            params.get("error_reason") ||
            errorParam;

          console.error("❌ OAuth error:", errorDescription);
          setError(errorDescription);

          sessionStorage.removeItem("oauth_provider");
          sessionStorage.removeItem("pre_oauth_url");

          setTimeout(() => {
            router.push("/sign-in");
          }, 3000);
          return;
        }

        if (!code) {
          console.error("❌ No OAuth code received");
          setError("Authentication failed - no code received");

          sessionStorage.removeItem("oauth_provider");
          sessionStorage.removeItem("pre_oauth_url");

          setTimeout(() => {
            router.push("/sign-in");
          }, 3000);
          return;
        }

        if (!provider) {
          console.error("❌ No OAuth provider identified");
          setError("Authentication failed - unknown provider");

          sessionStorage.removeItem("oauth_provider");
          sessionStorage.removeItem("pre_oauth_url");

          setTimeout(() => {
            router.push("/sign-in");
          }, 3000);
          return;
        }

        console.log(`🔄 Processing ${provider} OAuth callback...`);

        let oauthResponse;

        if (provider === "google") {
          oauthResponse = await googleAuthService.exchangeOAuthCode(
            code,
            "google"
          );
        } else if (provider === "facebook") {
          oauthResponse = await facebookAuthService.exchangeOAuthCode(code);
        } else {
          throw new Error(`Unknown OAuth provider: ${provider}`);
        }

        if (!oauthResponse.access_token) {
          throw new Error("No access token received from backend");
        }

        console.log("✅ OAuth token exchange successful");

        const userData = await authService.getCurrentUser(
          oauthResponse.access_token
        );

        if (!userData) {
          throw new Error("Failed to fetch user data");
        }

        console.log("✅ User data fetched successfully");

        setAuth(userData, oauthResponse.access_token);

        console.log("✅ OAuth authentication complete");

        const redirectUrl =
          sessionStorage.getItem("pre_oauth_url") || "/dashboard";

        sessionStorage.removeItem("oauth_provider");
        sessionStorage.removeItem("pre_oauth_url");

        router.push(redirectUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("❌ OAuth callback error:", err);

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Authentication failed. Please try again.";

        setError(errorMessage);

        sessionStorage.removeItem("oauth_provider");
        sessionStorage.removeItem("pre_oauth_url");

        setTimeout(() => {
          router.push("/sign-in");
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [router, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8ef]">
      <div className="text-center max-w-md px-4">
        {error ? (
          <div className="space-y-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Authentication Failed
            </h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500">
              Redirecting back to sign in...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-400 border-r-transparent"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              Completing Sign In...
            </h2>
            <p className="text-gray-600">
              Please wait while we authenticate you
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
