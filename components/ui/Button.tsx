import React from "react";
import { Plus, ArrowRight, PlayCircle } from "lucide-react";
import {
  ButtonVariant,
  ButtonSize,
  IconType,
  IconPosition,
} from "../../types/buttonTypes";

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: IconType;
  iconPosition?: IconPosition;
  disabled?: boolean;
  outlined?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  size = "medium",
  icon = null,
  iconPosition = "none",
  disabled = false,
  outlined = false,
  onClick,
  className = "",
}) => {
  const baseStyles =
    "font-poppins font-medium transition-all duration-200 rounded-lg flex items-center justify-center gap-2";

  const sizeStyles: Record<ButtonSize, string> = {
    small: "px-4 py-2 text-sm",
    medium: "px-6 py-2.5 text-sm",
    large: "px-8 py-3 text-base",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    default: outlined
      ? "bg-transparent border-1 border-[#FAB75B] text-[#FAB75B] hover:border-[#E4A753] hover:text-[#E4A753]"
      : "bg-[#FAB75B]  text-white hover:bg-[#E4A753] shadow-md hover:shadow-lg",
    text: "bg-transparent text-orange-400 hover:text-orange-500",
    multichoice: outlined
      ? "bg-transparent border border-gray-600 text-gray-400 hover:border-orange-400 hover:text-orange-400"
      : "bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600",
    multichoiceActive:
      "bg-transparent border border-orange-400 text-orange-400",
  };

  const disabledStyles =
    "opacity-50 cursor-not-allowed hover:from-orange-400 hover:to-orange-500";

  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
    ${disabled ? disabledStyles : "cursor-pointer"}
    ${className}
  `;

  const renderIcon = () => {
    if (icon === "plus") return <Plus size={20} />;
    if (icon === "arrow") return <ArrowRight size={20} />;
    if (icon === "play") return <PlayCircle size={20} />;
    return null;
  };

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {iconPosition === "left" && renderIcon()}
      {children}
      {iconPosition === "right" && renderIcon()}
    </button>
  );
};
