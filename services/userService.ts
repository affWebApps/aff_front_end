import apiClient from "@/lib/api/axios";

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
};
