"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

/**
 * AuthRedirect - Redirects authenticated users away from auth pages
 * Use this on: /sign-in, /sign-up, /forgot-password, etc.
 */
export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, token } = useAuthStore();

  useEffect(() => {
    // If user is already authenticated, redirect away from auth pages
    if (isAuthenticated && token) {
      const redirect = searchParams.get("redirect") || "/hub";
      console.log("✅ User already authenticated, redirecting to:", redirect);
      router.push(redirect);
    }
  }, [isAuthenticated, token, router, searchParams]);

  // If authenticated, show nothing while redirecting
  if (isAuthenticated && token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  // Show auth page (sign-in, sign-up, etc.)
  return <>{children}</>;
}
