"use client";

import React, { useEffect } from "react";
import styles from "@/app/styles/login.module.css";

interface StatusMessageProps {
  message: string;
  show: boolean;
  type?: "success" | "error" | "info";
  className?: string;
  onHide?: () => void; 
  duration?: number;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  message,
  show,
  type = "info",
  className = "",
  onHide,
  duration = 5000,
}) => {
  const typeStyles = {
    success: "text-green-600",
    error: "text-red-500",
    info: "text-blue-600",
  };

  useEffect(() => {
    if (show && message) {
      const timer = setTimeout(() => {
        if (onHide) {
          onHide();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, message, duration, onHide]);

  if (!show || !message) return null;

  return (
    <div
      className={`${styles.errorMessage} ${styles.show} text-sm mt-4 ${typeStyles[type]} ${className}`}
    >
      {message}
    </div>
  );
};
