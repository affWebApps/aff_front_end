"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

import styles from "@/app/styles/login.module.css";
import { Button } from "../../components/ui/Button";
import { StatusMessage } from "../../components/ui/StatusMessage";




const validationSchema = Yup.object({
  newPassword: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Must contain uppercase letter")
    .matches(/[a-z]/, "Must contain lowercase letter")
    .matches(/\d/, "Must contain number")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Must contain special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Please confirm your password"),
});

export default function ResetPasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [resetError, setResetError] = useState("");

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setResetError("");
        setResetSuccess(false);
        console.log("Reset password form submitted:", values);
       
        setResetSuccess(true);
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setResetError("Something went wrong. Please try again.");
      }
    },
  });

  const hasError = (field: keyof typeof formik.values) =>
    !!(formik.errors[field] && formik.touched[field]);

 

  const passwordsMatch =
    formik.values.newPassword === formik.values.confirmPassword &&
    formik.values.confirmPassword !== "";

  return (
    <>
      <div className={styles.formElement} style={{ animationDelay: "0.1s" }}>
        <h1 className="mb-2 header-large">Create a New Password</h1>
        <p className="text-[#484848] mb-8">
          Enter your new password below. Make sure it&apos;s strong and secure.
        </p>
      </div>

      <StatusMessage
        message={resetError}
        show={!!resetError}
        type="error"
        onHide={() => setResetError("")}
      />

      <StatusMessage
        message="Password reset successful! Redirecting..."
        show={resetSuccess}
        type="success"
        onHide={() => setResetSuccess(false)}
      />

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className={styles.formElement} style={{ animationDelay: "0.2s" }}>
          <label
            htmlFor="newPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? "text" : "password"}
              placeholder="Enter new password"
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 pr-12 ${
                hasError("newPassword")
                  ? `border-red-500 ring-2 ring-red-200 ${styles.errorShake}`
                  : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showNewPassword ? (
                <EyeOff size={20} fill="gray" />
              ) : (
                <Eye size={20} fill="gray" />
              )}
            </button>
          </div>

         

          <div className="h-6 mt-1">
            {hasError("newPassword") && (
              <div
                className={`${styles.errorMessage} ${styles.show} text-red-500 text-sm`}
              >
                {formik.errors.newPassword}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formElement} style={{ animationDelay: "0.3s" }}>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter password again"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 pr-12 ${
                hasError("confirmPassword")
                  ? `border-red-500 ring-2 ring-red-200 ${styles.errorShake}`
                  : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff size={20} fill="gray" />
              ) : (
                <Eye size={20} fill="gray" />
              )}
            </button>
          </div>

          <div className="h-6 mt-1 flex justify-between items-center">
            {hasError("confirmPassword") && (
              <div
                className={`${styles.errorMessage} ${styles.show} text-red-500 text-sm`}
              >
                {formik.errors.confirmPassword}
              </div>
            )}
            {formik.touched.confirmPassword && passwordsMatch && (
              <div className="text-green-600 text-sm flex items-center gap-1 ml-auto">
                <CheckCircle2 className="w-4 h-4" />
                Passwords match
              </div>
            )}
          </div>
        </div>

        <div className={styles.formElement} style={{ animationDelay: "0.4s" }}>
          <Button
            variant="default"
            size="large"
            className="w-full transition-all duration-300 hover:scale-105"
            disabled={formik.isSubmitting || resetSuccess}
          >
            {formik.isSubmitting ? "Resetting..." : "Reset Password"}
          </Button>
        </div>

        <div className={styles.formElement} style={{ animationDelay: "0.5s" }}>
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
