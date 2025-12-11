
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

  initiateFacebookLogin: () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL 

    if (typeof window !== "undefined") {
      sessionStorage.setItem("pre_oauth_url", window.location.pathname);
      sessionStorage.setItem("oauth_provider", "facebook");
    }

    window.location.href = `${backendUrl}/auth/facebook`;
  },

 
  handleFacebookCallback: (): { code: string | null; error: string | null } => {
    if (typeof window === "undefined") {
      return { code: null, error: null };
    }

    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const error = params.get("error");
    const errorReason = params.get("error_reason");
    const errorDescription = params.get("error_description");

    if (code || error) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    const formattedError = error
      ? errorDescription || errorReason || error
      : null;

    return { code, error: formattedError };
  },

  
  exchangeOAuthCode: async (
    code: string,
    provider: string = "facebook"
  ): Promise<OAuthExchangeResponse> => {
    try {
      console.log("🔄 Exchanging Facebook OAuth code for token...");

      const response = await apiClient.post<OAuthExchangeResponse>(
        "/auth/oauth-exchange",
        {
          code,
          provider,
        }
      );

      console.log("✅ Facebook OAuth exchange successful");
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("❌ Facebook OAuth exchange failed:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      throw error;
    }
  },

 
  getRedirectUrl: (): string => {
    if (typeof window === "undefined") return "/dashboard";

    const savedUrl = sessionStorage.getItem("pre_oauth_url");
    sessionStorage.removeItem("pre_oauth_url");
    sessionStorage.removeItem("oauth_provider");

    return savedUrl || "/dashboard";
  },


  getProvider: (): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem("oauth_provider");
  },
};
