"use client";

import React, { useState, Suspense } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import styles from "@/styles/login.module.css";
import { Button } from "../../../components/ui/Button";
import { SocialButton } from "../../../components/ui/SocialButtons";
import { useAuthStore } from "@/store/authStore";
import { authService } from "../../../services/authServices";
import { AuthRedirect } from "../../../components/auth/AuthRedirect";
import { useOAuth } from "../../../hooks/useOAuth";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

function SignInContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const { loginWithGoogle, loginWithFacebook } = useOAuth();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        setLoginError("");
        console.log("🔐 Sign in form submitted:", values.email);

        const loginResponse = await authService.login({
          email: values.email,
          password: values.password,
        });

        console.log("✅ Login successful");

        if (!loginResponse.access_token) {
          throw new Error("No access token in response");
        }

        const userData = await authService.getCurrentUser(
          loginResponse.access_token
        );

        if (!userData) {
          throw new Error("No user data received");
        }

        setAuth(userData, loginResponse.access_token);
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("showToast", {
              detail: {
                message: `Welcome back, ${userData.first_name || "User"}!`,
                type: "success",
              },
            })
          );
        }

        router.push("/");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("❌ Login error:", error);

        if (error.response?.status === 401) {
          setLoginError("Email or password incorrect");
        } else if (error.response?.status === 403) {
          setLoginError("Please verify your email before logging in");
        } else if (error.response?.data?.message) {
          setLoginError(error.response.data.message);
        } else {
          setLoginError("An error occurred. Please try again.");
        }
      }
    },
  });

  const hasError = (field: keyof typeof formik.values) =>
    !!(formik.errors[field] && formik.touched[field]);

  return (
    <AuthRedirect>
      <>
        <div className={styles.formElement} style={{ animationDelay: "0.1s" }}>
          <h1 className="mb-2 header-large">Welcome back</h1>
          <p className="text-[#484848] mb-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/sign-up"
              className="text-[#5C4033] hover:underline font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {loginError && (
          <div
            className={styles.formElement}
            style={{ animationDelay: "0.15s" }}
          >
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm font-medium">
              {loginError}
            </div>
          </div>
        )}

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div
            className={styles.formElement}
            style={{ animationDelay: "0.2s" }}
          >
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
              placeholder="Someone@gmail.com"
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

          <div
            className={styles.formElement}
            style={{ animationDelay: "0.3s" }}
          >
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
                placeholder="0123456789"
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
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={20} fill="gray" />
                ) : (
                  <Eye size={20} fill="gray" />
                )}
              </button>
            </div>
            <div className="h-6 mt-1 flex justify-between items-center">
              {hasError("password") && (
                <div
                  className={`${styles.errorMessage} ${styles.show} text-red-500 text-sm`}
                >
                  {formik.errors.password}
                </div>
              )}
              <Link
                href="/forgot-password"
                className="text-sm text-gray-600 hover:text-[#5C4033] hover:underline ml-auto"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <div
            className={styles.formElement}
            style={{ animationDelay: "0.4s" }}
          >
            <Button
              variant="default"
              size="large"
              className="w-full transition-all duration-300 hover:scale-105"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? "Signing in..." : "Sign In"}
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
          <div
            className={styles.formElement}
            style={{ animationDelay: "0.6s" }}
          >
            <SocialButton
              icon={
                <Image src="/icons/google.svg" alt="" height={20} width={20} />
              }
              text="Continue with Google"
              onClick={loginWithGoogle}
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
              onClick={loginWithFacebook}
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
          </div>
        </div>
      </>
    </AuthRedirect>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  );
}
