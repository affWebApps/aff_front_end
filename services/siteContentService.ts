import apiClient from "@/lib/api/axios";

export interface SiteContent {
  id: string;
  key: string;
  title: string;
  body: string;
  image_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateSiteContentData {
  key: string;
  title: string;
  body: string;
  imageUrl?: string;
  isActive?: boolean;
}

export type UpdateSiteContentData = Partial<Omit<CreateSiteContentData, "key">>;

export const siteContentService = {
  getAll: async (activeOnly?: boolean): Promise<SiteContent[]> => {
    const params = activeOnly ? { active: true } : {};
    const response = await apiClient.get<SiteContent[]>("/site-content", { params });
    return response.data;
  },

  getByKey: async (key: string): Promise<SiteContent> => {
    const response = await apiClient.get<SiteContent>(`/site-content/${key}`);
    return response.data;
  },

  create: async (data: CreateSiteContentData): Promise<SiteContent> => {
    const response = await apiClient.post<SiteContent>("/site-content", data);
    return response.data;
  },

  update: async (key: string, data: UpdateSiteContentData): Promise<SiteContent> => {
    const response = await apiClient.patch<SiteContent>(`/site-content/${key}`, data);
    return response.data;
  },

  delete: async (key: string): Promise<void> => {
    await apiClient.delete(`/site-content/${key}`);
  },
};
