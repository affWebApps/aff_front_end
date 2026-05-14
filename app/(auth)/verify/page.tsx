"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import styles from "@/styles/login.module.css";
import { authService } from "@/services/authServices";
import { useAuthStore } from "@/store/authStore";

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setErrorMessage("No verification token was found in the link. Please check your email and try again.");
      return;
    }

    authService
      .verifyEmail(token)
      .then(async (data) => {
        let user = data.user;
        if (!user) {
          user = await authService.getCurrentUser(data.access_token);
        }
        setAuth(user, data.access_token);
        setStatus("success");
        setTimeout(() => router.push("/hub"), 2500);
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(
          err?.response?.data?.message ||
            "Verification failed. Your link may have expired — request a new one from the sign-in page."
        );
      });
  }, []);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className={styles.formElement} style={{ animationDelay: "0.1s" }}>
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-amber-400 border-r-transparent mb-4" />
          <h1 className="mb-2 header-large">Verifying your email…</h1>
          <p className="text-[#484848]">Please wait while we confirm your account.</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        <div className={styles.formElement} style={{ animationDelay: "0.1s" }}>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="mb-2 header-large">Email Verified!</h1>
          <p className="text-[#484848]">
            Your account is now active. Redirecting you to your dashboard…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center text-center space-y-6">
      <div className={styles.formElement} style={{ animationDelay: "0.1s" }}>
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="mb-2 header-large">Verification Failed</h1>
        <p className="text-[#484848] mb-6">{errorMessage}</p>
      </div>
      <div className={`${styles.formElement} w-full`} style={{ animationDelay: "0.2s" }}>
        <Link href="/sign-in">
          <Button variant="default" size="large" className="w-full transition-all duration-300 hover:scale-105">
            Go to Sign In
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-400 border-r-transparent" />
            <p className="mt-2 text-gray-600">Loading…</p>
          </div>
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
