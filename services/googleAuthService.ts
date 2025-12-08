// services/googleAuthService.ts

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

export const googleAuthService = {
  /**
   * Initiate Google OAuth flow
   * Redirects user to backend Google OAuth endpoint
   */
  initiateGoogleLogin: () => {
    const backendUrl = "https://aff-back-end.onrender.com/v1";

    // Store the current URL to redirect back after OAuth
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pre_oauth_url", window.location.pathname);
    }

    // Redirect to backend Google OAuth endpoint
    window.location.href = `${backendUrl}/auth/google`;
  },

  /**
   * Handle Google OAuth callback
   * Extracts code from URL params after redirect
   */
  handleGoogleCallback: (): { code: string | null; error: string | null } => {
    if (typeof window === "undefined") {
      return { code: null, error: null };
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");

    // Clean URL after extracting params
    if (code || error) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    return { code, error };
  },

  /**
   * Exchange OAuth code for access token
   * POST /auth/oauth-exchange
   */
  exchangeOAuthCode: async (
    code: string,
    provider: string = "google"
  ): Promise<OAuthExchangeResponse> => {
    try {
      console.log("🔄 Exchanging OAuth code for token...");

      const response = await apiClient.post<OAuthExchangeResponse>(
        "/auth/oauth-exchange",
        {
          code,
          provider,
        }
      );

      console.log("✅ OAuth exchange successful");
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ OAuth exchange failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

  /**
   * Get redirect URL after OAuth
   */
  getRedirectUrl: (): string => {
    if (typeof window === "undefined") return "/dashboard";

    const savedUrl = sessionStorage.getItem("pre_oauth_url");
    sessionStorage.removeItem("pre_oauth_url");

    return savedUrl || "/dashboard";
  },
};
