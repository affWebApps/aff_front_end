import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
  showOnMobile?: boolean;
}

export const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = "Back",
  className = "",
  showOnMobile = true,
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.back();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center gap-2 
        text-gray-600 hover:text-gray-800 
        transition-all duration-200
        hover:gap-3
        focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 cursor-pointer
        rounded-lg px-2 py-1 -ml-2
        ${!showOnMobile ? "hidden sm:flex" : "flex"}
        ${className}
      `}
      aria-label="Go back"
    >
      <ArrowLeft size={20} className="shrink-0 sm:w-5 sm:h-5 w-4 h-4" />
      <span className="hidden sm:inline text-sm sm:text-base font-medium">
        {label}
      </span>
    </button>
  );
};
