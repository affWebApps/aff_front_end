"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  projectService,
  CreateProjectPayload,
  UpdateProjectPayload,
  CreateRequirementPayload,
  UpdateRequirementPayload,
  SubmitBidPayload,
} from "@/services/projectService";

// ── Projects ────────────────────────────────────────────────

export const useProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: projectService.list,
    staleTime: 60_000,
  });

export const useProject = (id: string | null) =>
  useQuery({
    queryKey: ["project", id],
    queryFn: () => projectService.getById(id!),
    enabled: Boolean(id),
    staleTime: 60_000,
  });

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) => projectService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateProjectPayload) => projectService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useCloseProject = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (status: "COMPLETED" | "CLOSED") => projectService.close(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProjectFile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ projectId, fileId }: { projectId: string; fileId: string }) =>
      projectService.deleteFile(projectId, fileId),
    onSuccess: (_, { projectId }) => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
};


// ── Requirements ────────────────────────────────────────────

export const useRequirements = (projectId: string | null) =>
  useQuery({
    queryKey: ["requirements", projectId],
    queryFn: () => projectService.listRequirements(projectId!),
    enabled: Boolean(projectId),
    staleTime: 60_000,
  });

export const useCreateRequirement = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRequirementPayload) =>
      projectService.createRequirement(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requirements", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
};

export const useUpdateRequirement = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reqId, payload }: { reqId: string; payload: UpdateRequirementPayload }) =>
      projectService.updateRequirement(projectId, reqId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requirements", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
};

export const useDeleteRequirement = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reqId: string) => projectService.deleteRequirement(projectId, reqId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requirements", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
};

export const useApproveRequirement = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reqId: string) => projectService.approveRequirement(projectId, reqId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requirements", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
};

// ── User Bids (from /users/me) ───────────────────────────────

export const useUserBids = () =>
  useQuery({
    queryKey: ["user-bids"],
    queryFn: projectService.listUserBids,
    staleTime: 60_000,
  });

export const useMyBids = () =>
  useQuery({
    queryKey: ["my-bids"],
    queryFn: projectService.getMyBids,
    staleTime: 60_000,
  });

// ── Bids ────────────────────────────────────────────────────

export const useProjectBids = (projectId: string | null) =>
  useQuery({
    queryKey: ["bids", projectId],
    queryFn: () => projectService.listBids(projectId!),
    enabled: Boolean(projectId),
    staleTime: 60_000,
  });

export const useBid = (bidId: string | null) =>
  useQuery({
    queryKey: ["bid", bidId],
    queryFn: () => projectService.getBid(bidId!),
    enabled: Boolean(bidId),
    staleTime: 60_000,
  });

export const useSubmitBid = (projectId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SubmitBidPayload) => projectService.submitBid(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bids", projectId] });
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["user-bids"] });
    },
  });
};

export const useDecideBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bidId, decision }: { bidId: string; decision: "APPROVED" | "REJECTED" }) =>
      projectService.decideBid(bidId, decision),
    onSuccess: (updatedBid) => {
      queryClient.invalidateQueries({ queryKey: ["bids", updatedBid.project_id] });
      queryClient.invalidateQueries({ queryKey: ["project", updatedBid.project_id] });
      queryClient.invalidateQueries({ queryKey: ["bid", updatedBid.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteBid = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bidId: string) => projectService.deleteBid(bidId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-bids"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

// ── Admin ────────────────────────────────────────────────────

export const useBlockProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      projectService.blockProject(id, reason),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["project", updated.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUnblockProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectService.unblockProject(id),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["project", updated.id] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
