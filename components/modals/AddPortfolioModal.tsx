"use client";
import React from "react";
import { BaseModal } from "./BaseModal";

interface AddPortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddPortfolioModal({
  isOpen,
  onClose,
}: AddPortfolioModalProps) {
  const [images, setImages] = React.useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setImages([...images, ...newImages]);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Add new portfolio"
      subtitle="All fields are required unless otherwise indicated"
      maxWidth="md"
    >
      <div className="p-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project title
          </label>
          <input
            type="text"
            placeholder="Enter a quick title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project description
          </label>
          <textarea
            placeholder="Briefly describe the project"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image Upload{" "}
            <span className="text-gray-400 text-xs">
              (PNG, PNG size or SVG)
            </span>
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm text-gray-600 mb-2">Drop your image here</p>
              <label className="text-sm text-orange-500 font-medium cursor-pointer hover:text-orange-600">
                Browse
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-4">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  src={img}
                  alt={`Upload ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {[...Array(Math.max(0, 4 - images.length))].map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <span className="text-2xl text-gray-300">+</span>
              </div>
            ))}
          </div>
        </div>

        <button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-3 rounded-lg transition-colors">
          Publish
        </button>
      </div>
    </BaseModal>
  );
}
