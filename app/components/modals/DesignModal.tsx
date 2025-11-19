"use client";
import React from "react";
import { Heart, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import { BaseModal } from "./BaseModal";

interface Design {
  id: number;
  title: string;
  image: string;
  designer: string;
  location: string;
  garmentType: string;
  fabric: string;
  colorTheme: string;
  description: string;
  likes: number;
  comments: number;
}

interface DesignModalProps {
  isOpen: boolean;
  onClose: () => void;
  design: Design | null;
}

export const DesignModal = ({ isOpen, onClose, design }: DesignModalProps) => {
  if (!design) return null;

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="md"
      showCloseButton={false}
    >
      <div className="p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-24 h-32 rounded-lg overflow-hidden shrink-0 bg-gray-100">
            <Image
              src={design.image}
              alt={design.title}
              width={96}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {design.title}
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white font-semibold">
                {design.designer.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {design.designer}
                </p>
                <p className="text-xs text-gray-500">{design.location}</p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase mb-1">
              Garment Type
            </p>
            <p className="text-gray-900">{design.garmentType}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase mb-1">
              Fabric
            </p>
            <p className="text-gray-900">{design.fabric}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase mb-1">
              Colour Theme
            </p>
            <p className="text-gray-900">{design.colorTheme}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500 uppercase mb-1">
              Description
            </p>
            <p className="text-gray-900">{design.description}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 pt-2">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              <span>{design.likes} likes</span>
            </div>
            <div className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              <span>{design.comments} comments</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button className="flex-1 bg-[#FAB75B] hover:bg-[#e9a547] text-white font-semibold py-3 rounded-lg transition-colors">
            Hire this Tailor
          </button>
          <button className="flex-1 border-2 border-[#FAB75B] text-[#FAB75B] hover:bg-orange-50 font-semibold py-3 rounded-lg transition-colors">
            View Profile
          </button>
        </div>
      </div>
    </BaseModal>
  );
};
