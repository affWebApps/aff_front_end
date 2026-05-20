"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";

export const useUsers = () =>
  useQuery({
    queryKey: ["admin-users"],
    queryFn: userService.getAll,
    staleTime: 60_000,
    retry: false,
  });

export const useUser = (id: string) =>
  useQuery({
    queryKey: ["admin-user", id],
    queryFn: () => userService.getById(id),
    staleTime: 60_000,
    retry: false,
    enabled: !!id,
  });
