"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/store/authStore";
import axios from "axios";

interface SettingsProps {
  notifications: {
    newMessages: boolean;
    activityUpdates: boolean;
    securityAlerts: boolean;
  };
  onNotificationsChange: (notifications: {
    newMessages: boolean;
    activityUpdates: boolean;
    securityAlerts: boolean;
  }) => void;
}

export default function Settings({
  notifications,
  onNotificationsChange,
}: SettingsProps) {
  const { token } = useAuthStore();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword === currentPassword) {
      setError("New password must be different from current password");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/change-password`,
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setSuccess("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");

        setTimeout(() => setSuccess(null), 5000);
      }
    } catch (err: any) {
      console.error("Password change error:", err);

      if (err.response?.status === 401) {
        setError("Current password is incorrect");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to change password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationToggle = (key: keyof typeof notifications) => {
    onNotificationsChange({
      ...notifications,
      [key]: !notifications[key],
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>

      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">Change Password</h3>
        <p className="text-sm text-gray-500 mb-4">
          Update your password here to keep your account secure
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label
              htmlFor="current-password"
              className="block text-sm text-gray-700 mb-2"
            >
              Current password
            </label>
            <div className="relative">
              <input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                placeholder="************"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Toggle current password visibility"
              >
                {showCurrentPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="new-password"
              className="block text-sm text-gray-700 mb-2"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                placeholder="************"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Toggle new password visibility"
              >
                {showNewPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm text-gray-700 mb-2"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="************"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#FAB75B] text-white font-semibold rounded-lg hover:bg-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-2">
          Email Notifications
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Choose which emails you want to receive
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900">New Messages</h4>
              <p className="text-sm text-gray-500">
                Get notified when you receive new messages
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.newMessages}
                onChange={() => handleNotificationToggle("newMessages")}
                className="sr-only peer"
                aria-label="Toggle new messages notifications"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FAB75B]"></div>
            </label>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Activity Updates</h4>
              <p className="text-sm text-gray-500">
                Receive updates about your account activity
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.activityUpdates}
                onChange={() => handleNotificationToggle("activityUpdates")}
                className="sr-only peer"
                aria-label="Toggle activity updates notifications"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FAB75B]"></div>
            </label>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-gray-900">Security Alerts</h4>
              <p className="text-sm text-gray-500">
                Receive important security notifications
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.securityAlerts}
                onChange={() => handleNotificationToggle("securityAlerts")}
                className="sr-only peer"
                aria-label="Toggle security alerts notifications"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FAB75B]"></div>
            </label>
          </div>
        </div>

        <Button size="large" className="w-full">
          Save preferences
        </Button>
      </div>
    </div>
  );
}
