"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  siteContentService,
  CreateSiteContentData,
  UpdateSiteContentData,
} from "@/services/siteContentService";

export const useSiteContent = (key: string) =>
  useQuery({
    queryKey: ["site-content", key],
    queryFn: () => siteContentService.getByKey(key),
    staleTime: 60_000,
    retry: false,
  });

export const useAllSiteContent = (activeOnly?: boolean) =>
  useQuery({
    queryKey: ["site-content-all", activeOnly ?? false],
    queryFn: () => siteContentService.getAll(activeOnly),
    staleTime: 60_000,
    retry: false,
  });

export const useCreateSiteContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSiteContentData) => siteContentService.create(data),
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["site-content-all"] });
      queryClient.invalidateQueries({ queryKey: ["site-content", created.key] });
    },
  });
};

export const useUpdateSiteContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ key, data }: { key: string; data: UpdateSiteContentData }) =>
      siteContentService.update(key, data),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["site-content-all"] });
      queryClient.invalidateQueries({ queryKey: ["site-content", updated.key] });
    },
  });
};

export const useDeleteSiteContent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (key: string) => siteContentService.delete(key),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-content-all"] });
      queryClient.invalidateQueries({ queryKey: ["site-content"] });
    },
  });
};
