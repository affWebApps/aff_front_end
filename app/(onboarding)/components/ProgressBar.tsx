import React from "react";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="fixed top-16 md:top-0 lg:top-0 left-0 right-0 z-40">
      <div className="absolute inset-0 bg-[#fff8ef] h-[140px]" />

      <div className="relative lg:top-20 top-4 md:top-10">
        <div className="flex flex-col lg:flex-col-reverse gap-4 px-4 lg:px-6">
          <div className="flex gap-1">
            {[...Array(totalSteps)].map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  idx < currentStep ? "bg-[#5C4033]" : "bg-[#CCC4C0]"
                }`}
              />
            ))}
          </div>

          <div className="flex justify-start lg:justify-end">
            <span className="text-sm font-medium">
              Step {currentStep}/{totalSteps}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
