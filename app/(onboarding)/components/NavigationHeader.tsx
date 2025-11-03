import React from "react";
import { BackButton } from "../../components/ui/BackNavigation";

interface NavigationHeaderProps {
  currentStep: number;
  onBack: () => void;
  onSkip?: () => void;
  showSkip?: boolean;
}

export const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  onBack,
  onSkip,
  showSkip = false,
}) => {
  return (
    <div className="fixed top-0 md:top-40 lg:top-40 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-[#fff8ef] h-20 md:h-0" />

      <div className="relative max-w-7xl mx-auto py-4 px-4 md:px-8 pt-2">
        {showSkip && onSkip ? (
          <div className="flex flex-row items-center justify-between">
            <BackButton onClick={onBack} />
            <button
              onClick={onSkip}
              className="text-[#FAB75B] font-medium hover:underline cursor-pointer"
            >
              Skip
            </button>
          </div>
        ) : (
          <BackButton onClick={onBack} />
        )}
      </div>
    </div>
  );
};

export default NavigationHeader;
