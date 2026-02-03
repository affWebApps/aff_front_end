// components/modals/ViewPortfolioModal.tsx
/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import { Star } from "lucide-react";
import { BaseModal } from "./BaseModal";
import { Portfolio } from "@/services/portfolioService";

interface ViewPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolio: Portfolio | null;
}

export default function ViewPortfolioModal({
  isOpen,
  onClose,
  portfolio,
}: ViewPortfolioModalProps) {
  if (!portfolio) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="View Portfolio"
      subtitle="See more about the project"
      maxWidth="lg"
    >
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {/* Project Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project title
            </label>
            <p className="text-gray-900 font-semibold">{portfolio.title}</p>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project description
            </label>
            <p className="text-gray-700 leading-relaxed">
              {portfolio.description}
            </p>
          </div>
        </div>

        {/* Portfolio Images */}
        {portfolio.Image && portfolio.Image.length > 0 ? (
          <div className="space-y-4">
            {portfolio.Image.map((image, index) => (
              <div key={image.id} className="relative">
                <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={image.image_url}
                    alt={`${portfolio.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {image.is_primary && (
                    <div className="absolute top-4 left-4 bg-[#FAB75B] text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-medium">
                      <Star className="w-3 h-3 fill-current" />
                      Primary Image
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>No images available for this portfolio</p>
          </div>
        )}

        {/* Metadata */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Created: {new Date(portfolio.created_at).toLocaleDateString()}
            </span>
            <span>{portfolio.Image.length} images</span>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
