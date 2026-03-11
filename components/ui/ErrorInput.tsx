"use client";

import React from "react";

interface ErrorInputProps {
  hasError: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ErrorInput: React.FC<ErrorInputProps> = ({
  hasError,
  children,
  className = "",
}) => {
  return (
    <div
      className={`error-input ${
        hasError ? "error-shake border-red-500" : "border-gray-200"
      } ${className}`}
    >
      {children}
    </div>
  );
};
