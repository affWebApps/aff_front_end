"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";

import styles from "@/app/styles/login.module.css";
import { Button } from "../../components/ui/Button";
import { StatusMessage } from "../../components/ui/StatusMessage";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

export default function ResetPasswordPage() {
  const [resetError, setResetError] = useState("");
  const [resetSuccess, setResetSuccess] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setResetError("");
        setResetSuccess(false); 
        console.log("Reset password form submitted:", values);
      
        setResetSuccess(true);
       
      } catch (error) {
        setResetError("Something went wrong. Please try again.");
      }
    },
  });

  const hasError = (field: keyof typeof formik.values) =>
    !!(formik.errors[field] && formik.touched[field]);

  return (
    <>
      <div className={styles.formElement} style={{ animationDelay: "0.1s" }}>
        <h1 className="mb-2 header-large">Reset Your Password</h1>
        <p className="text-[#484848] mb-8">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      <div className={styles.formElement} style={{ animationDelay: "0.15s" }}>
        <div className="min-h-[60px]">
          {" "}
          <StatusMessage
            message={resetError}
            show={!!resetError}
            type="error"
            className="px-4 py-3 rounded-lg"
            onHide={() => setResetError("")}
          />
          <StatusMessage
            message="Password reset link sent! Check your email."
            show={resetSuccess}
            type="success"
            className="px-4 py-3 rounded-lg"
            onHide={() => setResetSuccess(false)}
          />
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className={styles.formElement} style={{ animationDelay: "0.2s" }}>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Enter email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 ${
              hasError("email")
                ? `border-red-500 ring-2 ring-red-200 ${styles.errorShake}`
                : "border-gray-300"
            }`}
          />
          <div className="h-6 mt-1">
            {hasError("email") && (
              <div
                className={`${styles.errorMessage} ${styles.show} text-red-500 text-sm`}
              >
                {formik.errors.email}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formElement} style={{ animationDelay: "0.3s" }}>
          <Button
            variant="default"
            size="large"
            className="w-full transition-all duration-300 hover:scale-105"
            disabled={formik.isSubmitting || resetSuccess}
          >
            {formik.isSubmitting ? "Sending..." : "Send Reset Link"}
          </Button>
        </div>

        <div className={styles.formElement} style={{ animationDelay: "0.4s" }}>
          <Link href="/sign-in">
            <Button
              outlined={true}
              className="w-full transition-all duration-300"
            >
              Back to Sign In
            </Button>
          </Link>
        </div>
      </form>
    </>
  );
}
