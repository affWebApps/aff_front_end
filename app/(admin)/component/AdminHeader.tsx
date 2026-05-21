"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/Button";

export default function AdminHeader() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleSignOut = async () => {
    await logout();
    router.push("/sign-in");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#5C4033] text-white shadow-md">
      <div className="px-6 py-4 flex items-center justify-between">
        <Image
          src="/images/logo.svg"
          alt="logo"
          width={76}
          height={46}
          className="rounded-lg object-contain"
        />
        <Button size="medium" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </header>
  );
}
