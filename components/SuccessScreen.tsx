"use client";
import React from "react";
import { Check, Download, Printer } from "lucide-react";

interface SuccessScreenProps {
  title: string;
  subtitle: string;
  transactionDetails?: {
    label: string;
    value: string;
  }[];
  showReceipt?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  footerText?: string;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({
  title,
  subtitle,
  transactionDetails = [],
  showReceipt = false,
  buttonText = "Back to wallet",
  onButtonClick,
  footerText,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
            <Check size={48} className="text-white" strokeWidth={3} />
          </div>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-2">
            {title}
          </h1>
          <p className="text-gray-600">{subtitle}</p>
        </div>

        {/* Receipt Actions */}
        {showReceipt && (
          <div className="flex justify-center gap-6 mb-6">
            <button className="flex items-center gap-2 text-[#E9A556] hover:underline">
              <Download size={18} />
              <span>Download receipt</span>
            </button>
            <button className="flex items-center gap-2 text-[#E9A556] hover:underline">
              <Printer size={18} />
              <span>Print receipt</span>
            </button>
          </div>
        )}

        {/* Transaction Details */}
        {transactionDetails.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 mb-6">
            <div className="space-y-4">
              {transactionDetails.map((detail, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                >
                  <span className="text-gray-600">{detail.label}</span>
                  <span className="font-semibold text-gray-800">
                    {detail.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer Text */}
        {footerText && (
          <p className="text-center text-gray-600 mb-6">{footerText}</p>
        )}

        {/* Action Button */}
        <button
          onClick={onButtonClick}
          className="w-full bg-[#E9A556] text-white py-3 rounded-lg hover:bg-[#d89444] transition-colors font-medium text-lg"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default SuccessScreen;
