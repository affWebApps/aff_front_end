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
