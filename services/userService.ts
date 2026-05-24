import apiClient from "@/lib/api/axios";
import { User } from "@/services/authServices";

export interface ProjectFile {
  id: string;
  project_id: string;
  file_url: string;
  file_type: string | null;
  uploaded_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectRequirement {
  id: string;
  project_id: string;
  content: Record<string, string> | null;
  designer_approved: boolean;
  tailor_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectReview {
  id: string;
  reviewer_id: string;
  target_user_id: string | null;
  target_project_id: string | null;
  target_product_id: string | null;
  target_type: string;
  rating: number;
  comment: string;
}

export interface ProjectDetail {
  id: string;
  designer_id: string;
  design_id: string;
  title: string;
  description?: string;
  budget?: string | number | null;
  status?: string;
  estimated_time?: string | null;
  deadline?: string | null;
  created_at: string;
  updated_at: string;
  files: ProjectFile[];
  requirements: ProjectRequirement[];
  reviews: ProjectReview[];
}

export interface UserStats {
  total: number;
  designers: number;
  tailors: number;
}

export interface ProjectStats {
  total: number;
  inProgress: number;
  completed: number;
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

  getProjectStats: async (): Promise<ProjectStats> => {
    const response = await apiClient.get<ProjectStats>("/projects/stats");
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

  getProjectById: async (projectId: string): Promise<ProjectDetail> => {
    const response = await apiClient.get<ProjectDetail>(`/projects/${projectId}`);
    return response.data;
  },
};
