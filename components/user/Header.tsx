"use client";

import { MessageSquare, Search, Bell, Menu, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuthStore } from "@/store/authStore";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuthStore();

  return (
    <header className="bg-[#FAF6F0] border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <Menu size={24} className="text-gray-600" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search
              className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm sm:text-base"
            />
          </div>
        </div>

        {/* Header Icons */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:block"
            aria-label="Messages"
          >
            <MessageSquare size={24} className="text-gray-600" />
          </button>
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
            aria-label="Notifications"
          >
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar */}
          <Link
            href="/user"
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center overflow-hidden"
            aria-label="User profile"
          >
            {user?.avatar_url ? (
              <Image
                src={user.avatar_url}
                alt={
                  user.display_name || `${user.first_name} ${user.last_name}`
                }
                fill
                className="object-cover"
                sizes="40px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-400 to-orange-500">
                <User size={20} className="text-white" />
              </div>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
