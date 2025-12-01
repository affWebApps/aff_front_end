"use client";
import React from "react";
import { BaseModal } from "./BaseModal";
import { Button } from "../ui/Button";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const [formData, setFormData] = React.useState({
    fullName: "Maria Santos",
    displayName: "mariasant00",
    email: "mariasantos@gmail.com",
    location: "Lagos, NG",
    pricing: "NGN 25,000",
    bio: "With over 15 years of experience in custom tailoring and alterations. I specialize in creating garments that epitomize the every occasion. From custom suits to elegant dresses, I bring stories to life through the timeless art of tailoring. My devotion to detail ensures that each piece is tailored to your exact specifications and comfort.",
  });

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit your info"
      subtitle="Edit any information about you"
      maxWidth="2xl"
    >
      <div className="p-6">
        <div className="flex items-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-semibold">
              M
            </div>
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-yellow-400 rounded-full border-2 border-white"></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location (City, Country)
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pricing{" "}
            <span className="text-gray-400 text-xs">(pricing/Hour)</span>
          </label>
          <input
            type="text"
            value={formData.pricing}
            onChange={(e) =>
              setFormData({ ...formData, pricing: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Availability
          </label>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-sm text-gray-600">Mondays - Fridays</span>
              <input
                type="text"
                placeholder="From"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
              <input
                type="text"
                placeholder="To"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-sm text-gray-600">Saturdays</span>
              <input
                type="text"
                placeholder="From"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
              <input
                type="text"
                placeholder="To"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
              />
            </div>
          </div>
        </div>

        <Button variant="default" size="large" onClick={onClose} className="w-full">
          Save
        </Button>
      </div>
    </BaseModal>
  );
}
