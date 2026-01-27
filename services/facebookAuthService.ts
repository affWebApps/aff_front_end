// services/facebookAuthService.ts

import apiClient from "../lib/api/axios";

export interface OAuthExchangeResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const facebookAuthService = {
  /**
   * Initiate Facebook OAuth login
   * Redirects user to backend which then redirects to Facebook
   */
  initiateFacebookLogin: () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const frontendUrl =
      typeof window !== "undefined" ? window.location.origin : "";

    if (typeof window !== "undefined") {
      sessionStorage.setItem("pre_oauth_url", window.location.pathname);
      sessionStorage.setItem("oauth_provider", "facebook");
    }

    // Pass callback URL to backend so it knows where to redirect
    const callbackUrl = `${frontendUrl}/auth/callback`;
    window.location.href = `${backendUrl}/auth/facebook?callback_url=${encodeURIComponent(
      callbackUrl
    )}`;
  },

  /**
   * Handle Facebook OAuth callback
   * Extracts code and error from URL params
   */
  handleFacebookCallback: (): { code: string | null; error: string | null } => {
    if (typeof window === "undefined") {
      return { code: null, error: null };
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");
    const errorReason = params.get("error_reason");
    const errorDescription = params.get("error_description");

    // Clean up URL without triggering navigation
    if (code || error) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const formattedError = error
      ? errorDescription || errorReason || error
      : null;

    return { code, error: formattedError };
  },

  /**
   * Exchange OAuth code for access token
   */
  exchangeOAuthCode: async (
    code: string,
    // provider: string = "facebook"
  ): Promise<OAuthExchangeResponse> => {
    try {
      console.log("🔄 Exchanging Facebook OAuth code for token...");

      const response = await apiClient.post<OAuthExchangeResponse>(
        "/auth/oauth-exchange",
        {
          code,
          // provider,
        }
      );

      console.log("✅ Facebook OAuth exchange successful");
      return response.data;
    } catch (error: any) {
      console.error("❌ Facebook OAuth exchange failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  /**
   * Get redirect URL after successful OAuth
   * Returns the URL user was on before OAuth, or dashboard as default
   */
  getRedirectUrl: (): string => {
    if (typeof window === "undefined") return "/dashboard";

    const savedUrl = sessionStorage.getItem("pre_oauth_url");
    sessionStorage.removeItem("pre_oauth_url");
    sessionStorage.removeItem("oauth_provider");

    return savedUrl || "/dashboard";
  },

  /**
   * Get stored OAuth provider
   */
  getProvider: (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("oauth_provider");
  },
};
