"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";

export const useProject = (projectId: string | null) =>
  useQuery({
    queryKey: ["admin-project", projectId],
    queryFn: () => userService.getProjectById(projectId!),
    staleTime: 60_000,
    retry: false,
    enabled: !!projectId,
  });

const PAGE_LIMIT = 20;

export interface UserFilters {
  role?: string;
  isVerified?: boolean;
  isActive?: boolean;
  authProvider?: string;
}

export const useUsers = (
  page: number,
  sortBy?: string,
  sortOrder?: "asc" | "desc",
  filters?: UserFilters
) =>
  useQuery({
    queryKey: ["admin-users", page, sortBy, sortOrder, filters],
    queryFn: () => userService.getAll(page, PAGE_LIMIT, sortBy, sortOrder, filters),
    staleTime: 60_000,
    retry: false,
    placeholderData: keepPreviousData,
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => userService.getById(id),
    staleTime: 60_000,
    retry: false,
    enabled: !!id,
  });

export const useUpdateUserStatus = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (isActive: boolean) => userService.updateStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-user", id] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};
