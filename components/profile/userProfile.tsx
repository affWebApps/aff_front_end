"use client";
import { useState } from "react";
import Image from "next/image";
import {
  Mail,
  MapPin,
  Star,
  Eye,
  EyeOff,
  Calendar,
  Pencil,
} from "lucide-react";
import EditProfileModal from "../modals/EditProfileModal";
import EditSkillsModal from "../modals/EditSkillsModal";
import AddPortfolioModal from "../modals/AddPortfolioModal";
import ViewPortfolioModal from "../modals/ViewPortfolioModal";
import { Button } from "../ui/Button";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("published");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Modal states
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditSkillsOpen, setIsEditSkillsOpen] = useState(false);
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false);
  const [isViewPortfolioOpen, setIsViewPortfolioOpen] = useState(false);

  const [notifications, setNotifications] = useState({
    newMessages: true,
    activityUpdates: false,
    securityAlerts: false,
  });

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

  const portfolioItems = [
    {
      id: 1,
      name: "Minimalist dress",
      image: "/images/profile.jpg",
    },
    {
      id: 2,
      name: "Two-piece pants",
      image: "/images/profile.jpg",
    },
    {
      id: 3,
      name: "Corporate gown",
      image: "/images/profile.jpg",
    },
  ];

  const reviews = [
    {
      id: 1,
      name: "Chuoma O.",
      rating: 4,
      comment:
        "Absolutely stunning work! The attention to detail is impeccable.",
      date: "Posted 3 weeks ago",
    },
    {
      id: 2,
      name: "Ibrahim K.",
      rating: 5,
      comment: "Professional and creative. Delivered exactly what I wanted.",
      date: "Posted 2 weeks ago",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src="/images/profile.jpg"

                  alt="Amina Yusuf"
                  fill
                  className="object-cover"
                  sizes="64px"
                  priority
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Amina Yusuf
                </h1>
                <p className="text-gray-500">@aminat60</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditProfileOpen(true)}
              className="w-10 h-10 bg-[#FAB75B] rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
            >
              <span className="text-white text-xl">
                <Pencil className="w-5 h-5" />
              </span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Bio Section */}
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                Bio
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">
                With over 15 years of experience in custom tailoring and
                alterations, I specialize in creating perfectly fitted garments
                for every occasion. From wedding dresses to business suits, I
                bring precision and care to every project. My attention to
                detail ensures that each piece is tailored to your exact
                specifications and comfort.
              </p>

              <h2 className="text-sm font-semibold text-gray-500 uppercase mt-6 mb-3">
                Contact Information
              </h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>aminayusuf@gmail.com</span>
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
            <h2 className="text-xl font-bold text-gray-900">Portfolio</h2>
            <button
              onClick={() => setIsAddPortfolioOpen(true)}
              className="w-10 h-10 bg-[#FAB75B] rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
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

          <div className="grid grid-cols-3 gap-4">
            {portfolioItems.map((item) => (
              <div
                key={item.id}
                className="group cursor-pointer"
                onClick={() => setIsViewPortfolioOpen(true)}
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-2">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                  />
                </div>
                <p className="text-sm text-gray-700">{item.name}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Skills</h2>
            <button
              onClick={() => setIsEditSkillsOpen(true)}
              className="w-10 h-10 bg-[#FAB75B] rounded-full flex items-center justify-center hover:bg-amber-500 transition-colors"
            >
              <span className="text-white text-xl">
                <Pencil className="w-5 h-5" />
              </span>{" "}
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
              <span className="text-2xl font-bold text-gray-900">4.9</span>
              <div className="flex text-[#FAB75B]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mb-6">3 Total reviews</p>

          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center font-semibold text-amber-700">
                    {review.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {review.name}
                      </h3>
                      <div className="flex text-[#FAB75B]">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 mb-1">
                      {review.comment}
                    </p>
                    <p className="text-xs text-gray-500">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                <label className="block text-sm text-gray-700 mb-2">
                  Current password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="************"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
                  />
                  <button
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                <label className="block text-sm text-gray-700 mb-2">
                  New password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    placeholder="************"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
                  />
                  <button
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                <label className="block text-sm text-gray-700 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="************"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FAB75B]"
                  />
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
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
                <label className="relative inline-block w-12 h-6 cursor-pointer">
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
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-checked:bg-[#FAB75B] rounded-full peer transition-colors">
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                  </div>
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
                <label className="relative inline-block w-12 h-6 cursor-pointer">
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
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-checked:bg-[#FAB75B] rounded-full peer transition-colors">
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                  </div>
                </label>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Security Alerts</h4>
                  <p className="text-sm text-gray-500">
                    Receive important security notifications
                  </p>
                </div>
                <label className="relative inline-block w-12 h-6 cursor-pointer">
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
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-checked:bg-[#FAB75B] rounded-full peer transition-colors">
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-6"></div>
                  </div>
                </label>
              </div>
            </div>

            <Button size="large" className="w-full ">
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
      />
    </div>
  );
}
