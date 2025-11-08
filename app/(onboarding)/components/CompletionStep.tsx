import React from "react";
import { Check } from "lucide-react";

interface CompletionStepProps {
  title: string;
  message: string;
}

export const CompletionStep: React.FC<CompletionStepProps> = ({
  title,
  message,
}) => {
  return (
    <div className="text-center space-y-8">
      <h1 className="header-large mb-12">{title}</h1>

      <div className="flex justify-center mb-8">
        <div className="relative">
          <div className="w-32 h-32 rounded-full bg-linear-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg">
            <Check size={64} className="text-white" strokeWidth={3} />
          </div>
          <div className="absolute inset-0 rounded-full bg-green-400 opacity-30 animate-ping"></div>
        </div>
      </div>

      <p className="text-gray-600 max-w-md mx-auto text-lg">{message}</p>
    </div>
  );
};
