"use client";
import React, { useMemo } from "react";
import { BaseModal } from "./BaseModal";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/store/authStore";
import Image from "next/image";
import { Upload } from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const { user, updateUser } = useAuthStore();

  // Memoize initial form data based on user
  const initialFormData = useMemo(
    () => ({
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      displayName: user?.display_name || "",
      email: user?.email || "",
      location: "Lagos, NG",
      pricing: "NGN 20,000",
      bio: user?.portfolios?.[0]?.description || "",
      avatarUrl: user?.avatar_url || "",
      mondayFridayFrom: "10:00am",
      mondayFridayTo: "6:00pm",
      saturdayFrom: "11:00am",
      saturdayTo: "4:00pm",
    }),
    [user]
  );

  // Use a key prop on the form to reset it when modal opens
  // This is cleaner than using useEffect to set state
  const [formData, setFormData] = React.useState(initialFormData);

  // Reset form data when modal opens by using the key
  // Alternative: Add key={isOpen ? 'open' : 'closed'} to parent div
  React.useEffect(() => {
    if (isOpen) {
      // Use a callback form to avoid dependency on formData
      setFormData(() => initialFormData);
    }
  }, [isOpen, initialFormData]);

  const handleSave = async () => {
    try {
      // Update user in the store (you'll need to add API call here)
      updateUser({
        first_name: formData.firstName,
        last_name: formData.lastName,
        display_name: formData.displayName,
        avatar_url: formData.avatarUrl,
      });

      onClose();
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // TODO: Upload file and get URL
      // For now, just create a local preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData({ ...formData, avatarUrl: previewUrl });
    }
  };

  const displayName =
    user?.display_name ||
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    "User";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit your info"
      subtitle="Edit any information about you"
      maxWidth="2xl"
    >
      <div className="max-h-[70vh] overflow-y-auto p-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              {formData.avatarUrl ? (
                <Image
                  src={formData.avatarUrl}
                  alt={displayName}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              ) : (
                <span className="text-white text-xl font-semibold">
                  {initials}
                </span>
              )}
            </div>
            <label
              htmlFor="avatar-upload"
              className="absolute bottom-0 right-0 w-6 h-6 bg-[#FAB75B] rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-amber-500 transition-colors"
            >
              <Upload className="w-3 h-3 text-white" />
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">
              Click the icon to change avatar
            </p>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
            />
          </div>
        </div>

        {/* Display Name */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Name
          </label>
          <input
            type="text"
            value={formData.displayName}
            onChange={(e) =>
              setFormData({ ...formData, displayName: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
            placeholder="How you want to be called"
          />
        </div>

        {/* Email & Location */}
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] bg-gray-50"
              disabled
            />
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] resize-none"
            placeholder="Tell us about yourself and your expertise..."
          />
        </div>

        {/* Pricing */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pricing{" "}
            <span className="text-gray-400 text-xs">(starting price)</span>
          </label>
          <input
            type="text"
            value={formData.pricing}
            onChange={(e) =>
              setFormData({ ...formData, pricing: e.target.value })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
            placeholder="e.g., NGN 20,000"
          />
        </div>

        {/* Availability */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Availability
          </label>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-sm text-gray-600">Mon - Fri</span>
              <input
                type="text"
                placeholder="From"
                value={formData.mondayFridayFrom}
                onChange={(e) =>
                  setFormData({ ...formData, mondayFridayFrom: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] text-sm"
              />
              <input
                type="text"
                placeholder="To"
                value={formData.mondayFridayTo}
                onChange={(e) =>
                  setFormData({ ...formData, mondayFridayTo: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] text-sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-4 items-center">
              <span className="text-sm text-gray-600">Saturday</span>
              <input
                type="text"
                placeholder="From"
                value={formData.saturdayFrom}
                onChange={(e) =>
                  setFormData({ ...formData, saturdayFrom: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] text-sm"
              />
              <input
                type="text"
                placeholder="To"
                value={formData.saturdayTo}
                onChange={(e) =>
                  setFormData({ ...formData, saturdayTo: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          variant="default"
          size="large"
          onClick={handleSave}
          className="w-full"
        >
          Save Changes
        </Button>
      </div>
    </BaseModal>
  );
}
