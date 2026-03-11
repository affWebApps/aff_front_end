"use client";

import React from "react";

interface ErrorMessageProps {
  message: string;
  show: boolean;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  show,
  className = "",
}) => {
  return (
    <div
      className={`error-message text-red-500 text-sm mt-1 ${
        show ? "show" : ""
      } ${className}`}
    >
      {message}
    </div>
  );
};
