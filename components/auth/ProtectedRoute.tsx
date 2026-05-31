"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, token, checkAuth } = useAuthStore();

  // Wait for Zustand to rehydrate from localStorage before checking auth.
  // On first render token is null (before persist kicks in), so we must not
  // redirect until we know hydration is complete.
  const [hydrated, setHydrated] = useState(() => useAuthStore.persist.hasHydrated());
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (hydrated) return;
    return useAuthStore.persist.onFinishHydration(() => setHydrated(true));
  }, [hydrated]);

  useEffect(() => {
    if (!hydrated) return;

    const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "");

    const verifyAuth = async () => {
      try {
        if (!token) {
          router.push(`/sign-in?redirect=${encodeURIComponent(fullPath)}`);
          return;
        }

        if (token && !user) {
          await checkAuth();
        }

        setIsChecking(false);
      } catch (error) {
        console.error("Auth verification failed:", error);
        router.push(`/sign-in?redirect=${encodeURIComponent(fullPath)}`);
      }
    };

    verifyAuth();
  }, [hydrated, token, user, router, pathname, searchParams, checkAuth]);

  if (!hydrated || isChecking) {
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
