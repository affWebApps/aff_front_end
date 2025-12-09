

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
      const portfolioData = await portfolioService.getUserPortfolio();
      set({ portfolio: portfolioData, isLoading: false });
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to fetch portfolio";
      set({ error: errorMessage, isLoading: false });
      console.error("Failed to fetch portfolio:", error);
    }
  },

  setPortfolio: (portfolio) => {
    set({ portfolio });
  },

  clearPortfolio: () => {
    set({ portfolio: null, error: null });
  },
}));
