/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useMemo, useState } from "react";
import { BaseModal } from "./BaseModal";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/store/authStore";
import { Upload, Loader2 } from "lucide-react";
import { authService } from "@/services/authServices";
import { imageUploadService } from "@/services/imageUploadService";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const { user, token, updateUser } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initialFormData = useMemo(
    () => ({
      firstName: user?.first_name || "",
      lastName: user?.last_name || "",
      displayName: user?.display_name || "",
      email: user?.email || "",
      city: user?.city || "",
      country: user?.country || "Nigeria",
      pricing: "NGN 20,000",
      bio: user?.bio || "",
      avatarUrl: user?.avatar_url || "",
      mondayFridayFrom: "10:00am",
      mondayFridayTo: "6:00pm",
      saturdayFrom: "11:00am",
      saturdayTo: "4:00pm",
    }),
    [user]
  );

  const [formData, setFormData] = React.useState(initialFormData);

  React.useEffect(() => {
    if (isOpen) {
      setFormData(() => initialFormData);
      setError(null);
    }
  }, [isOpen, initialFormData]);

  const handleSave = async () => {
    if (!token) {
      setError("No authentication token found");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Call the API to update profile
      const updatedUser = await authService.updateProfile(
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          displayName: formData.displayName,
          bio: formData.bio,
          avatarUrl: formData.avatarUrl,
          city: formData.city || "",
          country: formData.country || "",
        },
        token
      );

      // Update the local store with the response from API
      updateUser(updatedUser);

      console.log("✅ Profile updated successfully");
      onClose();
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      setError(
        error.response?.data?.message ||
        error.message ||
        "Failed to update profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image before uploading
    const validation = imageUploadService.validateImage(file);
    if (!validation.valid) {
      setError(validation.error || "Invalid image file");
      return;
    }

    try {
      setIsUploadingAvatar(true);
      setError(null);

      // Upload using centralized service
      const { publicUrl } = await imageUploadService.uploadSingleImage({
        file,
        folder: "public",
        onProgress: (status) => {
          console.log(`Avatar upload status: ${status}`);
        },
      });

      setFormData({ ...formData, avatarUrl: publicUrl });
      console.log("✅ Avatar uploaded successfully:", publicUrl);
    } catch (error: any) {
      console.error("Failed to upload avatar:", error);
      setError(error.message || "Failed to upload avatar. Please try again.");
    } finally {
      setIsUploadingAvatar(false);
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
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Avatar Section */}
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={displayName}
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
              className={`absolute bottom-0 right-0 w-6 h-6 bg-[#FAB75B] rounded-full border-2 border-white flex items-center justify-center cursor-pointer hover:bg-amber-500 transition-colors ${isUploadingAvatar ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-3 h-3 text-white animate-spin" />
              ) : (
                <Upload className="w-3 h-3 text-white" />
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={isUploadingAvatar}
              />
            </label>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{displayName}</p>
            <p className="text-xs text-gray-500">
              {isUploadingAvatar
                ? "Uploading..."
                : "Click the icon to change avatar"}
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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
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
            disabled={isSubmitting}
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
              Country
            </label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
              placeholder="e.g., Nigeria"
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
              placeholder="e.g., Lagos"
              disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>

        {/* Pricing */}
        {/* <div className="mb-6">
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
            disabled={isSubmitting}
          />
        </div> */}

        {/* Availability */}
        {/* <div className="mb-6">
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
                disabled={isSubmitting}
              />
              <input
                type="text"
                placeholder="To"
                value={formData.mondayFridayTo}
                onChange={(e) =>
                  setFormData({ ...formData, mondayFridayTo: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] text-sm"
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              <input
                type="text"
                placeholder="To"
                value={formData.saturdayTo}
                onChange={(e) =>
                  setFormData({ ...formData, saturdayTo: e.target.value })
                }
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B] text-sm"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </div> */}

        {/* Save Button */}
        <Button
          variant="default"
          size="large"
          onClick={handleSave}
          className="w-full"
          disabled={isSubmitting || isUploadingAvatar}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </span>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </BaseModal>
  );
}
