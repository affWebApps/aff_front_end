"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TabNavigation from "../../component/Tabnavigation";
import ContentManagementView from "../../component/Contentmanagementview";
import AnalyticsView from "../../component/Analyticsview";
import AppConfigurationView from "../../component/Appconfigurationview";
import NewsletterView from "../../component/Newsletterview";
import UsersView from "../../component/Usersview";
import ProjectsView from "../../component/Projectsview";


function AdminDashboard() {
  const [currentView, setCurrentView] = useState<
    "dashboard" | "users" | "projects"
  >("dashboard");
  const [activeTab, setActiveTab] = useState("content");

  const pageVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  };

  return (
    <div className="min-h-screen bg-white">
      <main className="px-6 py-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 font-(family-name:--font-montserrat)">
            AFF Admin
          </h1>
          <p className="text-gray-600">Manage platform content and analytics</p>
        </div>

        <AnimatePresence mode="wait">
          {currentView === "dashboard" && (
            <motion.div
              key="dashboard"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

              {activeTab === "content" && <ContentManagementView />}
              {activeTab === "analytics" && (
                <AnalyticsView onNavigate={setCurrentView} />
              )}
              {activeTab === "config" && <AppConfigurationView />}
              {activeTab === "newsletter" && <NewsletterView />}
            </motion.div>
          )}

          {currentView === "users" && (
            <UsersView onBack={() => setCurrentView("dashboard")} />
          )}

          {currentView === "projects" && (
            <ProjectsView onBack={() => setCurrentView("dashboard")} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default AdminDashboard;
