"use client";

import React from "react";
import Link from "next/link";
import styles from "@/app/styles/login.module.css";
import { Button } from "../../components/ui/Button";

export default function PasswordUpdatedPage() {
  return (
    <>
      <div className={styles.formElement} style={{ animationDelay: "0.1s" }}>
        <h1 className="mb-2 header-large text-center">
          Password Updated Successfully
        </h1>
        <p className="text-[#484848] text-center mb-8">
          You can now log in with your new password.
        </p>
      </div>

      <div className={styles.formElement} style={{ animationDelay: "0.2s" }}>
        <Link href="/sign-in">
          <Button
            variant="default"
            size="large"
            className="w-full transition-all duration-300 hover:scale-105"
          >
            Proceed to Sign In
          </Button>
        </Link>
      </div>
    </>
  );
}


