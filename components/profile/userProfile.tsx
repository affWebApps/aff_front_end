"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Star,
  Eye,
  EyeOff,
  Calendar,
  Pencil,
  User,
  Briefcase,
} from "lucide-react";
import EditProfileModal from "../modals/EditProfileModal";
import EditSkillsModal from "../modals/EditSkillsModal";
import AddPortfolioModal from "../modals/AddPortfolioModal";
import ViewPortfolioModal from "../modals/ViewPortfolioModal";
import { Button } from "../ui/Button";
import { useAuthStore } from "@/store/authStore";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Portfolio, PortfolioImage } from "@/services/portfolioService";
import { Review } from "@/services/authServices";

export default function Profile() {
  const { user, checkAuth } = useAuthStore();
  const {
    portfolio,
    isLoading: portfolioLoading,
    fetchPortfolio,
  } = usePortfolioStore();
  const [activeTab, setActiveTab] = useState("published");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditSkillsOpen, setIsEditSkillsOpen] = useState(false);
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false);
  const [isViewPortfolioOpen, setIsViewPortfolioOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );

  const [notifications, setNotifications] = useState({
    newMessages: true,
    activityUpdates: false,
    securityAlerts: false,
  });

  // Fetch fresh user data and portfolio on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkAuth();
        await fetchPortfolio();
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [checkAuth, fetchPortfolio]);

  const skills = [
    "Fitting Adjustments",
    "Pattern Drafting",
    "Alterations & Repairs",
    "Fabric Cutting & Laying",
    "Machine Sewing",
    "Garment Construction",
    "Hand Stitching",
    "Finishing & Hemming",
    "Pressing & Ironing",
    "Measurement Taking",
  ];

  // Get user's display name
  const displayName =
    user?.display_name ||
    `${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    "User";

  // Get user's email username for @handle
  const username = user?.email?.split("@")[0] || "user";

  // Get portfolio title
  const portfolioTitle = portfolio?.title || null;

  // Calculate average rating from reviews
  const calculateAverageRating = (): string => {
    if (!user?.reviews_received || user.reviews_received.length === 0) {
      return "0.0";
    }
    const total = user.reviews_received.reduce(
      (sum: number, review: Review) => sum + (review.rating || 0),
      0
    );
    return (total / user.reviews_received.length).toFixed(1);
  };

  const handlePortfolioClick = (portfolioData: Portfolio) => {
    setSelectedPortfolio(portfolioData);
    setIsViewPortfolioOpen(true);
  };

  // Show loading state
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FAB75B] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-linear-to-br from-amber-400 to-orange-500">
                {user.avatar_url ? (
                  <Image
                    src={user.avatar_url}
                    alt={displayName}
                    fill
                    className="object-cover"
                    sizes="64px"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-8 h-8 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {displayName}
                </h1>
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
              onClick={() => setIsEditProfileOpen(true)}
              className="w-10 h-10 bg-[#FAB75B] rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
              aria-label="Edit profile"
            >
              <Pencil className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Bio Section */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Bio
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                {portfolio?.description ||
                  "No bio available. Click the edit button to add your professional bio."}
              </p>

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

            {/* Availability & Pricing */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Availability
              </h2>
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-gray-700">Mon - Fri</span>
                  </div>
                  <span className="text-gray-600">10:00am - 6:00pm</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
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

        {/* Portfolio Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Portfolio</h2>
              {portfolio && (
                <p className="text-sm text-gray-500 mt-1">
                  {portfolio.Image?.length || 0} images • {portfolio.title}
                </p>
              )}
            </div>
            <button
              onClick={() => setIsAddPortfolioOpen(true)}
              className="w-10 h-10 bg-[#FAB75B] rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
              aria-label="Add portfolio item"
            >
              <span className="text-white text-xl">+</span>
            </button>
          </div>

          <div className="flex gap-4 mb-6 border-b">
            <button
              onClick={() => setActiveTab("published")}
              className={`pb-3 px-1 font-medium text-sm ${
                activeTab === "published"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500"
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setActiveTab("drafts")}
              className={`pb-3 px-1 font-medium text-sm ${
                activeTab === "drafts"
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-500"
              }`}
            >
              Drafts
            </button>
          </div>

          {portfolioLoading ? (
            <div className="text-center py-12">
              <div className="w-12 h-12 border-4 border-[#FAB75B] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-500">Loading portfolio...</p>
            </div>
          ) : portfolio && portfolio.Image && portfolio.Image.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {portfolio.Image.map((image: PortfolioImage, index: number) => (
                <div
                  key={image.id}
                  className="group cursor-pointer relative"
                  onClick={() => handlePortfolioClick(portfolio)}
                >
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-2 bg-gray-100">
                    <Image
                      src={image.image_url}
                      alt={`${portfolio.title} - Image ${index + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                    {image.is_primary && (
                      <div className="absolute top-2 left-2 bg-[#FAB75B] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" />
                        Primary
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No portfolio items yet</p>
              {/* <Button onClick={() => setIsAddPortfolioOpen(true)}>
                Add your first portfolio item
              </Button> */}
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Skills</h2>
            <button
              onClick={() => setIsEditSkillsOpen(true)}
              className="w-10 h-10 bg-[#FAB75B] rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
              aria-label="Edit skills"
            >
              <Pencil className="w-5 h-5 text-white" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Reviews</h2>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-gray-900">
                {calculateAverageRating()}
              </span>
              <div className="flex text-[#FAB75B]">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(Number(calculateAverageRating()))
                        ? "fill-current"
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            {user.reviews_received?.length || 0} Total reviews
          </p>

          {user.reviews_received && user.reviews_received.length > 0 ? (
            <div className="space-y-4">
              {user.reviews_received.map((review: Review, index: number) => (
                <div
                  key={review.id || index}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center font-semibold text-amber-700">
                      {review.reviewer_name?.charAt(0) || "U"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {review.reviewer_name || "Anonymous"}
                        </h3>
                        <div className="flex text-[#FAB75B]">
                          {[...Array(review.rating || 0)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-1">
                        {review.comment || "No comment"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {review.created_at
                          ? new Date(review.created_at).toLocaleDateString()
                          : "Date unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">No reviews yet</div>
          )}
        </div>

        {/* Settings Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Settings</h2>

          {/* Change Password */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-900 mb-2">
              Change Password
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Update your password here to keep your account secure
            </p>

            <div className="space-y-4">
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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

              <button className="w-full py-3 bg-[#FAB75B] text-white font-semibold rounded-lg hover:bg-amber-500 transition-colors">
                Update password
              </button>
            </div>
          </div>

          {/* Email Notifications */}
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
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        newMessages: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                    aria-label="Toggle new messages notifications"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FAB75B]"></div>
                </label>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Activity Updates
                  </h4>
                  <p className="text-sm text-gray-500">
                    Receive updates about your account activity
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.activityUpdates}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        activityUpdates: e.target.checked,
                      })
                    }
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
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        securityAlerts: e.target.checked,
                      })
                    }
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
      </div>

      {/* Modals */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
      <EditSkillsModal
        isOpen={isEditSkillsOpen}
        onClose={() => setIsEditSkillsOpen(false)}
      />
      <AddPortfolioModal
        isOpen={isAddPortfolioOpen}
        onClose={() => setIsAddPortfolioOpen(false)}
      />
      <ViewPortfolioModal
        isOpen={isViewPortfolioOpen}
        onClose={() => setIsViewPortfolioOpen(false)}
        portfolio={selectedPortfolio}
      />
    </div>
  );
}
