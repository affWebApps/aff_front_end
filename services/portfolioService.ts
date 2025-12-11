// services/portfolioService.ts
import apiClient from "../lib/api/axios";
import { AxiosError } from "axios";

// API Error Response Type
interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  [key: string]: unknown;
}

// Portfolio Image Interface
export interface PortfolioImage {
  id: string;
  portfolio_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

// Portfolio Interface
export interface Portfolio {
  id: string;
  user_id: string;
  description: string;
  title: string;
  created_at: string;
  updated_at: string;
  Image: PortfolioImage[];
}

export interface CreatePortfolioData {
  title: string;
  description: string;
}

export interface UpdatePortfolioData {
  title?: string;
  description?: string;
}

export const portfolioService = {
  /**
   * Get user's portfolio
   * GET /portfolio
   */
  getUserPortfolio: async (): Promise<Portfolio> => {
    try {
      console.log("📂 Fetching user portfolio...");

      const response = await apiClient.get<Portfolio>("/portfolio");

      console.log("✅ Portfolio fetched:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Get portfolio failed:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        url: axiosError.config?.url,
      });
      throw error;
    }
  },

  /**
   * Create a new portfolio
   * POST /portfolio
   */
  createPortfolio: async (data: CreatePortfolioData): Promise<Portfolio> => {
    try {
      console.log("📝 Creating portfolio:", data);

      const response = await apiClient.post<Portfolio>("/portfolio", data);

      console.log("✅ Portfolio created:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Create portfolio failed:", axiosError);
      throw error;
    }
  },

  /**
   * Update portfolio
   * PUT /portfolio/:id
   */
  updatePortfolio: async (
    portfolioId: string,
    data: UpdatePortfolioData
  ): Promise<Portfolio> => {
    try {
      console.log("✏️ Updating portfolio:", portfolioId, data);

      const response = await apiClient.put<Portfolio>(
        `/portfolio/${portfolioId}`,
        data
      );

      console.log("✅ Portfolio updated:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Update portfolio failed:", axiosError);
      throw error;
    }
  },

  /**
   * Delete portfolio
   * DELETE /portfolio/:id
   */
  deletePortfolio: async (portfolioId: string): Promise<void> => {
    try {
      console.log("🗑️ Deleting portfolio:", portfolioId);

      await apiClient.delete(`/portfolio/${portfolioId}`);

      console.log("✅ Portfolio deleted");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Delete portfolio failed:", axiosError);
      throw error;
    }
  },

  /**
   * Upload portfolio image
   * POST /portfolio/:id/images
   */
  uploadPortfolioImage: async (
    portfolioId: string,
    imageFile: File,
    isPrimary: boolean = false
  ): Promise<PortfolioImage> => {
    try {
      console.log("📸 Uploading portfolio image...");

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("is_primary", String(isPrimary));

      const response = await apiClient.post<PortfolioImage>(
        `/portfolio/${portfolioId}/images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Image uploaded:", response.data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Upload image failed:", axiosError);
      throw error;
    }
  },

  /**
   * Delete portfolio image
   * DELETE /portfolio/images/:imageId
   */
  deletePortfolioImage: async (imageId: string): Promise<void> => {
    try {
      console.log("🗑️ Deleting portfolio image:", imageId);

      await apiClient.delete(`/portfolio/images/${imageId}`);

      console.log("✅ Image deleted");
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("❌ Delete image failed:", axiosError);
      throw error;
    }
  },
};
