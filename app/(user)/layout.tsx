"use client";

import React, { useState } from "react";
import { Menu } from "lucide-react";
import SideBar from "@/components/user/SideBar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-orange-50/40">
      <SideBar
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main content area */}
      <div className="lg:pl-[240px] transition-all duration-300 min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-4 bg-white border-b border-gray-200 px-4 py-3 shadow-sm">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="text-[#6b4e3d] hover:text-[#5a3d2f] transition-colors"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-[#5a3d2f] font-semibold font-poppins text-base">
            AFF Dashboard
          </h1>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
