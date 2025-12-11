"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { authService, LoginCredentials, RegisterData } from "../services/authServices";

// Register hook
export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      // Show success message - user needs to verify email
      console.log("Registration successful:", data.status);
      // Redirect to verification page or login
      router.push("/verify-email");
    },
    onError: (error: any) => {
      console.error(
        "Registration failed:",
        error.response?.data?.message || error.message
      );
    },
  });
};

