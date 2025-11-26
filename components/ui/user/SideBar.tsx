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
import { useState } from "react";
import { NavItem } from "./NavItem";
import Image from "next/image";
import { Button } from "../Button";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [activeNav, setActiveNav] = useState("home");

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#5C4033] text-white flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 hover:bg-amber-800 rounded-lg"
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
            active={activeNav === "home"}
            onClick={() => {
              setActiveNav("home");
              onClose();
            }}
          />
          <NavItem
            icon={<Folder size={20} />}
            label="Projects"
            active={activeNav === "projects"}
            onClick={() => {
              setActiveNav("projects");
              onClose();
            }}
          />
          <NavItem
            icon={<Package size={20} />}
            label="Products"
            active={activeNav === "products"}
            onClick={() => {
              setActiveNav("products");
              onClose();
            }}
          />
          <NavItem
            icon={<Wrench size={20} />}
            label="Services"
            active={activeNav === "services"}
            onClick={() => {
              setActiveNav("services");
              onClose();
            }}
          />
          <NavItem
            icon={<Wallet size={20} />}
            label="Wallet"
            active={activeNav === "wallet"}
            onClick={() => {
              setActiveNav("wallet");
              onClose();
            }}
          />
          <NavItem
            icon={<BarChart3 size={20} />}
            label="Analytics"
            active={activeNav === "analytics"}
            onClick={() => {
              setActiveNav("analytics");
              onClose();
            }}
          />
        </nav>

        <div className="border-t border-amber-800 mx-4"></div>

        <div className="p-4">
          <NavItem
            icon={<LogOut size={20} />}
            label="Sign Out"
            active={false}
            onClick={() => alert("Signing out...")}
          />
        </div>

        <div className="m-4 bg-white rounded-2xl p-6 text-center">
          <h3 className="text-gray-800 font-semibold mb-2">
            Upgrade Your Account
          </h3>
          <p className="text-gray-500 text-sm mb-4">
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
