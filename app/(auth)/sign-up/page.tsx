"use client";

import React, { useState, Suspense } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Button } from "../../../components/ui/Button";
import { SocialButton } from "../../../components/ui/SocialButtons";
import styles from "@/styles/login.module.css";
import Link from "next/link";
import { useRegister } from "@/hooks/useAuth";
import { useOAuth } from "../../../hooks/useOAuth";

export const dynamic = "force-dynamic";

const validationSchema = Yup.object({
  firstName: Yup.string()
    .min(2, "First name must be at least 2 characters")
    .required("First name is required"),
  lastName: Yup.string()
    .min(2, "Last name must be at least 2 characters")
    .required("Last name is required"),
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});


function RegisterFormContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    mutate: register,
    isPending,
    isError,
    error,
    isSuccess,
  } = useRegister();


  const {
    loginWithGoogle,
    loginWithFacebook,
    isLoading: oauthLoading,
  } = useOAuth();

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema,
    onSubmit: (values) => {
      register({
        email: values.email,
        password: values.password,
        first_name: values.firstName,
        last_name: values.lastName,
      });
    },
  });

  const hasError = (field: keyof typeof formik.values) =>
    !!(formik.errors[field] && formik.touched[field]);


  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto">
        <div className={styles.formElement} style={{ animationDelay: "0.1s" }}>
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Registration Successful! 🎉
            </h2>
            <p className="text-gray-600">
              A verification email has been sent to{" "}
              <strong>{formik.values.email}</strong>
            </p>
            <p className="text-sm text-gray-500">
              Please check your inbox and verify your email before logging in.
            </p>
            <Link href="/sign-in">
              <Button variant="default" size="large" className="w-full mt-6">
                Go to Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }


  const getErrorMessage = () => {
    if (!error) return "Registration failed. Please try again.";

    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: { data?: { message?: string } } };
      return (
        err.response?.data?.message || "Registration failed. Please try again."
      );
    }

    if (error instanceof Error) {
      return error.message;
    }

    return "Registration failed. Please try again.";
  };

  return (
    <>
      <div className={styles.formElement} style={{ animationDelay: "0.1s" }}>
        <h1 className="mb-2 header-large">Create a new account</h1>
        <p className="text-[#484848] mb-8">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-[#5C4033] hover:underline font-semibold"
          >
            Sign In
          </Link>
        </p>
      </div>

      {isError && (
        <div
          className={`${styles.formElement} mb-4 p-4 bg-red-50 border border-red-200 rounded-lg`}
          style={{ animationDelay: "0.15s" }}
        >
          <p className="text-red-700 text-sm">{getErrorMessage()}</p>
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-5">
        <div className={styles.formElement} style={{ animationDelay: "0.2s" }}>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            First Name
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Enter your first name"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 ${
              hasError("firstName")
                ? `border-red-500 ring-2 ring-red-200 ${styles.errorShake}`
                : "border-gray-300"
            }`}
          />
          <div className="h-6 mt-1">
            {hasError("firstName") && (
              <div
                className={`${styles.errorMessage} ${styles.show} text-red-500 text-sm`}
              >
                {formik.errors.firstName}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formElement} style={{ animationDelay: "0.25s" }}>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Last Name
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Enter your last name"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 ${
              hasError("lastName")
                ? `border-red-500 ring-2 ring-red-200 ${styles.errorShake}`
                : "border-gray-300"
            }`}
          />
          <div className="h-6 mt-1">
            {hasError("lastName") && (
              <div
                className={`${styles.errorMessage} ${styles.show} text-red-500 text-sm`}
              >
                {formik.errors.lastName}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formElement} style={{ animationDelay: "0.3s" }}>
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
            placeholder="Enter your email"
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

        <div className={styles.formElement} style={{ animationDelay: "0.35s" }}>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-300 pr-12 ${
                hasError("password")
                  ? `border-red-500 ring-2 ring-red-200 ${styles.errorShake}`
                  : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff size={20} fill="gray" />
              ) : (
                <Eye size={20} fill="gray" />
              )}
            </button>
          </div>
          <div className="h-6 mt-1">
            {hasError("password") && (
              <div
                className={`${styles.errorMessage} ${styles.show} text-red-500 text-sm`}
              >
                {formik.errors.password}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formElement} style={{ animationDelay: "0.4s" }}>
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
              placeholder="Confirm your password"
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
          <div className="h-6 mt-1">
            {hasError("confirmPassword") && (
              <div
                className={`${styles.errorMessage} ${styles.show} text-red-500 text-sm`}
              >
                {formik.errors.confirmPassword}
              </div>
            )}
          </div>
        </div>

        <div className={styles.formElement} style={{ animationDelay: "0.45s" }}>
          <Button
            variant="default"
            size="large"
            className="w-full transition-all duration-300 hover:scale-105"
            disabled={isPending || formik.isSubmitting}
          >
            {isPending ? "Creating Account..." : "Create Account"}
          </Button>
        </div>
      </form>

      <div className={styles.formElement} style={{ animationDelay: "0.5s" }}>
        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-[#fff8ef] text-gray-500">Or</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className={styles.formElement} style={{ animationDelay: "0.6s" }}>
          <SocialButton
            icon={
              <Image src="/icons/google.svg" alt="" height={20} width={20} />
            }
            text="Continue with Google"
            onClick={loginWithGoogle}
            disabled={oauthLoading}
          />
        </div>
        <div className={styles.formElement} style={{ animationDelay: "0.7s" }}>
          <SocialButton
            icon={
              <Image src="/icons/facebook.svg" alt="" height={20} width={20} />
            }
            text="Continue with Facebook"
            onClick={loginWithFacebook}
            disabled={oauthLoading}
          />
        </div>
        <div className={styles.formElement} style={{ animationDelay: "0.8s" }}>
          <SocialButton
            icon={
              <Image src="/icons/instagram.svg" alt="" height={20} width={20} />
            }
            text="Continue with Instagram"
          />
        </div>
        <div className={styles.formElement} style={{ animationDelay: "0.9s" }}>
          <SocialButton
            icon={
              <Image src="/icons/pintrest.svg" alt="" height={20} width={20} />
            }
            text="Continue with Pinterest"
          />
          <div className="w-full flex items-center justify-center mt-4 text-[#848484]">
            <p className="text-xs align-middle">
              By signing up, you agree to our{" "}
              <span className="text-[#4285F4] font-medium hover:underline cursor-pointer">
                Terms of use,{" "}
              </span>{" "}
              and{" "}
              <span className="text-[#4285F4] font-medium hover:underline cursor-pointer">
                Privacy policy{" "}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-400 border-r-transparent"></div>
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
