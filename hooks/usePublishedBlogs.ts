"use client";

import { useQuery } from "@tanstack/react-query";
import { blogService, Blog } from "@/services/blogService";

export const usePublishedBlogs = () =>
  useQuery<Blog[]>({
    queryKey: ["blogs", "published"],
    queryFn: () => blogService.getPublishedBlogs(),
    staleTime: 60_000,
  });
