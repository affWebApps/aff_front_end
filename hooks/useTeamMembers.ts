"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  teamMemberService,
  CreateTeamMemberData,
  UpdateTeamMemberData,
} from "@/services/teamMemberService";

export const useTeamMembers = (activeOnly?: boolean) =>
  useQuery({
    queryKey: ["team-members", activeOnly ?? false],
    queryFn: () => teamMemberService.getAll(activeOnly),
    staleTime: 60_000,
  });

export const useCreateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateTeamMemberData) => teamMemberService.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team-members"] }),
  });
};

export const useUpdateTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTeamMemberData }) =>
      teamMemberService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team-members"] }),
  });
};

export const useDeleteTeamMember = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => teamMemberService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["team-members"] }),
  });
};
