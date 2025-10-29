"use client";

import React, { useState } from "react";
import { Button } from "../../components/ui/Button";
import styles from "@/app/styles/login.module.css";
import { StatusMessage } from "../../components/ui/StatusMessage";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success"
  );

  const handleResendVerification = async () => {
    setIsResending(true);
    setResendMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setMessageType("success");
      setResendMessage("Verification email sent! Please check your inbox.");
      console.log("Resending verification email");

      setTimeout(() => {
        setResendMessage("");
      }, 5000);
    } catch (error) {
      setMessageType("error");
      setResendMessage("Failed to send verification email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className={styles.formElement} style={{ animationDelay: "0.1s" }}>
        <h1 className="mb-4 header-large">Verify Your Email</h1>
        <p className="text-[#484848] mb-8 leading-relaxed">
          We&apos;ve sent a verification link to your email address. Please
          check your inbox and click the link to activate your account.
        </p>
      </div>

      <Link href={'#'} className={styles.formElement} style={{ animationDelay: "0.2s" }}>
        <p className="text-sm text-[#848484] mb-4 hover:underline">
          Didn&apos;t receive mail?
        </p>
      </Link>

      <div
        className={`${styles.formElement} w-full`}
        style={{ animationDelay: "0.3s" }}
      >
        <Button
          variant="default"
          size="large"
          className="w-full transition-all duration-300 hover:scale-105"
          onClick={handleResendVerification}
          disabled={isResending}
        >
          {isResending ? "Sending..." : "Resend Verification"}
        </Button>
      </div>

      <StatusMessage
        message={resendMessage}
        show={!!resendMessage}
        type={messageType}
        className={`${styles.formElement} mt-4`}
      />
    </div>
  );
}
