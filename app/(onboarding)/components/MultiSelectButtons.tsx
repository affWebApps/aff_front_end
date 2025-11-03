import React from "react";

interface MultiSelectButtonsProps {
  title: string;
  subtitle?: string;
  secondTitle?: string;
  options: string[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
}

export const MultiSelectButtons: React.FC<MultiSelectButtonsProps> = ({
  title,
  subtitle,
  secondTitle,
  options,
  selectedOptions,
  onToggle,
}) => {
  return (
    <div className="space-y-8">
      <div className="text-center mb-12">
        <h1 className="header-large mb-3">{title}</h1>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>

      <div>
        {secondTitle && <h2 className="header-small  mt-4 w-full flex items-center justify-center ">{secondTitle}</h2>}
      </div>

      <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => onToggle(option)}
            className={`px-6 py-3 rounded-lg font-medium transition-all cursor-pointer  ${
              selectedOptions.includes(option)
                ? "bg-[#5C4033] text-white"
                : "bg-[#EFECEB] text-[#424242] hover:bg-gray-300"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
