"use client";

import React, { Suspense } from "react";
import { useOAuth } from "@/hooks/useOAuth";
import styles from "@/styles/login.module.css";

function OAuthExchangeContent() {
  const { isLoading, error } = useOAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8ef]">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        {isLoading && (
          <div className={styles.formElement}>
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4033]"></div>
              <h2 className="text-xl font-semibold text-gray-800">
                Completing sign in...
              </h2>
              <p className="text-gray-600 text-sm">
                Please wait while we authenticate your account
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className={styles.formElement}>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="text-red-500 text-4xl mb-3">⚠️</div>
              <h2 className="text-xl font-semibold text-red-800 mb-2">
                Authentication Error
              </h2>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <a
                href="/sign-in"
                className="inline-block bg-[#5C4033] text-white px-6 py-2 rounded-lg hover:bg-[#4a3329] transition-colors"
              >
                Return to Sign In
              </a>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className={styles.formElement}>
            <div className="flex flex-col items-center space-y-4">
              <div className="text-green-500 text-5xl mb-2">✓</div>
              <h2 className="text-xl font-semibold text-gray-800">
                Authentication Successful!
              </h2>
              <p className="text-gray-600 text-sm">
                Redirecting to your dashboard...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OAuthExchangePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fff8ef]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5C4033]"></div>
        </div>
      }
    >
      <OAuthExchangeContent />
    </Suspense>
  );
}
