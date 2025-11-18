
'use client'
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/Button";
import Image from "next/image";
import { Menu, X } from "lucide-react";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-linear-to-r from-[#6b4e3d] to-[#5a3d2f] shadow-lg">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center justify-between gap-10">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.svg"
                alt="logo"
                width={76}
                height={46}
                className="rounded-lg w-full h-full object-contain"
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8 ml-12">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`text-[15px] font-medium transition-colors duration-200 pb-1 border-b-2 ${
                    item.label === "Home"
                      ? "text-white border-[#F5A623]"
                      : "text-gray-300 hover:text-white border-transparent hover:border-[#F5A623]/50"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-white text-[15px] font-medium hover:text-gray-200 transition-colors duration-200 hidden lg:block">
              Sign In
            </button>
            <Button size="medium">Get Started</Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white hover:text-gray-200 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-white/10">
            <nav className="flex flex-col space-y-4 pt-4">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className={`text-[15px] font-medium transition-colors duration-200 ${
                    item.label === "Home"
                      ? "text-white"
                      : "text-gray-300 hover:text-white"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                <button className="text-white text-[15px] font-medium hover:text-gray-200 transition-colors duration-200">
                  Sign In
                </button>
                <Button size="medium">Get Started</Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
