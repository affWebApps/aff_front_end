"use client";

import Link from "next/link";
import HomeLayout from "@/app/(home)/layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL;

const quickLinks = [
  {
    title: "Dashboard",
    description: "Manage your dashboard, activity, and account workspace.",
    href: "/dashboard",
  },
  {
    title: "Marketplace",
    description: "Browse products and services across the marketplace.",
    href: "/marketplace",
  },
  {
    title: "Wallet",
    description: "Check balances, transactions, and recent orders.",
    href: "/wallet",
  },
  {
    title: "Products",
    description: "View, create, and manage your listed products.",
    href: "/products",
  },
  {
    title: "Projects",
    description: "Track your active projects and service work.",
    href: "/projects",
  },
  {
    title: "Profile",
    description: "Update your profile, details, and public information.",
    href: "/user",
  },
  ...(studioUrl
    ? [
      {
        title: "Studio",
        description: "Open the design studio in a new tab.",
        href: studioUrl,
        external: true,
      },
    ]
    : []),
];

export default function HubPage() {
  return (
    <ProtectedRoute>
      <HomeLayout>
        <section className="min-h-[calc(100vh-10rem)] px-4 py-10 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 sm:mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#E9A556]">
                Quick Links
              </p>
              <h1 className="mt-3 text-3xl font-bold text-[#2F241F] sm:text-4xl">
                Choose where you want to go
              </h1>
              <p className="mt-3 max-w-2xl text-base text-[#6B5B52]">
                Jump straight into the main parts of your account from one place.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {quickLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.title}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-2xl border border-[#E7D7CC] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#E9A556] hover:shadow-md"
                  >
                    <h2 className="text-2xl font-bold text-[#2F241F]">
                      {link.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[#6B5B52]">
                      {link.description}
                    </p>
                  </a>
                ) : (
                  <Link
                    key={link.title}
                    href={link.href}
                    className="group rounded-2xl border border-[#E7D7CC] bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-[#E9A556] hover:shadow-md"
                  >
                    <h2 className="text-2xl font-bold text-[#2F241F]">
                      {link.title}
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-[#6B5B52]">
                      {link.description}
                    </p>
                  </Link>
                )
              )}
            </div>
          </div>
        </section>
      </HomeLayout>
    </ProtectedRoute>
  );
}
