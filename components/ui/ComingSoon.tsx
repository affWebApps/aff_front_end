"use client";
import { ReactNode } from "react";

interface ComingSoonProps {
  title?: string;
  message?: string;
  fullPage?: boolean;
}

export function ComingSoon({
  title = "Coming Soon",
  message = "We're working on something great. Check back soon.",
  fullPage = false,
}: ComingSoonProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center px-6 ${
        fullPage ? "min-h-screen bg-gray-50" : "py-24"
      }`}
    >
      <div className="w-20 h-20 rounded-full bg-[#5C4033]/10 flex items-center justify-center mb-6">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#5C4033"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 text-sm max-w-xs leading-relaxed">{message}</p>
    </div>
  );
}

interface ComingSoonGateProps {
  enabled: boolean;
  children: ReactNode;
  title?: string;
  message?: string;
  fullPage?: boolean;
}

export function ComingSoonGate({
  enabled,
  children,
  title,
  message,
  fullPage,
}: ComingSoonGateProps) {
  if (enabled) {
    return <ComingSoon title={title} message={message} fullPage={fullPage} />;
  }
  return <>{children}</>;
}
