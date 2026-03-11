"use client";

import { useMutation } from "@tanstack/react-query";
import { authService, RegisterData } from "../services/authServices";

// Register hook - NO automatic redirect, let component handle success
export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: (data) => {
      console.log("✅ Registration successful:", data);
      // Component will handle showing success message
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      console.error(
        "❌ Registration failed:",
        err.response?.data?.message || err.message
      );
    },
  });
};
