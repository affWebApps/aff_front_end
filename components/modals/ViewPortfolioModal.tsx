"use client";
import React from "react";
import { BaseModal } from "./BaseModal";

interface ViewPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewPortfolioModal({
  isOpen,
  onClose,
}: ViewPortfolioModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="View Portfolio"
      subtitle="See more about the project"
      maxWidth="lg"
    >
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project title
            </label>
            <p className="text-gray-900">Milkmaid dress</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project description
            </label>
            <p className="text-gray-900">
              Female dress that can be worn to Picnics
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <img
            src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop"
            alt="Milkmaid dress"
            className="w-full rounded-lg object-cover"
          />
          <img
            src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=600&fit=crop"
            alt="Milkmaid dress detail"
            className="w-full rounded-lg object-cover"
          />
        </div>
      </div>
    </BaseModal>
  );
}
