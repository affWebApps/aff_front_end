"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="hidden md:block fixed top-0 left-0 z-60 px-6 py-4"
      >
        <div className="inline-block px-4 py-2 rounded-lg bg-[#fff8ef]">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={76}
            height={46}
            className="rounded-lg w-full h-full object-contain"
          />
        </div>
      </motion.div>

      <main>{children}</main>
    </div>
  );
}
