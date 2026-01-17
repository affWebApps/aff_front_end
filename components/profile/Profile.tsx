"use client";
import { useState, useEffect } from "react";
import EditProfileModal from "../modals/EditProfileModal";
import EditSkillsModal from "../modals/EditSkillsModal";
import AddPortfolioModal from "../modals/AddPortfolioModal";
import ViewPortfolioModal from "../modals/ViewPortfolioModal";

import Settings from "./Settings";
import { useAuthStore } from "@/store/authStore";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Portfolio } from "@/services/portfolioService";
import { Review } from "@/services/authServices";
import ProfileHeader from "./Profileheader";
import PortfolioSection from "./Portfoliosection";
import ReviewsSection from "./Reviewssection";
import SkillsSection from "./Skillssection";

export default function Profile() {
  const { user, checkAuth } = useAuthStore();
  const {
    portfolio,
    isLoading: portfolioLoading,
    fetchPortfolio,
  } = usePortfolioStore();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditSkillsOpen, setIsEditSkillsOpen] = useState(false);
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewPortfolioOpen, setIsViewPortfolioOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );

  const [notifications, setNotifications] = useState({
    newMessages: true,
    activityUpdates: false,
    securityAlerts: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await checkAuth();
        await fetchPortfolio();
        console.log("📊 Portfolio data loaded:", portfolio);
        console.log("👤 User portfolios:", user?.portfolios);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const portfolioTitle = portfolio?.title || null;

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

  const handleEditPortfolio = () => {
    setIsEditMode(true);
    setIsAddPortfolioOpen(true);
  };

  const handleAddPortfolio = () => {
    setIsEditMode(false);
    setIsAddPortfolioOpen(true);
  };

  const handlePortfolioSaved = async () => {
    console.log("Portfolio saved, refreshing data...");
    setIsAddPortfolioOpen(false);
    setIsEditMode(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await Promise.all([fetchPortfolio(), checkAuth()]);
      console.log("✅ Data refreshed successfully");
    } catch (error) {
      console.error("❌ Failed to refresh data:", error);
    }
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
        <ProfileHeader
          user={user}
          portfolioTitle={portfolioTitle}
          onEdit={() => setIsEditProfileOpen(true)}
        />

        <PortfolioSection
          portfolio={portfolio}
          isLoading={portfolioLoading}
          onAddPortfolio={handleAddPortfolio}
          onEditPortfolio={handleEditPortfolio}
          onPortfolioClick={handlePortfolioClick}
        />

        <SkillsSection
          skills={skills}
          onEdit={() => setIsEditSkillsOpen(true)}
        />

        
        <ReviewsSection
          reviews={user.reviews_received || []}
          averageRating={calculateAverageRating()}
        />

        
        <Settings
          notifications={notifications}
          onNotificationsChange={setNotifications}
        />
      </div>

      
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
        onClose={() => {
          setIsAddPortfolioOpen(false);
          setIsEditMode(false);
        }}
        editMode={isEditMode}
        portfolioToEdit={isEditMode ? portfolio : null}
        onSaved={handlePortfolioSaved}
      />
      <ViewPortfolioModal
        isOpen={isViewPortfolioOpen}
        onClose={() => setIsViewPortfolioOpen(false)}
        portfolio={selectedPortfolio}
      />
    </div>
  );
}
