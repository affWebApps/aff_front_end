"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { Button } from "../../components/ui/Button";
import { SocialButton } from "../../components/ui/SocialButtons";
import styles from "@/app/styles/login.module.css";
import Link from "next/link";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: (values) => {
      console.log("Login form submitted:", values);
      // Handle login submission here
    },
  });

  const hasError = (field: keyof typeof formik.values) =>
    !!(formik.errors[field] && formik.touched[field]);

  return (
    <>
      <div className={styles.formElement} style={{ animationDelay: "0.1s" }}>
        <h1 className="mb-2 header-large">Create a new account</h1>
        <p className="text-[#484848] mb-8">
          Do you have an account?{" "}
          <Link
            href="/sign-in"
            className="text-[#5C4033] hover:underline font-semibold"
          >
            Sign In
          </Link>
        </p>
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

        <div className={styles.formElement} style={{ animationDelay: "0.3s" }}>
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
          <Button
            variant="default"
            size="large"
            className="w-full transition-all duration-300 hover:scale-105"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </div>

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
          <div
            className={styles.formElement}
            style={{ animationDelay: "0.6s" }}
          >
            <SocialButton
              icon={
                <Image src="/icons/google.svg" alt="" height={20} width={20} />
              }
              text="Continue with Google"
            />
          </div>
          <div
            className={styles.formElement}
            style={{ animationDelay: "0.7s" }}
          >
            <SocialButton
              icon={
                <Image
                  src="/icons/facebook.svg"
                  alt=""
                  height={20}
                  width={20}
                />
              }
              text="Continue with Facebook"
            />
          </div>
          <div
            className={styles.formElement}
            style={{ animationDelay: "0.8s" }}
          >
            <SocialButton
              icon={
                <Image
                  src="/icons/instagram.svg"
                  alt=""
                  height={20}
                  width={20}
                />
              }
              text="Continue with Instagram"
            />
          </div>
          <div
            className={styles.formElement}
            style={{ animationDelay: "0.9s" }}
          >
            <SocialButton
              icon={
                <Image
                  src="/icons/pintrest.svg"
                  alt=""
                  height={20}
                  width={20}
                />
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
      </form>
    </>
  );
}
