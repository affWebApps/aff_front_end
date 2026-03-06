"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  User,
  ShoppingBag,
  Package,
  Store,
  MessageSquare,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/user/dashboard",
    icon: <LayoutDashboard size={20} />,
  },
  {
    label: "Profile",
    href: "/user/profile",
    icon: <User size={20} />,
  },
  {
    label: "My Designs",
    href: "/user/designs",
    icon: <ShoppingBag size={20} />,
  },
  {
    label: "My Orders",
    href: "/user/orders",
    icon: <Package size={20} />,
  },
  {
    label: "Marketplace",
    href: "/marketplace",
    icon: <Store size={20} />,
  },
  {
    label: "Messages",
    href: "/user/messages",
    icon: <MessageSquare size={20} />,
  },
  {
    label: "Settings",
    href: "/user/settings",
    icon: <Settings size={20} />,
  },
];

interface SideBarProps {
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const SideBar: React.FC<SideBarProps> = ({
  isMobileOpen = false,
  onMobileClose,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (href: string) => pathname === href;

  const handleSignOut = () => {
    router.push("/sign-in");
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50 flex flex-col
          bg-gradient-to-b from-[#6b4e3d] to-[#5a3d2f]
          shadow-2xl transition-all duration-300 ease-in-out
          ${isCollapsed ? "w-[72px]" : "w-[240px]"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-2 min-w-0">
              <Image
                src="/images/logo.svg"
                alt="AFF Logo"
                width={36}
                height={36}
                className="rounded-md shrink-0"
              />
              <span className="text-white font-semibold text-sm font-poppins truncate">
                AFF Dashboard
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/" className="mx-auto">
              <Image
                src="/images/logo.svg"
                alt="AFF Logo"
                width={36}
                height={36}
                className="rounded-md"
              />
            </Link>
          )}

          {/* Mobile close button */}
          <button
            onClick={onMobileClose}
            className="lg:hidden text-white/70 hover:text-white transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Profile */}
        <div
          className={`flex items-center gap-3 px-4 py-4 border-b border-white/10 ${
            isCollapsed ? "justify-center px-2" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-[#FAB75B] flex items-center justify-center shrink-0">
            <User size={18} className="text-[#5a3d2f]" />
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-white text-sm font-medium font-poppins truncate">
                My Account
              </p>
              <p className="text-white/50 text-xs truncate">Free Plan</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
                transition-all duration-200 group
                ${
                  isActive(item.href)
                    ? "bg-[#FAB75B] text-[#5a3d2f]"
                    : "text-white/75 hover:bg-white/10 hover:text-white"
                }
                ${isCollapsed ? "justify-center px-2" : ""}
              `}
              title={isCollapsed ? item.label : undefined}
            >
              <span className={isActive(item.href) ? "text-[#5a3d2f]" : ""}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className="font-poppins truncate">{item.label}</span>
              )}
            </Link>
          ))}
        </nav>

        {/* Upgrade CTA */}
        {!isCollapsed && (
          <div className="mx-3 mb-3 p-3 rounded-xl bg-[#FAB75B]/15 border border-[#FAB75B]/30">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-[#FAB75B]" />
              <span className="text-white text-xs font-semibold font-poppins">
                Upgrade to Pro
              </span>
            </div>
            <p className="text-white/60 text-xs mb-3 leading-relaxed">
              Unlock unlimited designs and priority support.
            </p>
            <Link
              href="/user/upgrade"
              className="flex items-center justify-center w-full py-2 rounded-lg bg-[#FAB75B] text-[#5a3d2f] text-xs font-semibold font-poppins hover:bg-[#E4A753] transition-colors duration-200"
            >
              Upgrade Now
            </Link>
          </div>
        )}

        {isCollapsed && (
          <div className="mx-2 mb-3">
            <Link
              href="/user/upgrade"
              className="flex items-center justify-center w-full py-2.5 rounded-lg bg-[#FAB75B] text-[#5a3d2f] hover:bg-[#E4A753] transition-colors duration-200"
              title="Upgrade to Pro"
            >
              <Zap size={18} />
            </Link>
          </div>
        )}

        {/* Logout */}
        <div className="px-2 pb-4 border-t border-white/10 pt-3">
          <button
            className={`
              flex items-center gap-3 w-full rounded-lg px-3 py-2.5 text-sm font-medium
              text-white/60 hover:bg-white/10 hover:text-white transition-all duration-200
              ${isCollapsed ? "justify-center px-2" : ""}
            `}
            title={isCollapsed ? "Sign Out" : undefined}
            onClick={handleSignOut}
          >
            <LogOut size={20} />
            {!isCollapsed && (
              <span className="font-poppins">Sign Out</span>
            )}
          </button>
        </div>

        {/* Collapse Toggle (desktop only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FAB75B] text-[#5a3d2f] items-center justify-center shadow-md hover:bg-[#E4A753] transition-colors z-10"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>
    </>
  );
};

export default SideBar;
