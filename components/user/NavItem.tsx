import { ReactNode } from "react";
import Link from "next/link";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  href?: string;
}

export function NavItem({
  icon,
  label,
  active,
  onClick,
  href = "#",
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        active
          ? "bg-white bg-opacity-100 text-[#5C4033]"
          : "text-white hover:bg-[#745547] hover:bg-opacity-10"
      }`}
    >
      <span className={active ? "text-[#5C4033]" : "text-white"}>{icon}</span>
      <span className="font-medium">{label}</span>
    </Link>
  );
}
