import apiClient from "@/lib/api/axios";
import { User } from "@/services/authServices";

export interface UserStats {
  total: number;
  designers: number;
  tailors: number;
}

export interface UserListItem {
  id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  auth_provider: string;
  created_at: string;
}

export interface UsersListResponse {
  data: UserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const userService = {
  getStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<UserStats>("/users/stats");
    return response.data;
  },

  getAll: async (
    page: number,
    limit: number,
    sortBy?: string,
    sortOrder?: "asc" | "desc",
    filters?: {
      role?: string;
      isVerified?: boolean;
      isActive?: boolean;
      authProvider?: string;
    }
  ): Promise<UsersListResponse> => {
    const response = await apiClient.get<UsersListResponse>("/users", {
      params: {
        page,
        limit,
        ...(sortBy && { sortBy, sortOrder }),
        ...filters,
      },
    });
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, isActive: boolean): Promise<User> => {
    const response = await apiClient.patch<User>(`/users/${id}/status`, { isActive });
    return response.data;
  },
};
