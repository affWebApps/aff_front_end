import apiClient from "../lib/api/axios";
import { AxiosError } from "axios";

interface ApiErrorResponse {
  message?: string;
  detail?: string;
  error?: string;
  [key: string]: unknown;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  scheduled_for: string;
  status: "draft" | "published" | "scheduled";
  created_at: string;
  updated_at: string;
  images: string[];
}

export const blogService = {
  getAllBlogs: async (): Promise<Blog[]> => {
    try {
      const response = await apiClient.get<Blog[]>("/blogs/");
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      console.error("Get blogs failed:", {
        message: axiosError.message,
        status: axiosError.response?.status,
        url: axiosError.config?.url,
      });
      throw error;
    }
  },
};
