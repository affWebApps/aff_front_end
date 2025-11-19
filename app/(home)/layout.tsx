"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return (
    <div className="w-full bg-linear-to-b from-orange-50 to-white">
      <Header />
      <main className="min-h-screen pt-20 lg:mt-16">{children}</main>
      <Footer />
    </div>
  );
}
