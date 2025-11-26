import { ReactNode } from "react";

interface NavItemProps {
  icon: ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

export function NavItem({ icon, label, active, onClick }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? "bg-amber-800 text-white"
          : "text-amber-100 hover:bg-amber-800/50"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
