import Image from "next/image";
import { Button } from "../../../components/ui/Button";

import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#5C4033] text-white shadow-md">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Image
            src="/images/logo.svg"
            alt="logo"
            width={76}
            height={46}
            className="rounded-lg object-contain"
          />

          {/* Sign Out Button */}
          <Button size="medium">Sign Out</Button>
        </div>
      </header>

      {/* Main Content */}
      <main >{children}</main>
    </div>
  );
} 
