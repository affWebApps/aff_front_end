"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, checkAuth } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        if (!token) {
          router.push(`/sign-in?redirect=${pathname}`);
          return;
        }

        if (token && !user) {
          await checkAuth();
        }

        setIsChecking(false);
      } catch (error) {
        console.error("Auth verification failed:", error);
        router.push(`/sign-in?redirect=${pathname}`);
      }
    };

    verifyAuth();
  }, [token, user, router, pathname, checkAuth]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
