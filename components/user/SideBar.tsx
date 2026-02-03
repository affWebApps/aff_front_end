"use client";

import {
  BarChart3,
  Folder,
  Home,
  LogOut,
  Package,
  Wallet,
  Wrench,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { NavItem } from "./NavItem";
import Image from "next/image";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authServices";
import { useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  // Get token from auth store
  const { logout, token } = useAuthStore();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // const handleSignOut = async () => {
  //   try {
  //     setIsSigningOut(true);
  //     console.log("🚪 Signing out...");

  //     // Call backend logout with token
  //     try {
  //       if (token) {
  //         await authService.logout(token);
  //       }
  //     } catch (error) {
  //       console.warn("Backend logout failed, but continuing with local logout");
  //     }

  //     // Clear auth state from Zustand store (this also clears localStorage)
  //     logout();

  //     console.log("✅ Signed out successfully");

  //     // Redirect to sign-in page
  //     router.push("/sign-in");
  //   } catch (error) {
  //     console.error("❌ Sign out error:", error);
  //     // Even if there's an error, we should still clear local state
  //     logout();
  //     router.push("/sign-in");
  //   } finally {
  //     setIsSigningOut(false);
  //   }
  // };

  const handleSignOut = async () => {
    try {
      await logout();
      // setShowProfileMenu(false);
      router.push("/");
      // setToast({ message: "Logged out successfully", type: "success" });
    } catch (error) {
      console.error("Logout failed:", error);
      // setToast({ message: "Logout failed", type: "error" });
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-80 bg-[#5C4033] text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-amber-900 hover:bg-opacity-30 rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={70}
            height={40}
            className="rounded-lg object-contain"
          />
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          <NavItem
            icon={<Home size={20} />}
            label="Home"
            active={pathname === "/dashboard"}
            href="/dashboard"
            onClick={onClose}
          />
          <NavItem
            icon={<Folder size={20} />}
            label="Projects"
            active={pathname === "/projects"}
            href="/projects"
            onClick={onClose}
          />
          <NavItem
            icon={<Package size={20} />}
            label="Products"
            active={pathname === "/products"}
            href="/products"
            onClick={onClose}
          />
          <NavItem
            icon={<Wrench size={20} />}
            label="Services"
            active={pathname === "/services"}
            href="/services"
            onClick={onClose}
          />
          <NavItem
            icon={<Wallet size={20} />}
            label="Wallet"
            active={pathname === "/wallet"}
            href="/wallet"
            onClick={onClose}
          />
          <NavItem
            icon={<BarChart3 size={20} />}
            label="Analytics"
            active={pathname === "/analytics"}
            href="/analytics"
            onClick={onClose}
          />
        </nav>

        <div className="border-t border-amber-900 border-opacity-40 mx-4 my-2"></div>

        {/* Sign Out Button */}
        <div className="px-4 pb-4">
          <button
            onClick={handleSignOut}
            disabled={isSigningOut}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isSigningOut
                ? "bg-amber-900 bg-opacity-30 cursor-not-allowed opacity-50"
                : "hover:bg-amber-900 hover:bg-opacity-30"
              }`}
          >
            <LogOut size={20} />
            <span className="font-medium">
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </span>
          </button>
        </div>

        {/* Upgrade Card */}
        <div className="m-4 bg-white rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-gray-800 font-bold text-lg mb-2">
            Upgrade Your Account
          </h3>
          <p className="text-gray-500 text-sm mb-4 leading-relaxed">
            Unlock more tools and earn more across selling, and tailoring.
          </p>
          <Button size="large" className="w-full">
            Upgrade
          </Button>
        </div>
      </aside>
    </>
  );
}
