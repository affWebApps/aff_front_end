import React from "react";

interface ToggleSwitchProps {
  label: string;
  description?: string;
  required?: boolean;
  checked: boolean;
  onChange: () => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  required = false,
  checked,
  onChange,
}) => {
  return (
    <div className="flex items-center justify-between bg-white p-6 rounded-xl border border-gray-300">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </h3>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </div>
      <button
        onClick={onChange}
        aria-label={label}
        className={`relative w-14 h-8 rounded-full transition-colors ${
          checked ? "bg-blue-500" : "bg-gray-300"
        }`}
      >
        <span
          className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
            checked ? "translate-x-6" : ""
          }`}
        />
      </button>
    </div>
  );
};
