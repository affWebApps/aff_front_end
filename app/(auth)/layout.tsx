"use client";

import React from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "@/app/styles/login.module.css";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const authImages = {
  "/sign-in": {
    mobile: "/images/sign-in-mobile.svg",
    large: "/images/sign-in-large.svg",
  },
  "/sign-up": {
    mobile: "/images/auth-image-mobile.svg",
    large: "/images/auth-image-large.svg",
  },
  "/verify-email": {
    mobile: "/images/auth-image-mobile.svg",
    large: "/images/auth-image-large.svg",
  },
  "/forgot-password": {
    mobile: "/images/sign-in-mobile.svg",
    large: "/images/sign-in-large.svg",
  },
  "/reset-password": {
    mobile: "/images/sign-in-mobile.svg",
    large: "/images/sign-in-large.svg",
  },
  "/password-reset-success": {
    mobile: "/images/auth-image-mobile.svg",
    large: "/images/auth-image-large.svg",
  },
  default: {
    mobile: "/images/auth-default-mobile.svg",
    large: "/images/auth-default-large.svg",
  },
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();

  // Get images for current route or use default
  const images =
    authImages[pathname as keyof typeof authImages] || authImages.default;

  return (
    <div className="min-h-screen flex flex-col xl:flex-row xl:p-4 xl:gap-6 bg-[#fff8ef]">
      {/* Left side - Image */}
      <div
        className={`xl:w-1/2 relative overflow-hidden w-full ${styles.slideInLeft}`}
      >
        <div className="absolute top-4 left-4 xl:top-8 xl:left-4 z-10 w-[60px] h-10 xl:w-[76px] xl:h-[46px]">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={76}
            height={46}
            className="rounded-lg w-full h-full object-contain"
          />
        </div>

        <div className="h-80 md:h-[550px] lg:h-[600px] xl:h-full xl:min-h-screen w-full relative">
          <Image
            src={images.mobile}
            alt=""
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="md:hidden rounded-md"
            priority
          />
          <Image
            src={images.large}
            alt=""
            fill
            style={{ objectFit: "cover", objectPosition: "center" }}
            className="hidden md:block rounded-md"
            priority
          />
        </div>
      </div>

      {/* Right side - Content */}
      <div
        className={`xl:w-1/2 bg-[#fff8ef] flex items-center justify-center p-6 xl:p-8 ${styles.slideInRight}`}
      >
        <div className="w-full max-w-md space-y-2 ">{children}</div>
      </div>
    </div>
  );
}
