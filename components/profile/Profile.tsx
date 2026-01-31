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
import DeletePortfolioModal from "../modals/Deleteportfoliomodal";

export default function Profile() {
  const { user, checkAuth } = useAuthStore();
  const { isLoading: portfolioLoading, fetchPortfolio } = usePortfolioStore();

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditSkillsOpen, setIsEditSkillsOpen] = useState(false);
  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isViewPortfolioOpen, setIsViewPortfolioOpen] = useState(false);
  const [isDeletePortfolioOpen, setIsDeletePortfolioOpen] = useState(false);
  const [selectedPortfolio, setSelectedPortfolio] = useState<Portfolio | null>(
    null
  );
  const [editingPortfolio, setEditingPortfolio] = useState<Portfolio | null>(
    null
  );
  const [deletingPortfolio, setDeletingPortfolio] = useState<Portfolio | null>(
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

  const portfolios = user?.portfolios || [];

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

  const handleEditPortfolio = (portfolioData: Portfolio) => {
    setEditingPortfolio(portfolioData);
    setIsEditMode(true);
    setIsAddPortfolioOpen(true);
  };

  const handleAddPortfolio = () => {
    setEditingPortfolio(null);
    setIsEditMode(false);
    setIsAddPortfolioOpen(true);
  };

  const handleDeletePortfolio = (portfolioData: Portfolio) => {
    setDeletingPortfolio(portfolioData);
    setIsDeletePortfolioOpen(true);
  };

  const handlePortfolioSaved = async () => {
    setIsAddPortfolioOpen(false);
    setIsEditMode(false);
    setEditingPortfolio(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await Promise.all([fetchPortfolio(), checkAuth()]);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  };
  

  const handlePortfolioDeleted = async () => {
    setIsDeletePortfolioOpen(false);
    setDeletingPortfolio(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await Promise.all([fetchPortfolio(), checkAuth()]);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  };

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
console.log("Profile - handleDeletePortfolio:", handleDeletePortfolio);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <ProfileHeader
          user={user}
          portfolioTitle={portfolios[0]?.title || null}
          onEdit={() => setIsEditProfileOpen(true)}
        />

        <PortfolioSection
          portfolios={portfolios}
          isLoading={portfolioLoading}
          onAddPortfolio={handleAddPortfolio}
          onEditPortfolio={handleEditPortfolio}
          onPortfolioClick={handlePortfolioClick}
          onDeletePortfolio={handleDeletePortfolio}
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
          setEditingPortfolio(null);
        }}
        editMode={isEditMode}
        portfolioToEdit={editingPortfolio}
        onSaved={handlePortfolioSaved}
      />
      <ViewPortfolioModal
        isOpen={isViewPortfolioOpen}
        onClose={() => setIsViewPortfolioOpen(false)}
        portfolio={selectedPortfolio}
      />
      <DeletePortfolioModal
        isOpen={isDeletePortfolioOpen}
        onClose={() => {
          setIsDeletePortfolioOpen(false);
          setDeletingPortfolio(null);
        }}
        portfolio={deletingPortfolio}
        onDeleted={handlePortfolioDeleted}
      />
    </div>
  );
}
