import React from "react";
import SideBar from "@/components/user/SideBar";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fff8ef] flex">
      <SideBar />
      {/* Main content — offset by sidebar width on md+ */}
      <main className="flex-1 md:ml-64 p-6 pt-16 md:pt-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
