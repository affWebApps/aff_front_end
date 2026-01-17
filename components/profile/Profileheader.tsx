"use client";
import { Mail, MapPin, Pencil, User, Briefcase } from "lucide-react";
import { User as UserType } from "@/services/authServices";

interface ProfileHeaderProps {
  user: UserType;
  portfolioTitle: string | null;
  onEdit: () => void;
}

export default function ProfileHeader({
  user,
  portfolioTitle,
  onEdit,
}: ProfileHeaderProps) {
  const displayName =
    user?.display_name ||
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    "User";

  const username = user?.email?.split("@")[0] || "user";

  const userBio =
    "No bio available. Click the edit button to add your professional bio.";

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-amber-400 to-orange-500">
            {user.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatar_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{displayName}</h1>
            <p className="text-gray-500">@{username}</p>
            {portfolioTitle && (
              <div className="flex items-center gap-1 mt-1">
                <Briefcase className="w-3 h-3 text-[#FAB75B]" />
                <p className="text-sm text-[#FAB75B] font-medium">
                  {portfolioTitle}
                </p>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onEdit}
          className="w-10 h-10 bg-[#FAB75B] rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
          aria-label="Edit profile"
        >
          <Pencil className="w-5 h-5 text-white" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Bio
          </h2>
          <p className="text-gray-700 text-sm leading-relaxed">{userBio}</p>

          <h2 className="text-sm font-semibold text-gray-500 uppercase mt-6 mb-3">
            Contact Information
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span>Lagos, NG</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Availability
          </h2>
          <div className="space-y-2 mb-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-700">Mon - Fri</span>
              </div>
              <span className="text-gray-600">10:00am - 6:00pm</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-700">Sat</span>
              </div>
              <span className="text-gray-600">11:00am - 4:00pm</span>
            </div>
          </div>

          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
            Pricing
          </h2>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <span className="text-gray-400">₦</span>
            <span>Starting from NGN 20,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
