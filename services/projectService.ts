import apiClient from "@/lib/api/axios";

export type ProjectStatus = "OPEN" | "IN_PROGRESS" | "COMPLETED" | "CLOSED";
export type BidStatus = "PENDING" | "APPROVED" | "REJECTED";

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

export interface Bid {
  id: string;
  project_id: string;
  tailor_id: string;
  amount: string;
  duration: string | null;
  message: string | null;
  status: BidStatus;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  designer_id: string;
  assigned_tailor_id: string | null;
  design_id: string | null;
  title: string;
  description: string | null;
  budget: string;
  status: ProjectStatus;
  estimated_time: string | null;
  deadline: string | null;
  is_blocked: boolean;
  blocked_by: string | null;
  blocked_at: string | null;
  block_reason: string | null;
  created_at: string;
  updated_at: string;
  files: ProjectFile[];
  requirements: ProjectRequirement[];
  bids: Bid[];
  reviews: unknown[];
}

export interface CreateProjectPayload {
  title: string;
  description?: string;
  budget: number;
  estimatedTime?: string;
  status?: ProjectStatus;
  designId?: string;
  files?: { fileUrl: string; fileType?: string }[];
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  budget?: number;
  estimatedTime?: string;
  status?: ProjectStatus;
}

export interface CreateRequirementPayload {
  content?: Record<string, string>;
  designerApproved?: boolean;
  tailorApproved?: boolean;
}

export interface UpdateRequirementPayload {
  content?: Record<string, string>;
  designerApproved?: boolean;
  tailorApproved?: boolean;
}

export interface SubmitBidPayload {
  amount: number;
  duration?: string;
  message?: string;
}

export const projectService = {
  // ── Projects ──────────────────────────────────────────────

  create: async (payload: CreateProjectPayload): Promise<Project> => {
    const res = await apiClient.post<Project>("/projects", payload);
    return res.data;
  },

  getById: async (id: string): Promise<Project> => {
    const res = await apiClient.get<Project>(`/projects/${id}`);
    return res.data;
  },

  list: async (): Promise<Project[]> => {
    const res = await apiClient.get<Project[] | { data: Project[] }>("/projects");
    const data = res.data;
    return Array.isArray(data) ? data : (data.data ?? []);
  },

  update: async (id: string, payload: UpdateProjectPayload): Promise<Project> => {
    const res = await apiClient.patch<Project>(`/projects/${id}`, payload);
    return res.data;
  },

  close: async (id: string, status: "COMPLETED" | "CLOSED"): Promise<Project> => {
    const res = await apiClient.post<Project>(`/projects/${id}/close`, { status });
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  deleteFile: async (projectId: string, fileId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/files/${fileId}`);
  },

  // ── Requirements ──────────────────────────────────────────

  listRequirements: async (projectId: string): Promise<ProjectRequirement[]> => {
    const res = await apiClient.get<ProjectRequirement[]>(`/projects/${projectId}/requirements`);
    return res.data;
  },

  createRequirement: async (
    projectId: string,
    payload: CreateRequirementPayload
  ): Promise<ProjectRequirement> => {
    const res = await apiClient.post<ProjectRequirement>(
      `/projects/${projectId}/requirements`,
      payload
    );
    return res.data;
  },

  updateRequirement: async (
    projectId: string,
    reqId: string,
    payload: UpdateRequirementPayload
  ): Promise<ProjectRequirement> => {
    const res = await apiClient.patch<ProjectRequirement>(
      `/projects/${projectId}/requirements/${reqId}`,
      payload
    );
    return res.data;
  },

  deleteRequirement: async (projectId: string, reqId: string): Promise<void> => {
    await apiClient.delete(`/projects/${projectId}/requirements/${reqId}`);
  },

  approveRequirement: async (
    projectId: string,
    reqId: string
  ): Promise<ProjectRequirement> => {
    const res = await apiClient.post<ProjectRequirement>(
      `/projects/${projectId}/requirements/${reqId}/approve`
    );
    return res.data;
  },

  // ── Bids ──────────────────────────────────────────────────

  submitBid: async (projectId: string, payload: SubmitBidPayload): Promise<Bid> => {
    const res = await apiClient.post<Bid>(`/projects/${projectId}/bids`, payload);
    return res.data;
  },

  listBids: async (projectId: string): Promise<Bid[]> => {
    const res = await apiClient.get<Bid[]>(`/projects/${projectId}/bids`);
    return res.data;
  },

  getBid: async (bidId: string): Promise<Bid> => {
    const res = await apiClient.get<Bid>(`/bids/${bidId}`);
    return res.data;
  },

  decideBid: async (bidId: string, decision: "APPROVED" | "REJECTED"): Promise<Bid> => {
    const res = await apiClient.patch<Bid>(`/bids/${bidId}/decision`, { decision });
    return res.data;
  },

  deleteBid: async (bidId: string): Promise<void> => {
    await apiClient.delete(`/bids/${bidId}`);
  },

  // ── Admin ─────────────────────────────────────────────────

  blockProject: async (id: string, reason: string): Promise<Project> => {
    const res = await apiClient.patch<Project>(`/projects/${id}/block`, { reason });
    return res.data;
  },

  unblockProject: async (id: string): Promise<Project> => {
    const res = await apiClient.patch<Project>(`/projects/${id}/unblock`);
    return res.data;
  },
};
