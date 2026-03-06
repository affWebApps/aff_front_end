"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  MessageSquare,
  Home,
  ShoppingBag,
  Settings,
  Star,
  TrendingUp,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Sessions", href: "/sessions", icon: MessageSquare },
  { label: "Orders", href: "/orders", icon: ShoppingBag },
  { label: "Reviews", href: "/reviews", icon: Star },
  { label: "Upgrade", href: "/upgrade", icon: TrendingUp },
  { label: "Settings", href: "/settings", icon: Settings },
];

export const SideBar: React.FC = () => {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-[#6b4e3d] text-white p-2 rounded-lg shadow-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle sidebar"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#6b4e3d] flex flex-col z-40 transition-transform duration-300
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center px-6 py-5 border-b border-white/10">
          <Link href="/" onClick={() => setIsMobileOpen(false)}>
            <Image
              src="/images/logo.svg"
              alt="AFF Logo"
              width={76}
              height={46}
              className="rounded-lg object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200
                  ${
                    isActive
                      ? "bg-[#FAB75B] text-white"
                      : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Log out */}
        <div className="px-4 py-5 border-t border-white/10">
          {/* TODO: wire up real auth sign-out when auth layer is added */}
          <button
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-colors duration-200"
            onClick={() => { /* sign-out placeholder */ }}
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </aside>
    </>
  );
};

export default SideBar;
