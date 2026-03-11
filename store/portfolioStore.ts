import { create } from "zustand";
import { portfolioService, Portfolio } from "@/services/portfolioService";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  [key: string]: unknown;
}

interface PortfolioState {
  portfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
  fetchPortfolio: () => Promise<void>;
  setPortfolio: (portfolio: Portfolio) => void;
  clearPortfolio: () => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  portfolio: null,
  isLoading: false,
  error: null,

  fetchPortfolio: async () => {
    set({ isLoading: true, error: null });
    try {
      console.log("🔄 Fetching portfolio from API...");
      const portfolioData = await portfolioService.getUserPortfolio();

      console.log("✅ Portfolio fetched successfully:", {
        id: portfolioData.id,
        title: portfolioData.title,
        imageCount: portfolioData.Image?.length || 0,
        images: portfolioData.Image,
      });

      set({ portfolio: portfolioData, isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to fetch portfolio";

      console.error("❌ Failed to fetch portfolio:", {
        status: axiosError.response?.status,
        message: errorMessage,
        error: axiosError,
      });

      set({ error: errorMessage, isLoading: false, portfolio: null });
    }
  },

  setPortfolio: (portfolio) => {
    console.log("📝 Setting portfolio in store:", portfolio);
    set({ portfolio });
  },

  clearPortfolio: () => {
    console.log("🗑️ Clearing portfolio from store");
    set({ portfolio: null, error: null });
  },
}));
