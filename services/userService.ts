import apiClient from "@/lib/api/axios";
import { User } from "@/services/authServices";

export interface UserStats {
  total: number;
  designers: number;
  tailors: number;
}

export const userService = {
  getStats: async (): Promise<UserStats> => {
    const response = await apiClient.get<UserStats>("/users/stats");
    return response.data;
  },

  getAll: async (): Promise<User[]> => {
    const response = await apiClient.get<User[]>("/users");
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await apiClient.get<User>(`/users/${id}`);
    return response.data;
  },
};
