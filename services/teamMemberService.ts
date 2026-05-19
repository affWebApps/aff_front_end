import apiClient from "@/lib/api/axios";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  photo_url?: string | null;
  display_order: number;
  is_active: boolean;
}

export interface CreateTeamMemberData {
  name: string;
  role: string;
  bio?: string;
  photoUrl?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export type UpdateTeamMemberData = Partial<CreateTeamMemberData>;

export const teamMemberService = {
  getAll: async (activeOnly?: boolean): Promise<TeamMember[]> => {
    const params = activeOnly ? { active: true } : {};
    const response = await apiClient.get<TeamMember[]>("/team-members", { params });
    return response.data;
  },

  create: async (data: CreateTeamMemberData): Promise<TeamMember> => {
    const response = await apiClient.post<TeamMember>("/team-members", data);
    return response.data;
  },

  update: async (id: string, data: UpdateTeamMemberData): Promise<TeamMember> => {
    const response = await apiClient.patch<TeamMember>(`/team-members/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/team-members/${id}`);
  },
};
